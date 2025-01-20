"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpSignIn = void 0;
const db_1 = __importDefault(require("../db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signUpSignIn = async (req, res) => {
    const { username, email, password, accountType, isSignUp } = req.body;
    // console.log("Request body: ", req.body);
    // console.log("Account type: ", accountType);
    const generateToken = (user) => {
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, accountType }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
        // console.log("Generated token: ", token);
        return token;
    };
    if (isSignUp) {
        switch (accountType) {
            case 'student': {
                const student = await db_1.default.student.findFirst({ where: { email } });
                if (student) {
                    return res.status(400).json({
                        success: false,
                        message: "Student already exists",
                    });
                }
                const salt = await bcrypt_1.default.genSalt(10);
                const hashedPassword = await bcrypt_1.default.hash(password, salt);
                const newStudent = await db_1.default.student.create({
                    data: {
                        username,
                        email,
                        password: hashedPassword,
                    }
                });
                const token = generateToken(newStudent);
                res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
                res.cookie('accountType', 'student', { path: '/', sameSite: 'strict' });
                return res.status(200).json({
                    success: true,
                    message: "Student created successfully",
                    student: newStudent,
                });
            }
            case 'counsellor': {
                const counsellor = await db_1.default.counsellor.findFirst({ where: { email } });
                if (counsellor) {
                    return res.status(400).json({
                        success: false,
                        message: "Counsellor already exists",
                    });
                }
                const salt = await bcrypt_1.default.genSalt(10);
                const hashedPassword = await bcrypt_1.default.hash(password, salt);
                const newCounsellor = await db_1.default.counsellor.create({
                    data: {
                        username,
                        email,
                        password: hashedPassword,
                    }
                });
                const token = generateToken(newCounsellor);
                res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
                res.cookie('accountType', 'counsellor', { path: '/', sameSite: 'strict' });
                return res.status(200).json({
                    success: true,
                    message: "Counsellor created successfully",
                    counsellor: newCounsellor,
                });
            }
            case 'recruiter': {
                const recruiter = await db_1.default.recruiter.findFirst({ where: { email } });
                if (recruiter) {
                    return res.status(400).json({
                        success: false,
                        message: "Recruiter already exists",
                    });
                }
                const salt = await bcrypt_1.default.genSalt(10);
                const hashedPassword = await bcrypt_1.default.hash(password, salt);
                const newRecruiter = await db_1.default.recruiter.create({
                    data: {
                        username,
                        email,
                        password: hashedPassword,
                    }
                });
                const token = generateToken(newRecruiter);
                res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
                res.cookie('accountType', 'recruiter', { path: '/', sameSite: 'strict' });
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
                const student = await db_1.default.student.findFirst({ where: { email } });
                if (!student) {
                    return res.status(400).json({
                        success: false,
                        message: "Student does not exist",
                    });
                }
                const isMatch = await bcrypt_1.default.compare(password, student.password);
                if (!isMatch) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid credentials",
                    });
                }
                const token = generateToken(student);
                res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
                // const userCookie = { username: student.username, email: student.email, id: student.id, userId: student.id };
                res.cookie('accountType', 'student', { path: '/', sameSite: 'strict' });
                // res.cookie('userDetails', JSON.stringify(userCookie), { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
                res.cookie('userId', student.id, { path: '/', sameSite: 'strict' });
                return res.status(200).json({
                    success: true,
                    message: "Student signed in successfully",
                    student,
                    token
                });
            }
            case 'counsellor': {
                console.log("Inside counsellor sign in");
                const counsellor = await db_1.default.counsellor.findUnique({ where: { email } });
                console.log("Counsellor: ", counsellor);
                if (!counsellor) {
                    return res.status(400).json({
                        success: false,
                        message: "Counsellor does not exist",
                    });
                }
                const isMatch = await bcrypt_1.default.compare(password, counsellor.password);
                if (!isMatch) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid credentials",
                    });
                }
                const token = generateToken(counsellor);
                res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
                res.cookie('accountType', 'counsellor', { path: '/', sameSite: 'strict' });
                res.cookie('userId', counsellor.id, { path: '/', sameSite: 'strict' });
                return res.status(200).json({
                    success: true,
                    message: "Counsellor signed in successfully",
                    counsellor,
                    token
                });
            }
            case 'recruiter': {
                const recruiter = await db_1.default.recruiter.findFirst({ where: { email } });
                if (!recruiter) {
                    return res.status(400).json({
                        success: false,
                        message: "Recruiter does not exist",
                    });
                }
                const isMatch = await bcrypt_1.default.compare(password, recruiter.password);
                if (!isMatch) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid credentials",
                    });
                }
                const token = generateToken(recruiter);
                res.cookie('userToken', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
                res.cookie('accountType', 'recruiter', { path: '/', sameSite: 'strict' });
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
};
exports.signUpSignIn = signUpSignIn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbnRyb2xsZXIvYXV0aC5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLCtDQUEyQjtBQUMzQixvREFBNEI7QUFDNUIsZ0VBQStCO0FBRXhCLE1BQU0sWUFBWSxHQUFHLEtBQUssRUFBRSxHQUFZLEVBQUUsR0FBYSxFQUFFLEVBQUU7SUFDOUQsTUFBTSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO0lBQ3RFLDJDQUEyQztJQUMzQyw4Q0FBOEM7SUFFOUMsTUFBTSxhQUFhLEdBQUcsQ0FBQyxJQUFTLEVBQUUsRUFBRTtRQUNoQyxNQUFNLEtBQUssR0FBRyxzQkFBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDdEgsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQzFGLDJDQUEyQztRQUMzQyxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDLENBQUM7SUFFRixJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQ1gsUUFBUSxXQUFXLEVBQUUsQ0FBQztZQUNsQixLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsTUFBTSxPQUFPLEdBQUcsTUFBTSxZQUFNLENBQUMs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