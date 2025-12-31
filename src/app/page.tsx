"use client"

import { FlashcardStack } from "@/components/flashcard-stack"
import { CardEditor } from "@/components/card-editor"
import { ProfileSettings } from "@/components/profile-settings"
import { Card as CardType } from "@/lib/types"

// Mock data for initial dev
const MOCK_CARDS: CardType[] = [
    {
        id: "1",
        user_id: "u1",
        hierarchy_id: "h1",
        question: "What is the time complexity of QuickSort?",
        answer: "Average: O(n log n), Worst: O(n^2)",
        type: "flashcard",
        created_at: new Date().toISOString()
    },
    {
        id: "2",
        user_id: "u1",
        hierarchy_id: "h1",
        question: "Explain the difference between interface and type in TypeScript.",
        answer: "Interface is for objects specifically and supports merging. Type is an alias for any type (unions, primitives) and doesn't support declaration merging.",
        type: "flashcard",
        created_at: new Date().toISOString()
    }
]

export default function Home() {
    const handleReview = (id: string, rating: number) => {
        console.log(`Reviewed card ${id} with rating ${rating}`)
        // Call server action to update SM-2 progress
    }

    return (
        <main className="min-h-screen bg-black text-white relative">
            <FlashcardStack
                initialCards={MOCK_CARDS}
                onReview={handleReview}
            />
            <CardEditor />
            <ProfileSettings />
        </main>
    )
}
