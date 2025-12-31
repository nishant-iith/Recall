"use client"

import * as React from "react"
import { ActivityCalendar } from "react-activity-calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Flame } from "lucide-react"

// Mock data for heatmap (leaving hardcoded for now as user just wanted streak logic)
const MOCK_DATA = [
    { count: 12, date: '2025-10-01', level: 1 },
    { count: 2, date: '2025-10-02', level: 1 },
    { count: 0, date: '2025-10-03', level: 0 },
    { count: 18, date: '2025-10-04', level: 3 },
]

export function HeatmapStats() {
    const [streak, setStreak] = React.useState(0)

    React.useEffect(() => {
        const fetchStreak = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from("user_streaks")
                    .select("current_streak")
                    .eq("user_id", user.id)
                    .single()

                if (data) {
                    setStreak(data.current_streak)
                }
            }
        }
        fetchStreak()
    }, [])

    return (
        <Card className="w-full bg-zinc-900 border-zinc-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Study Activity</CardTitle>
                <div className="flex items-center gap-1 text-orange-500 font-bold bg-orange-500/10 px-3 py-1 rounded-full text-sm animate-pulse">
                    <Flame className="h-4 w-4 fill-orange-500" />
                    {streak} Day Streak
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center">
                    <ActivityCalendar
                        data={MOCK_DATA}
                        theme={{
                            light: ['#18181b', '#2e2e33', '#46464f', '#60606e', '#7d7d8e'],
                            dark: ['#18181b', '#1e293b', '#3b82f6', '#2563eb', '#1d4ed8'],
                        }}
                        showWeekdayLabels
                        colorScheme="dark"
                        renderBlock={(block, activity) => (
                            <div title={`${activity.count} activities on ${activity.date}`} className="w-2.5 h-2.5 rounded-[2px]">{block}</div>
                        )}
                        blockRadius={3}
                        blockSize={12}
                    />
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4 text-center divide-x divide-zinc-800">
                    <div>
                        <div className="text-2xl font-bold flex items-center justify-center gap-1">
                            {streak} <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
                        </div>
                        <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Day Streak</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">85%</div>
                        <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Recall Rate</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">342</div>
                        <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Cards</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
