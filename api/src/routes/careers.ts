import type { Request, Response } from "express";
import { Router } from "express";
import prisma from "../db";
import { fetchOnetData } from "../controller/careers.controller";

const router = Router();
router.get('/', async (req: Request, res: Response) => {
    const careers = await prisma.careerCategory.findMany(
        {
            include: {
                careers: true
            }
        }
    );

    res.status(200).json({
        success: true,
        message: "Careers fetched successfully",
        careers,
    });
});

router.get('/:onetCode', fetchOnetData);


export default router;