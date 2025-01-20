import { Request, Response } from "express";
import prisma from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUpSignIn = async (req: Request, res: Response) => {
    const { username, email, password, accountType, isSignUp } = req.body;
    // console.log("Request body: ", req.body);
    // console.log("Account type: ", accountType);

    const generateToken = (user: any) => {
        const token = jwt.sign({ id: user.id, email: user.email, accountType }, process.env.JWT_SECRET!, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
        // console.log("Generated token: ", token);
        return token;
    };

    if (isSignUp) {
        switch (accountType) {
            case 'student': {
                const student = await prisma.student.findFirst({ where: { email }});
                if (student) {
                    return res.status(400).json({
                        success: false,
                        message: "Student already exists",
                    });
                }
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const newStudent = await prisma.student.create({
                    data: {
                        username,
                        email,
                        password: hashedPassword,
                    }
                });

                const token = generateToken(newStudent);

                res.cookie('token', token, { path: '/', sameSite: 'none', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
                res.cookie('accountType', 'student', { path: '/', sameSite: 'none', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
                return res.status(200).json({
                    success: true,
                    message: "Student created successfully",
                    student: newStudent,
                });
            }
            case 'counsellor': {
                const counsellor = await prisma.counsellor.findFirst({ where: { email } });
                if (counsellor) {
                    return res.status(400).json({
                        success: false,
                        message: "Counsellor already exists",
                    });
                }
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const newCounsellor = await prisma.counsellor.create({
                    data: {
                        username,
                        email,
                        password: hashedPassword,
                    }
                });

                const token = generateToken(newCounsellor);

                res.cookie('token', token, { path: '/', sameSite: 'none', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
                res.cookie('accountType', 'counsellor', { path: '/', sameSite: 'none', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
                return res.status(200).json({
                    success: true,
                    message: "Counsellor created successfully",
                    counsellor: newCounsellor,
                });
            }
            case 'recruiter': {
                const recruiter = await prisma.recruiter.findFirst({ where: { email } });
                if (recruiter) {
                    return res.status(400).json({
                        success: false,
                        message: "Recruiter already exists",
                    });
                }
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const newRecruiter = await prisma.recruiter.create({
                    data: {
                        username,
                        email,
                        password: hashedPassword,
                    }
                });

                const token = generateToken(newRecruiter);

                res.cookie('token', token, { path: '/', sameSite: 'none', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
                res.cookie('accountType', 'recruiter', { path: '/', sameSite: 'none', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
                return res.status(200).json({
                    success: true,
                    message: "Recruiter created successfully",
                    recruiter: newRecruiter,
                });
            }
        }

        return res.status(400).json({
            success: false,
            message: "Invalid account type",
        });
    }
    else {
        switch (accountType) {
            case 'student': {
                const student = await prisma.student.findFirst({ where: { email } });
                if (!student) {
                    return res.status(400).json({
                        success: false,
                        message: "Student does not exist",
                    });
                }
                const isMatch = await bcrypt.compare(password, student.password);
                if (!isMatch) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid credentials",
                    });
                }

                const token = generateToken(student);

                res.cookie('token', token, { path: '/', sameSite: 'none', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
                // const userCookie = { username: student.username, email: student.email, id: student.id, userId: student.id };
                res.cookie('accountType', 'student', { path: '/', sameSite: 'none', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
                // res.cookie('userDetails', JSON.stringify(userCookie), { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
                res.cookie('userId', student.id, { path: '/', sameSite: 'none', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
                return res.status(200).json({
                    success: true,
                    message: "Student signed in successfully",
                    student,
                    token
                });
            }
            case 'counsellor': {
                console.log("Inside counsellor sign in");
                const counsellor = await prisma.counsellor.findUnique({ where: { email } });
                console.log("Counsellor: ", counsellor);
                if (!counsellor) {
                    return res.status(400).json({
                        success: false,
                        message: "Counsellor does not exist",
                    });
                }
                const isMatch = await bcrypt.compare(password, counsellor.password);
                if (!isMatch) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid credentials",
                    });
                }

                const token = generateToken(counsellor);

                res.cookie('token', token, { path: '/', sameSite: 'none', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
                res.cookie('accountType', 'counsellor', { path: '/', sameSite: 'none', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
                res.cookie('userId', counsellor.id, { path: '/', sameSite: 'none', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
                return res.status(200).json({
                    success: true,
                    message: "Counsellor signed in successfully",
                    counsellor,
                    token
                });
            }
            case 'recruiter': {
                const recruiter = await prisma.recruiter.findFirst({ where: { email } });
                if (!recruiter) {
                    return res.status(400).json({
                        success: false,
                        message: "Recruiter does not exist",
                    });
                }
                const isMatch = await bcrypt.compare(password, recruiter.password);
                if (!isMatch) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid credentials",
                    });
                }

                const token = generateToken(recruiter);

                res.cookie('userToken', token, { path: '/', sameSite: 'none', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
                res.cookie('accountType', 'recruiter', { path: '/', sameSite: 'none', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
                return res.status(200).json({
                    success: true,
                    message: "Recruiter signed in successfully",
                    recruiter,
                    token
                });
            }
        }

        return res.status(400).json({
            success: false,
            message: "Invalid account type",
        });
    }
}