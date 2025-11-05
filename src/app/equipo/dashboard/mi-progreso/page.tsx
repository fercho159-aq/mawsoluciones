'use client';

import React from 'react';
import { teamMembers } from '@/lib/team-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, XCircle, BarChart2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-provider';
import AnimatedDiv from '@/components/animated-div';

const mockProgressData = teamMembers.map(member => ({
    name: member.name,
    punctuality: Math.random() > 0.8 ? 'Tarde' : (Math.random() > 0.9 ? 'Falta' : 'Puntual'),
    tasksCompleted: Math.floor(Math.random() * 5) + 1,
    totalTasks: 6,
    recordings: Math.floor(Math.random() * 4),
}));


const PunctualityBadge = ({ status }: { status: string }) => {
    return (
        <Badge variant={status === 'Puntual' ? 'default' : 'destructive'} className={cn(
            status === 'Puntual' && 'bg-green-500 hover:bg-green-500/80',
            status === 'Tarde' && 'bg-yellow-500 hover:bg-yellow-500/80',
            status === 'Falta' && 'bg-red-500 hover:bg-red-500/80',
            'text-white'
        )}>
             {status === 'Puntual' && <CheckCircle className="w-3 h-3 mr-1" />}
             {status === 'Tarde' && <Clock className="w-3 h-3 mr-1" />}
             {status === 'Falta' && <XCircle className="w-3 h-3 mr-1" />}
            {status}
        </Badge>
    )
}

export default function MiProgresoPage() {
    const { user } = useAuth();
    const userProgress = mockProgressData.find(member => member.name === user?.name);

    if (!user) {
        return <div className="text-center text-foreground/70">Cargando datos de usuario...</div>
    }

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline">Mi Progreso</h1>
      
      {user.role === 'admin' ? (
        <>
            <p className="mt-4 text-foreground/80 mb-8">
                Como administrador, puedes ver un resumen del rendimiento de todo el equipo, incluyendo puntualidad, tareas completadas y actividades.
            </p>
            <AnimatedDiv>
                <Card>
                    <CardHeader>
                        <CardTitle>Reporte de Rendimiento del Equipo</CardTitle>
                        <CardDescription>Resumen de las actividades y puntualidad del mes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Miembro del Equipo</TableHead>
                                        <TableHead>Asistencia (Hoy)</TableHead>
                                        <TableHead>Tareas Completadas (Hoy)</TableHead>
                                        <TableHead className="text-right">Grabaciones (Mes)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockProgressData.map((member) => (
                                        <TableRow key={member.name}>
                                            <TableCell className="font-medium">{member.name}</TableCell>
                                            <TableCell>
                                                <PunctualityBadge status={member.punctuality} />
                                            </TableCell>
                                            <TableCell>
                                                <span className={cn(member.tasksCompleted === member.totalTasks ? 'text-green-500' : 'text-foreground')}>
                                                    {member.tasksCompleted} / {member.totalTasks}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">{member.recordings}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </AnimatedDiv>
        </>
      ) : (
        <>
             <p className="mt-4 text-foreground/80 mb-8">
                En esta sección, podrás ver un resumen de tu rendimiento personal, incluyendo tu puntualidad y tareas completadas.
            </p>
             {userProgress ? (
                <AnimatedDiv>
                    <Card>
                        <CardHeader>
                            <CardTitle>Tu Reporte de Rendimiento</CardTitle>
                            <CardDescription>Resumen de tus actividades del mes.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                           <div className="flex items-center justify-between p-4 bg-card-foreground/5 rounded-lg">
                             <div className="flex items-center gap-4">
                                <PunctualityBadge status={userProgress.punctuality} />
                                <div>
                                    <p className="font-semibold">Asistencia (Hoy)</p>
                                    <p className="text-sm text-muted-foreground">Tu estado de asistencia para el día de hoy.</p>
                                </div>
                             </div>
                           </div>
                           <div className="flex items-center justify-between p-4 bg-card-foreground/5 rounded-lg">
                             <div className="flex items-center gap-4">
                                <BarChart2 className="w-6 h-6 text-primary"/>
                                <div>
                                    <p className="font-semibold">Tareas Completadas (Hoy)</p>
                                    <p className="text-sm text-muted-foreground">Has completado <span className="font-bold text-primary">{userProgress.tasksCompleted}</span> de <span className="font-bold">{userProgress.totalTasks}</span> tareas.</p>
                                </div>
                             </div>
                           </div>
                            <div className="flex items-center justify-between p-4 bg-card-foreground/5 rounded-lg">
                             <div className="flex items-center gap-4">
                                <CheckCircle className="w-6 h-6 text-green-500"/>
                                <div>
                                    <p className="font-semibold">Grabaciones (Mes)</p>
                                    <p className="text-sm text-muted-foreground">Has participado en <span className="font-bold text-primary">{userProgress.recordings}</span> grabaciones este mes.</p>
                                </div>
                             </div>
                           </div>
                        </CardContent>
                    </Card>
                </AnimatedDiv>
             ) : (
                <div className="text-center text-foreground/70 p-8">No se encontraron datos de progreso para tu usuario.</div>
             )}
        </>
      )}
    </div>
  );
}
