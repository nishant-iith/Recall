"use client"

import * as React from "react"
import { deleteCard, updateCard } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, X, Save } from "lucide-react"

interface FlashcardManagerProps {
    initialCards: any[]
}

export function FlashcardManager({ initialCards }: FlashcardManagerProps) {
    const router = useRouter()
    const [editingId, setEditingId] = React.useState<string | null>(null)
    const [editForm, setEditForm] = React.useState<any>({})
    const [isLoading, setIsLoading] = React.useState(false)

    async function handleDelete(id: string) {
        if (!confirm("Are you sure?")) return
        setIsLoading(true)
        try {
            await deleteCard(id)
            toast.success("Card deleted")
            router.refresh()
        } catch (error) {
            toast.error("Failed to delete")
        } finally {
            setIsLoading(false)
        }
    }

    function startEdit(card: any) {
        setEditingId(card.id)
        setEditForm({
            question: card.question,
            answer: card.answer,
            video_url: card.video_url
        })
    }

    async function handleSave() {
        setIsLoading(true)
        try {
            await updateCard(editingId!, editForm)
            toast.success("Card updated")
            setEditingId(null)
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("Failed to update")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            {initialCards.map(card => (
                <div key={card.id} className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-3">
                    {editingId === card.id ? (
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs text-zinc-500">Question</label>
                                <Textarea
                                    value={editForm.question}
                                    onChange={e => setEditForm({ ...editForm, question: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-zinc-500">Answer</label>
                                <Textarea
                                    value={editForm.answer}
                                    onChange={e => setEditForm({ ...editForm, answer: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-zinc-500">Video URL</label>
                                <Input
                                    value={editForm.video_url || ""}
                                    onChange={e => setEditForm({ ...editForm, video_url: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="h-4 w-4" /></Button>
                                <Button size="sm" onClick={handleSave} disabled={isLoading}><Save className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1 flex-1">
                                    <h4 className="font-medium text-white">{card.question}</h4>
                                    <p className="text-sm text-zinc-400 line-clamp-2">{card.answer}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                                            {card.hierarchy?.name || "General"}
                                        </span>
                                        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                                            {card.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-white" onClick={() => startEdit(card)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-red-400" onClick={() => handleDelete(card.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ))}

            {initialCards.length === 0 && (
                <div className="text-center text-zinc-500 py-8">
                    No cards found.
                </div>
            )}
        </div>
    )
}
