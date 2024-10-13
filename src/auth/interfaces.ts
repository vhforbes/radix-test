export interface JwtPayload {
  email: string;
  name: string;
  role: string;
  sub: string;
  iat: number;
  exp: number;
}

export interface UserReq {
  user_id: string;
  email: string;
  name: string;
  role: string;
}
