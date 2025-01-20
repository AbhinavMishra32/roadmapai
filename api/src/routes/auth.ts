import { Router } from "express";
import { signUpSignIn } from "../controller/auth.controller";

const router = Router();
router.post('/', signUpSignIn);

export default router;