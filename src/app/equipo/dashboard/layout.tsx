
'use client';

import DashboardNav from "@/components/dashboard-nav";
import { useAuth } from "@/lib/auth-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-card p-4 border-r flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <Avatar>
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-muted-foreground">Bienvenido</p>
            <h2 className="text-lg font-bold font-headline -mt-1">
              {user?.name || 'Usuario'}
            </h2>
          </div>
        </div>
        <DashboardNav />
      </aside>
      <main className="flex-1 p-8 bg-background">
        {children}
      </main>
    </div>
  );
}
