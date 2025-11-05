import DashboardNav from "@/components/dashboard-nav";
import { AuthProvider } from "@/lib/auth-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
        <div className="flex min-h-screen">
        <aside className="w-64 bg-card p-4 border-r flex flex-col">
            <h2 className="text-xl font-bold font-headline mb-8">Equipo Interno</h2>
            <DashboardNav />
        </aside>
        <main className="flex-1 p-8 bg-background">
            {children}
        </main>
        </div>
    </AuthProvider>
  );
}
