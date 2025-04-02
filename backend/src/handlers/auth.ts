import { Request, Response } from "express";
import sql from "../database.js";
import bcrypt from "bcryptjs";
import config from "../config/index.js";
import jwt from "jsonwebtoken";
import { User } from "../types.js";

export async function signIn(request: Request, response: Response) {
  try {
    const { email, password } = request.body;

    const userRows = await sql`SELECT * FROM users WHERE email = ${email}`;

    if (userRows?.length === 0) {
      return response.status(401).send({ error: "User not found" });
    }

    const user = userRows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return response
        .status(401)
        .send({ error: "Invalid email/password combination" });
    }

    const accessToken = jwt.sign({ user }, config.accessTokenSecret, {
      expiresIn: "2m",
    });
    const refreshToken = jwt.sign({ user }, config.refreshTokenSecret, {
      expiresIn: "3d",
    });

    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    response.setHeader("Authorization", `Bearer ${accessToken}`);
    response.send({ user });
  } catch (error) {
    console.error(error);
    response.status(500).send({ error: "Error signing in" });
  }
}

export async function refreshToken(request: Request, response: Response) {
  const refreshToken = request.cookies["refreshToken"];
  if (!refreshToken) {
    return response
      .status(401)
      .send("Access Denied. No refresh token provided.");
  }

  try {
    const decoded = jwt.verify(refreshToken, config.refreshTokenSecret) as {
      user: User;
    };
    const accessToken = jwt.sign(
      { user: decoded.user },
      config.accessTokenSecret,
      { expiresIn: "2m" }
    );

    response.setHeader("Authorization", `Bearer ${accessToken}`);
    response.send(decoded.user);
  } catch (error) {
    return response.status(400).send("Invalid refresh token.");
  }
}

export async function logout(_: Request, response: Response) {
  try {
    response.clearCookie("refreshToken");
    response.removeHeader("Authorization");
    response.status(200).send({ message: "Logged out" });
  } catch (error: unknown) {
    console.error(error);
    response.status(500).send({ error: (error as Error).message });
  }
}
