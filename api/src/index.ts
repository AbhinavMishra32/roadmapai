import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/user.js';
import authRouter from './routes/auth.js';
import lessonRouter from './routes/lesson.js';
import quizRouter from './routes/quiz.js';
import aiRouter from './routes/ai.js';
import careersRouter from './routes/careers.js';
import chatRouter from './routes/chat.js';
import counsellorRouter from './routes/counsellor.js';
import studentRouter from './routes/student.js';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from './config.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import prisma from './db.js';

const CLIENT_URL = process.env.CLIENT_URL;
if (!CLIENT_URL) {
    console.error('CLIENT_URL is not set in environment variables');
    process.exit(1);
}

export const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: CLIENT_URL,
        methods: ['GET', 'POST'],
        credentials: true,
    }
});
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))

export const legacyRequireAuth = (req: any, res: any, next: any) => {
    if (!req.auth) {
        return next(new Error('Unauthenticated'))
    }
    next()
}

export interface ReqWithUser extends Request {
    addedUser: JwtPayload
}

export const authRequire = (req: Request, res: Response, next: NextFunction) => {
    // console.log("Cookies: ", req.cookies);
    const token = req.cookies['userToken'] || req.cookies['token'];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token is required"
        });
    }

        jwt.verify(token, JWT_SECRET, (err: any, user: JwtPayload) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: "Token is invalid"
                });
            }
            let reqWithUser = req as ReqWithUser;
            reqWithUser.addedUser = user;
            // console.log("addedUser in authRequire: ", reqWithUser.addedUser);
            next();
        });
    };
    
    const userSocketMap = new Map();
    const chatRooms = new Map();
    
    io.on('connection', (socket) => {
        console.log('New connection:', socket.id);
        const chatId = socket.handshake.query.chatId as string;
        
        socket.join(chatId);
        console.log(`Socket ${socket.id} joined chat ${chatId}`);

        socket.on('sendMessage', async (data) => {
            try {
                const { senderId, receiverId, content, sender } = data;
                console.log('Message received:', data);

                const newMessage = await prisma.message.create({
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

            } catch (error) {
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

app.get('/', async (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "MM API"
    });
});

app.use('/api/user', authRequire, userRouter);
app.use('/api/lesson', authRequire, lessonRouter);
app.use('/api/quiz', authRequire, quizRouter);
app.use('/api/auth', authRouter);
app.use('/api/ai', authRequire, aiRouter);
app.use('/api/careers', careersRouter);
app.use('/api/chat', authRequire, chatRouter);
app.use('/api/counsellor', authRequire, counsellorRouter);
app.use('/api/student', authRequire, studentRouter);



app.get('/api/approve', async (req: ReqWithUser, res: Response) => { 
    try {
        const counsellors = await prisma.counsellor.findMany({
            where: {
                isVerified: false
            }
        });

        res.status(200).json({
            success: true,
            counsellors
        });
    } catch (error) {
        console.log("Error in counsellor router GET /approve : ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
})

export default app;