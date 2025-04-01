import { Request, Response } from "express";
import sql from "../database";
import { PostgresError } from "postgres";
import bcrypt from "bcrypt";

export async function getUsers(_: Request, response: Response) {
  const result = await sql`SELECT id, name, email FROM users`;
  response.send(result);
}

export async function registerUser(request: Request, response: Response) {
  try {
    const { name, email, password } = request.body;

    const encryptedPassword = await bcrypt.hash(password, 10);
    await sql`INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${encryptedPassword})`;
    response.status(201).send({ message: "User created successfully" });
  } catch (err) {
    const error = err as PostgresError;
    console.error(error);

    if (error.code === "23505") {
      response.status(400).send({ error: "User already exists" });
    } else {
      response.status(500).send({ error: "Error creating user" });
    }
  }
}
