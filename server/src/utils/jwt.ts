import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

interface TokenUser {
  id: string;
  email: string;
  role: string;
}

interface AuthTokenPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

export function generateAccessToken(user: TokenUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: "15m",
    }
  );
}

export function generateRefreshToken(user: TokenUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "7d",
    }
  );
}

export function verifyAccessToken(
  token: string
): AuthTokenPayload {
  const decoded = jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET!
  );

  if (typeof decoded === "string") {
    throw new Error("Invalid access token");
  }

  return decoded as AuthTokenPayload;
}

export function verifyRefreshToken(
  token: string
): AuthTokenPayload {
  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET!
  );

  if (typeof decoded === "string") {
    throw new Error("Invalid refresh token");
  }

  return decoded as AuthTokenPayload;
}