import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/env";

export type TJwtPayload = {
  userId: string;
  role: string;
  email: string;
};

export const signAccessToken = (payload: TJwtPayload) => {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
  } as jwt.SignOptions);
};

export const signRefreshToken = (payload: TJwtPayload) => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): TJwtPayload & JwtPayload => {
  return jwt.verify(token, config.jwt.accessSecret) as TJwtPayload & JwtPayload;
};

export const verifyRefreshToken = (token: string): TJwtPayload & JwtPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as TJwtPayload & JwtPayload;
};
