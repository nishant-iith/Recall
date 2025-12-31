"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

const MODEL_NAMES = ["gemini-1.5-flash", "gemini-1.5-flash-001", "gemini-1.5-pro", "gemini-pro"];

async function getWorkingModel(apiKey: string) {
    // 1. Try raw REST API to discover models (most robust)
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Gemini ListModels Failed:", response.status, errorBody);
            // If 400/403, key is bad.
            if (response.status === 400 || response.status === 403) {
                throw new Error("Invalid API Key or API not enabled in Google Cloud Console.");
            }
        } else {
            const data = await response.json();
            const models = data.models || [];
            // Find first model that supports generateContent
            const viableModel = models.find((m: any) =>
                m.supportedGenerationMethods?.includes("generateContent") &&
                (m.name.includes("flash") || m.name.includes("pro")) // Prefer modern models
            );

            if (viableModel) {
                console.log("Discovered viable model:", viableModel.name);
                const genAI = new GoogleGenerativeAI(apiKey);
                // model name comes as "models/gemini-pro", SDK expects just "gemini-pro" usually, 
                // but SDK also handles "models/" prefix fine.
                const modelName = viableModel.name.replace(/^models\//, "");
                return genAI.getGenerativeModel({ model: modelName });
            }
        }
    } catch (e) {
        console.warn("Raw model list failed, falling back to hardcoded list:", e);
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // 2. Fallback: Try models in hardcoded order
    for (const modelName of MODEL_NAMES) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            await model.generateContent("test");
            return model;
        } catch (error: any) {
            const errStr = error.toString();
            if (errStr.includes("404") || errStr.includes("not found")) {
                continue;
            }
            throw error;
        }
    }
    throw new Error("No compatible Gemini models found for this API key. Ensure the 'Generative Language API' is enabled.");
}

export async function verifyApiKey(apiKey: string) {
    try {
        const model = await getWorkingModel(apiKey);
        // Double check with a generate call
        await model.generateContent("OK");
        return { success: true }
    } catch (error: any) {
        console.error("Verification Error:", error);
        return {
            success: false,
            error: error.message || "Failed to verify key."
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
