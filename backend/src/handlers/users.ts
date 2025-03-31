import { Request, Response } from "express";
import sql from "../database";
import { PostgresError } from "postgres";

export async function getUsers(request: Request, response: Response) {
  const result = await sql`SELECT * FROM users`;
  response.send(result);
}

export async function createUser(request: Request, response: Response) {
  const { name, email } = request.body;

  try {
    await sql`INSERT INTO users (name, email) VALUES (${name}, ${email})`;
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
