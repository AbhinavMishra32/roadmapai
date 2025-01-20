import { Router } from "express";
import { counsellorModel, geminiModel } from "../ai";
import {Request, Response} from 'express';
import { FileState, GoogleAIFileManager } from '@google/generative-ai/server';
import {promisify} from 'util';
import os from 'os';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const router = Router();

router.get('/chat', async (req, res) => {
    const userMessage = req.query.message as string;
    
    if (!userMessage) {
        res.status(400).json({ error: 'Message is required' });
        return;
    }

    try {
        const reply = await counsellorModel.generateContentStream(userMessage);
        
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
                    } else {
                        console.error('Chunk text is not a string:', chunkText);
                    }
                } else {
                    console.error('Chunk does not contain text method:', chunk);
                }
            }
            
            res.write('event: end\ndata: {}\n\n');
            res.end();
        } catch (streamError) {
            console.error('Streaming error:', streamError);
            res.write(`event: error\ndata: ${JSON.stringify({ error: 'Streaming error occurred' })}\n\n`);
            res.end();
        }
    } catch (error) {
        console.error('Error streaming data:', error);
        res.write(`event: error\ndata: ${JSON.stringify({ error: 'Failed to initialize stream' })}\n\n`);
        res.end();
    }
});

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.post('/video', upload.single('video'), async (req: Request, res: Response) => {
    try {
      const { question } = req.body;
      console.log('Question:', question);
      const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
      const file = req.file;
  
      if (!file) {
        res.status(400).json({ error: 'Video file is required' });
        return;
      }
  
      // Write the file buffer to a temporary file
      const tempFilePath = path.join(os.tmpdir(), file.originalname); // Using OS temp dir
  
      await writeFileAsync(tempFilePath, file.buffer); // Save file buffer to temp file
  
      // Upload the file by passing the file path
      const uploadResponse = await fileManager.uploadFile(tempFilePath, {
        mimeType: 'video/mp4',
        displayName: file.originalname,
      });
  
      const name = uploadResponse.file.name;
  
      let uploadedFile = await fileManager.getFile(name);
      while (uploadedFile.state === FileState.PROCESSING) {
        await new Promise((resolve) => setTimeout(resolve, 10_000));
        uploadedFile = await fileManager.getFile(name);
      }
  
      if (uploadedFile.state === FileState.FAILED) {
        throw new Error('Video processing failed.');
      }
      if (uploadedFile.state == FileState.ACTIVE){
        console.log('File uploaded and processed successfully, now generating content');
      }
  
      await unlinkAsync(tempFilePath);

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

      const schema = {
        type: SchemaType.OBJECT,
        properties: {
          response: {
            type: SchemaType.OBJECT,
            properties: {
              contentAnalysis: {
                type: SchemaType.OBJECT,
                properties: {
                  relevance: { type: SchemaType.STRING },
                  depth: { type: SchemaType.STRING },
                  clarity: { type: SchemaType.STRING }
                }
              },
              deliveryAnalysis: {
                type: SchemaType.OBJECT,
                properties: {
                  confidence: { type: SchemaType.STRING },
                  conciseness: { type: SchemaType.STRING },
                  tone: { type: SchemaType.STRING }
                }
              },
              emotionalAndBehavioralCues: {
                type: SchemaType.OBJECT,
                properties: {
                  facialExpression: { type: SchemaType.STRING },
                  bodyLanguage: { type: SchemaType.STRING },
                  stressIndicators: { type: SchemaType.STRING }
                }
              },
              fillerWordsUsage: {
                type: SchemaType.OBJECT,
                properties: {
                  frequency: { type: SchemaType.STRING },
                  examples: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
                }
              },
              overallAnalysis: {
                type: SchemaType.OBJECT,
                properties: {
                  overallScore: { type: SchemaType.STRING },
                  feedback: { type: SchemaType.STRING },
                  review: { type: SchemaType.STRING },
                }
              },
              moodAnalysis: {
                type: SchemaType.OBJECT,
                properties: {
                  mood: { type: SchemaType.STRING },
                  sentiment: { type: SchemaType.STRING }
                }
              },
              transcription: {
                type: SchemaType.OBJECT,
                properties: {
                  text: { type: SchemaType.STRING }
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
          summary: { type: SchemaType.STRING }
        },
        required: ["response", "summary"]
      };

      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        }
      })

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
          ` }
      ]);

      // console.log("without json response: ", result.response.text());
      const response = await JSON.parse(result.response.text())
      console.log('Response json:', response);

      res.status(200).json({
        response,
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      res.status(500).json({ error: 'Failed to upload video' });
    }
  });

router.post('/video/finalize', async (req: Request, res: Response) => {
  try {
    const { questionResponses } = req.body;

    if (!questionResponses) {
      res.status(400).json({ error: 'Question analysis is required' });
      return;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        analysis: {
          type: SchemaType.OBJECT,
          properties: {
            overallReview: { type: SchemaType.STRING },
            score: { type: SchemaType.NUMBER },
            speechTonality: { type: SchemaType.STRING },
            personalityImpression: { type: SchemaType.STRING },
            strengths: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            areasForImprovement: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
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
    }

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
    })

  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Failed to finalize interview analyzation' });
  }
});

export default router;