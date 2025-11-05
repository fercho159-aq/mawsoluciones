'use client';

import React, { useState, useMemo } from 'react';
import { teamMembers } from '@/lib/team-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, XCircle, BarChart2, TrendingUp, Target, Calendar } from 'lucide-react';
import { useAuth } from '@/lib/auth-provider';
import AnimatedDiv from '@/components/animated-div';
import { Button } from '@/components/ui/button';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, format } from 'date-fns';
import { es } from 'date-fns/locale';

// --- Mock Data Simulation ---
// These functions generate more realistic, time-based mock data for demonstration.

const today = new Date();
const currentMonthStart = startOfMonth(today);

// Simulate tasks with different completion dates throughout the month
const generateMockTasks = () => {
    const tasks = [];
    const statuses = ["Completado", "Trabajando", "Pendiente"];
    for (const member of teamMembers) {
        for (let i = 0; i < 15; i++) {
            const taskDate = new Date(currentMonthStart.getTime() + Math.random() * (today.getTime() - currentMonthStart.getTime()));
            tasks.push({
                id: `task-${member.id}-${i}`,
                ejecutor: member.name,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                completedAt: taskDate,
            });
        }
    }
    return tasks;
};

// Simulate calendar events (visits/activities)
const generateMockActivities = () => {
    const activities = [];
    for (const member of teamMembers) {
        for (let i = 0; i < 10; i++) {
             const activityDate = new Date(currentMonthStart.getTime() + Math.random() * (today.getTime() - currentMonthStart.getTime()));
            if(member.role === 'admin') { // Assume only sales/admins have visits
                 activities.push({
                    id: `act-${member.id}-${i}`,
                    responsable: member.name,
                    date: activityDate,
                });
            }
        }
    }
    return activities;
};

const mockTasks = generateMockTasks();
const mockActivities = generateMockActivities();
const mockPunctuality = teamMembers.map(member => ({
    name: member.name,
    status: Math.random() > 0.8 ? 'Tarde' : (Math.random() > 0.95 ? 'Falta' : 'Puntual'),
}));
// --- End of Mock Data Simulation ---


type TimeFrame = 'day' | 'week' | 'month';

const PunctualityBadge = ({ status }: { status: string }) => {
    return (
        <Badge variant={status === 'Puntual' ? 'default' : 'destructive'} className={cn(
            'text-white',
            status === 'Puntual' && 'bg-green-500 hover:bg-green-500/80',
            status === 'Tarde' && 'bg-yellow-500 hover:bg-yellow-500/80',
            status === 'Falta' && 'bg-red-500 hover:bg-red-500/80'
        )}>
             {status === 'Puntual' && <CheckCircle className="w-3 h-3 mr-1" />}
             {status === 'Tarde' && <Clock className="w-3 h-3 mr-1" />}
             {status === 'Falta' && <XCircle className="w-3 h-3 mr-1" />}
            {status}
        </Badge>
    );
};

export default function MiProgresoPage() {
    const { user } = useAuth();
    const [timeFrame, setTimeFrame] = useState<TimeFrame>('month');

    const dateRange = useMemo(() => {
        const now = new Date();
        if (timeFrame === 'day') {
            return { start: new Date(now.setHours(0,0,0,0)), end: new Date(now.setHours(23,59,59,999)) };
        }
        if (timeFrame === 'week') {
            return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
        }
        // month
        return { start: startOfMonth(now), end: endOfMonth(now) };
    }, [timeFrame]);

    const teamProgressData = useMemo(() => {
        return teamMembers.map(member => {
            const memberTasks = mockTasks.filter(t => t.ejecutor === member.name);
            const memberActivities = mockActivities.filter(a => a.responsable === member.name);

            const tasksInFrame = memberTasks.filter(t => isWithinInterval(t.completedAt, dateRange));
            const completedTasks = tasksInFrame.filter(t => t.status === 'Completado').length;
            const totalTasks = tasksInFrame.length || 1; // Avoid division by zero
            
            const activitiesInFrame = memberActivities.filter(a => isWithinInterval(a.date, dateRange)).length;

            const punctuality = mockPunctuality.find(p => p.name === member.name)?.status || 'N/A';
            
            // Calculate Performance Score
            const taskScore = (completedTasks / totalTasks) * 100;
            const activityScore = Math.min(activitiesInFrame * 10, 100); // 10 points per activity, max 100
            const performanceScore = Math.round((taskScore * 0.7) + (activityScore * 0.3));

            return {
                name: member.name,
                punctuality: punctuality,
                tasksCompleted: completedTasks,
                totalTasks: totalTasks,
                activities: activitiesInFrame,
                performanceScore: performanceScore,
            };
        });
    }, [dateRange]);

    if (!user) {
        return <div className="text-center text-foreground/70">Cargando datos de usuario...</div>
    }

    const userProgress = teamProgressData.find(member => member.name === user.name);

    return (
    <div>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold font-headline">Mi Progreso</h1>
            <div className="flex items-center gap-2 bg-card p-1 rounded-lg">
                <Button variant={timeFrame === 'day' ? 'secondary' : 'ghost'} onClick={() => setTimeFrame('day')}>Día</Button>
                <Button variant={timeFrame === 'week' ? 'secondary' : 'ghost'} onClick={() => setTimeFrame('week')}>Semana</Button>
                <Button variant={timeFrame === 'month' ? 'secondary' : 'ghost'} onClick={() => setTimeFrame('month')}>Mes</Button>
            </div>
        </div>
      
      {user.role === 'admin' ? (
        <>
            <p className="mt-4 text-foreground/80 mb-8">
                Como administrador, puedes ver un resumen del rendimiento de todo el equipo para el periodo seleccionado: <span className='font-bold text-primary'>{format(dateRange.start, 'd MMM', {locale: es})} - {format(dateRange.end, 'd MMM yyyy', {locale: es})}</span>.
            </p>
            <AnimatedDiv>
                <Card>
                    <CardHeader>
                        <CardTitle>Reporte de Rendimiento del Equipo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Miembro</TableHead>
                                        <TableHead>Puntualidad (Hoy)</TableHead>
                                        <TableHead>Tareas Completadas</TableHead>
                                        <TableHead>Actividades (Visitas)</TableHead>
                                        <TableHead className="text-right">Calificación Rendimiento</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {teamProgressData.map((member) => (
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
                                            <TableCell>{member.activities}</TableCell>
                                            <TableCell className="text-right font-bold">
                                                 <span className={cn(
                                                    member.performanceScore >= 80 && 'text-green-500',
                                                    member.performanceScore >= 60 && member.performanceScore < 80 && 'text-yellow-500',
                                                    member.performanceScore < 60 && 'text-red-500'
                                                 )}>
                                                    {member.performanceScore} / 100
                                                 </span>
                                            </TableCell>
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
                Resumen de tu rendimiento personal para el periodo seleccionado: <span className='font-bold text-primary'>{format(dateRange.start, 'd MMM', {locale: es})} - {format(dateRange.end, 'd MMM yyyy', {locale: es})}</span>.
            </p>
             {userProgress ? (
                <AnimatedDiv>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Rendimiento General</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold ${
                                    userProgress.performanceScore >= 80 ? 'text-green-500' : 
                                    userProgress.performanceScore >= 60 ? 'text-yellow-500' : 'text-red-500'
                                }`}>
                                    {userProgress.performanceScore} / 100
                                </div>
                                <p className="text-xs text-muted-foreground">Calificación de tu progreso.</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tareas Completadas</CardTitle>
                                <Target className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{userProgress.tasksCompleted} / {userProgress.totalTasks}</div>
                                <p className="text-xs text-muted-foreground">Tareas finalizadas en el periodo.</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Actividades</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+{userProgress.activities}</div>
                                <p className="text-xs text-muted-foreground">Citas y grabaciones realizadas.</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Asistencia (Hoy)</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="mt-2">
                                     <PunctualityBadge status={userProgress.punctuality} />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">Tu estado de asistencia de hoy.</p>
                            </CardContent>
                        </Card>
                   </div>
                </AnimatedDiv>
             ) : (
                <div className="text-center text-foreground/70 p-8">No se encontraron datos de progreso para tu usuario.</div>
             )}
        </>
      )}
    </div>
  );
}
