import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { AuthService } from '../services';
import { JWTUserPayload, UserPayload } from '../types/jwt';
import myLogger from '../utils/myLogger';
import { clearAllCookies } from '../utils/common';
import { htmxFolderConfigMap } from '../../config/htmxFolderConfigMap';

declare global {
  namespace Express {
    interface Request {
      GlobalTemplates: any;
      currentUrl: string,
      isHtmx: boolean;
      isLoggedIn: boolean;
      user?: UserPayload;
      jwt: { access?: string, refresh?: string, refreshExp?: number | undefined }
    }
  }
}

// const protocolWithHost = (req: Request) => {
//   console.log("ffffffffffff ", req.protocol + "://" + (req.get('host') || "") + "/")
//   return req.protocol + "://" + (req.get('host') || "") + "/"
// }

export const handleGlobals = async (req: Request, res: Response, next: NextFunction) => {
  let render = { file: "", ops: {} }
  req.currentUrl = req.get("hx-current-url") || req.originalUrl
  req.GlobalTemplates = {
    isLoggedIn: req.isLoggedIn,
    user: req.user,
    exp: (req.jwt || {}).refreshExp,
  }

  const urlsNotInOriginalUrl = (notProtectedUrls: string[]) => {
    // isHtmx => is partial hx request
    // in originalUrl (which is a partial request from htmx)
    // not any of in not_protected_urls like: nav, login, about pages

    // after fullPageLoad, hx-current-url will be still the url what you called in browser
    // ==>
    //    fullPageLoad with /daily-course
    // ==>
    //    hx-current-url == /daily-course, but we dont want this when /navbar calling
    // thats why we use originalUrl here
    return req.isHtmx && !notProtectedUrls.some(v => req.originalUrl.includes(v))
  }

  if (!req.isHtmx) {
    console.log("Full page loading ...", req.currentUrl)
    render.file = htmxFolderConfigMap.main
    render.ops = { ...render.ops, layout: 'index' }
    res.render(render.file, { ...render.ops, ...req.GlobalTemplates })
    return
  }

  if (!req.isLoggedIn && urlsNotInOriginalUrl(["home", "nav", "login", "about"])) {
    console.log("Not logged in ...", req.currentUrl, req.originalUrl)
    render.file = htmxFolderConfigMap.main
    res.render(render.file, { ...render.ops, ...req.GlobalTemplates })
    return
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