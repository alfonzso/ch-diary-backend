import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { AuthService } from '../services';
import { JWTUserPayload, UserPayload } from '../types/jwt';
import myLogger from '../utils/myLogger';
import { clearAllCookies } from '../utils/common';

declare global {
  namespace Express {
    interface Request {
      GlobalTemplates: any;
      isHtmx: boolean;
      isLoggedIn: boolean;
      user?: UserPayload;
      jwt: { access?: string, refresh?: string, refreshExp?: number | undefined }
    }
  }
}

export const handleGlobals = async (req: Request, res: Response, next: NextFunction) => {
  req.GlobalTemplates = {
    isLoggedIn: req.isLoggedIn,
    user: req.user,
    exp: (req.jwt || {}).refreshExp,
  }
  next()
}

export const handleAuth = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.access_token === "undefined" ? undefined : req.headers.access_token;
  const refreshToken = req.cookies.refreshToken;

  req.isHtmx = req.headers['hx-request'] === "true"

  if (accessToken === undefined) {
    if (refreshToken === undefined || refreshToken.length < 0) {
      myLogger("accessToken & refreshToken is undefined ")
      clearAllCookies(req, res)
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
        myLogger("[ RenewAccessFromRefresh ] ERR ", err.reason)
        Container.get(AuthService).CleanUpRefreshToken(refreshToken)
        clearAllCookies(req, res)
        req.isLoggedIn = false
        req.user = undefined
        res.setHeader("HX-Redirect", "/login")
      })
      .finally(() => {
        return next();
      })
  }

  if (typeof accessToken === "string") {
    return Container.get(AuthService).VerifyToken(accessToken)
      .then(async (payload) => {
        req.isLoggedIn = true
        req.user = (payload as JWTUserPayload).user
        req.jwt = { access: accessToken }
      })
      .catch((err) => {
        myLogger("[ AccessToken Verify ] ERR ", err.reason)
        clearAllCookies(req, res)
        req.isLoggedIn = false
        req.user = undefined
      })
      .finally(() => {
        return next();
      })
  }

  return next();
}