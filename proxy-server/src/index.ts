import express, { Request, Response } from "express";
import httpProxy from "http-proxy";
import {
  APP_URL,
  BLOB_CDN_URL,
  BLOB_CONTAINER_FILES_PATH,
  BLOB_CONTAINER_IMAGES_PATH,
  PORT,
  SAS_TOKEN,
  SECRET,
  SERVER_NAME,
} from "./constants";
import { getIdFromToken, getTokenFromReq } from "./lib";
import { isFilePrivate } from "./prisma/db/project";

const app = express();
app.use(express.json());

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
});

app.get("/", (_req, res) => {
  res.redirect(APP_URL);
});

app.get("/:userId", (req: Request, res: Response) => {
  proxy.on("proxyReq", (proxyReq, req: any) => {
    try {
      const userId = req.params?.userId;
      const currentServerUrl = req.protocol + "://" + req.get("host");
      console.log("currentServerUrl", currentServerUrl);

      if (userId) {
        proxyReq.path = `/${BLOB_CONTAINER_IMAGES_PATH}/${userId}`;
        console.log(proxyReq.path);
      }

      proxyReq.setHeader("Server", SERVER_NAME);
    } catch (error) {
      console.error("Error in proxyReq", error);
    }
  });

  proxy.web(req, res, { target: BLOB_CDN_URL }, (error) => {
    console.error("Proxy error:", error);
    res.status(500).send({ error: "Proxy request failed" });
  });
});

app.get("/f/:fileId(*)", async (request: any, response: any) => {
  const fileId = request.params.fileId;
  const download = request.query.download;
  console.log("fileId", fileId);

  const img_token = getTokenFromReq(request);
  const id = getIdFromToken(img_token);
  if (!img_token) {
    return response.status(401).send({
      message: "Uh oh! You are not authorized to access this resource",
    });
  }

  const res = await isFilePrivate({
    fileId,
    userId: id,
  });

  if (res.status === "error") {
    return response.status(500).send({
      message: "Error fetching file info",
    });
  }

  const { isPrivate, name } = res.data;

  console.log("isPrivate", { isPrivate, name });

  proxy.on("proxyReq", async (proxyReq, req) => {
    try {
      proxyReq.path = `/${BLOB_CONTAINER_FILES_PATH}/${id}/${fileId}?${SAS_TOKEN}`;
      console.log(proxyReq.path);

      proxyReq.setHeader("X-Forwarded-Host", req.headers.host!);
      proxyReq.setHeader("Server", SERVER_NAME);
    } catch (error) {
      console.error("Error in proxyReq", error);
    }
  });

  proxy.on("proxyRes", (proxyRes) => {
    const safeName = decodeURIComponent(name)
      .replace(/[\n\r"]+/g, "")
      .replace(/[^\x20-\x7E]/g, "");

    if (
      !download &&
      safeName &&
      /\.(jpg|jpeg|png|gif|webp|svg|bmp|pdf|docx|doc|txt|xls|xlsx|ppt|pptx)$/.test(
        safeName
      )
    ) {
      proxyRes.headers["content-disposition"] =
        `inline; filename="${safeName}"`;
    } else {
      proxyRes.headers["content-disposition"] =
        `attachment; filename="${safeName}"`;
    }
  });

  proxy.web(request, response, {
    target: BLOB_CDN_URL,
  });
});

app.listen(PORT, () => {
  if (!SECRET) {
    console.error("Please provide a valid SECRET in .env file");
    process.exit(1);
  }
  console.log(`Reverse Proxy Running on port ${PORT}`);
});
