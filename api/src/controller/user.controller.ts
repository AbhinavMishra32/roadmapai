import { NextFunction, Request, type Response } from "express";
import { Webhook } from "svix";
import prisma from "../db.js";
import { ReqWithUser } from "../index.js";

export const fetchUser = async (req: ReqWithUser, res: Response) => {
    try {
        const addedUser = req.addedUser;
        const { accountType } = addedUser;
        switch (accountType) {
            case 'student': {
                const user = await prisma.student.findUnique({ where: { id: addedUser.id } });
                res.cookie('onboarded', user.onboarded);
                return res.status(200).json({
                    success: true,
                    message: "User fetched successfully",
                    user,
                    accountType,
                });
            }
            case 'recruiter': {
                const user = await prisma.recruiter.findUnique({ where: { id: addedUser.id } });
                res.cookie('onboarded', user.onboarded);
                return res.status(200).json({
                    success: true,
                    message: "User fetched successfully",
                    user,
                    accountType,
                });
            }
            case 'counsellor': {
                const user = await prisma.counsellor.findUnique({ where: { id: addedUser.id } });
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

    } catch (error) {
        console.log("Error in fetchUser(): ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

export const fetchExtendedUser = async (req: ReqWithUser, res: Response) => {
    try {
        const completedLessons = await prisma.lesson.count({where: {completedBy: {id: req.addedUser.id}}});
        const totalLessons = await prisma.lesson.count();
        const user = await prisma.student.findUnique({ where: { id: req.addedUser.id } });

        const uniqueCategories = await prisma.lesson.findMany({
            distinct: ['categoryTitle'],
            select: { categoryTitle: true }
        });
        const courseProgress = await Promise.all(uniqueCategories.map(async (category) => {
            const totalCategoryLessons = await prisma.lesson.count({ where: { categoryTitle: category.categoryTitle } });
            const completedCategoryLessons = await prisma.lesson.count({ where: { categoryTitle: category.categoryTitle, completedBy: { id: req.addedUser.id } } });
            return {
            categoryTitle: category.categoryTitle,
            completed: totalCategoryLessons === completedCategoryLessons
            };
        }));

        const completedLessonsUnderCourse = await 
        Promise.all(uniqueCategories.map(async (category) => {
            const completedLessons = await prisma.lesson.count({
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
        }))

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
        })
    } catch (error) {
        console.log("Error in fetchExtendedUser(): ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const onboardUser = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const addedUser = req.addedUser;

        const student = await prisma.student.findUnique({ where: { id: addedUser.id } });
        console.log("Student: ", student);

        const {
            school,
            grade,
            stream,
            subjects,
            address,
            careerGoal,
            extracurriculars,
            learningStyle,
            counsellingReason
        } = req.body;
        console.log("All details:", school, grade, stream, subjects, address, careerGoal, extracurriculars, learningStyle, counsellingReason);

        const onboardedStudent = await prisma.student.update({
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
    } catch (error) {
        console.error("Error in onboardUser(): ", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while onboarding the student",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const recruiterOnboard = async (req: ReqWithUser, res: Response) => {
    try {
        const addedUser = req.addedUser;

        const recruiter = await prisma.recruiter.findUnique({ where: { id: addedUser.id } });
        if (!recruiter) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        console.log("Recruiter form request: ", req.body);

        const onboardedRecruiter = await prisma.recruiter.update({
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
    } catch (error) {
        console.log("Error in recruiterOnboard(): ", error);
    }
}