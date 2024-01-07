import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { AuthService } from '../services';
import { JWTUserPayload } from '../types/jwt';

export const handleAuth = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.access_token === "undefined" ? undefined : req.headers.access_token;
  const refreshToken = req.cookies.refreshToken;

  req.isHtmx = req.headers['hx-request'] === "true"

  if (accessToken === undefined) {
    if (refreshToken === undefined || refreshToken.length < 0) {
      req.isLoggedIn = false
      return next();
    }
    return Container.get(AuthService).RenewAccessFromRefresh(refreshToken)
      .then((payload) => {
        req.isLoggedIn = true
        if (payload === null) return
        req.user = payload.user
        req.jwt = {
          access: payload.accessToken,
          refresh: payload.refreshToken,
          refreshExp: payload.refreshExp,
        }
      })
      .catch(async (err) => {
        console.log("[RenewAccessFromRefresh] ERR ", err.reason)
        Container.get(AuthService).CleanUpRefreshToken(refreshToken)
        res.clearCookie("refreshToken");
        req.isLoggedIn = false
        req.user = undefined
        res.setHeader("HX-Redirect", "/login")
      }).finally(() => {
        return next();
      })
  }

  if (typeof accessToken === "string") {
    return Container.get(AuthService).VerifyToken(accessToken)
      .then(async (payload) => {
        req.isLoggedIn = true
        req.user = (payload as JWTUserPayload).user
        req.jwt = {
          access: accessToken,
        }
      })
      .catch((err) => {
        req.isLoggedIn = false
        req.user = undefined
        console.log("accessToken error: ", err)
      }).finally(() => {
        return next();
      })
  }

  return next();
}