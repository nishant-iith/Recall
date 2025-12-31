import { getHierarchy, getAllCards } from "@/app/actions/admin"
import { HierarchyManager } from "@/components/admin/hierarchy-manager"
import { FlashcardManager } from "@/components/admin/flashcard-manager"

export default async function AdminPage() {
    const hierarchy = await getHierarchy() || []
    const cards = await getAllCards() || []

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <section className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50">
                <h2 className="text-xl font-semibold mb-4">Manage Hierarchy</h2>
                <HierarchyManager initialHierarchy={hierarchy} />
            </section>

            <section className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50">
                <h2 className="text-xl font-semibold mb-4">Manage Flashcards ({cards.length})</h2>
                <FlashcardManager initialCards={cards} />
            </section>
        </div>
    )
}
