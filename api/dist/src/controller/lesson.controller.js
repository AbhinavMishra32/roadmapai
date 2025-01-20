"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLessonWIthId = exports.createLesson = exports.submitLesson = exports.getLessonById = exports.getLesson = void 0;
const db_1 = __importDefault(require("../db"));
const getLesson = async (req, res) => {
    const userId = req.addedUser.id;
    console.log('User ID:', userId);
    try {
        const { category } = req.params;
        const lessons = await db_1.default.lesson.findMany({ where: { category, studentId: userId } });
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
        });
        // res.render('lesson', {
        //     title: lesson.title,
        //     description: lesson.description,
        //     content: lesson.content,
        // })
    }
    catch (error) {
        console.log("Error in getLesson(): ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
exports.getLesson = getLesson;
const getLessonById = async (req, res) => {
    const { category } = req.params;
    const userId = req.addedUser.id;
    const { id } = req.params;
    const { addedUser } = req;
    try {
        const lesson = await db_1.default.lesson.findUnique({
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
        });
    }
    catch (error) {
        console.log("Error in getLessonById(): ", error);
    }
};
exports.getLessonById = getLessonById;
const submitLesson = async (req, res) => {
    const { category } = req.params;
    const { id } = req.params;
    const { addedUser } = req;
    try {
        const lesson = await db_1.default.lesson.findUnique({
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
        const completedLesson = await db_1.default.lesson.update({
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
        });
        return res.status(200).json({
            success: true,
            message: "Lesson completed successfully",
            completedLesson,
            isCompleted: true
        });
    }
    catch (error) {
        console.log("Error in getLessonById(): ", error);
    }
};
exports.submitLesson = submitLesson;
const createLesson = async (req, res) => {
    console.log(req.body);
    try {
        const { category, categoryTitle, quizCategory, title, description, no, sbh1, p1, sbh2, p2, sbh3, p3, sbh4, p4, quizQuestions } = req.body;
        if (!quizCategory) {
            return res.status(400).json({
                success: false,
                message: "QuizCategory is required",
            });
        }
        const lesson = await db_1.default.lesson.create({
            data: {
                category,
                categoryTitle,
                title,
                description,
                no: parseInt(no),
            },
        });
        await db_1.default.lessonContent.create({
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
        const quizCat = await db_1.default.quizCategory.findUnique({
            where: { name: quizCategory },
        });
        if (!quizCat) {
            return res.status(404).json({
                success: false,
                message: "QuizCategory not found",
            });
        }
        const quiz = await db_1.default.quiz.create({
            data: {
                category: {
                    connect: { id: quizCat.id },
                },
                lesson: {
                    connect: { id: lesson.id },
                },
                questions: {
                    create: quizQuestions.map((q) => ({
                        text: q.questionText,
                        answers: {
                            create: q.answers.map((answer) => ({
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
    }
    catch (error) {
        console.log("Error in createLesson(): ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
exports.createLesson = createLesson;
const createLessonWIthId = async (req, res) => {
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
        const lesson = await db_1.default.lesson.create({
            data: {
                category,
                categoryTitle,
                title,
                description,
                no: parseInt(no),
                studentId: id,
            },
        });
        await db_1.default.lessonContent.create({
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
        const quizCat = await db_1.default.quizCategory.findUnique({
            where: { name: quizCategory },
        });
        if (!quizCat) {
            return res.status(404).json({
                success: false,
                message: "QuizCategory not found",
            });
        }
        const quiz = await db_1.default.quiz.create({
            data: {
                category: {
                    connect: { id: quizCat.id },
                },
                lesson: {
                    connect: { id: lesson.id },
                },
                questions: {
                    create: quizQuestions.map((q) => ({
                        text: q.questionText,
                        answers: {
                            create: q.answers.map((answer) => ({
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
    }
    catch (error) {
        console.log("Error in createLessonWithId(): ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
exports.createLessonWIthId = createLessonWIthId;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVzc29uLmNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29udHJvbGxlci9sZXNzb24uY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSwrQ0FBMkI7QUFDcEIsTUFBTSxTQUFTLEdBQUcsS0FBSyxFQUFFLEdBQVEsRUFBRSxHQUFhLEVBQUUsRUFBRTtJQUN2RCxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztJQUNoQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNoQyxJQUFJLENBQUM7UUFDRCxNQUFNLEVBQUUsUUFBUSxFQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUUvQixNQUFNLE9BQU8sR0FBRyxNQUFNLFlBQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsRUFBQyxDQUFDLENBQUM7UUFDeEYsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ1gsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDeEIsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsT0FBTyxFQUFFLGtCQUFrQjthQUM5QixDQUFDLENBQUM7UUFDUCxDQUFDO1FBQ0QsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUN4QixPQUFPLEVBQUUsSUFBSTtZQUNiLE9BQU8sRUFBRSw2QkFBNkI7WUFDdEMsT0FBTztTQUNWLENBQUMsQ0FBQTtRQUNGLHlCQUF5QjtRQUN6QiwyQkFBMkI7UUFDM0IsdUNBQXVDO1FBQ3ZDLCtCQUErQjtRQUMvQixLQUFLO0lBRVQsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDYixPQUFPLENBQUMsR0FB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