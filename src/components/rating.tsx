"use client"

import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingProps {
    value: number
    onChange: (value: number) => void
    readOnly?: boolean
    className?: string
}

export function Rating({ value, onChange, readOnly = false, className }: RatingProps) {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null)

    return (
        <div className={cn("flex gap-1", className)}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => !readOnly && onChange(star)}
                    onMouseEnter={() => !readOnly && setHoverValue(star)}
                    onMouseLeave={() => !readOnly && setHoverValue(null)}
                    className={cn(
                        "rounded-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        readOnly ? "cursor-default" : "cursor-pointer"
                    )}
                    disabled={readOnly}
                    aria-label={`Rate ${star} stars`}
                >
                    <Star
                        className={cn(
                            "h-6 w-6 transition-all",
                            (hoverValue !== null ? star <= hoverValue : star <= value)
                                ? "fill-primary text-primary"
                                : "fill-muted text-muted-foreground"
                        )}
                    />
                </button>
            ))}
        </div>
    )
}
