import express, { Request, Response } from "express";
import httpProxy from "http-proxy";
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

proxy.on("proxyReq", (proxyReq, req: any) => {
  try {
    const userId = req.params?.userId;
    const currentServerUrl = req.protocol + "://" + req.get("host");
    console.log("currentServerUrl", currentServerUrl);

    if (userId) {
      proxyReq.path = `/${BLOB_CONTAINER_IMAGES_PATH}/${userId}`;
      console.log(proxyReq.path);
    }

    proxyReq.setHeader("X-Forwarded-Host", req.headers.host!);
    proxyReq.setHeader("Server", SERVER_NAME);
  } catch (error) {
    console.error("Error in proxyReq", error);
  }
});

app.get("/", (_req, res) => {
  res.redirect("http://localhost:3000");
});

app.get("/:userId", (req: Request, res: Response) => {
  proxy.web(req, res, { target: BLOB_CDN_URL }, (error) => {
    console.error("Proxy error:", error);
    res.status(500).send({ error: "Proxy request failed" });
  });
});

// app.get("/pfp", (request, response) => {
//   proxy.web(request, response, {
//     target: BLOB_CDN_URL,
//   });

//   proxy.on("proxyReq", (proxyReq, req) => {
//     try {
//       const currentServerUrl = request.protocol + "://" + request.get("host");
//       console.log("currentServerUrl", currentServerUrl);

//       const img_token = getTokenFromReq(req);
//       if (!img_token) {
//         return response.status(401).send({
//           message: "Uh oh! You are not authorized to access this resource",
//         });
//       } else {
//         const id = getIdFromToken(img_token);
//         proxyReq.path = `/${BLOB_CONTAINER_IMAGES_PATH}/${id}`;
//         console.log(proxyReq.path);

//         proxyReq.setHeader("X-Forwarded-Host", req.headers.host!);
//         proxyReq.setHeader("Server", SERVER_NAME);
//       }
//     } catch (error) {
//       console.error("Error in proxyReq", error);
//     }
//   });
// });

app.listen(PORT, () => {
  if (!SECRET) {
    console.error("Please provide a valid SECRET in .env file");
    process.exit(1);
  }
  console.log(`Reverse Proxy Running on port ${PORT}`);
});
