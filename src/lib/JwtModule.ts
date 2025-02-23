import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { appConfig } from "~/config";
import {
  ExpiredJwtTokenException,
  InvalidJwtTokenException,
} from "~/exceptions/SessionExceptions";

export type SessionPayload = {
  sessionId: string;
};

export const JwtModule = {
  signToken,
  verifyToken,
  decodeToken,
};

// Sign a token
async function signToken(
  user: SessionPayload,
  expiresIn: number = appConfig.jwt.expiry
) {
  const { sessionId } = user;
  return jwt.sign({ sessionId }, appConfig.jwt.secret, { expiresIn });
}

// Verify a token
async function verifyToken(token: string) {
  try {
    return jwt.verify(token, appConfig.jwt.secret) as SessionPayload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new ExpiredJwtTokenException();
    }
    throw new InvalidJwtTokenException();
  }
}

// Decode a token without verifying (useful for extracting payload without validation)
async function decodeToken<T = JwtPayload>(token: string) {
  return jwt.decode(token) as T;
}
