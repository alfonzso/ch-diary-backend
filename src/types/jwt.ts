import jwt from 'jsonwebtoken';

type UserPayload = {
  id: string
  email: string
  nickname: string
}
// ;

export type JWTUserPayload = {
  user?: UserPayload,
  jti?: string,
} & jwt.JwtPayload;

export type {
  UserPayload
}