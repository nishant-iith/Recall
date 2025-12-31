"use client"

import * as React from "react"
import { createHierarchyNode } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface HierarchyManagerProps {
    initialHierarchy: any[]
}

export function HierarchyManager({ initialHierarchy }: HierarchyManagerProps) {
    const router = useRouter()
    const [name, setName] = React.useState("")
    const [type, setType] = React.useState<"field" | "topic" | "subtopic">("field")
    const [parentId, setParentId] = React.useState<string>("")
    const [isLoading, setIsLoading] = React.useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        try {
            await createHierarchyNode(name, type, parentId === "none" ? undefined : parentId)
            toast.success("Node created")
            setName("")
            router.refresh()
        } catch (error) {
            toast.error("Failed to create node")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="flex gap-4 items-end bg-black p-4 rounded-lg border border-zinc-800">
                <div className="space-y-2 flex-1">
                    <label className="text-sm font-medium">Name</label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. DSA, Sorting..." required />
                </div>

                <div className="space-y-2 w-40">
                    <label className="text-sm font-medium">Type</label>
                    <Select value={type} onValueChange={(v: any) => setType(v)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="field">Field</SelectItem>
                            <SelectItem value="topic">Topic</SelectItem>
                            <SelectItem value="subtopic">Subtopic</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {type !== "field" && (
                    <div className="space-y-2 w-64">
                        <label className="text-sm font-medium">Parent</label>
                        <Select value={parentId} onValueChange={setParentId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select parent..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {initialHierarchy
                                    .filter(h =>
                                        type === "topic" ? h.type === "field" : h.type === "topic"
                                    )
                                    .map(h => (
                                        <SelectItem key={h.id} value={h.id}>
                                            {h.name}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Using Force..." : "Create"}
                </Button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="space-y-2">
                    <h3 className="font-semibold text-zinc-400">Fields</h3>
                    {initialHierarchy.filter(h => h.type === 'field').map(h => (
                        <div key={h.id} className="p-2 bg-zinc-900 rounded border border-zinc-800">
                            {h.name}
                        </div>
                    ))}
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold text-zinc-400">Topics</h3>
                    {initialHierarchy.filter(h => h.type === 'topic').map(h => (
                        <div key={h.id} className="p-2 bg-zinc-900 rounded border border-zinc-800">
                            {h.name}
                        </div>
                    ))}
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold text-zinc-400">Subtopics</h3>
                    {initialHierarchy.filter(h => h.type === 'subtopic').map(h => (
                        <div key={h.id} className="p-2 bg-zinc-900 rounded border border-zinc-800">
                            {h.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
