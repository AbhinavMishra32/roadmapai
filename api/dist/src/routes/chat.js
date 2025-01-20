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
        const chats = await db_1.default.chat.findMany({
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
    }
    catch (error) {
        console.log("Error in chat router GET / : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const chat = await db_1.default.chat.findUnique({
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
        });
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }
        res.status(200).json({
            success: true,
            chat
        });
    }
    catch (error) {
        console.log("Error in chat router GET /:id : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
router.post('/start', async (req, res) => {
    try {
        // console.log("req.body.counsellorId: ", req.body.counsellorId);
        if (!req.body.counsellorId) {
            return res.status(400).json({
                success: false,
                message: "Counsellor ID is required"
            });
        }
        const findChat = await db_1.default.chat.findFirst({
            where: {
                AND: [
                    { studentId: req.addedUser.id },
                    { counsellorId: req.body.counsellorId }
                ]
            }
        });
        if (findChat) {
            return res.status(400).json({
                success: false,
                message: "Chat already exists",
                chat: findChat
            });
        }
        const chat = await db_1.default.chat.create({
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
        });
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
    }
    catch (error) {
        console.log("Error in chat router POST /start : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb3V0ZXMvY2hhdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHFDQUFvRDtBQUNwRCwrQ0FBMkI7QUFHM0IsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFFeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQWdCLEVBQUUsR0FBYSxFQUFFLEVBQUU7SUFDdEQsSUFBSSxDQUFDO1FBQ0QsTUFBTSxLQUFLLEdBQUcsTUFBTSxZQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUNyQyxLQUFLLEVBQUU7Z0JBQ0gsRUFBRSxFQUFFO29CQUNBLEVBQUUsWUFBWSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFO29CQUNsQyxFQUFFLFNBQVMsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRTtpQkFDbEM7YUFDSjtZQUNELE9BQU8sRUFBRTtnQkFDTCxPQUFPLEVBQUUsSUFBSTtnQkFDYixVQUFVLEVBQUUsSUFBSTtnQkFDaEIsUUFBUSxFQUFFO29CQUNOLE9BQU8sRUFBRTt3QkFDTCxTQUFTLEVBQUUsS0FBSztxQkFDbkI7aUJBQ0o7YUFDSjtTQUNKLENBQUMsQ0FBQztRQUVILEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ2pCLE9BQU8sRUFBRSxJQUFJO1lBQ2IsS0FBSztTQUNSLENBQUMsQ0FBQztJQUVQLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNwRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNqQixPQUFPLEVBQUUsS0FBSztZQUNkLE9BQU8sRUFBRSx1QkFBdUI7U0FDbkMs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