"use client"

import * as React from "react"
import { motion, AnimatePresence, PanInfo, useAnimation } from "framer-motion"
import { Card as CardType } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Sparkles, Share2, Volume2, ThumbsUp, ThumbsDown } from "lucide-react"

interface FlashcardReelProps {
    initialCards: CardType[]
    onReview: (cardId: string, rating: number) => void
}

export function FlashcardReel({ initialCards, onReview }: FlashcardReelProps) {
    // We'll use a virtual index to track which card is active
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [cards, setCards] = React.useState(initialCards)
    const [isFlipped, setIsFlipped] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    // Handle vertical snap scrolling
    // For a true "Reel" feel, we might want to use native CSS scroll snap 
    // but framer-motion gives us more control over swipe gestures (like left swipe).
    // Let's try a hybrid: 
    // 1. One active card taking up the full viewport.
    // 2. Drag Y to switch.

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 50
        const velocityThreshold = 20

        // Vertical Swipe (Next/Prev)
        if (info.offset.y < -threshold && info.velocity.y < -velocityThreshold) {
            // Swipe Up -> Next
            if (currentIndex < cards.length - 1) {
                handleNext()
            } else {
                // Bounce back or load more?
                toast("You've reached the end for now!")
            }
        } else if (info.offset.y > threshold && info.velocity.y > velocityThreshold) {
            // Swipe Down -> Prev
            if (currentIndex > 0) {
                handlePrev()
            }
        }

        // Horizontal Swipe (AI Deep Dive)
        if (info.offset.x < -50) {
            // Swipe Left
            toast.info("AI Deep Dive coming soon!", {
                icon: <Sparkles className="h-4 w-4 text-purple-400" />
            })
        }
    }

    const handleNext = () => {
        setIsFlipped(false)
        setCurrentIndex(prev => prev + 1)
    }

    const handlePrev = () => {
        setIsFlipped(false)
        setCurrentIndex(prev => prev - 1)
    }

    const handleRating = (rating: number) => {
        onReview(cards[currentIndex].id, rating)
        toast.success(rating > 3 ? "Marked as Easy" : "Marked for Review", {
            duration: 1000
        })
        handleNext()
    }

    // PWA Install Prompt Check
    React.useEffect(() => {
        // @ts-ignore
        const prompt = window.deferredPrompt
        if (!prompt && !localStorage.getItem("install_prompt_shown")) {
            // Logic to detect if not installed could be added here
            // For now, simplistically show toast on mount
            toast("Install App for offline access!", {
                action: {
                    label: "Install",
                    onClick: () => {
                        // @ts-ignore
                        if (window.deferredPrompt) window.deferredPrompt.prompt()
                        else alert("Use your browser menu to 'Add to Home Screen'")
                    }
                },
                duration: 5000
            })
            localStorage.setItem("install_prompt_shown", "true")
        }
    }, [])

    const currentCard = cards[currentIndex]

    return (
        <div className="relative w-full h-[100dvh] bg-black overflow-hidden flex flex-col">
            {/* Top Bar (Overlay) */}
            <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                <span className="font-bold text-lg tracking-tighter text-white">Recall</span>
                <div className="flex gap-4 text-white/80">
                    <span className="text-xs font-mono opacity-60">
                        {currentIndex + 1}/{cards.length}
                    </span>
                </div>
            </div>

            {/* The Reel - AnimatePresence for transitions */}
            <div className="flex-1 relative flex items-center justify-center">
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                        key={currentIndex}
                        className="absolute inset-0 p-4 pb-20 pt-16 flex items-center justify-center"
                        initial={{ y: 300, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -300, opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.2}
                        onDragEnd={handleDragEnd}
                    >
                        {/* Card Container */}
                        <div
                            className="w-full h-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden relative shadow-2xl"
                            onClick={() => setIsFlipped(!isFlipped)}
                        >
                            <ScrollArea className="h-full w-full">
                                <div className="min-h-full flex flex-col items-center justify-center p-8 text-center">
                                    {/* Video content would go here */}

                                    <div className="mb-6 flex gap-2 justify-center">
                                        <span className={cn(
                                            "text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded bg-zinc-800 text-zinc-400",
                                            isFlipped ? "text-green-400" : "text-blue-400"
                                        )}>
                                            {isFlipped ? "Answer" : "Question"}
                                        </span>
                                        {currentCard.hierarchy_id && (
                                            <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded bg-zinc-800 text-zinc-500">
                                                {currentCard.hierarchy_id}
                                            </span>
                                        )}
                                    </div>

                                    <div className="prose prose-invert">
                                        <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-6">
                                            {isFlipped ? currentCard.answer : currentCard.question}
                                        </h2>
                                    </div>

                                    {/* Tap hint */}
                                    {!isFlipped && (
                                        <div className="mt-12 text-zinc-600 text-sm animate-pulse">
                                            Tap to reveal answer
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>

                            {/* Side Action Bar (Like TikTok) */}
                            <div className="absolute right-4 bottom-20 flex flex-col gap-6 items-center z-30 pointer-events-none">
                                <Button
                                    size="icon" variant="ghost" className="rounded-full bg-zinc-800/50 backdrop-blur pointer-events-auto hover:bg-zinc-700"
                                    onClick={(e) => { e.stopPropagation(); toast.info("Reading aloud...") }}
                                >
                                    <Volume2 className="h-5 w-5" />
                                </Button>
                                <Button
                                    size="icon" variant="ghost" className="rounded-full bg-zinc-800/50 backdrop-blur pointer-events-auto hover:bg-zinc-700"
                                    onClick={(e) => { e.stopPropagation(); toast.success("Link copied!") }}
                                >
                                    <Share2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Controls (Rating) - Only visible when flipped */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black via-black/90 to-transparent flex items-center justify-center gap-8 z-30">
                {isFlipped ? (
                    <>
                        <Button
                            variant="destructive"
                            className="rounded-full w-14 h-14 p-0 shadow-lg shadow-red-900/20"
                            onClick={(e) => { e.stopPropagation(); handleRating(1) }}
                        >
                            <ThumbsDown className="h-6 w-6" />
                        </Button>
                        <div className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Rate It</div>
                        <Button
                            className="rounded-full w-14 h-14 p-0 bg-green-600 hover:bg-green-500 shadow-lg shadow-green-900/20"
                            onClick={(e) => { e.stopPropagation(); handleRating(5) }}
                        >
                            <ThumbsUp className="h-6 w-6" />
                        </Button>
                    </>
                ) : (
                    <div className="text-zinc-500 text-xs font-medium flex flex-col items-center gap-1 animate-pulse">
                        <div className="h-1 w-12 bg-zinc-800 rounded-full mb-1" />
                        Swipe up for next
                    </div>
                )}
            </div>
        </div>
    )
}
