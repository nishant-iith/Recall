"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

const MODEL_NAMES = ["gemini-1.5-flash", "gemini-1.5-flash-001", "gemini-1.5-pro", "gemini-pro"];

async function getWorkingModel(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey);

    // Try models in order
    for (const modelName of MODEL_NAMES) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            // Quick test to see if model exists/is accessible
            // We use a token count request which is cheaper/faster than generation usually, 
            // but generateContent is definitive.
            await model.generateContent("test");
            return model;
        } catch (error: any) {
            // If 404, continue to next model. If 403 (Invalid Key), throw immediately.
            if (error.toString().includes("404") || error.toString().includes("not found")) {
                console.warn(`Model ${modelName} not found, trying next...`);
                continue;
            }
            throw error; // Re-throw auth errors or rate limits
        }
    }
    throw new Error("No compatible Gemini models found for this API key.");
}

export async function verifyApiKey(apiKey: string) {
    try {
        await getWorkingModel(apiKey);
        return { success: true }
    } catch (error: any) {
        console.error("Verification Error:", error)
        return {
            success: false,
            error: error.message || "Invalid API Key or API not enabled."
        }
    }
}

export async function explainConcept(question: string, answer: string, userApiKey?: string) {
    try {
        let model;
        const keyToUse = userApiKey || process.env.GEMINI_API_KEY;

        if (!keyToUse) {
            return { error: "AI configuration missing. Please add your Gemini API Key in Settings." }
        }

        // Just get the model directly. If it fails here, it falls to catch block.
        // We re-use the same fallback logic for the actual call to ensure robustness.
        model = await getWorkingModel(keyToUse);

        const prompt = `
        You are an expert tutor. Create a "Deep Dive" explanation for this flashcard.
        
        **Question**: ${question}
        **Answer**: ${answer}
        
        **Your Output Format (Markdown)**:
        1. **Simple Explanation (ELI5)**: Explain it like I'm 5 years old. Use a real-world analogy (non-technical if possible).
        2. **Why it matters**: One sentence on why this is important in software engineering/life.
        3. **Code/Example**: If it's a coding concept, provide a short, clean code snippet (JS/Python). If it's a puzzle, explain the logic step-by-step.
        
        Keep it concise, engaging, and formatted beautifully.
        `

        const result = await model.generateContent(prompt)
        const response = result.response
        const text = response.text()

        return { text }

    } catch (error: any) {
        console.error("AI Error:", error)
        // Return more specific error info
        const msg = error.message || error.toString()
        if (msg.includes("API_KEY_INVALID") || msg.includes("403")) return { error: "Invalid API Key provided." }
        if (msg.includes("429")) return { error: "Rate limit exceeded. Try again later." }
        return { error: `AI Error: ${msg.substring(0, 100)}...` }
    }
}
