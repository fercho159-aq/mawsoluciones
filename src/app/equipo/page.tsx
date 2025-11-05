
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn } from 'lucide-react';
import Logo from '@/components/logo';
import { teamMembers } from '@/lib/team-data';
import { useAuth } from '@/lib/auth-provider';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, user } = useAuth();

  useEffect(() => {
    // Si ya hay un usuario, redirigir directamente.
    if (user) {
      router.push('/equipo/dashboard');
      return;
    }

    // Iniciar sesión automáticamente con el primer usuario admin como default
    const defaultAdmin = teamMembers.find(member => member.role === 'admin');

    if (defaultAdmin) {
      login(defaultAdmin);
      toast({
        title: 'Inicio de sesión automático',
        description: `Accediendo como ${defaultAdmin.name}.`,
      });
      router.push('/equipo/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Error de configuración',
        description: 'No se encontró un usuario administrador por defecto.',
      });
    }
  }, [login, router, toast, user]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                 <Logo />
            </div>
          <CardTitle>Acceso Interno</CardTitle>
          <CardDescription>Iniciando sesión automáticamente...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center text-muted-foreground">
            <LogIn className="w-5 h-5 mr-2 animate-spin" />
            <p>Redirigiendo al panel...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
