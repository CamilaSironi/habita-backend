import { auth } from "express-oauth2-jwt-bearer";
import type { Request, Response, NextFunction } from "express";

if (!process.env.AUTH0_AUDIENCE || !process.env.AUTH0_ISSUER_BASE_URL) {
  throw new Error("Missing Auth0 environment variables");
}

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256"
});

export const authMiddleware = [
  checkJwt,
  (req: Request, res: Response, next: NextFunction) => {
    const payload = (req as any).auth?.payload;

    if (!payload?.sub) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    (req as any).user = {
      id: payload.sub,
      email: payload.email
    };

    next();
  }
];