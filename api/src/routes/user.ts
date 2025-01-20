import { Router } from "express";
import { fetchUser, onboardUser, recruiterOnboard, fetchExtendedUser } from "../controller/user.controller";

const router = Router();
router.get("/", fetchUser);
router.get('/extended', fetchExtendedUser);
router.post('/onboard', onboardUser);
router.post('/onboard/recruiter', recruiterOnboard);

export default router;