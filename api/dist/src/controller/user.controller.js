"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recruiterOnboard = exports.onboardUser = exports.fetchExtendedUser = exports.fetchUser = void 0;
const db_js_1 = __importDefault(require("../db.js"));
const fetchUser = async (req, res) => {
    try {
        const addedUser = req.addedUser;
        const { accountType } = addedUser;
        switch (accountType) {
            case 'student': {
                const user = await db_js_1.default.student.findUnique({ where: { id: addedUser.id } });
                res.cookie('onboarded', user.onboarded);
                return res.status(200).json({
                    success: true,
                    message: "User fetched successfully",
                    user,
                    accountType,
                });
            }
            case 'recruiter': {
                const user = await db_js_1.default.recruiter.findUnique({ where: { id: addedUser.id } });
                res.cookie('onboarded', user.onboarded);
                return res.status(200).json({
                    success: true,
                    message: "User fetched successfully",
                    user,
                    accountType,
                });
            }
            case 'counsellor': {
                const user = await db_js_1.default.counsellor.findUnique({ where: { id: addedUser.id } });
                // res.cookie('onboarded', user.onboarded);
                return res.status(200).json({
                    success: true,
                    message: "User fetched successfully",
                    user,
                    accountType,
                });
            }
            default: {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
        }
    }
    catch (error) {
        console.log("Error in fetchUser(): ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
exports.fetchUser = fetchUser;
const fetchExtendedUser = async (req, res) => {
    try {
        const completedLessons = await db_js_1.default.lesson.count({ where: { completedBy: { id: req.addedUser.id } } });
        const totalLessons = await db_js_1.default.lesson.count();
        const user = await db_js_1.default.student.findUnique({ where: { id: req.addedUser.id } });
        const uniqueCategories = await db_js_1.default.lesson.findMany({
            distinct: ['categoryTitle'],
            select: { categoryTitle: true }
        });
        const courseProgress = await Promise.all(uniqueCategories.map(async (category) => {
            const totalCategoryLessons = await db_js_1.default.lesson.count({ where: { categoryTitle: category.categoryTitle } });
            const completedCategoryLessons = await db_js_1.default.lesson.count({ where: { categoryTitle: category.categoryTitle, completedBy: { id: req.addedUser.id } } });
            return {
                categoryTitle: category.categoryTitle,
                completed: totalCategoryLessons === completedCategoryLessons
            };
        }));
        const completedLessonsUnderCourse = await Promise.all(uniqueCategories.map(async (category) => {
            const completedLessons = await db_js_1.default.lesson.count({
                where: {
                    categoryTitle: category.categoryTitle,
                    completedBy: { id: req.addedUser.id }
                }
            });
            return {
                categoryTitle: category.categoryTitle,
                A: completedLessons,
                fullMark: totalLessons
            };
        }));
        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user,
            accountType: req.addedUser.accountType,
            lessonProgress: {
                completedLessons,
                totalLessons,
            },
            courseProgress,
            completedLessonsUnderCourse,
        });
    }
    catch (error) {
        console.log("Error in fetchExtendedUser(): ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
exports.fetchExtendedUser = fetchExtendedUser;
const onboardUser = async (req, res, next) => {
    try {
        const addedUser = req.addedUser;
        const student = await db_js_1.default.student.findUnique({ where: { id: addedUser.id } });
        console.log("Student: ", student);
        const { school, grade, stream, subjects, address, careerGoal, extracurriculars, learningStyle, counsellingReason } = req.body;
        console.log("All details:", school, grade, stream, subjects, address, careerGoal, extracurriculars, learningStyle, counsellingReason);
        const onboardedStudent = await db_js_1.default.student.update({
            where: { id: addedUser.id },
            data: {
                onboarded: true,
                school,
                grade,
                stream,
                subjects,
                address,
                careerGoal,
                extracurriculars,
                learningStyle,
                counsellingReason
            }
        });
        return res.status(200).json({
            success: true,
            message: "Student onboarded successfully",
            user: onboardedStudent
        });
    }
    catch (error) {
        console.error("Error in onboardUser(): ", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while onboarding the student",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
exports.onboardUser = onboardUser;
const recruiterOnboard = async (req, res) => {
    try {
        const addedUser = req.addedUser;
        const recruiter = await db_js_1.default.recruiter.findUnique({ where: { id: addedUser.id } });
        if (!recruiter) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        console.log("Recruiter form request: ", req.body);
        const onboardedRecruiter = await db_js_1.default.recruiter.update({
            where: { id: addedUser.id },
            data: {
                ...req.body,
                onboarded: true,
                userType: "recruiter"
            }
        });
        return res.status(200).json({
            success: true,
            message: "Recruiter form created",
            onboardedRecruiter
        });
    }
    catch (error) {
        console.log("Error in recruiterOnboard(): ", error);
    }
};
exports.recruiterOnboard = recruiterOnboard;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbnRyb2xsZXIvdXNlci5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLHFEQUE4QjtBQUd2QixNQUFNLFNBQVMsR0FBRyxLQUFLLEVBQUUsR0FBZ0IsRUFBRSxHQUFhLEVBQUUsRUFBRTtJQUMvRCxJQUFJLENBQUM7UUFDRCxNQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDO1FBQ2hDLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxTQUFTLENBQUM7UUFDbEMsUUFBUSxXQUFXLEVBQUUsQ0FBQztZQUNsQixLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsTUFBTSxJQUFJLEdBQUcsTUFBTSxlQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUM5RSxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3hDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7b0JBQ3hCLE9BQU8sRUFBRSxJQUFJO29CQUNiLE9BQU8sRUFBRSwyQkFBMkI7b0JBQ3BDLElBQUk7b0JBQ0osV0FBVztpQkFDZCxDQUFDLENBQUM7WUFDUCxDQUFDO1lBQ0QsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUNmLE1BQU0sSUFBSSxHQUFHLE1BQU0sZUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDaEYsR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFNB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