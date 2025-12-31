"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

const ADMIN_EMAIL = "iith.nishant@gmail.com"

export async function checkAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.email !== ADMIN_EMAIL) {
        redirect("/")
    }

    return user
}

export async function getHierarchy() {
    const supabase = await createClient()
    const { data } = await supabase
        .from("hierarchy")
        .select("*")
        .order("created_at", { ascending: true })
    return data
}

export async function createHierarchyNode(name: string, type: "field" | "topic" | "subtopic", parentId?: string) {
    const user = await checkAdmin()
    const supabase = await createClient()

    const { error } = await supabase.from("hierarchy").insert({
        user_id: user.id,
        name,
        type,
        parent_id: parentId || null
    })

    if (error) {
        console.error("Create hierarchy error:", error)
        throw new Error(error.message)
    }
    return { success: true }
}

export async function getAllCards() {
    await checkAdmin()
    const supabase = await createClient()

    // Fetch cards with their hierarchy info
    // Hierarchy is joined via hierarchy_id
    const { data, error } = await supabase
        .from("flashcards")
        .select(`
            *,
            hierarchy:hierarchy_id (
                id,
                name,
                type,
                parent_id
            )
        `)
        .order("created_at", { ascending: false })
        .limit(50) // Pagination later

    if (error) throw new Error(error.message)
    return data
}

export async function deleteCard(cardId: string) {
    const user = await checkAdmin()
    const supabase = await createClient()

    const { error } = await supabase
        .from("flashcards")
        .delete()
        .eq("id", cardId)

    if (error) throw new Error(error.message)
    return { success: true }
}

export async function updateCard(cardId: string, data: any) {
    const user = await checkAdmin()
    const supabase = await createClient()

    const { error } = await supabase
        .from("flashcards")
        .update(data)
        .eq("id", cardId)

    if (error) throw new Error(error.message)
    return { success: true }
}
