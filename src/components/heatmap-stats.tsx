"use client"

import * as React from "react"
import { ActivityCalendar } from "react-activity-calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for now
const MOCK_DATA = [
    { count: 12, date: '2025-10-01', level: 1 },
    { count: 2, date: '2025-10-02', level: 1 },
    { count: 0, date: '2025-10-03', level: 0 },
    { count: 18, date: '2025-10-04', level: 3 },
]

export function HeatmapStats() {
    return (
        <Card className="w-full bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
                <CardTitle className="text-lg font-medium">Study Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center">
                    <ActivityCalendar
                        data={MOCK_DATA}
                        theme={{
                            light: ['#18181b', '#2e2e33', '#46464f', '#60606e', '#7d7d8e'], // Grayscale fallback
                            dark: ['#18181b', '#1e293b', '#3b82f6', '#2563eb', '#1d4ed8'], // Blue shades
                        }}
                        labels={{
                            legend: {
                                less: 'Less',
                                more: 'More',
                            },
                        }}
                        showWeekdayLabels
                        colorScheme="dark"
                    />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-xs text-zinc-500">Day Streak</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">85%</div>
                        <div className="text-xs text-zinc-500">Recall Rate</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">342</div>
                        <div className="text-xs text-zinc-500">Cards</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
