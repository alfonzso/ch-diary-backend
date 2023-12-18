import { Response } from "express";
import config from "../../config";

export default (res: Response, token: string) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 100);

  res.cookie(config.jwtCookieName, token, {
    httpOnly: true,
    sameSite: true,
    // path: '/api/auth',
    expires: date
  });
}