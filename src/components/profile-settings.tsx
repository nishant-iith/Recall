"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HeatmapStats } from "@/components/heatmap-stats"
import { User } from "lucide-react"

export function ProfileSettings() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="fixed top-4 right-4 z-50 rounded-full h-10 w-10 p-0 overflow-hidden border border-zinc-800 bg-black/50 backdrop-blur">
                    <Avatar className="h-full w-full">
                        <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                        <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Profile & Settings</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-900">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-medium text-lg">User</h3>
                            <p className="text-sm text-zinc-500">user@example.com</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <HeatmapStats />
                        <h4 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Preferences</h4>
                        {/* Add settings here */}
                        <div className="p-4 rounded-lg border border-zinc-800">
                            Dark Mode: On
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
