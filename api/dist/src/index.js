"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRequire = exports.legacyRequireAuth = exports.app = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const user_js_1 = __importDefault(require("./routes/user.js"));
const auth_js_1 = __importDefault(require("./routes/auth.js"));
const lesson_js_1 = __importDefault(require("./routes/lesson.js"));
const quiz_js_1 = __importDefault(require("./routes/quiz.js"));
const ai_js_1 = __importDefault(require("./routes/ai.js"));
const careers_js_1 = __importDefault(require("./routes/careers.js"));
const chat_js_1 = __importDefault(require("./routes/chat.js"));
const counsellor_js_1 = __importDefault(require("./routes/counsellor.js"));
const student_js_1 = __importDefault(require("./routes/student.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_js_1 = require("./config.js");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const db_js_1 = __importDefault(require("./db.js"));
const CLIENT_URL = process.env.CLIENT_URL;
if (!CLIENT_URL) {
    console.error('CLIENT_URL is not set in environment variables');
    process.exit(1);
}
exports.app = (0, express_1.default)();
const server = (0, http_1.createServer)(exports.app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: CLIENT_URL,
        methods: ['GET', 'POST'],
        credentials: true,
    }
});
const PORT = 3000;
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)({
    origin: CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
const legacyRequireAuth = (req, res, next) => {
    if (!req.auth) {
        return next(new Error('Unauthenticated'));
    }
    next();
};
exports.legacyRequireAuth = legacyRequireAuth;
const authRequire = (req, res, next) => {
    // console.log("Cookies: ", req.cookies);
    const token = req.cookies['userToken'];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token is required"
        });
    }
    jsonwebtoken_1.default.verify(token, config_js_1.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: "Token is invalid"
            });
        }
        let reqWithUser = req;
        reqWithUser.addedUser = user;
        // console.log("addedUser in authRequire: ", reqWithUser.addedUser);
        next();
    });
};
exports.authRequire = authRequire;
const userSocketMap = new Map();
const chatRooms = new Map();
io.on('connection', (socket) => {
    console.log('New connection:', socket.id);
    const chatId = socket.handshake.query.chatId;
    socket.join(chatId);
    console.log(`Socket ${socket.id} joined chat ${chatId}`);
    socket.on('sendMessage', async (data) => {
        try {
            const { senderId, receiverId, content, sender } = data;
            console.log('Message received:', data);
            const newMessage = await db_js_1.default.message.create({
                data: {
                    senderId,
                    receiverId,
                    content,
                    sender,
                    chat: {
                        connect: { id: chatId }
                    }
                },
            });
            io.to(chatId).emit('receiveMessage', newMessage);
            console.log('Message sent to chat room:', chatId, newMessage);
        }
        catch (error) {
            console.error('Error sending message:', error);
            socket.emit('messageError', { error: 'Failed to send message' });
        }
    });
    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
        io.to(chatId).emit('userLeft', { socketId: socket.id, chatId });
    });
});
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.app.get('/', async (req, res) => {
    res.status(200).json({
        success: true,
        message: "MM API"
    });
});
exports.app.use('/api/user', exports.authRequire, user_js_1.default);
exports.app.use('/api/lesson', exports.authRequire, lesson_js_1.default);
exports.app.use('/api/quiz', exports.authRequire, quiz_js_1.default);
exports.app.use('/api/auth', auth_js_1.default);
exports.app.use('/api/ai', exports.authRequire, ai_js_1.default);
exports.app.use('/api/careers', careers_js_1.default);
exports.app.use('/api/chat', exports.authRequire, chat_js_1.default);
exports.app.use('/api/counsellor', exports.authRequire, counsellor_js_1.default);
exports.app.use('/api/student', exports.authRequire, student_js_1.default);
exports.app.get('/api/approve', async (req, res) => {
    try {
        const counsellors = await db_js_1.default.counsellor.findMany({
            where: {
                isVerified: false
            }
        });
        res.status(200).json({
            success: true,
            counsellors
        });
    }
    catch (error) {
        console.log("Error in counsellor router GET /approve : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.default = exports.app;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEseUJBQXVCO0FBQ3ZCLHNEQUFtRTtBQUNuRSxrRUFBeUM7QUFDekMsZ0RBQXdCO0FBQ3hCLCtEQUEwQztBQUMxQywrREFBMEM7QUFDMUMsbUVBQThDO0FBQzlDLCtEQUEwQztBQUMxQywyREFBc0M7QUFDdEMscUVBQWdEO0FBQ2hELCtEQUEwQztBQUMxQywyRUFBc0Q7QUFDdEQscUVBQWdEO0FBQ2hELGdFQUErQztBQUMvQywyQ0FBeUM7QUFDekMsK0JBQW9DO0FBQ3BDLHlDQUFtQztBQUNuQyxvREFBNkI7QUFFN0IsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUM7QUFDMUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ2QsT0FBTyxDQUFDLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO0lBQ2hFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsQ0FBQztBQUVZLFFBQUEsR0FBRyxHQUFHLElBQUEsaUJBQU8sR0FBRSxDQUFDO0FBQzdCLE1BQU0sTUFBTSxHQUFHLElBQUEsbUJBQVksRUFBQyxXQUFHLENBQUMsQ0FBQztBQUNqQyxNQUFNLEVBQUUsR0FBRyxJQUFJLGtCQUFNLENBQUMsTUFBTSxFQUFFO0lBQzFCLElBQUksRUFBRTtRQUNGLE1BQU0sRUFBRSxVQUFVO1FBQ2xCLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUM7UUFDeEIsV0FBVyxFQUFFLElBQUk7S0FDcEI7Q0FDSixDQUFDLENBQUM7QUFDSCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7QUFFbEIsV0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFBLHVCQUFZLEdBQUUsQ0FBQyxDQUFDO0FBQ3hCLFdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBRXhCLFdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBQSxjQUFJLEVBQUM7SUFDVCxNQUFNLEVBQUUsVUFBVTtJQUNsQixPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUM7SUFDekMsV0FBVyxFQUFFLElBQUk7Q0FDcEIsQ0FBQyxDQUFDLENBQUE7QUFFSSxNQUFNLGlCQUFpQixHQUFHLENBQUMsR0FBUSxFQUFFLEdBQVEsRUFBRSxJQUFTLEVBQUUsRUFBRTtJQUMvRCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1osT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFBO0lBQzdDLENBQUM7SUFDRCxJQUFJLEVBQUUsQ0FBQTtBQUNWLENBQUMsQ0FBQTtBQUxZLFFBQUEsaUJBQWlCLHFCQUs3QjtBQU1NLE1BQU0sV0FBVyxHQUFHLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQixFQUFFLEVBQUU7SUFDM0UseUNBQXlDO0lBQ3pDLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7SUFFdkMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ1QsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUN4QixPQUFPLEVBQUUsS0FBSztZQUNkLE9BQU8sRUFBRSxtQkFBbUI7U0FDL0IsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVHLHNCQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxzQkFBVSxFQUFFLENBQUMsR0FBUSxFQUFFLElBQWdCLEVBQUUsRUFBRTtRQUN6RCxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ04sT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDeEIsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsT0FBTyxFQUFFLGtCQUFrQjthQUM5QixDQUFDLENBQUM7UUFDUCxDQUFDO1FBQ0QsSUFBSSxXQUFXLEdBQUcsR0FBa0IsQ0FBQztRQUNyQyxXQUFXLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUM3QixvRUFBb0U7UUFDcEUsSUFBSSxFQUFFLENBQUM7SUFDWCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQztBQXZCTyxRQUFBLFdBQVcsZUF1QmxCO0FBRUYsTUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNoQyxNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBRTVCLEVBQUUsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUU7SUFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDMUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBZ0IsQ0FBQztJQUV2RCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxNQUFNLENBQUMsRUFBRSxnQkFBZ0IsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUV6RCxNQUFNLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFDcEMsSUFBSSxDQUFDO1lBQ0QsTUFBTSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztZQUN2RCxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFDO1lBRXZDLE1BQU0sVUFBVSxHQUFHLE1BQU0sZUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7Z0JBQzNDLElBQUksRUFBRTtvQkFDRixRQUFRO29CQUNSLFVBQVU7b0JBQ1YsT0FBTztvQkFDUCxNQUFNO29CQUNOLElBQUksRUFBRTt3QkFDRixPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFO3FCQUMxQjtpQkFDSjthQUNKLENBQUMsQ0FBQztZQUVILEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ2pELE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRWxFLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMvQyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLEtBQUssRUFBRSx3QkFBd0IsRUFBRSxDQUFDLENBQUM7UUFDckUsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO1FBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDcEUsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQztBQUdQLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtJQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3JELENBQUMsQ0FBQyxDQUFDO0FBRUgsV0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQVksRUFBRSxHQUFhLEVBQUUsRUFBRTtJQUMvQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNqQixPQUFPLEVBQUUsSUFBSTtRQUNiLE9BQU8sRUFBRSxRQUFRO0tBQ3BCLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDO0FBRUgsV0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsbUJBQVcsRUFBRSxpQkFBVSxDQUFDLENBQUM7QUFDOUMsV0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsbUJBQVcsRUFBRSxtQkFBWSxDQUFDLENBQUM7QUFDbEQsV0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsbUJBQVcsRUFBRSxpQkFBVSxDQUFDLENBQUM7QUFDOUMsV0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsaUJBQVUsQ0FBQyxDQUFDO0FBQ2pDLFdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLG1CQUFXLEVBQUUsZUFBUSxDQUFDLENBQUM7QUFDMUMsV0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsb0JBQWEsQ0FBQyxDQUFDO0FBQ3ZDLFdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLG1CQUFXLEVBQUUsaUJBQVUsQ0FBQyxDQUFDO0FBQzlDLFdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsbUJBQVcsRUFBRSx1QkFBZ0IsQ0FBQyxDQUFDO0FBQzFELFdBQUcsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLG1CQUFXLEVBQUUsb0JBQWEsQ0FBQyxDQUFDO0FBSXBELFdBQUcsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLEtBQUssRUFBRSxHQUFnQixFQUFFLEdBQWEsRUFBRSxFQUFFO0lBQzlELElBQUksQ0FBQztRQUNELE1BQU0sV0FBVyxHQUFHLE1BQU0sZUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7WUFDakQsS0FBSyxFQUFFO2dCQUNILFVBQVUsRUFBRSxLQUFLO2FBQ3BCO1NBQ0osQ0FBQyxDQUFDO1FBRUgsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDakIsT0FBTyxFQUFFLElBQUk7WUFDYixXQUFXO1NBQ2QsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLDRDQUE0QyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2pFLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ2pCLE9BQU8sRUFBRSxLQUFLO1lBQ2QsT0FBTyxFQUFFLHVCQUF1QjtTQUNuQyxDQUFDLENBQUM7SUFDUCxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUE7QUFFRixrQkFBZSxXQUFHLENBQUMifQ==