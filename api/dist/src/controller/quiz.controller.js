"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetQuiz = exports.submitQuiz = exports.getQuizById = void 0;
const db_1 = __importDefault(require("../db"));
const getQuizById = async (req, res) => {
    const { id } = req.params;
    try {
        const quiz = await db_1.default.quiz.findUnique({
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
        });
    }
    catch (error) {
        console.log("Error in getQuizById(): ", error);
    }
};
exports.getQuizById = getQuizById;
const submitQuiz = async (req, res) => {
    const { id } = req.params;
    const { addedUser } = req;
    const { score } = req.body;
    try {
        const quiz = await db_1.default.quiz.findUnique({
            where: { id: parseInt(id) }
        });
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found",
            });
        }
        const completedQuiz = await db_1.default.quiz.update({
            where: { id: parseInt(id) },
            data: {
                completedBy: {
                    connect: {
                        id: addedUser.id
                    }
                },
                score: parseInt(score)
            }
        });
        return res.status(200).json({
            success: true,
            message: "Quiz submitted successfully",
            completedQuiz,
        });
    }
    catch (error) {
        console.log("Error in submitQuiz(): ", error);
    }
};
exports.submitQuiz = submitQuiz;
const resetQuiz = async (req, res) => {
    const { id } = req.params;
    const { addedUser } = req;
    try {
        const quiz = await db_1.default.quiz.findUnique({
            where: { id: parseInt(id) }
        });
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found",
            });
        }
        const resetQuiz = await db_1.default.quiz.update({
            where: { id: parseInt(id) },
            data: {
                completedBy: {
                    disconnect: {
                        id: addedUser.id
                    }
                },
                score: null
            }
        });
        return res.status(200).json({
            success: true,
            message: "Quiz reset successfully",
            resetQuiz,
        });
    }
    catch (error) {
        console.log("Error in resetQuiz(): ", error);
    }
};
exports.resetQuiz = resetQuiz;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpei5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbnRyb2xsZXIvcXVpei5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLCtDQUEyQjtBQVNwQixNQUFNLFdBQVcsR0FBRyxLQUFLLEVBQUUsR0FBa0IsRUFBRSxHQUFhLEVBQUUsRUFBRTtJQUNuRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUUxQixJQUFJLENBQUM7UUFDRCxNQUFNLElBQUksR0FBRyxNQUFNLFlBQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ3RDLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDM0IsT0FBTyxFQUFFO2dCQUNMLFNBQVMsRUFBRTtvQkFDUCxPQUFPLEVBQUU7d0JBQ0wsT0FBTyxFQUFFLElBQUk7cUJBQ2hCO2lCQUNKO2dCQUNELE1BQU0sRUFBRSxJQUFJO2dCQUNaLFdBQVcsRUFBRSxJQUFJO2FBQ3BCO1NBQ0osQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ1IsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDeEIsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsT0FBTyxFQUFFLGdCQUFnQjthQUM1QixDQUFDLENBQUM7UUFDUCxDQUFDO1FBQ0QsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLEtBQUssR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7UUFDOUQsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUN4QixPQUFPLEVBQUUsSUFBSTtZQUNiLE9BQU8sRUFBRSwyQkFBMkI7WUFDcEMsSUFBSTtZQUNKLFdBQVc7U0FDZCxDQUFD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