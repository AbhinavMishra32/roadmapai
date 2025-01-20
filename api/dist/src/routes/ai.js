"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_1 = require("../ai");
const server_1 = require("@google/generative-ai/server");
const util_1 = require("util");
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const generative_ai_1 = require("@google/generative-ai");
const router = (0, express_1.Router)();
router.get('/chat', async (req, res) => {
    const userMessage = req.query.message;
    if (!userMessage) {
        res.status(400).json({ error: 'Message is required' });
        return;
    }
    try {
        const reply = await ai_1.counsellorModel.generateContentStream(userMessage);
        if (!reply || !reply.stream) {
            throw new Error("Stream data or contents are not available");
        }
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        try {
            for await (const chunk of reply.stream) {
                if (chunk && typeof chunk.text === 'function') {
                    const chunkText = chunk.text();
                    if (typeof chunkText === 'string') {
                        // console.log('Streaming:', chunkText);
                        res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
                    }
                    else {
                        console.error('Chunk text is not a string:', chunkText);
                    }
                }
                else {
                    console.error('Chunk does not contain text method:', chunk);
                }
            }
            res.write('event: end\ndata: {}\n\n');
            res.end();
        }
        catch (streamError) {
            console.error('Streaming error:', streamError);
            res.write(`event: error\ndata: ${JSON.stringify({ error: 'Streaming error occurred' })}\n\n`);
            res.end();
        }
    }
    catch (error) {
        console.error('Error streaming data:', error);
        res.write(`event: error\ndata: ${JSON.stringify({ error: 'Failed to initialize stream' })}\n\n`);
        res.end();
    }
});
const writeFileAsync = (0, util_1.promisify)(fs_1.default.writeFile);
const unlinkAsync = (0, util_1.promisify)(fs_1.default.unlink);
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
router.post('/video', upload.single('video'), async (req, res) => {
    try {
        const { question } = req.body;
        console.log('Question:', question);
        const fileManager = new server_1.GoogleAIFileManager(process.env.GEMINI_API_KEY);
        const file = req.file;
        if (!file) {
            res.status(400).json({ error: 'Video file is required' });
            return;
        }
        // Write the file buffer to a temporary file
        const tempFilePath = path_1.default.join(os_1.default.tmpdir(), file.originalname); // Using OS temp dir
        await writeFileAsync(tempFilePath, file.buffer); // Save file buffer to temp file
        // Upload the file by passing the file path
        const uploadResponse = await fileManager.uploadFile(tempFilePath, {
            mimeType: 'video/mp4',
            displayName: file.originalname,
        });
        const name = uploadResponse.file.name;
        let uploadedFile = await fileManager.getFile(name);
        while (uploadedFile.state === server_1.FileState.PROCESSING) {
            await new Promise((resolve) => setTimeout(resolve, 10_000));
            uploadedFile = await fileManager.getFile(name);
        }
        if (uploadedFile.state === server_1.FileState.FAILED) {
            throw new Error('Video processing failed.');
        }
        if (uploadedFile.state == server_1.FileState.ACTIVE) {
            console.log('File uploaded and processed successfully, now generating content');
        }
        await unlinkAsync(tempFilePath);
        const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const schema = {
            type: generative_ai_1.SchemaType.OBJECT,
            properties: {
                response: {
                    type: generative_ai_1.SchemaType.OBJECT,
                    properties: {
                        contentAnalysis: {
                            type: generative_ai_1.SchemaType.OBJECT,
                            properties: {
                                relevance: { type: generative_ai_1.SchemaType.STRING },
                                depth: { type: generative_ai_1.SchemaType.STRING },
                                clarity: { type: generative_ai_1.SchemaType.STRING }
                            }
                        },
                        deliveryAnalysis: {
                            type: generative_ai_1.SchemaType.OBJECT,
                            properties: {
                                confidence: { type: generative_ai_1.SchemaType.STRING },
                                conciseness: { type: generative_ai_1.SchemaType.STRING },
                                tone: { type: generative_ai_1.SchemaType.STRING }
                            }
                        },
                        emotionalAndBehavioralCues: {
                            type: generative_ai_1.SchemaType.OBJECT,
                            properties: {
                                facialExpression: { type: generative_ai_1.SchemaType.STRING },
                                bodyLanguage: { type: generative_ai_1.SchemaType.STRING },
                                stressIndicators: { type: generative_ai_1.SchemaType.STRING }
                            }
                        },
                        fillerWordsUsage: {
                            type: generative_ai_1.SchemaType.OBJECT,
                            properties: {
                                frequency: { type: generative_ai_1.SchemaType.STRING },
                                examples: { type: generative_ai_1.SchemaType.ARRAY, items: { type: generative_ai_1.SchemaType.STRING } }
                            }
                        },
                        overallAnalysis: {
                            type: generative_ai_1.SchemaType.OBJECT,
                            properties: {
                                overallScore: { type: generative_ai_1.SchemaType.STRING },
                                feedback: { type: generative_ai_1.SchemaType.STRING },
                                review: { type: generative_ai_1.SchemaType.STRING },
                            }
                        },
                        moodAnalysis: {
                            type: generative_ai_1.SchemaType.OBJECT,
                            properties: {
                                mood: { type: generative_ai_1.SchemaType.STRING },
                                sentiment: { type: generative_ai_1.SchemaType.STRING }
                            }
                        },
                        transcription: {
                            type: generative_ai_1.SchemaType.OBJECT,
                            properties: {
                                text: { type: generative_ai_1.SchemaType.STRING }
                            }
                        }
                    },
                    required: [
                        "contentAnalysis",
                        "deliveryAnalysis",
                        "emotionalAndBehavioralCues",
                        "fillerWordsUsage",
                        "overallAnalysis",
                        "transcription",
                        "moodAnalysis",
                    ]
                },
                summary: { type: generative_ai_1.SchemaType.STRING }
            },
            required: ["response", "summary"]
        };
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: schema,
            }
        });
        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: uploadResponse.file.mimeType,
                    fileUri: uploadResponse.file.uri,
                }
            },
            {
                text: `
          Analyse the personality testing question of the following question: ${question} and provide detailed and constructive feedback on how the individual responds to the question, have the analysis of each parameter really short, keep it short keep the score out of 10 but everything else keep it in english (single sentences), keep the overallAnalysis a little medium length, like 50 words., tell exactly what happened in the video as well, dont just talk about the interview only, be like a real person. In the summary talk directly to the user and no third person (dont refer to user as "candidate", refer to as "you" or "student".), direct dialogue. give the video transcription with timestamps too.
          `
            }
        ]);
        // console.log("without json response: ", result.response.text());
        const response = await JSON.parse(result.response.text());
        console.log('Response json:', response);
        res.status(200).json({
            response,
        });
    }
    catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).json({ error: 'Failed to upload video' });
    }
});
router.post('/video/finalize', async (req, res) => {
    try {
        const { questionResponses } = req.body;
        if (!questionResponses) {
            res.status(400).json({ error: 'Question analysis is required' });
            return;
        }
        const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const schema = {
            type: generative_ai_1.SchemaType.OBJECT,
            properties: {
                analysis: {
                    type: generative_ai_1.SchemaType.OBJECT,
                    properties: {
                        overallReview: { type: generative_ai_1.SchemaType.STRING },
                        score: { type: generative_ai_1.SchemaType.NUMBER },
                        speechTonality: { type: generative_ai_1.SchemaType.STRING },
                        personalityImpression: { type: generative_ai_1.SchemaType.STRING },
                        strengths: { type: generative_ai_1.SchemaType.ARRAY, items: { type: generative_ai_1.SchemaType.STRING } },
                        areasForImprovement: { type: generative_ai_1.SchemaType.ARRAY, items: { type: generative_ai_1.SchemaType.STRING } }
                    },
                    required: [
                        "overallReview",
                        "score",
                        "speechTonality",
                        "personalityImpression",
                        "strengths",
                        "areasForImprovement"
                    ]
                }
            },
            required: ["analysis"]
        };
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: schema,
            }
        });
        const result = await model.generateContent([
            {
                text: `
        Provide a detailed analysis of the entire interview, data: ${questionResponses}, and provide a final review of the candidate's performance by analyising if the candidate responded correctly or not, be brutal. absolute brutal. also be extremely detailed, alot. (dont make the areas for improvement and weakness too long, keep it a sentence or two) Include the overall review, score, speech tonality, personality impression, strengths, and areas for improvement. Give the final score out of 100`
            }
        ]);
        const response = await JSON.parse(result.response.text());
        console.log('Response json for final analysis:', response);
        res.status(200).json({
            analysis: response.analysis,
        });
    }
    catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).json({ error: 'Failed to finalize interview analyzation' });
    }
});
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcm91dGVzL2FpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEscUNBQWlDO0FBQ2pDLDhCQUFxRDtBQUVyRCx5REFBOEU7QUFDOUUsK0JBQStCO0FBQy9CLDRDQUFvQjtBQUNwQixnREFBd0I7QUFDeEIsNENBQW9CO0FBQ3BCLG9EQUE0QjtBQUM1Qix5REFBdUU7QUFFdkUsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFFeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtJQUNuQyxNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQWlCLENBQUM7SUFFaEQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ2YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUscUJBQXFCLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZELE9BQU87SUFDWCxDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0QsTUFBTSxLQUFLLEdBQUcsTUFBTSxvQkFBZSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXZFLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7UUFFRCxHQUFHLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQ25ELEdBQUcsQ0FBQyxTQUFTLENBQUMsZUFBZSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzNDLEdBQUcsQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRTFDLElBQUksQ0FBQztZQUNELElBQUksS0FBSyxFQUFFLE1BQU0sS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDckMsSUFBSSxLQUFLLElBQUksT0FBTyxLQUFLLENBQUMsSUFBSSxLQUFLLFVBQVUsRUFBRSxDQUFDO29CQUM1QyxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQy9CLElBQUksT0FBTyxTQUFTLEtBQUssUUFBUSxFQUFFLENBQUM7d0JBQ2hDLHdDQUF3Qzt3QkFDeEMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ2xFLENBQUM7eUJBQU0sQ0FBQzt3QkFDSixPQUFPLENBQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFLFNBQVMsQ0FBQyxDQUFDO29CQUM1RCxDQUFDO2dCQUNMLENBQUM7cUJBQU0sQ0FBQztvQkFDSixPQUFPLENBQUMsS0FBSyxDQUFDLHFDQUFxQyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNoRSxDQUFDO1lBQ0wsQ0FBQztZQUVELEdBQUcsQ0FBQyxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUN0QyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDZCxDQUFDO1FBQUMsT0FBTyxXQUFXLEVBQUUsQ0FBQztZQUNuQixPQUFPLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQy9DLEdBQUcsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUUsMEJBQTBCLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM5RixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDZCxDQUFDO0lBQ0wsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLHVCQUF1QixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzlDLEdBQUcsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUUsNkJBQTZCLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqRyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDZCxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxNQUFNLGNBQWMsR0FBRyxJQUFBLGdCQUFTLEVBQUMsWUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQy9DLE1BQU0sV0FBVyxHQUFHLElBQUEsZ0JBQVMsRUFBQyxZQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDekMsTUFBTSxPQUFPLEdBQUcsZ0JBQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztBQUN2QyxNQUFNLE1BQU0sR0FBRyxJQUFBLGdCQUFNLEVBQUMsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztBQUUxQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFZLEVBQUUsR0FBYSxFQUFFLEVBQUU7SUFDaEYsSUFBSSxDQUFDO1FBQ0gsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbkMsTUFBTSxXQUFXLEdBQUcsSUFBSSw0QkFBbUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFFdEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ1YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsd0JBQXdCLEVBQUUsQ0FBQyxDQUFDO1lBQzFELE9BQU87UUFDVCxDQUFDO1FBRUQsNENBQTRDO1FBQzVDLE1BQU0sWUFBWSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsWUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLG9CQUFvQjtRQUVwRixNQUFNLGNBQWMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsZ0NBQWdDO1FBRWpGLDJDQUEyQztRQUMzQyxNQUFNLGNBQWMsR0FBRyxNQUFNLFdBQVcsQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFO1lBQ2hFLFFBQVEsRUFBRSxXQUFXO1lBQ3JCLFdBQVcsRUFBRSxJQUFJLENBQUMsWUFBWTtTQUMvQixDQUFDLENBQUM7UUFFSCxNQUFNLElBQUksR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUV0QyxJQUFJLFlBQVksR0FBRyxNQUFNLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkQsT0FBTyxZQUFZLENBQUMsS0FBSyxLQUFLLGtCQUFTLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbkQsTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzVELFlBQVksR0FBRyxNQUFNLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakQsQ0FBQztRQUVELElBQUksWUFBWSxDQUFDLEtBQUssS0FBSyxrQkFBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzVDLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBQ0QsSUFBSSxZQUFZLENBQUMsS0FBSyxJQUFJLGtCQUFTLENBQUMsTUFBTSxFQUFDLENBQUM7WUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO1FBQ2xGLENBQUM7UUFFRCxNQUFNLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVoQyxNQUFNLEtBQUssR0FBRyxJQUFJLGtDQUFrQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFakUsTUFBTSxNQUFNLEdBQUc7WUFDYixJQUFJLEVBQUUsMEJBQVUsQ0FBQyxNQUFNO1lBQ3ZCLFVBQVUsRUFBRTtnQkFDVixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLDBCQUFVLENBQUMsTUFBTTtvQkFDdkIsVUFBVSxFQUFFO3dCQUNWLGVBQWUsRUFBRTs0QkFDZixJQUFJLEVBQUUsMEJBQVUsQ0FBQyxNQUFNOzRCQUN2QixVQUFVLEVBQUU7Z0NBQ1YsU0FBUyxFQUFFLEVBQUUsSUFBSSxFQUFFLDBCQUFVLENBQUMsTUFBTSxFQUFFO2dDQUN0QyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsMEJBQVUsQ0FBQyxNQUFNLEVBQUU7Z0NBQ2xDLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSwwQkFBVSxDQUFDLE1BQU0sRUFBRTs2QkFDckM7eUJBQ0Y7d0JBQ0QsZ0JBQWdCLEVBQUU7NEJBQ2hCLElBQUksRUFBRSwwQkFBVSxDQUFDLE1BQU07NEJBQ3ZCLFVBQVUsRUFBRTtnQ0FDVixVQUFVLEVBQUUsRUFBRSxJQUFJLEVBQUUsMEJBQVUsQ0FBQyxNQUFNLEVBQUU7Z0NBQ3ZDLFdBQVcsRUFBRSxFQUFFLElBQUksRUFBRSwwQkFBVSxDQUFDLE1BQU0sRUFBRTtnQ0FDeEMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLDBCQUFVLENBQUMsTUFBTSxFQUFFOzZCQUNsQzt5QkFDRjt3QkFDRCwwQkFBMEIsRUFBRTs0QkFDMUIsSUFBSSxFQUFFLDBCQUFVLENBQUMsTUFBTTs0QkFDdkIsVUFBVSxFQUFFO2dDQUNWLGdCQUFnQixFQUFFLEVBQUUsSUFBSSxFQUFFLDBCQUFVLENBQUMsTUFBTSxFQUFFO2dDQUM3QyxZQUFZLEVBQUUsRUFBRSxJQUFJLEVBQUUsMEJBQVUsQ0FBQyxNQUFNLEVBQUU7Z0NBQ3pDLGdCQUFnQixFQUFFLEVBQUUsSUFBSSxFQUFFLDBCQUFVLENBQUMsTUFBTSxFQUFFOzZCQUM5Qzt5QkFDRjt3QkFDRCxnQkFBZ0IsRUFBRTs0QkFDaEIsSUFBSSxFQUFFLDBCQUFVLENBQUMsTUFBTTs0QkFDdkIsVUFBVSxFQUFFO2dDQUNWLFNBQVMsRUFBRSxFQUFFLElBQUksRUFBRSwwQkFBVSxDQUFDLE1BQU0sRUFBRTtnQ0FDdEMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLDBCQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSwwQkFBVSxDQUFDLE1BQU0sRUFBRSxFQUFFOzZCQUN6RTt5QkFDRjt3QkFDRCxlQUFlLEVBQUU7NEJBQ2YsSUFBSSxFQUFFLDBCQUFVLENBQUMsTUFBTTs0QkFDdkIsVUFBVSxFQUFFO2dDQUNWLFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSwwQkFBVSxDQUFDLE1BQU0sRUFBRTtnQ0FDekMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLDBCQUFVLENBQUMsTUFBTSxFQUFFO2dDQUNyQyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsMEJBQVUsQ0FBQyxNQUFNLEVBQUU7NkJBQ3BDO3lCQUNGO3dCQUNELFlBQVksRUFBRTs0QkFDWixJQUFJLEVBQUUsMEJBQVUsQ0FBQyxNQUFNOzRCQUN2QixVQUFVLEVBQUU7Z0NBQ1YsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLDBCQUFVLENBQUMsTUFBTSxFQUFFO2dDQUNqQyxTQUFTLEVBQUUsRUFBRSxJQUFJLEVBQUUsMEJBQVUsQ0FBQyxNQUFNLEVBQUU7NkJBQ3ZDO3lCQUNGO3dCQUNELGFBQWEsRUFBRTs0QkFDYixJQUFJLEVBQUUsMEJBQVUsQ0FBQyxNQUFNOzRCQUN2QixVQUFVLEVBQUU7Z0NBQ1YsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLDBCQUFVLENBQUMsTUFBTSxFQUFFOzZCQUNsQzt5QkFDRjtxQkFDRjtvQkFDRCxRQUFRLEVBQUU7d0JBQ1IsaUJBQWlCO3dCQUNqQixrQkFBa0I7d0JBQ2xCLDRCQUE0Qjt3QkFDNUIsa0JBQWtCO3dCQUNsQixpQkFBaUI7d0JBQ2pCLGVBQWU7d0JBQ2YsY0FBYztxQkFDZjtpQkFDRjtnQkFDRCxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsMEJBQVUsQ0FBQyxNQUFNLEVBQUU7YUFDckM7WUFDRCxRQUFRLEVBQUUsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDO1NBQ2xDLENBQUM7UUFFRixNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUM7WUFDckMsS0FBSyxFQUFFLGtCQUFrQjtZQUN6QixnQkFBZ0IsRUFBRTtnQkFDaEIsZ0JBQWdCLEVBQUUsa0JBQWtCO2dCQUNwQyxjQUFjLEVBQUUsTUFBTTthQUN2QjtTQUNGLENBQUMsQ0FBQTtRQUVGLE1BQU0sTUFBTSxHQUFHLE1BQU0sS0FBSyxDQUFDLGVBQWUsQ0FBQztZQUN6QztnQkFDRSxRQUFRLEVBQUU7b0JBQ1IsUUFBUSxFQUFFLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUTtvQkFDdEMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRztpQkFDakM7YUFDRjtZQUNEO2dCQUNFLElBQUksRUFBRTtnRkFDZ0UsUUFBUTtXQUM3RTthQUFFO1NBQ04sQ0FBQyxDQUFDO1FBRUgsa0VBQWtFO1FBQ2xFLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7UUFDekQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUV4QyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNuQixRQUFRO1NBQ1QsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLENBQUMsS0FBSyxDQUFDLHdCQUF3QixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQy9DLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLHdCQUF3QixFQUFFLENBQUMsQ0FBQztJQUM1RCxDQUFDO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFFTCxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEtBQUssRUFBRSxHQUFZLEVBQUUsR0FBYSxFQUFFLEVBQUU7SUFDbkUsSUFBSSxDQUFDO1FBQ0gsTUFBTSxFQUFFLGlCQUFpQixFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztRQUV2QyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUN2QixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSwrQkFBK0IsRUFBRSxDQUFDLENBQUM7WUFDakUsT0FBTztRQUNULENBQUM7UUFFRCxNQUFNLEtBQUssR0FBRyxJQUFJLGtDQUFrQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFakUsTUFBTSxNQUFNLEdBQUc7WUFDYixJQUFJLEVBQUUsMEJBQVUsQ0FBQyxNQUFNO1lBQ3ZCLFVBQVUsRUFBRTtnQkFDVixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLDBCQUFVLENBQUMsTUFBTTtvQkFDdkIsVUFBVSxFQUFFO3dCQUNWLGFBQWEsRUFBRSxFQUFFLElBQUksRUFBRSwwQkFBVSxDQUFDLE1BQU0sRUFBRTt3QkFDMUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLDBCQUFVLENBQUMsTUFBTSxFQUFFO3dCQUNsQyxjQUFjLEVBQUUsRUFBRSxJQUFJLEVBQUUsMEJBQVUsQ0FBQyxNQUFNLEVBQUU7d0JBQzNDLHFCQUFxQixFQUFFLEVBQUUsSUFBSSxFQUFFLDBCQUFVLENBQUMsTUFBTSxFQUFFO3dCQUNsRCxTQUFTLEVBQUUsRUFBRSxJQUFJLEVBQUUsMEJBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLDBCQUFVLENBQUMsTUFBTSxFQUFFLEVBQUU7d0JBQ3pFLG1CQUFtQixFQUFFLEVBQUUsSUFBSSxFQUFFLDBCQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSwwQkFBVSxDQUFDLE1BQU0sRUFBRSxFQUFFO3FCQUNwRjtvQkFDRCxRQUFRLEVBQUU7d0JBQ1IsZUFBZTt3QkFDZixPQUFPO3dCQUNQLGdCQUFnQjt3QkFDaEIsdUJBQXVCO3dCQUN2QixXQUFXO3dCQUNYLHFCQUFxQjtxQkFDdEI7aUJBQ0Y7YUFDRjtZQUNELFFBQVEsRUFBRSxDQUFDLFVBQVUsQ0FBQztTQUN2QixDQUFBO1FBRUQsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDO1lBQ3JDLEtBQUssRUFBRSxrQkFBa0I7WUFDekIsZ0JBQWdCLEVBQUU7Z0JBQ2hCLGdCQUFnQixFQUFFLGtCQUFrQjtnQkFDcEMsY0FBYyxFQUFFLE1BQU07YUFDdkI7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxNQUFNLEtBQUssQ0FBQyxlQUFlLENBQUM7WUFDekM7Z0JBQ0UsSUFBSSxFQUFFO3FFQUN1RCxpQkFBaUIsK1pBQStaO2FBQzllO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMxRCxPQUFPLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRTNELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ25CLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUTtTQUM1QixDQUFDLENBQUE7SUFFSixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0JBQXdCLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDL0MsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsMENBQTBDLEVBQUUsQ0FBQyxDQUFDO0lBQzlFLENBQUM7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILGtCQUFlLE1BQU0sQ0FBQyJ9