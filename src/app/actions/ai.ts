"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

const defaultGenAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function verifyApiKey(apiKey: string) {
    try {
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
        // Simple test generation
        await model.generateContent("Test connection")
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

        if (userApiKey) {
            const tempAI = new GoogleGenerativeAI(userApiKey)
            model = tempAI.getGenerativeModel({ model: "gemini-1.5-flash" })
        } else if (process.env.GEMINI_API_KEY) {
            model = defaultGenAI.getGenerativeModel({ model: "gemini-1.5-flash" })
        } else {
            return { error: "AI configuration missing. Please add your Gemini API Key in Settings." }
        }

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
        if (msg.includes("API_KEY_INVALID")) return { error: "Invalid API Key provided." }
        if (msg.includes("429")) return { error: "Rate limit exceeded. Try again later." }
        return { error: `AI Error: ${msg.substring(0, 100)}...` }
    }
}
