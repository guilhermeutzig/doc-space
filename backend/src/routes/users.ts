import { Router, RequestHandler } from "express";
import { getUsers, registerUser } from "../handlers/users";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.get("/", authenticateToken as RequestHandler, getUsers);
router.post("/", authenticateToken as RequestHandler, registerUser);

export default router;
