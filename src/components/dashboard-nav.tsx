"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Users, BookOpen, ListTodo, KeyRound, DollarSign } from "lucide-react";

const navItems = [
    { href: "/equipo/dashboard/nosotros", label: "Nosotros", icon: <Users className="w-4 h-4" /> },
    { href: "/equipo/dashboard/introduccion", label: "Introducción", icon: <BookOpen className="w-4 h-4" /> },
    { href: "/equipo/dashboard/pendientes", label: "Pendientes", icon: <ListTodo className="w-4 h-4" /> },
    { href: "/equipo/dashboard/finanzas", label: "Finanzas", icon: <DollarSign className="w-4 h-4" /> },
    { href: "/equipo/dashboard/accesos", label: "Accesos", icon: <KeyRound className="w-4 h-4" /> },
];

export default function DashboardNav() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-2">
            {navItems.map(item => (
                <Button 
                    key={item.href}
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    asChild
                    className="justify-start"
                >
                    <Link href={item.href} className="flex items-center gap-2">
                        {item.icon}
                        {item.label}
                    </Link>
                </Button>
            ))}
        </nav>
    );
}
