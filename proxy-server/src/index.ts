import express from "express";

import httpProxy from "http-proxy";
import { getIdFromToken, getTokenFromReq } from "./lib";
import {
  BLOB_CDN_URL,
  BLOB_CONTAINER_IMAGES_PATH,
  PORT,
  SECRET,
  SERVER_NAME,
} from "./constants";

const app = express();
app.use(express.json());

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
});

app.use((request, response) => {
  proxy.web(request, response, {
    target: BLOB_CDN_URL,
  });

  proxy.on("proxyReq", (proxyReq, req) => {
    const currentServerUrl = request.protocol + "://" + request.get("host");
    console.log("currentServerUrl", currentServerUrl);

    const img_token = getTokenFromReq(req);
    if (!img_token) {
      return response.status(401).send({
        message: "Uh oh! You are not authorized to access this resource",
      });
    }

    const id = getIdFromToken(img_token);
    proxyReq.path = `/${BLOB_CONTAINER_IMAGES_PATH}/${id}`;
    console.log(proxyReq.path);

    proxyReq.setHeader("X-Forwarded-Host", req.headers.host!);
    proxyReq.setHeader("Server", SERVER_NAME);
  });
});

app.listen(PORT, () => {
  if (!SECRET) {
    console.error("Please provide a valid SECRET in .env file");
    process.exit(1);
  }
  console.log(`Reverse Proxy Running on port ${PORT}`);
});
