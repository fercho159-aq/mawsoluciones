'use client';

import React from 'react';
import { teamMembers } from '@/lib/team-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

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
  return (
    <div>
      <h1 className="text-3xl font-bold font-headline">Mi Progreso</h1>
       <p className="mt-4 text-foreground/80 mb-8">
        En esta sección, cada miembro del equipo podrá ver un resumen de su rendimiento, incluyendo puntualidad, tareas completadas y actividades como grabaciones.
      </p>

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
    </div>
  );
}
