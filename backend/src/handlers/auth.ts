import { Request, Response } from "express";
import sql from "../database";
import bcrypt from "bcrypt";
import config from "../config";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { getJwtTokens } from "../utils/jwt";

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

    const tokens = getJwtTokens({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    response.cookie("refresh_token", tokens.refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    response.send({
      user: {
        email: user.email,
        name: user.name,
      },
      tokens,
    });
  } catch (error) {
    console.error(error);
    response.status(500).send({ error: "Error signing in" });
  }
}

export async function refreshToken(request: Request, response: Response) {
  try {
    const refreshToken = request.cookies.refresh_token;

    if (!refreshToken) {
      return response.status(401).send({ error: "Refresh token not found" });
    }

    jwt.verify(
      refreshToken,
      config.refreshTokenSecret,
      (err: VerifyErrors | null, user: any) => {
        if (err) {
          return response.status(403).send({ error: err.message });
        }

        const tokens = getJwtTokens({
          id: user.id,
          name: user.name,
          email: user.email,
        });

        response.cookie("refresh_token", tokens.refreshToken, {
          httpOnly: true,
          secure: config.nodeEnv === "production",
          maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        response.send({
          user: {
            email: user.email,
            name: user.name,
          },
          tokens,
        });
      }
    );
  } catch (error: unknown) {
    console.error(error);
    response.status(500).send({ error: (error as Error).message });
  }
}

export async function logout(request: Request, response: Response) {
  try {
    response.clearCookie("refresh_token");
    response.status(200).send({ message: "Logged out" });
  } catch (error: unknown) {
    console.error(error);
    response.status(500).send({ error: (error as Error).message });
  }
}
