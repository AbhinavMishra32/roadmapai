import { Router, Request, Response } from "express";
import prisma from "../db";
import { ReqWithUser } from "..";

const router = Router();

router.get('/', async (req: ReqWithUser, res: Response) => {
    try {
        const counsellors = await prisma.counsellor.findMany({
            include: {
                chats: { where: { studentId: req.addedUser.id } },
            },
            where: {
                isVerified: true
            }
        });

        const chattingCounsellors = counsellors.map((counsellor: any) => ({
            ...counsellor,
            isChattingWithStudent: counsellor.chats.length > 0,
            chatId: counsellor.chats.length > 0 ? counsellor.chats[0].id : null
        }));

        res.status(200).json({
            success: true,
            counsellors: chattingCounsellors
        });
    } catch (error) {
        console.log("Error in counsellor router GET / : ", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

router.get('/all', async (req: ReqWithUser, res: Response) => {
    try {
        const counsellors = await prisma.counsellor.findMany({
            include: {
                chats: { where: { studentId: req.addedUser.id } },
            },
            where: {
                isVerified: true
            }
        });

        const counsellorsWithChatInfo = counsellors.map((counsellor: any) => ({
            ...counsellor,
            isChattingWithStudent: counsellor.chats.length > 0,
            chatId: counsellor.chats.length > 0 ? counsellor.chats[0].id : null
        }));

        res.status(200).json({
            success: true,
            counsellors: counsellorsWithChatInfo
        });
    } catch (error) {
        console.log("Error in counsellor router GET /all : ", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
})

router.get('/me', async (req: ReqWithUser, res: Response) => {
    try {
        const user = await prisma.counsellor.findUnique({
            where: {
                id: req.addedUser.id
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.log("Error in counsellor router GET /me : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
})

router.get('/:id', async (req: ReqWithUser, res: Response) => {
    try {
        const { id } = req.params;
        const counsellor = await prisma.counsellor.findUnique({
            where: {
                id: id
            },
            include: {
                chats: { where: { studentId: req.addedUser.id } }
            }
        });

        if (!counsellor) {
            return res.status(404).json({
                success: false,
                message: "Counsellor not found"
            });
        }

        res.status(200).json({
            success: true,
            counsellor: {
                ...counsellor,
                isChattingWithStudent: counsellor.chats.length > 0
            }
        });
    } catch (error) {
        console.log("Error in counsellor router GET /:id : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

router.get('/onboarding', async (req: ReqWithUser, res: Response) => {
    console.log("req.addedUser: ", req.addedUser);
    try {
        const user = await prisma.counsellor.findUnique({
            where: {
                id: req.addedUser.id
            }
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log("Error in counsellor router GET /onboarding : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
})

router.post('/onboarding', async (req: ReqWithUser, res: Response) => {
    try {
        const { data } = req.body;
        const user = await prisma.counsellor.update({
            where: {
                id: req.addedUser.id
            },
            data: {
                ...data,
                onboarded: true
            }
        });

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.log("Error in counsellor router POST /onboarding : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
        
    }
})


// router.get('/approve', async (req: ReqWithUser, res: Response) => { 
//     try {
//         const counsellors = await prisma.counsellor.findMany({
//             where: {
//                 isVerified: false
//             }
//         });

//         res.status(200).json({
//             success: true,
//             counsellors
//         });
//     } catch (error) {
//         console.log("Error in counsellor router GET /approve : ", error);
//         res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         });
//     }
// })

router.post('/:id/approve', async (req: ReqWithUser, res: Response) => {
    try {
        const { id } = req.params;
        const counsellor = await prisma.counsellor.update({
            where: {
                id: id
            },
            data: {
                isVerified: true
            }
        });

        res.status(200).json({
            success: true,
            counsellor
        });
    } catch (error) {
        console.log("Error in counsellor router POST /:id/approve : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
})

export default router;