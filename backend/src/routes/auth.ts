import { RequestHandler, Router } from "express";
import { logout, refreshToken, signIn } from "../handlers/auth.js";

const router = Router();

router.post("/signin", signIn as RequestHandler);
router.post("/refresh-token", refreshToken as RequestHandler);
router.delete("/logout", logout as RequestHandler);

export default router;
