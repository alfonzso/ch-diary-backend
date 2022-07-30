import { Response } from "express";
import config from "../../config";

export default (res: Response, token: string) => {
   res.cookie(config.jwtCookieName, token, {
    httpOnly: true,
    sameSite: true,
    path: '/api/auth',
  });
}