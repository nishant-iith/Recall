"use client"

import * as React from "react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { Card as CardType } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
    const [exitX, setExitX] = React.useState(0)

    const currentCard = cards[currentIndex]
    const progress = ((currentIndex + (isFinished ? 1 : 0)) / cards.length) * 100

    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x < -100 && info.velocity.x < -100) {
            setExitX(-300)
            handleNext()
        } else if (info.offset.x > 100 && info.velocity.x > 100) {
            setExitX(300)
            handlePrev()
        }
    }

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setExitX(-300)
            setTimeout(() => {
                setIsFlipped(false)
                setRating(0)
                setCurrentIndex(prev => prev + 1)
            }, 50)
        } else {
            setIsFinished(true)
        }
    }

    const handlePrev = () => {
        if (currentIndex > 0) {
            setExitX(300)
            setTimeout(() => {
                setIsFlipped(false)
                setRating(0)
                setCurrentIndex(prev => prev - 1)
            }, 50)
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
            <div className="flex-1 relative flex items-center justify-center px-4">
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                        key={currentCard.id}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.8}
                        onDragEnd={handleDragEnd}
                        className="w-full h-full max-h-[65vh] cursor-grab active:cursor-grabbing"
                        initial={{ scale: 0.9, opacity: 0, x: exitX > 0 ? -300 : 300 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        exit={{ scale: 0.9, opacity: 0, x: exitX }}
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    >
                        <Card className="w-full h-full bg-zinc-900/90 backdrop-blur border-zinc-800 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
                            {/* Card Content - Tappable Area */}
                            <div
                                className="flex-1 relative cursor-pointer"
                                onClick={() => setIsFlipped(!isFlipped)}
                            >
                                <ScrollArea className="h-full w-full">
                                    <div className="min-h-[40vh] flex flex-col justify-center items-center text-center p-6">
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
                                            <span className={cn(
                                                "inline-block px-3 py-1 rounded-full text-xs font-medium",
                                                isFlipped
                                                    ? "bg-green-500/20 text-green-400"
                                                    : "bg-blue-500/20 text-blue-400"
                                            )}>
                                                {isFlipped ? "ANSWER" : "QUESTION"}
                                            </span>
                                            <div className="text-lg md:text-xl font-medium text-white leading-relaxed">
                                                {isFlipped ? currentCard.answer : currentCard.question}
                                            </div>
                                        </div>
                                    </div>
                                </ScrollArea>

                                {/* Tap hint */}
                                {!isFlipped && (
                                    <motion.div
                                        className="absolute bottom-2 left-0 right-0 text-center text-zinc-600 text-xs"
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
                                    className="p-4 bg-zinc-900/95 backdrop-blur border-t border-zinc-800"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="flex flex-col gap-3 items-center">
                                        <span className="text-sm text-zinc-400">How difficult was this?</span>

                                        {/* Rating Buttons */}
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((value) => (
                                                <button
                                                    key={value}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleRating(value)
                                                    }}
                                                    className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                                                        rating === value
                                                            ? "bg-primary text-primary-foreground scale-110"
                                                            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                                                    )}
                                                >
                                                    {value}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-1 text-xs text-zinc-600">
                                            <span>1 = Easy</span>
                                            <span className="mx-2">•</span>
                                            <span>5 = Hard</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="p-4 flex items-center justify-between">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="h-12 w-12 rounded-full"
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button
                    onClick={handleNext}
                    className="px-8 h-12 rounded-full bg-primary hover:bg-primary/90"
                >
                    {currentIndex === cards.length - 1 ? "Finish" : "Next"}
                    <ChevronRight className="h-5 w-5 ml-1" />
                </Button>
            </div>
        </div>
    )
}


