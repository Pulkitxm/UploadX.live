import express, { Request, Response } from "express";
import httpProxy from "http-proxy";
import {
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
  res.redirect("http://localhost:3000");
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

app.get("/f/:filePath(*)", async (request: any, response: any) => {
  const filePath = request.params.filePath;
  console.log("filePath", filePath);

  const img_token = getTokenFromReq(request);
  const id = getIdFromToken(img_token);
  if (!img_token) {
    return response.status(401).send({
      message: "Uh oh! You are not authorized to access this resource",
    });
  }

  // const isPrivate = await isFilePrivate({
  //   filePath,
  //   userId: id,
  // });

  // console.log("isPrivate", isPrivate);

  proxy.on("proxyReq", async (proxyReq, req) => {
    try {
      proxyReq.path = `/${BLOB_CONTAINER_FILES_PATH}/${id}/${filePath}?${SAS_TOKEN}`;
      console.log(proxyReq.path);

      proxyReq.setHeader("X-Forwarded-Host", req.headers.host!);
      proxyReq.setHeader("Server", SERVER_NAME);
    } catch (error) {
      console.error("Error in proxyReq", error);
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
