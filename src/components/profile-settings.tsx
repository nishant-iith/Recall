"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { HeatmapStats } from "@/components/heatmap-stats"
import { User, Plus, LogOut } from "lucide-react"
import { signInWithGoogle, signOut } from "@/app/actions/auth"
import { createCard } from "@/app/actions/cards"
import { toast } from "sonner" // Assuming we have sonner or similar, else simple alert

interface ProfileSettingsProps {
    user?: { email?: string; user_metadata?: { full_name?: string; avatar_url?: string } } | null
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
    const [showAddCard, setShowAddCard] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

    async function onAddCard(formData: FormData) {
        setIsLoading(true)
        const result = await createCard(formData)
        setIsLoading(false)

        if (result?.error) {
            alert(result.error) // Replace with toast later
        } else {
            alert("Card created successfully!")
            setShowAddCard(false)
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="fixed top-4 right-4 z-50 rounded-full h-10 w-10 p-0 overflow-hidden border border-zinc-800 bg-black/50 backdrop-blur">
                    <Avatar className="h-full w-full">
                        <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt="User" />
                        <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Settings</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                    {/* User Profile */}
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-900">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
                            <AvatarFallback>{user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "G"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h3 className="font-medium text-lg">{user?.user_metadata?.full_name || "Guest"}</h3>
                            <p className="text-sm text-zinc-500">{user?.email || "Not signed in"}</p>
                        </div>
                    </div>

                    {/* Auth Button */}
                    {user ? (
                        <form action={signOut}>
                            <Button variant="outline" className="w-full gap-2">
                                <LogOut className="h-4 w-4" /> Sign Out
                            </Button>
                        </form>
                    ) : (
                        <form action={signInWithGoogle}>
                            <Button className="w-full gap-2 bg-white text-black hover:bg-zinc-200">
                                <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                Sign in with Google
                            </Button>
                        </form>
                    )}

                    {/* Add Card Section */}
                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full gap-2"
                            onClick={() => setShowAddCard(!showAddCard)}
                        >
                            <Plus className="h-4 w-4" /> Add New Flashcard
                        </Button>

                        {showAddCard && (
                            <form action={onAddCard} className="space-y-4 p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
                                <div className="space-y-2">
                                    <Label htmlFor="question">Question</Label>
                                    <Textarea
                                        id="question"
                                        name="question"
                                        placeholder="Enter the question..."
                                        required
                                        className="min-h-[80px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="answer">Answer</Label>
                                    <Textarea
                                        id="answer"
                                        name="answer"
                                        placeholder="Enter the answer..."
                                        required
                                        className="min-h-[80px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="videoUrl">Video URL (Optional)</Label>
                                    <Input
                                        id="videoUrl"
                                        name="videoUrl"
                                        placeholder="https://..."
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Creating..." : "Create Card"}
                                </Button>
                            </form>
                        )}
                    </div>

                    {/* Heatmap */}
                    <HeatmapStats />

                    {/* Preferences */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Preferences</h4>
                        <div className="p-4 rounded-lg border border-zinc-800 space-y-4">
                            <div className="flex justify-between items-center">
                                <span>Dark Mode</span>
                                <span className="text-zinc-500">On</span>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    // @ts-ignore
                                    if (window.deferredPrompt) {
                                        // @ts-ignore
                                        window.deferredPrompt.prompt()
                                    } else {
                                        alert("To install, select 'Add to Home Screen' from your browser menu.")
                                    }
                                }}
                            >
                                Install App
                            </Button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

