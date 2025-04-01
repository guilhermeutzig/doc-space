import { Request, Response } from "express";
import sql from "../database";
import bcrypt from "bcrypt";
import config from "../config";
import jwt from "jsonwebtoken";

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

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: "30m" }
    );

    response.send({
      user: {
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    response.status(500).send({ error: "Error signing in" });
  }
}
