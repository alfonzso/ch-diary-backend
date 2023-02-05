
type UserPayload = {
  id: string
  email: string
  nickname: string
};

export interface jwtUserPayload {
  user: UserPayload
}

export type {
  UserPayload
}