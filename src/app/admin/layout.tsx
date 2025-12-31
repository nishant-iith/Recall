import { checkAdmin } from "@/app/actions/admin"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    await checkAdmin()

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-primary">Admin Dashboard</h1>
            {children}
        </div>
    )
}
