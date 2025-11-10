
"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn, FileArchive } from 'lucide-react';
import Logo from '@/components/logo';
import { teamMembers } from '@/lib/team-data';
import { useAuth } from '@/lib/auth-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Colaborador } from '@/lib/db/schema';

const graciasLinks = [
    { href: "/equipo/dashboard/gracias-sitio-web", label: "Gracias Sitio Web" },
    { href: "/equipo/dashboard/gracias-contenido", label: "Gracias Contenido" },
    { href: "/equipo/dashboard/renovacion", label: "Renovación" },
    { href: "/equipo/dashboard/correo", label: "Correo" },
];

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleLogin = (user: Colaborador) => {
    login(user);
    toast({
      title: 'Inicio de Sesión Exitoso',
      description: `Accediendo como ${user.name}.`,
    });
    router.push('/equipo/dashboard');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                 <Logo />
            </div>
          <CardTitle>Selección de Usuario (Pruebas)</CardTitle>
          <CardDescription>Haz clic en un usuario para iniciar sesión y probar su vista.</CardDescription>
        </CardHeader>
        <CardContent className="max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {teamMembers.map((member) => (
              <Button 
                key={member.id} 
                variant="outline" 
                className="flex flex-col h-auto p-4 gap-2"
                onClick={() => handleLogin(member)}
              >
                <span className="font-bold text-lg">{member.name}</span>
                <Badge variant={member.role === 'admin' ? 'destructive' : 'secondary'}>
                    {member.role}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="w-full max-w-md mt-8">
        <CardHeader>
            <CardTitle>Recursos para Clientes</CardTitle>
            <CardDescription>Accede a guías y requisitos para empezar a trabajar con nosotros.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 gap-4">
                {graciasLinks.map(link => (
                    <Button key={link.href} variant="outline" asChild className="justify-start">
                        <Link href={link.href}>
                            <FileArchive className="w-4 h-4 mr-2"/>
                            {link.label}
                        </Link>
                    </Button>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
