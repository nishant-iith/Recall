"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { calculateSM2 } from "@/lib/sm2"

export async function createCard(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "You must be signed in to create cards" }
    }

    const question = formData.get("question") as string
    const answer = formData.get("answer") as string
    const videoUrl = formData.get("videoUrl") as string

    // Default hierarchy to "General" for now
    // Ideally we'd have a selector in the UI
    const defaultHierarchyName = "General"
    let hierarchyId

    // Check if "General" topic exists for user, else create it
    const { data: existingHierarchy } = await supabase
        .from("hierarchy")
        .select("id")
        .eq("user_id", user.id)
        .eq("name", defaultHierarchyName)
        .eq("type", "topic")
        .single()

    if (existingHierarchy) {
        hierarchyId = existingHierarchy.id
    } else {
        const { data: newHierarchy, error: hierarchyError } = await supabase
            .from("hierarchy")
            .insert({
                user_id: user.id,
                name: defaultHierarchyName,
                type: "topic"
            })
            .select("id")
            .single()

        if (hierarchyError) {
            console.error("Hierarchy error:", hierarchyError)
            return { error: "Failed to create default topic" }
        }
        hierarchyId = newHierarchy.id
    }

    const { error } = await supabase
        .from("cards")
        .insert({
            user_id: user.id,
            hierarchy_id: hierarchyId,
            question,
            answer,
            type: videoUrl ? "video" : "flashcard",
            video_url: videoUrl || null
        })

    if (error) {
        console.error("Card creation error:", error)
        return { error: error.message }
    }

    revalidatePath("/")
    return { success: true }
}

export async function submitReview(cardId: string, rating: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return // Don't save progress for guests

    // 1. Record the review
    await supabase.from("reviews").insert({
        user_id: user.id,
        card_id: cardId,
        rating
    })

    // 2. Update Progress (SM-2)
    const { data: currentProgress } = await supabase
        .from("card_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("card_id", cardId)
        .single()

    const lastInterval = currentProgress?.interval || 0
    const lastEaseFactor = currentProgress?.ease_factor || 2.5

    const { interval, easeFactor } = calculateSM2({
        quality: rating,
        lastInterval,
        lastEaseFactor
    })

    const nextDueDate = new Date()
    nextDueDate.setDate(nextDueDate.getDate() + interval)

    if (currentProgress) {
        await supabase
            .from("card_progress")
            .update({
                interval,
                ease_factor: easeFactor,
                due_date: nextDueDate.toISOString(),
                last_reviewed: new Date().toISOString()
            })
            .eq("id", currentProgress.id)
    } else {
        await supabase
            .from("card_progress")
            .insert({
                user_id: user.id,
                card_id: cardId,
                interval,
                ease_factor: easeFactor,
                due_date: nextDueDate.toISOString(),
                last_reviewed: new Date().toISOString()
            })
    }

    // 3. Update Streak
    const today = new Date().toISOString().split("T")[0]

    // Get current streak
    const { data: streakData } = await supabase
        .from("user_streaks")
        .select("*")
        .eq("user_id", user.id)
        .single()

    if (streakData) {
        const lastStudyDate = streakData.last_study_date

        if (lastStudyDate !== today) {
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            const yesterdayStr = yesterday.toISOString().split("T")[0]

            let newStreak = 1
            if (lastStudyDate === yesterdayStr) {
                newStreak = (streakData.current_streak || 0) + 1
            }

            await supabase.from("user_streaks").update({
                current_streak: newStreak,
                last_study_date: today,
                updated_at: new Date().toISOString()
            }).eq("user_id", user.id)
        }
    } else {
        // First time ever
        await supabase.from("user_streaks").insert({
            user_id: user.id,
            current_streak: 1,
            last_study_date: today
        })
    }

    revalidatePath("/")
}
