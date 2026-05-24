import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Ensure this runs on Node.js runtime since pdf-parse relies on fs/buffer
export const runtime = "nodejs";

// Polyfill missing globals for pdf-parse (pdf.js dependency)
if (typeof global.DOMMatrix === "undefined") {
  (global as any).DOMMatrix = class DOMMatrix {};
}
if (typeof global.ImageData === "undefined") {
  (global as any).ImageData = class ImageData {};
}
if (typeof global.Path2D === "undefined") {
  (global as any).Path2D = class Path2D {};
}


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const topic = formData.get("topic") as string;
    const mode = formData.get("mode") as "strict" | "loose";
    const maxScore = formData.get("maxScore") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set in environment variables." },
        { status: 500 }
      );
    }

    // 1. Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const PDFParser = require("pdf2json");
    
    const pdfText = await new Promise<string>((resolve, reject) => {
      const pdfParser = new PDFParser(null, 1);
      
      pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
      pdfParser.on("pdfParser_dataReady", () => {
        resolve(pdfParser.getRawTextContent());
      });
      
      pdfParser.parseBuffer(buffer);
    });

    // 2. Prepare the AI prompt
    const ai = new GoogleGenAI({ apiKey });
    
    const systemInstruction = `
      You are an expert Teacher and Assignment Evaluator.
      Evaluate the student's submission text based on the provided instructions.
      
      Evaluation Mode: ${mode.toUpperCase()}
      - If STRICT: Be highly critical. Deduct marks heavily for being off-topic, too short, missing structural elements (like intro/conclusion for essays), or irrelevant content.
      - If LOOSE: Be encouraging and flexible. Reward effort, give partial credit even if requirements are only partially met, and only deduct heavily for completely unrelated content.
      
      Maximum possible score: ${maxScore}
      
      Guidelines/Topic given to student:
      """
      ${topic}
      """
      
      Your goal is to extract the Student's Name and Roll Number from the submission (if present), evaluate their work, and return a JSON object ONLY.
      Do not include any markdown formatting like \`\`\`json or \`\`\`. Just return the raw JSON object matching exactly this schema:
      {
        "studentName": "Extracted name or 'Unknown'",
        "rollNumber": "Extracted roll number or 'Unknown'",
        "score": <calculated score out of maxScore (number)>,
        "remarks": "A short, precise paragraph explaining the grade (max 2-3 sentences)."
      }
    `;

    // 3. Call Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: "Here is the student submission:\n\n" + pdfText }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.2, // Low temperature for more consistent grading
        responseMimeType: "application/json",
      }
    });

    const aiText = response.text;
    if (!aiText) {
      throw new Error("Empty response from AI");
    }

    // Attempt to parse JSON response
    try {
      const parsedData = JSON.parse(aiText.trim());
      return NextResponse.json(parsedData);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiText);
      return NextResponse.json(
        { error: "Failed to parse AI evaluation results." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Evaluation Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
