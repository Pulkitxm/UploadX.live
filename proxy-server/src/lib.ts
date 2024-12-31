import jwt from "jsonwebtoken";
import { SECRET } from "./constants";
import { IncomingMessage } from "http";

export function getIdFromToken(token: string) {
  try {
    const res = jwt.verify(token, SECRET);
    const id = (res as any).id;
    console.log("id", id);
    
    return id;
  } catch (error) {
    return null;
  }
}

export function getTokenFromReq(req: IncomingMessage) {
  try {
    const cookies = req.headers.cookie
      ? Object.fromEntries(
          req.headers.cookie.split("; ").map((c) => c.split("="))
        )
      : {};
    const img_token = cookies.img_token;
    return img_token;
  } catch (error) {
    return null;
  }
}
