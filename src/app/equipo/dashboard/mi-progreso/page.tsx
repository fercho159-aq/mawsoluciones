
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { teamMembers } from '@/lib/team-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, XCircle, TrendingUp, Target, Calendar, DollarSign, TrendingDown } from 'lucide-react';
import { useAuth } from '@/lib/auth-provider';
import AnimatedDiv from '@/components/animated-div';
import { format, isWithinInterval, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { getMovimientos } from '../finanzas/_actions';
import { MovimientoDiario } from '@/lib/db/schema';


// --- Mock Data Simulation (for non-financial parts) ---
const today = new Date();
const currentMonthStart = startOfMonth(today);

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

const generateMockActivities = () => {
    const activities = [];
    for (const member of teamMembers) {
        for (let i = 0; i < 10; i++) {
             const activityDate = new Date(currentMonthStart.getTime() + Math.random() * (today.getTime() - currentMonthStart.getTime()));
            if(['admin', 'julio', 'alma', 'fernando'].includes(member.role)) {
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
    const [isLoading, setIsLoading] = useState(true);
    const [movimientos, setMovimientos] = useState<MovimientoDiario[]>([]);
    
    const [monthFilter, setMonthFilter] = useState(format(new Date(), 'yyyy-MM'));

     const fetchFinancialData = async () => {
        setIsLoading(true);
        try {
            const movimientosData = await getMovimientos();
            setMovimientos(movimientosData as MovimientoDiario[]);
        } catch (error) {
            console.error("Failed to fetch financial data:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if (user?.role === 'admin') {
            fetchFinancialData();
        } else {
            setIsLoading(false);
        }
    }, [user]);

    const teamProgressData = useMemo(() => {
        if (!monthFilter) return [];
        const start = startOfMonth(parseISO(`${monthFilter}-01`));
        const end = endOfMonth(start);
        
        return teamMembers.map(member => {
            const memberTasks = mockTasks.filter(t => t.ejecutor === member.name);
            const memberActivities = mockActivities.filter(a => a.responsable === member.name);

            const tasksInFrame = memberTasks.filter(t => isWithinInterval(t.completedAt, { start, end }));
            const completedTasks = tasksInFrame.filter(t => t.status === 'Completado').length;
            const totalTasks = tasksInFrame.length || 1;
            
            const activitiesInFrame = memberActivities.filter(a => isWithinInterval(a.date, { start, end })).length;

            const punctuality = mockPunctuality.find(p => p.name === member.name)?.status || 'N/A';
            
            const taskScore = (completedTasks / totalTasks) * 100;
            const activityScore = Math.min(activitiesInFrame * 10, 100);
            const performanceScore = Math.round((taskScore * 0.7) + (activityScore * 0.3));

            return {
                name: member.name,
                punctuality: punctuality,
                tasksCompleted: completedTasks,
                totalTasks: tasksInFrame.length,
                activities: activitiesInFrame,
                performanceScore: performanceScore,
            };
        });
    }, [monthFilter]);

    const financialSummary = useMemo(() => {
        if (!monthFilter) return { totalIncome: 0, totalExpenses: 0, incomeByCategory: {}, expensesByCategory: {}, profit: 0 };
        const start = startOfMonth(parseISO(`${monthFilter}-01`));
        const end = endOfMonth(start);

        const financialsInFrame = movimientos.filter(f => 
            isWithinInterval(new Date(f.fecha), { start, end })
        );
        
        const totalIncome = financialsInFrame.filter(f => f.tipo === 'Ingreso').reduce((sum, f) => sum + f.monto, 0);
        const totalExpenses = financialsInFrame.filter(f => f.tipo === 'Gasto').reduce((sum, f) => sum + f.monto, 0);

        const incomeByCategory = financialsInFrame.filter(f => f.tipo === 'Ingreso').reduce((acc, f) => {
            const category = f.categoria || 'Sin Categoría';
            acc[category] = (acc[category] || 0) + f.monto;
            return acc;
        }, {} as Record<string, number>);

        const expensesByCategory = financialsInFrame.filter(f => f.tipo === 'Gasto').reduce((acc, f) => {
            const category = f.categoria || 'Sin Categoría';
            acc[category] = (acc[category] || 0) + f.monto;
            return acc;
        }, {} as Record<string, number>);
        
        return { totalIncome, totalExpenses, incomeByCategory, expensesByCategory, profit: totalIncome - totalExpenses };
    }, [monthFilter, movimientos]);


    if (isLoading) {
       return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div></div>
    }

    if (!user) {
        return <div className="text-center text-foreground/70">Cargando datos de usuario...</div>
    }

    const userProgress = teamProgressData.find(member => member.name === user.name);

    return (
    <div>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold font-headline">{user.role === 'admin' ? '¿Cómo va la Empresa?' : 'Mi Progreso'}</h1>
             {user.role === 'admin' && (
                <Input
                    type="month"
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="w-[200px]"
                />
            )}
        </div>
      
      {user.role === 'admin' ? (
        <>
             <p className="mt-4 text-foreground/80 mb-8">
                Como administrador, puedes ver un resumen del rendimiento y las finanzas del equipo para el periodo seleccionado.
            </p>

            <AnimatedDiv className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Ingresos</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{financialSummary.totalIncome.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</div>
                        <p className="text-xs text-muted-foreground">Ingresos brutos en el periodo</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Gastos</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{financialSummary.totalExpenses.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</div>
                        <p className="text-xs text-muted-foreground">Gastos totales en el periodo</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Utilidad Neta</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold", financialSummary.profit >= 0 ? 'text-blue-500' : 'text-destructive')}>{financialSummary.profit.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</div>
                        <p className="text-xs text-muted-foreground">Ingresos - Gastos</p>
                    </CardContent>
                </Card>
            </AnimatedDiv>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Desglose de Ingresos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {Object.entries(financialSummary.incomeByCategory).length > 0 ? Object.entries(financialSummary.incomeByCategory).map(([category, amount]) => (
                                <div key={category} className="flex justify-between">
                                    <span className="text-muted-foreground">{category}</span>
                                    <span className="font-medium">{amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>
                                </div>
                            )) : <p className="text-sm text-muted-foreground">No hay ingresos en este periodo.</p>}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Desglose de Gastos</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="space-y-2">
                            {Object.entries(financialSummary.expensesByCategory).length > 0 ? Object.entries(financialSummary.expensesByCategory).map(([category, amount]) => (
                                <div key={category} className="flex justify-between">
                                    <span className="text-muted-foreground">{category}</span>
                                    <span className="font-medium">{amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>
                                </div>
                            )) : <p className="text-sm text-muted-foreground">No hay gastos en este periodo.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <AnimatedDiv>
                <Card>
                    <CardHeader>
                        <CardTitle>Reporte de Rendimiento del Equipo</CardTitle>
                        <CardDescription>Datos basados en el periodo seleccionado.</CardDescription>
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
                                                <span className={cn(member.tasksCompleted === member.totalTasks && member.totalTasks > 0 ? 'text-green-500' : 'text-foreground')}>
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
                Resumen de tu rendimiento personal para el periodo seleccionado.
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
