"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function explainConcept(question: string, answer: string) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return { error: "AI configuration missing (GEMINI_API_KEY)." }
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

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

    } catch (error) {
        console.error("AI Error:", error)
        return { error: "Failed to generate explanation. Try again later." }
    }
}
