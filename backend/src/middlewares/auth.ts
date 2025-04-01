import jwt from "jsonwebtoken";
import config from "../config";
import { NextFunction, Request, Response } from "express";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthenticatedRequest = Request & {
  user: User;
};

function authenticateToken(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers["authorization"];
  const accessToken = (authHeader && authHeader.split(" ")[1]) || "";
  const refreshToken = request.cookies["refreshToken"] || "";

  if (!accessToken && !refreshToken) {
    return response.status(401).send("Access Denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(accessToken, config.accessTokenSecret) as {
      user: User;
    };
    (request as AuthenticatedRequest).user = decoded.user;
    return next();
  } catch (error) {
    if (!refreshToken) {
      return response
        .status(401)
        .send("Access Denied. No refresh token provided.");
    }

    try {
      const decoded = jwt.verify(refreshToken, config.refreshTokenSecret) as {
        user: User;
      };
      const newAccessToken = jwt.sign(
        { user: decoded.user },
        config.accessTokenSecret,
        { expiresIn: "2m" }
      );

      response.header("Authorization", `Bearer ${newAccessToken}`);

      (request as AuthenticatedRequest).user = decoded.user;
      return next();
    } catch (error) {
      return response.status(401).send("Invalid Token.");
    }
  }
}

export { authenticateToken };
