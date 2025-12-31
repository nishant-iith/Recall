"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Plus } from "lucide-react"

export function CardEditor() {
    // Basic form state for now, will enhance with react-hook-form + zod later if complex
    const [question, setQuestion] = React.useState("")
    const [answer, setAnswer] = React.useState("")
    const [videoUrl, setVideoUrl] = React.useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log({ question, answer, videoUrl })
        // Call server action to save
        setQuestion("")
        setAnswer("")
        setVideoUrl("")
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="default"
                    size="icon"
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50"
                >
                    <Plus className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh] rounded-t-xl">
                <SheetHeader>
                    <SheetTitle>Add New Flashcard</SheetTitle>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    <div className="space-y-2">
                        <Label htmlFor="question">Question</Label>
                        <Textarea
                            id="question"
                            placeholder="Enter the question..."
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="answer">Answer</Label>
                        <Textarea
                            id="answer"
                            placeholder="Enter the answer..."
                            value={answer}
                            onChange={e => setAnswer(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="video">Video URL (Optional)</Label>
                        <Input
                            id="video"
                            placeholder="https://..."
                            value={videoUrl}
                            onChange={e => setVideoUrl(e.target.value)}
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        Create Card
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    )
}
