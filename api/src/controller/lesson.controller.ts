import { Request, Response } from 'express';
import prisma from '../db';
export const getLesson = async (req: any, res: Response) => {
    const userId = req.addedUser.id;
    console.log('User ID:', userId);
    try {
        const { category} = req.params;

        const lessons = await prisma.lesson.findMany({ where: { category, studentId: userId }});
        if (!lessons) {
            return res.status(404).json({
                success: false,
                message: "Lesson not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Lesson fetched successfully",
            lessons,
        })
        // res.render('lesson', {
        //     title: lesson.title,
        //     description: lesson.description,
        //     content: lesson.content,
        // })

    } catch (error) {
        console.log("Error in getLesson(): ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const getLessonById = async (req: any, res: Response) => {
    const { category } = req.params;
    const userId = req.addedUser.id;
    const { id } = req.params;
    const { addedUser } = req;

    try {
        const lesson = await prisma.lesson.findUnique({
            where: { 
            id: parseInt(id),
            category, 
            studentId: userId
            },
            include: { 
            content: true, 
            quizes: true,
            completedBy: true,
            }
        });
        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Lesson not found",
            });
        }
        if (lesson.completedBy?.id === addedUser.id) {
            return res.status(200).json({
                success: true,
                message: "Lesson already completed by user",
                lesson: lesson,
                isCompleted: true
            });
        }
        return res.status(200).json({
            success: true,
            message: "Lesson fetched successfully",
            lesson,
        })
    } catch (error) {
        console.log("Error in getLessonById(): ", error);
    }
}

export const submitLesson = async (req: any, res: Response) => {
    const { category } = req.params;
    const { id } = req.params;
    const { addedUser } = req;

    try {
        const lesson = await prisma.lesson.findUnique({
            where: { 
            id: parseInt(id),
            category 
            },
            include: { 
            content: true, 
            quizes: true,
            }
        });
        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Lesson not found",
            });
        }

        const completedLesson = await prisma.lesson.update({
            where: {
                id: parseInt(id),
            },
            data: {
                completedBy: {
                    connect: {
                        id: addedUser.id
                    }
                },
            }
        })

        return res.status(200).json({
            success: true,
            message: "Lesson completed successfully",
            completedLesson,
            isCompleted: true
        })
    } catch (error) {
        console.log("Error in getLessonById(): ", error);
    }
}

export const createLesson = async (req: Request, res: Response) => {
    console.log(req.body);
    try {
        const { category, categoryTitle, quizCategory, title, description, no, sbh1, p1, sbh2, p2, sbh3, p3, sbh4, p4, quizQuestions } = req.body;
        if (!quizCategory) {
            return res.status(400).json({
                success: false,
                message: "QuizCategory is required",
            });
        }

        const lesson = await prisma.lesson.create({
            data: {
                category,
                categoryTitle,
                title,
                description,
                no: parseInt(no),
            },
        });

        await prisma.lessonContent.create({
            data: {
                lessonId: lesson.id,
                sbh1,
                p1,
                sbh2,
                p2,
                sbh3,
                p3,
                sbh4,
                p4,
            },
        });

        const quizCat = await prisma.quizCategory.findUnique({
            where: { name: quizCategory },
        });

        if (!quizCat) {
            return res.status(404).json({
                success: false,
                message: "QuizCategory not found",
            });
        }

        const quiz = await prisma.quiz.create({
            data: {
                category: {
                    connect: { id: quizCat.id },
                },
                lesson: {
                    connect: { id: lesson.id },
                },
                questions: {
                    create: quizQuestions.map((q: { questionText: string, answers: { text: string, isCorrect: boolean }[] }) => ({
                        text: q.questionText,
                        answers: {
                            create: q.answers.map((answer: { text: string, isCorrect: boolean }) => ({
                                text: answer.text,
                                isCorrect: answer.isCorrect,
                            })),
                        },
                    })),
                },
            },
        });

        return res.status(201).json({
            success: true,
            message: "Lesson created successfully",
            lesson,
            quiz,
        });
    } catch (error) {
        console.log("Error in createLesson(): ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const createLessonWIthId = async (req: Request, res: Response) => {
    console.log(req.body);
    try {
        const { category, categoryTitle, quizCategory, title, description, no, sbh1, p1, sbh2, p2, sbh3, p3, sbh4, p4, quizQuestions } = req.body;
        const { id } = req.params;
        console.log('ID:', id);

        if (!quizCategory) {
            return res.status(400).json({
                success: false,
                message: "QuizCategory is required",
            });
        }

        const lesson = await prisma.lesson.create({
            data: {
                category,
                categoryTitle,
                title,
                description,
                no: parseInt(no),
                studentId: id,
            },
        });

        await prisma.lessonContent.create({
            data: {
                lessonId: lesson.id,
                sbh1,
                p1,
                sbh2,
                p2,
                sbh3,
                p3,
                sbh4,
                p4,
            },
        });

        const quizCat = await prisma.quizCategory.findUnique({
            where: { name: quizCategory },
        });

        if (!quizCat) {
            return res.status(404).json({
                success: false,
                message: "QuizCategory not found",
            });
        }

        const quiz = await prisma.quiz.create({
            data: {
                category: {
                    connect: { id: quizCat.id },
                },
                lesson: {
                    connect: { id: lesson.id },
                },
                questions: {
                    create: quizQuestions.map((q: { questionText: string, answers: { text: string, isCorrect: boolean }[] }) => ({
                        text: q.questionText,
                        answers: {
                            create: q.answers.map((answer: { text: string, isCorrect: boolean }) => ({
                                text: answer.text,
                                isCorrect: answer.isCorrect,
                            })),
                        },
                    })),
                },
            },
        });

        return res.status(201).json({
            success: true,
            message: "Lesson created successfully",
            lesson,
            quiz,
        });
    } catch (error) {
        console.log("Error in createLessonWithId(): ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}