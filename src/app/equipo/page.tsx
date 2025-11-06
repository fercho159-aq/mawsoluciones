
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn } from 'lucide-react';
import Logo from '@/components/logo';
import { teamMembers } from '@/lib/team-data';
import { useAuth } from '@/lib/auth-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Colaborador } from '@/lib/db/schema';

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
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
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
    </div>
  );
}
