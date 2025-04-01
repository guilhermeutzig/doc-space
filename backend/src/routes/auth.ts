import { Router } from "express";
import { signIn } from "../handlers/auth";

const router = Router();

router.post("/signin", signIn);

export default router;
