import { Router, Request, Response } from "express";
import prisma from "../db";
import { ReqWithUser } from "..";

const router = Router();

router.get('/', async (req: ReqWithUser, res: Response) => {
    try {
        const chats = await prisma.chat.findMany({
            where: {
                OR: [
                    { counsellorId: req.addedUser.id },
                    { studentId: req.addedUser.id }
                ]
            },
            include: {
                student: true,
                counsellor: true,
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                },
            }
        });

        res.status(200).json({
            success: true,
            chats
        });

    } catch (error) {
        console.log("Error in chat router GET / : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

router.get('/:id', async (req: ReqWithUser, res: Response) => {
    try {
        const chat = await prisma.chat.findUnique({
            where: {
                id: req.params.id
            },
            include: {
                student: true,
                counsellor: true,
                messages: {
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        })

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }
        res.status(200).json({
            success: true,
            chat
        })
    } catch (error) {
        console.log("Error in chat router GET /:id : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
});

router.post('/start', async (req: ReqWithUser, res: Response) => {
    try {
        // console.log("req.body.counsellorId: ", req.body.counsellorId);
        if (!req.body.counsellorId) {
            return res.status(400).json({
                success: false,
                message: "Counsellor ID is required"
            });
        }
        const findChat = await prisma.chat.findFirst({
            where: {
                AND: [
                    { studentId: req.addedUser.id },
                    { counsellorId: req.body.counsellorId }
                ]
            }
        })

        if (findChat) {
            return res.status(400).json({
                success: false,
                message: "Chat already exists",
                chat: findChat
            });
        }

        const chat = await prisma.chat.create({
            data: {
                student: {
                    connect: {
                        id: req.addedUser.id
                    }
                },
                counsellor: {
                    connect: {
                        id: req.body.counsellorId
                    }
                }
            }
        })

        if (!chat) {
            return res.status(400).json({
                success: false,
                message: "Chat could not be started"
            });
        }

        res.status(200).json({
            success: true,
            chat
        });

    } catch (error) {
        console.log("Error in chat router POST /start : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
});

export default router;