"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Users, BookOpen, ListTodo, KeyRound, DollarSign, Calendar, LineChart, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-provider";

const navItems = [
    { href: "/equipo/dashboard/nosotros", label: "Nosotros", icon: <Users className="w-4 h-4" /> },
    { href: "/equipo/dashboard/introduccion", label: "Introducción", icon: <BookOpen className="w-4 h-4" /> },
    { href: "/equipo/dashboard/pendientes", label: "Pendientes", icon: <ListTodo className="w-4 h-4" /> },
    { href: "/equipo/dashboard/finanzas", label: "Finanzas", icon: <DollarSign className="w-4 h-4" /> },
    { href: "/equipo/dashboard/accesos", label: "Accesos", icon: <KeyRound className="w-4 h-4" /> },
    { href: "/equipo/dashboard/calendario", label: "Calendario", icon: <Calendar className="w-4 h-4" /> },
    { href: "/equipo/dashboard/mi-progreso", label: "Mi Progreso", icon: <LineChart className="w-4 h-4" /> },
];

export default function DashboardNav() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <nav className="flex flex-col gap-2 flex-grow">
            <div className="flex-grow">
                {navItems.map(item => (
                    <Button 
                        key={item.href}
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        asChild
                        className="justify-start w-full mb-1"
                    >
                        <Link href={item.href} className="flex items-center gap-2">
                            {item.icon}
                            {item.label}
                        </Link>
                    </Button>
                ))}
            </div>
            <div className="mt-auto">
                 <Button 
                    variant="outline"
                    onClick={logout}
                    className="justify-start w-full"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                </Button>
            </div>
        </nav>
    );
}
