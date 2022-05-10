import { Response } from "express";

export default (res: Response, token: string) => {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    sameSite: true,
    path: '/api/auth',
  });
}