import { env } from "../config/env";
import { auth } from "express-oauth2-jwt-bearer";
import type { Request, Response, NextFunction } from "express";

const checkJwt = auth({
  audience: env.AUTH0_AUDIENCE || "",
  issuerBaseURL: env.AUTH0_ISSUER_BASE_URL || "",
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