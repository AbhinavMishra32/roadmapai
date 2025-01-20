import prisma from "../db";
import { Request, Response } from "express";

interface CustomRequest extends Request {
    addedUser: {
        id: string;
    };
}

export const getQuizById = async (req: CustomRequest, res: Response) => {
    const { id } = req.params;

    try {
        const quiz = await prisma.quiz.findUnique({
            where: { id: parseInt(id) },
            include: {
                questions: {
                    include: {
                        answers: true,
                    },
                },
                lesson: true,
                completedBy: true,
            }
        });
        
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }
        const isCompleted = quiz.completedBy?.id === req.addedUser.id;
        return res.status(200).json({
            success: true,
            message: "Quiz fetched successfully",
            quiz,
            isCompleted,
        })
    } catch (error) {
        console.log("Error in getQuizById(): ", error);
    }
}

export const submitQuiz = async (req: any, res: Response) => {
    const { id } = req.params;
    const { addedUser } = req;
    const {score} = req.body;

    try {
        const quiz = await prisma.quiz.findUnique({
            where: { id: parseInt(id) }
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found",
            });
        }

        const completedQuiz = await prisma.quiz.update({
            where: { id: parseInt(id) },
            data: {
                completedBy: {
                    connect: {
                        id: addedUser.id
                    }
                },
                score: parseInt(score)
            }
        })

        return res.status(200).json({
            success: true,
            message: "Quiz submitted successfully",
            completedQuiz,
        });
    } catch (error) {
        console.log("Error in submitQuiz(): ", error);
    }
}

export const resetQuiz = async (req: any, res: Response) => {
    const { id } = req.params;
    const { addedUser } = req;

    try {
        const quiz = await prisma.quiz.findUnique({
            where: { id: parseInt(id) }
        });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found",
            });
        }

        const resetQuiz = await prisma.quiz.update({
            where: { id: parseInt(id) },
            data: {
                completedBy: {
                    disconnect: {
                        id: addedUser.id
                    }
                },
                score: null
            }
        })

        return res.status(200).json({
            success: true,
            message: "Quiz reset successfully",
            resetQuiz,
        });
    } catch (error) {
        console.log("Error in resetQuiz(): ", error);
    }
}