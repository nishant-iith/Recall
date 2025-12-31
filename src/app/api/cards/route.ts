import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { question, answer, hierarchy_id, video_url } = body

        // Basic validation
        if (!question || !answer) {
            return NextResponse.json({ error: "Question and Answer are required" }, { status: 400 })
        }

        // Logic to handle "hierarchy creation on the fly" could go here, 
        // but for now we expect a valid hierarchy_id or null.

        const { data, error } = await supabase
            .from("flashcards")
            .insert({
                user_id: user.id,
                question,
                answer,
                hierarchy_id: hierarchy_id || null, // Optional
                type: video_url ? "video" : "flashcard",
                video_url: video_url || null
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, card: data })
    } catch (e) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }
}
