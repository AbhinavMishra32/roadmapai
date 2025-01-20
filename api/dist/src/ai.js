"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.counsellorModel = exports.geminiModel = void 0;
require("dotenv/config");
const generative_ai_1 = require("@google/generative-ai");
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
const genAI = new generative_ai_1.GoogleGenerativeAI(GEMINI_API_KEY);
exports.geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
exports.counsellorModel = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    systemInstruction: 'You are a knowledgeable career advisor with expertise in describing various professions.When a user provides a job title, your role is to explain what a typical day in that position looks like.Describe the daily activities, responsibilities, and tools used, along with the challenges they might face.Provide insights into the interpersonal aspects of the role, such as teamwork or client interactions, and how the job fits into the larger industry.Additionally, share information about work- life balance, growth opportunities, and any unique aspects that make the job interesting or challenging.Use simple, clear language to paint a vivid picture of the role, making it easy to understand and relatable.'
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYWkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUJBQXVCO0FBQ3ZCLHlEQUEyRDtBQUMzRCwrQkFBK0I7QUFFL0IscURBQXFEO0FBRXJELHlCQUF5QjtBQUN6QixpREFBaUQ7QUFDakQsSUFBSTtBQUNKLGdFQUFnRTtBQUVoRSxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQztBQUNsRCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQzlDLENBQUM7QUFFRCxNQUFNLEtBQUssR0FBRyxJQUFJLGtDQUFrQixDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3hDLFFBQUEsV0FBVyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7QUFDcEUsUUFBQSxlQUFlLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDO0lBQ3BELEtBQUssRUFBRSxnQkFBZ0I7SUFDdkIsaUJBQWlCLEVBQUUsa3NCQUFrc0I7Q0FDeHRCLENBQUMsQ0FBQyJ9