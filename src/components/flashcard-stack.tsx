"use client"

import * as React from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { Card as CardType } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Rating } from "@/components/rating"
import { Play, RotateCcw } from "lucide-react"

interface FlashcardStackProps {
    initialCards: CardType[]
    onReview: (cardId: string, rating: number) => void
}

export function FlashcardStack({ initialCards, onReview }: FlashcardStackProps) {
    const [cards, setCards] = React.useState(initialCards)
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [isFlipped, setIsFlipped] = React.useState(false)
    const [rating, setRating] = React.useState(0)

    // Drag state
    const x = useMotionValue(0)
    const rotate = useTransform(x, [-200, 200], [-10, 10])
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

    const currentCard = cards[currentIndex]

    const handleDragEnd = (event: any, info: any) => {
        if (info.offset.x < -100) {
            // Swiped Left (Next)
            handleNext()
        } else {
            // Reset position
            // Framer motion handles reset if we don't remove it or controlled x
        }
    }

    const handleNext = () => {
        if (rating === 0) {
            // Enforce rating? Or maybe just skip? 
            // User requirement: "mark the difficulty... to go to the next flashcard we can have left swipe"
            // If swiped without rating, maybe default to 3? Or prevent swipe?
            // Let's assume rating is required before swipe effectively "completes" the review, 
            // OR swipe just moves it and we rate it *after*? 
            // "Mark difficulty... so that next appearance will be taken care etc"
            // Flow: Question -> Tap to Flip -> See Answer -> Rate -> Swipe Next.
            // If user swipes without rating, we prompt or just move?
            // Let's allow swipe to move, but if not rated, maybe don't record review?
            // Better UX: Must rate to count as review.
            if (isFlipped) {
                // If flipped, user likely saw answer.
            }
        }

        // Logic: move to next card
        if (currentIndex < cards.length - 1) {
            setIsFlipped(false)
            setRating(0)
            setCurrentIndex(prev => prev + 1)
        } else {
            // End of stack
            alert("Finished deck!")
        }
    }

    const handleRating = (value: number) => {
        setRating(value)
        onReview(currentCard.id, value)
    }

    if (!currentCard) return <div className="flex items-center justify-center h-full text-muted-foreground">No cards due for review!</div>

    return (
        <div className="relative w-full h-screen max-w-md mx-auto overflow-hidden bg-black flex flex-col">
            {/* Card Stack */}
            <div className="flex-1 relative flex items-center justify-center p-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentCard.id}
                        style={{ x, rotate, opacity }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={handleDragEnd}
                        className="w-full h-full max-h-[80vh] absolute cursor-grab active:cursor-grabbing"
                        initial={{ scale: 0.95, opacity: 0, x: 200 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        exit={{ scale: 0.95, opacity: 0, x: -200 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <Card className="w-full h-full bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
                            <div
                                className="flex-1 relative"
                                onClick={() => setIsFlipped(!isFlipped)}
                            >
                                <ScrollArea className="h-full w-full p-6">
                                    <div className="min-h-[60vh] flex flex-col justify-center items-center text-center">
                                        {currentCard.type === 'video' && currentCard.video_url && (
                                            <div className="w-full aspect-[9/16] bg-black mb-4 rounded-lg overflow-hidden relative">
                                                <video
                                                    src={currentCard.video_url}
                                                    className="w-full h-full object-cover"
                                                    loop
                                                    muted
                                                    playsInline
                                                    autoPlay={isFlipped} // Auto play answer? Or question? Maybe question is text, answer is video?
                                                // Schema says: question, answer, video_url. 
                                                // Often video IS the question or answer.
                                                // Let's assume video accompanies the content.
                                                />
                                            </div>
                                        )}

                                        <div className="prose dark:prose-invert max-w-none">
                                            <h2 className="text-xl font-medium text-zinc-400 mb-2 uppercase tracking-wider text-xs">
                                                {isFlipped ? "Answer" : "Question"}
                                            </h2>
                                            <div className="text-2xl font-bold text-white">
                                                {isFlipped ? currentCard.answer : currentCard.question}
                                            </div>
                                        </div>
                                    </div>
                                </ScrollArea>

                                {/* Tap hint */}
                                <div className="absolute bottom-4 left-0 right-0 text-center text-zinc-600 text-xs pointer-events-none">
                                    Tap to flip
                                </div>
                            </div>

                            {/* Footer Actions */}
                            {isFlipped && (
                                <div className="p-4 bg-zinc-900/90 backdrop-blur border-t border-zinc-800">
                                    <div className="flex flex-col gap-4 items-center">
                                        <div className="text-sm text-zinc-400">Rate Difficulty</div>
                                        <Rating value={rating} onChange={handleRating} />
                                        <div className="w-full flex justify-between items-center text-xs text-zinc-500 mt-2">
                                            <span>&larr; Swipe for Next</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
