"use client"

import { FlashcardStack } from "@/components/flashcard-stack"
import { ProfileSettings } from "@/components/profile-settings"
import { Card as CardType } from "@/lib/types"

// Puzzle data from GFG Logical Puzzles
const MOCK_CARDS: CardType[] = [
    {
        id: "1",
        user_id: "u1",
        hierarchy_id: "puzzles",
        question: "An employee works for 7 days. The employer has a gold rod of 7 units. How to pay 1 unit daily with at most 2 cuts?",
        answer: "Cut at 1 and 3 units to get pieces: 1, 2, 4. Use binary combinations. Day 1: give 1. Day 2: take 1, give 2. Day 3: give 1. Day 4: take both, give 4. And so on.",
        type: "flashcard",
        created_at: new Date().toISOString()
    },
    {
        id: "2",
        user_id: "u1",
        hierarchy_id: "puzzles",
        question: "25 horses, 5 can race at once. Minimum races to find the 3 fastest?",
        answer: "7 races. First 5 races: group into 5 groups, race each. 6th race: race the 5 winners. 7th race: race candidates for 2nd/3rd (W2, W3, S1, S2, T1).",
        type: "flashcard",
        created_at: new Date().toISOString()
    },
    {
        id: "3",
        user_id: "u1",
        hierarchy_id: "puzzles",
        question: "5 bottles of pills (10g each), one bottle has 9g pills. Find the defective bottle in ONE weighing.",
        answer: "Take 1 pill from bottle 1, 2 from bottle 2... 5 from bottle 5. Total should be 150g. Difference from 150 = defective bottle number.",
        type: "flashcard",
        created_at: new Date().toISOString()
    },
    {
        id: "4",
        user_id: "u1",
        hierarchy_id: "puzzles",
        question: "3 bulbs inside, 3 switches outside. Enter room once. How to identify which switch controls which bulb?",
        answer: "Turn switch 1 ON for 10 min, then OFF. Turn switch 2 ON. Enter: ON bulb = switch 2, OFF but warm = switch 1, OFF and cold = switch 3.",
        type: "flashcard",
        created_at: new Date().toISOString()
    },
    {
        id: "5",
        user_id: "u1",
        hierarchy_id: "puzzles",
        question: "100 prisoners with red/black hats in a line. Each sees hats in front. What strategy saves the most?",
        answer: "Last prisoner counts red hats - says 'Red' if even, 'Black' if odd (50% survival). Others use this parity info to deduce their own hat color with certainty. 99 guaranteed saved.",
        type: "flashcard",
        created_at: new Date().toISOString()
    },
    {
        id: "6",
        user_id: "u1",
        hierarchy_id: "puzzles",
        question: "10 coins (5 heads, 5 tails) on table. Blindfolded. Create two piles with equal heads using only flipping.",
        answer: "Divide into two piles of 5. Flip ALL coins in one pile. If pile 1 had H heads, after flipping it has (5-H) heads, matching pile 2's (5-H) heads.",
        type: "flashcard",
        created_at: new Date().toISOString()
    },
    {
        id: "7",
        user_id: "u1",
        hierarchy_id: "puzzles",
        question: "5 Pirates divide 100 gold coins. Most senior proposes, majority votes. If rejected, proposer dies. What does Pirate A (most senior) get?",
        answer: "98 coins. A gives: 98 to self, 0 to B, 1 to C, 0 to D, 1 to E. C and E vote yes because they get more than in subsequent scenarios.",
        type: "flashcard",
        created_at: new Date().toISOString()
    },
    {
        id: "8",
        user_id: "u1",
        hierarchy_id: "puzzles",
        question: "Two gates: Heaven and Hell. Two gatekeepers: one always lies, one always tells truth. One question to find Heaven?",
        answer: "Ask either: 'If I asked the OTHER gatekeeper which gate leads to Heaven, what would they say?' Both will point to Hell. Go to the other gate.",
        type: "flashcard",
        created_at: new Date().toISOString()
    },
    {
        id: "9",
        user_id: "u1",
        hierarchy_id: "puzzles",
        question: "1000 bottles, 1 poisoned. Rats die in 1 hour. Minimum rats needed to find poisoned bottle?",
        answer: "10 rats. Binary encoding: number bottles 0-999 in binary (10 bits). Rat i drinks from bottles where bit i is set. Dead rats pattern = bottle number in binary.",
        type: "flashcard",
        created_at: new Date().toISOString()
    },
    {
        id: "10",
        user_id: "u1",
        hierarchy_id: "puzzles",
        question: "Chessboard with opposite corners removed. Can you cover remaining 62 squares with 31 dominoes (each covers 2)?",
        answer: "No. Opposite corners are same color. Dominoes always cover one of each color. Remaining: 32 of one color, 30 of other. Impossible.",
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
            <ProfileSettings />
        </main>
    )
}
