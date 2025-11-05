
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Users, BookOpen, ListTodo, KeyRound, DollarSign, Calendar, LineChart, Handshake } from "lucide-react";
import { useAuth } from "@/lib/auth-provider";

const navItems = [
    { href: "/equipo/dashboard/nosotros", label: "Nosotros", icon: <Users className="w-4 h-4" />, section: 'nosotros' },
    { href: "/equipo/dashboard/introduccion", label: "Introducción", icon: <BookOpen className="w-4 h-4" />, section: 'introduccion' },
    { href: "/equipo/dashboard/clientes", label: "Clientes", icon: <Users className="w-4 h-4" />, section: 'clientes' },
    { href: "/equipo/dashboard/pendientes", label: "Pendientes", icon: <ListTodo className="w-4 h-4" />, section: 'pendientes' },
    { href: "/equipo/dashboard/finanzas", label: "Finanzas", icon: <DollarSign className="w-4 h-4" />, section: 'finanzas' },
    { href: "/equipo/dashboard/ventas", label: "Ventas", icon: <Handshake className="w-4 h-4" />, section: 'ventas' },
    { href: "/equipo/dashboard/accesos", label: "Accesos", icon: <KeyRound className="w-4 h-4" />, section: 'accesos' },
    { href: "/equipo/dashboard/calendario", label: "Calendario", icon: <Calendar className="w-4 h-4" />, section: 'calendario' },
    { href: "/equipo/dashboard/mi-progreso", label: "Mi Progreso", icon: <LineChart className="w-4 h-4" />, section: 'miProgreso' },
];

export default function DashboardNav() {
    const pathname = usePathname();
    const { user } = useAuth();

    const userHasAccess = (section: string) => {
        if (!user) return false;
        if (user.role === 'admin') return true;
        if (!user.accessSections) return false;

        return user.accessSections[section] === true;
    };

    return (
        <nav className="flex flex-col gap-2 flex-grow">
            <div className="flex-grow">
                {navItems.map(item => {
                    if (!userHasAccess(item.section)) {
                        return null;
                    }
                    return (
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
                    );
                })}
            </div>
        </nav>
    );
}
