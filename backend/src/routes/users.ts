import { Router, RequestHandler } from "express";
import { getUsers, registerUser } from "../handlers/users.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = Router();

router.get("/", authenticateToken as RequestHandler, getUsers);
router.post("/", registerUser);

export default router;
