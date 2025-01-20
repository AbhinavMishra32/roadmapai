"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const counsellors = await db_1.default.counsellor.findMany({
            include: {
                chats: { where: { studentId: req.addedUser.id } },
            },
            where: {
                isVerified: true
            }
        });
        const chattingCounsellors = counsellors.map((counsellor) => ({
            ...counsellor,
            isChattingWithStudent: counsellor.chats.length > 0,
            chatId: counsellor.chats.length > 0 ? counsellor.chats[0].id : null
        }));
        res.status(200).json({
            success: true,
            counsellors: chattingCounsellors
        });
    }
    catch (error) {
        console.log("Error in counsellor router GET / : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
router.get('/all', async (req, res) => {
    try {
        const counsellors = await db_1.default.counsellor.findMany({
            include: {
                chats: { where: { studentId: req.addedUser.id } },
            },
            where: {
                isVerified: true
            }
        });
        const counsellorsWithChatInfo = counsellors.map((counsellor) => ({
            ...counsellor,
            isChattingWithStudent: counsellor.chats.length > 0,
            chatId: counsellor.chats.length > 0 ? counsellor.chats[0].id : null
        }));
        res.status(200).json({
            success: true,
            counsellors: counsellorsWithChatInfo
        });
    }
    catch (error) {
        console.log("Error in counsellor router GET /all : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
router.get('/me', async (req, res) => {
    try {
        const user = await db_1.default.counsellor.findUnique({
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
    }
    catch (error) {
        console.log("Error in counsellor router GET /me : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const counsellor = await db_1.default.counsellor.findUnique({
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
    }
    catch (error) {
        console.log("Error in counsellor router GET /:id : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
router.get('/onboarding', async (req, res) => {
    console.log("req.addedUser: ", req.addedUser);
    try {
        const user = await db_1.default.counsellor.findUnique({
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
        return res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        console.log("Error in counsellor router GET /onboarding : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
router.post('/onboarding', async (req, res) => {
    try {
        const { data } = req.body;
        const user = await db_1.default.counsellor.update({
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
    }
    catch (error) {
        console.log("Error in counsellor router POST /onboarding : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
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
router.post('/:id/approve', async (req, res) => {
    try {
        const { id } = req.params;
        const counsellor = await db_1.default.counsellor.update({
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
    }
    catch (error) {
        console.log("Error in counsellor router POST /:id/approve : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnNlbGxvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb3V0ZXMvY291bnNlbGxvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHFDQUFvRDtBQUNwRCwrQ0FBMkI7QUFHM0IsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFFeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQWdCLEVBQUUsR0FBYSxFQUFFLEVBQUU7SUFDdEQsSUFBSSxDQUFDO1FBQ0QsTUFBTSxXQUFXLEdBQUcsTUFBTSxZQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQztZQUNqRCxPQUFPLEVBQUU7Z0JBQ0wsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsU0FBUyxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUU7YUFDcEQ7WUFDRCxLQUFLLEVBQUU7Z0JBQ0gsVUFBVSxFQUFFLElBQUk7YUFDbkI7U0FDSixDQUFDLENBQUM7UUFFSCxNQUFNLG1CQUFtQixHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxVQUFlLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDOUQsR0FBRyxVQUFVO1lBQ2IscUJBQXFCLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUNsRCxNQUFNLEVBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSTtTQUN0RSxDQUFDLENBQUMsQ0FBQztRQUVKLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ2pCLE9BQU8sRUFBRSxJQUFJO1lBQ2IsV0FBVyxFQUFFLG1CQUFtQjtTQUNuQyxDQUFDLENBQUM7SUFDUCxD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