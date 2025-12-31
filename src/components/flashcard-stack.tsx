"use client"

import * as React from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { Card as CardType } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Rating } from "@/components/rating"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FlashcardStackProps {
    initialCards: CardType[]
    onReview: (cardId: string, rating: number) => void
}

export function FlashcardStack({ initialCards, onReview }: FlashcardStackProps) {
    const [cards] = React.useState(initialCards)
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [isFlipped, setIsFlipped] = React.useState(false)
    const [rating, setRating] = React.useState(0)
    const [isFinished, setIsFinished] = React.useState(false)

    // Drag state
    const x = useMotionValue(0)
    const rotate = useTransform(x, [-200, 200], [-10, 10])
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5])

    const currentCard = cards[currentIndex]
    const progress = ((currentIndex + (isFinished ? 1 : 0)) / cards.length) * 100

    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
        if (info.offset.x < -100) {
            handleNext()
        }
    }

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setIsFlipped(false)
            setRating(0)
            setCurrentIndex(prev => prev + 1)
        } else {
            setIsFinished(true)
        }
    }

    const handleRating = (value: number) => {
        setRating(value)
        onReview(currentCard.id, value)
    }

    const handleRestart = () => {
        setCurrentIndex(0)
        setIsFlipped(false)
        setRating(0)
        setIsFinished(false)
    }

    // Finished state
    if (isFinished) {
        return (
            <div className="relative w-full h-screen max-w-md mx-auto bg-gradient-to-b from-zinc-900 to-black flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                    <CheckCircle2 className="h-24 w-24 text-green-500 mb-6" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">Session Complete!</h2>
                <p className="text-zinc-400 mb-6">You reviewed {cards.length} cards</p>
                <Button onClick={handleRestart} variant="outline" className="gap-2">
                    <RotateCcw className="h-4 w-4" /> Review Again
                </Button>
            </div>
        )
    }

    // No cards state
    if (!currentCard) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-zinc-500">
                No cards due for review!
            </div>
        )
    }

    return (
        <div className="relative w-full h-screen max-w-md mx-auto overflow-hidden bg-gradient-to-b from-zinc-900 to-black flex flex-col">
            {/* Progress Bar */}
            <div className="p-4 pt-6">
                <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                    <span>Progress</span>
                    <span>{currentIndex + 1} / {cards.length}</span>
                </div>
                <Progress value={progress} className="h-1" />
            </div>

            {/* Card Stack */}
            <div className="flex-1 relative flex items-center justify-center p-4 pb-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentCard.id}
                        style={{ x, rotate, opacity }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={handleDragEnd}
                        className="w-full h-full max-h-[70vh] absolute cursor-grab active:cursor-grabbing"
                        initial={{ scale: 0.95, opacity: 0, x: 200 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        exit={{ scale: 0.95, opacity: 0, x: -200 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <Card className="w-full h-full bg-zinc-900/80 backdrop-blur border-zinc-800 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
                            <div
                                className="flex-1 relative"
                                onClick={() => setIsFlipped(!isFlipped)}
                            >
                                <ScrollArea className="h-full w-full p-6">
                                    <div className="min-h-[50vh] flex flex-col justify-center items-center text-center">
                                        {currentCard.type === 'video' && currentCard.video_url && (
                                            <div className="w-full aspect-video bg-black mb-4 rounded-xl overflow-hidden">
                                                <video
                                                    src={currentCard.video_url}
                                                    className="w-full h-full object-cover"
                                                    loop
                                                    muted
                                                    playsInline
                                                    autoPlay={isFlipped}
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-4">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${isFlipped
                                                    ? "bg-green-500/20 text-green-400"
                                                    : "bg-blue-500/20 text-blue-400"
                                                }`}>
                                                {isFlipped ? "ANSWER" : "QUESTION"}
                                            </span>
                                            <div className="text-xl md:text-2xl font-semibold text-white leading-relaxed">
                                                {isFlipped ? currentCard.answer : currentCard.question}
                                            </div>
                                        </div>
                                    </div>
                                </ScrollArea>

                                {/* Tap hint */}
                                {!isFlipped && (
                                    <motion.div
                                        className="absolute bottom-4 left-0 right-0 text-center text-zinc-600 text-xs"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    >
                                        👆 Tap to reveal answer
                                    </motion.div>
                                )}
                            </div>

                            {/* Footer Actions - Rating */}
                            {isFlipped && (
                                <motion.div
                                    className="p-6 bg-zinc-900/95 backdrop-blur border-t border-zinc-800"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="flex flex-col gap-3 items-center">
                                        <span className="text-sm text-zinc-400">How difficult was this?</span>
                                        <Rating value={rating} onChange={handleRating} />
                                        <div className="w-full flex justify-center items-center text-xs text-zinc-600 mt-2">
                                            <span>👈 Swipe left for next</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

