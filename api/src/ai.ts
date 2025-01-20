import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
// import OpenAI from "openai";

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// if (!OPENAI_API_KEY) {
//     throw new Error("Missing OPENAI_API_KEY");
// }
// export const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    throw new Error("Missing GOOGLE_API_KEY");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
export const counsellorModel = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    systemInstruction: 'You are a knowledgeable career advisor with expertise in describing various professions.When a user provides a job title, your role is to explain what a typical day in that position looks like.Describe the daily activities, responsibilities, and tools used, along with the challenges they might face.Provide insights into the interpersonal aspects of the role, such as teamwork or client interactions, and how the job fits into the larger industry.Additionally, share information about work- life balance, growth opportunities, and any unique aspects that make the job interesting or challenging.Use simple, clear language to paint a vivid picture of the role, making it easy to understand and relatable.'
});