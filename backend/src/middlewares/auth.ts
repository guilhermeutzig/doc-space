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
  const authHeader = request.headers["authorization"]; // Bearer <token>
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return response.status(401).send({ error: "Unauthorized" });
  }

  jwt.verify(token, config.accessTokenSecret, (err, user) => {
    if (err) {
      return response.status(403).send({ error: "Invalid access token" });
    }

    (request as AuthenticatedRequest).user = user as User;
    next();
  });
}

export { authenticateToken };
