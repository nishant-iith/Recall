"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { HeatmapStats } from "@/components/heatmap-stats"
import { Plus, LogOut, Settings2, Download } from "lucide-react"
import { signInWithGoogle, signOut } from "@/app/actions/auth"
import { createCard } from "@/app/actions/cards"

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
            alert(result.error)
        } else {
            alert("Card created successfully!")
            setShowAddCard(false)
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="fixed top-4 right-4 z-50 rounded-full h-10 w-10 p-0 overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md hover:bg-black/60 transition-colors">
                    <Avatar className="h-full w-full">
                        <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt="User" />
                        <AvatarFallback className="bg-transparent text-white"><Settings2 className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto bg-zinc-950 border-zinc-800 text-zinc-100 sm:max-w-md">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-xl font-bold text-white">Profile & Settings</SheetTitle>
                </SheetHeader>

                <div className="space-y-8">
                    {/* User Profile Card */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
                        <Avatar className="h-16 w-16 ring-2 ring-white/10">
                            <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
                            <AvatarFallback className="bg-zinc-800 text-lg">{user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "G"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-white truncate">{user?.user_metadata?.full_name || "Guest User"}</h3>
                            <p className="text-sm text-zinc-500 truncate">{user?.email || "Sign in to save progress"}</p>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest ml-1">Activity</h4>
                        <HeatmapStats />
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest ml-1">Actions</h4>

                        <div className="grid gap-2">
                            {/* Toggle Add Card Form */}
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-3 h-12 bg-zinc-900/30 border-white/5 hover:bg-zinc-900 hover:text-white transition-all text-zinc-300"
                                onClick={() => setShowAddCard(!showAddCard)}
                            >
                                <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400">
                                    <Plus className="h-4 w-4" />
                                </div>
                                <span className="flex-1 text-left">Create New Card</span>
                            </Button>

                            {/* Add Card Form (Inline) */}
                            {showAddCard && (
                                <form action={onAddCard} className="space-y-4 p-4 rounded-xl border border-white/10 bg-zinc-900/80 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="question" className="text-zinc-400">Question</Label>
                                        <Textarea id="question" name="question" placeholder="What's the concept?" required className="min-h-[80px] bg-zinc-950 border-zinc-800 focus:ring-purple-500/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="answer" className="text-zinc-400">Answer</Label>
                                        <Textarea id="answer" name="answer" placeholder="The answer is..." required className="min-h-[80px] bg-zinc-950 border-zinc-800 focus:ring-purple-500/50" />
                                    </div>
                                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={isLoading}>
                                        {isLoading ? "Creating..." : "Save Card"}
                                    </Button>
                                </form>
                            )}

                            <Button
                                variant="outline"
                                className="w-full justify-start gap-3 h-12 bg-zinc-900/30 border-white/5 hover:bg-zinc-900 hover:text-white transition-all text-zinc-300"
                                onClick={() => {
                                    // @ts-expect-error: deferredPrompt is non-standard
                                    if (window.deferredPrompt) window.deferredPrompt.prompt()
                                    else alert("Use browser menu to 'Add to Home Screen'")
                                }}
                            >
                                <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400">
                                    <Download className="h-4 w-4" />
                                </div>
                                <span className="flex-1 text-left">Install App</span>
                            </Button>
                        </div>
                    </div>

                    {/* Account Section */}
                    {user ? (
                        <div className="pt-4 border-t border-white/5">
                            <form action={signOut}>
                                <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="pt-4 border-t border-white/5">
                            <form action={signInWithGoogle}>
                                <Button className="w-full gap-2 bg-white text-black hover:bg-zinc-200 h-12 font-medium">
                                    <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                    Sign in with Google
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
