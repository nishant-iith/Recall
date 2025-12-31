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

declare global {
    interface Window {
        deferredPrompt: any;
    }
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
    const [showAddCard, setShowAddCard] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [apiKey, setApiKey] = React.useState("")

    React.useEffect(() => {
        const storedKey = localStorage.getItem("recall_gemini_key")
        if (storedKey) setApiKey(storedKey)
    }, [])

    function saveApiKey() {
        localStorage.setItem("recall_gemini_key", apiKey)
        alert("API Key saved!")
    }

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
                <Button variant="ghost" size="icon" className="fixed top-4 right-4 z-50 rounded-full h-10 w-10 p-0 overflow-hidden border border-white/10 bg-black/20 backdrop-blur-md hover:bg-black/40 transition-all shadow-xl">
                    <Avatar className="h-full w-full">
                        <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt="User" className="object-cover" />
                        <AvatarFallback className="bg-transparent text-white"><Settings2 className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto bg-black/80 backdrop-blur-2xl border-l border-white/5 text-zinc-100 sm:max-w-md w-full p-0 shadow-2xl">
                {/* Header Gradient */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-500/20 to-transparent pointer-events-none" />

                <div className="relative p-6 space-y-8">
                    <SheetHeader className="mb-2">
                        <SheetTitle className="text-2xl font-bold text-white tracking-tight">Settings</SheetTitle>
                    </SheetHeader>

                    {/* User Profile Card */}
                    <div className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white/5 border border-white/10 shadow-lg backdrop-blur-md">
                        <Avatar className="h-20 w-20 ring-4 ring-white/10 shadow-xl">
                            <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
                            <AvatarFallback className="bg-zinc-800 text-2xl font-medium">{user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "G"}</AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                            <h3 className="font-bold text-lg text-white">{user?.user_metadata?.full_name || "Guest User"}</h3>
                            <p className="text-sm text-zinc-400">{user?.email || "Sign in to sync your progress"}</p>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-2">Your Progress</h4>
                        <div className="p-4 rounded-3xl bg-zinc-900/50 border border-white/5">
                            <HeatmapStats />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-2">Controls</h4>

                        <div className="space-y-2">
                            {/* Toggle Add Card Form */}
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-4 h-14 px-4 rounded-2xl bg-zinc-900/40 border border-white/5 hover:bg-zinc-800 hover:text-white transition-all group"
                                onClick={() => setShowAddCard(!showAddCard)}
                            >
                                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                                    <Plus className="h-5 w-5" />
                                </div>
                                <span className="flex-1 text-left font-medium">Create New Card</span>
                            </Button>

                            {/* Add Card Form (Inline) - Animated */}
                            {showAddCard && (
                                <form action={onAddCard} className="space-y-4 p-5 rounded-3xl border border-white/10 bg-zinc-900/60 animate-in fade-in slide-in-from-top-4 shadow-inner">
                                    <div className="space-y-2">
                                        <Label htmlFor="question" className="text-zinc-400 text-xs uppercase font-bold tracking-wider">Question</Label>
                                        <Textarea id="question" name="question" placeholder="Enter concept..." required className="min-h-[80px] bg-black/40 border-white/10 focus:ring-purple-500/50 rounded-xl resize-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="answer" className="text-zinc-400 text-xs uppercase font-bold tracking-wider">Answer</Label>
                                        <Textarea id="answer" name="answer" placeholder="Enter answer..." required className="min-h-[80px] bg-black/40 border-white/10 focus:ring-purple-500/50 rounded-xl resize-none" />
                                    </div>
                                    <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white h-12 rounded-xl font-bold shadow-lg" disabled={isLoading}>
                                        {isLoading ? "Creating..." : "Save Card"}
                                    </Button>
                                </form>
                            )}

                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-4 h-14 px-4 rounded-2xl bg-zinc-900/40 border border-white/5 hover:bg-zinc-800 hover:text-white transition-all group"
                                onClick={() => {
                                    if (window.deferredPrompt) window.deferredPrompt.prompt()
                                    else alert("Use browser menu to 'Add to Home Screen'")
                                }}
                            >
                                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                                    <Download className="h-5 w-5" />
                                </div>
                                <span className="flex-1 text-left font-medium">Install App</span>
                            </Button>
                        </div>
                    </div>


                    {/* AI Configuration */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-2">Intelligence</h4>
                        <div className="p-5 rounded-3xl border border-white/10 bg-zinc-900/40 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="gemini-key" className="text-zinc-400 text-xs uppercase font-bold tracking-wider">Gemini API Key</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="gemini-key"
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        placeholder="sk-..."
                                        className="bg-black/40 border-white/10 h-10 rounded-xl"
                                    />
                                    <Button size="sm" onClick={saveApiKey} className="rounded-xl h-10 px-4 bg-white/10 hover:bg-white/20 text-white font-medium">Save</Button>
                                </div>
                                <p className="text-[10px] text-zinc-500">
                                    Stored locally. Bring your own key for unlimited power.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Account Section */}
                    {user ? (
                        <div className="pt-4">
                            <form action={signOut}>
                                <Button variant="ghost" className="w-full justify-start gap-4 h-14 px-4 rounded-2xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all font-medium">
                                    <LogOut className="h-5 w-5" />
                                    Sign Out
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="pt-4">
                            <form action={signInWithGoogle}>
                                <Button className="w-full gap-3 bg-white text-black hover:bg-zinc-200 h-14 rounded-2xl font-bold shadow-xl">
                                    <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                    Sign in with Google
                                </Button>
                            </form>
                        </div>
                    )}

                    <div className="h-8" /> {/* Spacer */}
                </div>
            </SheetContent>
        </Sheet>
    )
}
