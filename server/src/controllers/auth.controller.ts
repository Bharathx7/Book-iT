import type { Request, Response } from "express";

import {
  register,
  login,
  refreshAccessToken,
} from "../services/auth.service.js";

export async function registerController(
  req: Request,
  res: Response
) {
  const { name, email, password } = req.body;

  const user = await register(name, email, password);

  return res.status(201).json({
    message: "Registration successful",
    user,
  });
}

export async function loginController(
  req: Request,
  res: Response
) {
  const { email, password } = req.body;

  const result = await login(email, password);

  return res.status(200).json(result);
}

export async function refreshTokenController(
  req: Request,
  res: Response
) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      message: "Refresh token is required",
    });
  }

  const result = await refreshAccessToken(refreshToken);

  return res.status(200).json(result);
}