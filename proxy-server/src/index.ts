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
import { getIdFromUsername, isFilePrivate } from "./prisma/db/project";

const app = express();
app.use(express.json());

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
});

proxy.on("proxyReq", async (proxyReq, req: any) => {
  try {
    const { proxyType, username, fileId, userId } = req.locals || {};

    if (proxyType === "profile") {
      const imagePath = `/${BLOB_CONTAINER_IMAGES_PATH}/${userId}`;
      proxyReq.path = imagePath;
    } else if (proxyType === "file") {
      proxyReq.path = `/${BLOB_CONTAINER_FILES_PATH}/${userId}/${fileId}?${SAS_TOKEN}`;
    }

    proxyReq.setHeader("Server", SERVER_NAME);
    proxyReq.setHeader("X-Forwarded-Host", req.headers.host!);
  } catch (error) {
    console.error("Error in proxyReq:", error);
  }
});

proxy.on("proxyRes", (proxyRes, req: any) => {
  const { proxyType, fileName, download } = req.locals || {};

  if (proxyType === "file") {
    const safeName = decodeURIComponent(fileName)
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
  }
});

app.get("/", (_req, res) => {
  res.redirect(APP_URL);
});

// @ts-ignore
app.get("/:username/pfp", async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const resId = await getIdFromUsername({ username });

    if (resId.status === "error") {
      return res.status(404).send({ message: "User not found" });
    }

    const { id: userId } = resId.data;
    // @ts-ignore
    req.locals = { proxyType: "profile", username, userId };

    proxy.web(req, res, { target: BLOB_CDN_URL }, (error) => {
      console.error("Proxy error:", error);
      res.status(500).send({ error: "Proxy request failed" });
    });
  } catch (error) {
    console.error("Error in /pfp route:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// @ts-ignore
app.get("/:username/:fileName", async (req: Request, res: Response) => {
  try {
    const { username, fileName } = req.params;
    const download = req.query.download;

    const resId = await getIdFromUsername({ username });
    if (resId.status === "error") {
      return res.status(404).send({ message: "User not found" });
    }

    const { id: userId } = resId.data;
    const fileInfo = await isFilePrivate({ fileName, userId });

    if (fileInfo.status === "error") {
      return res.status(500).send({ message: "File not found" });
    }

    const { fileId } = fileInfo.data;
    // @ts-ignore
    req.locals = {
      proxyType: "file",
      username,
      fileId,
      userId,
      fileName,
      download,
    };

    proxy.web(req, res, { target: BLOB_CDN_URL }, (error) => {
      console.error("Proxy error:", error);
      res.status(500).send({ error: "Proxy request failed" });
    });
  } catch (error) {
    console.error("Error in /file route:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  if (!SECRET) {
    console.error("Please provide a valid SECRET in .env file");
    process.exit(1);
  }
  console.log(`Reverse Proxy Running on port ${PORT}`);
});
