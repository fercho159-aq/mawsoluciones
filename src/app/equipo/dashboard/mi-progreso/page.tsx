

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { teamMembers } from '@/lib/team-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, XCircle, TrendingUp, Target, Calendar, DollarSign, TrendingDown, Building, Briefcase } from 'lucide-react';
import { useAuth } from '@/lib/auth-provider';
import AnimatedDiv from '@/components/animated-div';
import { format, isWithinInterval, startOfMonth, endOfMonth, parseISO, getMonth } from 'date-fns';
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

const personalFinanceData = [
    { month: "Enero", agencia: 95360.00, oscar: 11880.00, transporte: 29000.00, rentas: 0, bienes_raices: 0, intereses: 0 },
    { month: "Febrero", agencia: 186937.00, oscar: 5148.00, transporte: 10381.00, rentas: 10390.00, bienes_raices: 0, intereses: 0 },
    { month: "Marzo", agencia: 111299.00, oscar: 2024.00, transporte: 8907.00, rentas: 1713.00, bienes_raices: 0, intereses: 0 },
    { month: "Abril", agencia: 142469.00, oscar: 6100.00, transporte: 3645.00, rentas: 3989.00, bienes_raices: 0, intereses: 0 },
    { month: "Mayo", agencia: 109715.00, oscar: 3960.00, transporte: 11520.00, rentas: 5159.00, bienes_raices: 0, intereses: 0 },
    { month: "Junio", agencia: 213108.00, oscar: 6500.00, transporte: 11498.00, rentas: 3884.00, bienes_raices: 53382.00, intereses: 0 },
    { month: "Julio", agencia: 212869.00, oscar: 0, transporte: -4731.00, rentas: 5571.00, bienes_raices: 0, intereses: 5806.00 },
    { month: "Agosto", agencia: 82242.00, oscar: 2311.67, transporte: -164166.00, rentas: 1610.00, bienes_raices: -1154053.00, intereses: 1800.00 },
    { month: "Septiembre", agencia: 178814.00, oscar: 0, transporte: 3755.00, rentas: 5267.00, bienes_raices: -843093.00, intereses: -22092.00 },
    { month: "Octubre", agencia: 91700.00, oscar: 5720.00, transporte: 22208.00, rentas: 5100.00, bienes_raices: -6000.00, intereses: 5740.00 }
];

const PersonalFinanceDashboard = ({ agenciaProfit }: { agenciaProfit: number }) => {
    
    const [currentMonthData, setCurrentMonthData] = useState(() => {
        const currentMonthIndex = new Date().getMonth();
        return personalFinanceData.find((_, index) => index === currentMonthIndex) || { month: format(new Date(), 'MMMM', {locale: es}) };
    });

    const combinedData = useMemo(() => {
        const currentMonthIndex = new Date().getMonth();
        return personalFinanceData.map((data, index) => {
            if (index === currentMonthIndex) {
                const total = agenciaProfit + (data.oscar || 0) + (data.transporte || 0) + (data.rentas || 0) + (data.bienes_raices || 0) + (data.intereses || 0);
                return { ...data, agencia: agenciaProfit, ganancia: total };
            }
            const ganancia = data.agencia + data.oscar + data.transporte + data.rentas + data.bienes_raices + data.intereses;
            return { ...data, ganancia };
        });
    }, [agenciaProfit]);
    
    const formatCurrency = (value: number | undefined) => {
        if (value === undefined) return '$0.00';
        return value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
    }

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building className="w-5 h-5"/>Resumen Financiero Personal</CardTitle>
                <CardDescription>Consolidado de tus fuentes de ingreso.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mes</TableHead>
                                <TableHead>Agencia</TableHead>
                                <TableHead>Oscar</TableHead>
                                <TableHead>Transporte</TableHead>
                                <TableHead>Rentas</TableHead>
                                <TableHead>Bienes Raíces</TableHead>
                                <TableHead>Intereses</TableHead>
                                <TableHead className="font-bold">Ganancia</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {combinedData.map((row) => (
                                <TableRow key={row.month}>
                                    <TableCell className="font-medium capitalize">{row.month}</TableCell>
                                    <TableCell className={cn(row.agencia < 0 ? "text-red-500" : "")}>{formatCurrency(row.agencia)}</TableCell>
                                    <TableCell className={cn(row.oscar < 0 ? "text-red-500" : "")}>{formatCurrency(row.oscar)}</TableCell>
                                    <TableCell className={cn(row.transporte < 0 ? "text-red-500" : "")}>{formatCurrency(row.transporte)}</TableCell>
                                    <TableCell className={cn(row.rentas < 0 ? "text-red-500" : "")}>{formatCurrency(row.rentas)}</TableCell>
                                    <TableCell className={cn(row.bienes_raices < 0 ? "text-red-500" : "")}>{formatCurrency(row.bienes_raices)}</TableCell>
                                    <TableCell className={cn(row.intereses < 0 ? "text-red-500" : "")}>{formatCurrency(row.intereses)}</TableCell>
                                    <TableCell className={cn("font-bold", row.ganancia < 0 ? "text-red-500" : "text-green-500")}>{formatCurrency(row.ganancia)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
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

             <PersonalFinanceDashboard agenciaProfit={financialSummary.profit} />
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

    

    