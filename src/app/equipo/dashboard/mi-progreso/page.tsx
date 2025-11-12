
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { teamMembers } from '@/lib/team-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, XCircle, TrendingUp, Target, Calendar, DollarSign, TrendingDown, Building, Briefcase, PlusCircle, Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-provider';
import AnimatedDiv from '@/components/animated-div';
import { format, isWithinInterval, startOfMonth, endOfMonth, parseISO, getMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { getMovimientos } from '../finanzas/_actions';
import { MovimientoDiario } from '@/lib/db/schema';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


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

interface Transaction {
    id: number;
    type: 'income' | 'expense';
    concept: string;
    amount: number;
}

interface MonthlyData {
    month: string;
    agencia: number;
    oscar: Transaction[];
    transporte: Transaction[];
    rentas: Transaction[];
    bienes_raices: Transaction[];
    intereses: Transaction[];
}

const initialPersonalFinanceData: MonthlyData[] = [
    { month: "Enero", agencia: 95360.00, oscar: [{id: 1, type: 'income', concept: 'Ingreso', amount: 11880}], transporte: [{id: 1, type: 'income', concept: 'Ingreso', amount: 29000}], rentas: [], bienes_raices: [], intereses: [] },
    { month: "Febrero", agencia: 186937.00, oscar: [{id: 1, type: 'income', concept: 'Ingreso', amount: 5148}], transporte: [{id: 1, type: 'income', concept: 'Ingreso', amount: 10381}], rentas: [{id: 1, type: 'income', concept: 'Ingreso', amount: 10390}], bienes_raices: [], intereses: [] },
    { month: "Marzo", agencia: 111299.00, oscar: [{id: 1, type: 'income', concept: 'Ingreso', amount: 2024}], transporte: [{id: 1, type: 'income', concept: 'Ingreso', amount: 8907}], rentas: [{id: 1, type: 'income', concept: 'Ingreso', amount: 1713}], bienes_raices: [], intereses: [] },
    { month: "Abril", agencia: 142469.00, oscar: [{id: 1, type: 'income', concept: 'Ingreso', amount: 6100}], transporte: [{id: 1, type: 'income', concept: 'Ingreso', amount: 3645}], rentas: [{id: 1, type: 'income', concept: 'Ingreso', amount: 3989}], bienes_raices: [], intereses: [] },
    { month: "Mayo", agencia: 109715.00, oscar: [{id: 1, type: 'income', concept: 'Ingreso', amount: 3960}], transporte: [{id: 1, type: 'income', concept: 'Ingreso', amount: 11520}], rentas: [{id: 1, type: 'income', concept: 'Ingreso', amount: 5159}], bienes_raices: [], intereses: [] },
    { month: "Junio", agencia: 213108.00, oscar: [{id: 1, type: 'income', concept: 'Ingreso', amount: 6500}], transporte: [{id: 1, type: 'income', concept: 'Ingreso', amount: 11498}], rentas: [{id: 1, type: 'income', concept: 'Ingreso', amount: 3884}], bienes_raices: [{id: 1, type: 'income', concept: 'Ingreso', amount: 53382}], intereses: [] },
    { month: "Julio", agencia: 212869.00, oscar: [], transporte: [{id: 1, type: 'income', concept: 'Ingreso', amount: -4731}], rentas: [{id: 1, type: 'income', concept: 'Ingreso', amount: 5571}], bienes_raices: [], intereses: [{id: 1, type: 'income', concept: 'Ingreso', amount: 5806}] },
    { month: "Agosto", agencia: 82242.00, oscar: [{id: 1, type: 'income', concept: 'Ingreso', amount: 2311.67}], transporte: [{id: 1, type: 'income', concept: 'Ingreso', amount: -164166}], rentas: [{id: 1, type: 'income', concept: 'Ingreso', amount: 1610}], bienes_raices: [{id: 1, type: 'income', concept: 'Ingreso', amount: -1154053}], intereses: [{id: 1, type: 'income', concept: 'Ingreso', amount: 1800}] },
    { month: "Septiembre", agencia: 178814.00, oscar: [], transporte: [{id: 1, type: 'income', concept: 'Ingreso', amount: 3755}], rentas: [{id: 1, type: 'income', concept: 'Ingreso', amount: 5267}], bienes_raices: [{id: 1, type: 'income', concept: 'Ingreso', amount: -843093}], intereses: [{id: 1, type: 'income', concept: 'Ingreso', amount: -22092}] },
    { month: "Octubre", agencia: 91700.00, oscar: [{id: 1, type: 'income', concept: 'Ingreso', amount: 5720}], transporte: [{id: 1, type: 'income', concept: 'Ingreso', amount: 22208}], rentas: [{id: 1, type: 'income', concept: 'Ingreso', amount: 5100}], bienes_raices: [{id: 1, type: 'income', concept: 'Ingreso', amount: -6000}], intereses: [{id: 1, type: 'income', concept: 'Ingreso', amount: 5740}] }
];

const CategoryDetailModal = ({ categoryName, transactions, onUpdate }: { categoryName: string, transactions: Transaction[], onUpdate: (newTransactions: Transaction[]) => void }) => {
    const [open, setOpen] = useState(false);
    const [type, setType] = useState<'income' | 'expense'>('income');
    const [concept, setConcept] = useState('');
    const [amount, setAmount] = useState('');

    const handleAddTransaction = () => {
        if (!concept || !amount) return;
        const newTransaction: Transaction = {
            id: Date.now(),
            type,
            concept,
            amount: parseFloat(amount),
        };
        onUpdate([...transactions, newTransaction]);
        setConcept('');
        setAmount('');
    };

    const handleDeleteTransaction = (id: number) => {
        onUpdate(transactions.filter(t => t.id !== id));
    };

    const total = transactions.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="w-full h-full text-left p-2 rounded hover:bg-muted transition-colors">
                    {total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detalle de: {categoryName}</DialogTitle>
                </DialogHeader>
                <div className="max-h-[300px] overflow-y-auto pr-2">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Concepto</TableHead>
                                <TableHead className="text-right">Monto</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map(t => (
                                <TableRow key={t.id}>
                                    <TableCell><Badge variant={t.type === 'income' ? 'default' : 'destructive'} className={cn(t.type === 'income' && 'bg-green-500')}>{t.type === 'income' ? 'Ingreso' : 'Egreso'}</Badge></TableCell>
                                    <TableCell>{t.concept}</TableCell>
                                    <TableCell className={cn("text-right", t.type === 'income' ? 'text-green-500' : 'text-red-500')}>{t.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</TableCell>
                                    <TableCell><Button variant="ghost" size="icon" onClick={() => handleDeleteTransaction(t.id)}><Trash2 className="w-4 h-4"/></Button></TableCell>
                                </TableRow>
                            ))}
                             {transactions.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No hay movimientos.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </div>
                 <div className="border-t pt-4 mt-2">
                     <div className="grid grid-cols-5 gap-2 items-end">
                        <div className="col-span-2 space-y-1">
                            <Label>Concepto</Label>
                            <Input value={concept} onChange={e => setConcept(e.target.value)} placeholder="Ej. Renta de local"/>
                        </div>
                        <div className="col-span-1 space-y-1">
                            <Label>Monto</Label>
                            <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"/>
                        </div>
                        <div className="col-span-1 space-y-1">
                            <Label>Tipo</Label>
                            <RadioGroup value={type} onValueChange={(v) => setType(v as any)} className="flex items-center h-10 gap-2">
                                <div className="flex items-center space-x-1"><RadioGroupItem value="income" id={`in-${categoryName}`}/><Label htmlFor={`in-${categoryName}`} className="font-normal">Ingreso</Label></div>
                                <div className="flex items-center space-x-1"><RadioGroupItem value="expense" id={`ex-${categoryName}`}/><Label htmlFor={`ex-${categoryName}`} className="font-normal">Egreso</Label></div>
                            </RadioGroup>
                        </div>
                        <Button onClick={handleAddTransaction}><PlusCircle className="w-4 h-4"/> Añadir</Button>
                    </div>
                </div>
                 <div className="text-right font-bold text-lg mt-4">Total: {total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</div>
            </DialogContent>
        </Dialog>
    )
}

const PersonalFinanceDashboard = ({ agenciaProfit, selectedMonth }: { agenciaProfit: number, selectedMonth: string }) => {
    
    const [personalData, setPersonalData] = useState<MonthlyData[]>(initialPersonalFinanceData);

    const isNovember = format(new Date(selectedMonth), 'MMMM', { locale: es }).toLowerCase() === 'noviembre';
    const novemberAdjustment = -528899;

    const combinedData = useMemo(() => {
        // Ensure data for all 12 months exists
        const yearData = Array.from({ length: 12 }, (_, i) => {
            const monthName = format(new Date(2024, i), 'MMMM', { locale: es });
            const monthData = personalData.find(d => d.month.toLowerCase() === monthName.toLowerCase());
            return monthData || { month: monthName, agencia: 0, oscar: [], transporte: [], rentas: [], bienes_raices: [], intereses: [] };
        });

        return yearData.map(data => {
            const currentMonthName = format(new Date(selectedMonth), 'MMMM', { locale: es });
            let finalAgenciaProfit = data.agencia;
            if (data.month.toLowerCase() === currentMonthName.toLowerCase()) {
                 finalAgenciaProfit = isNovember ? agenciaProfit + novemberAdjustment : agenciaProfit;
            }
            
            const totalOscar = data.oscar.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
            const totalTransporte = data.transporte.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
            const totalRentas = data.rentas.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
            const totalBienesRaices = data.bienes_raices.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
            const totalIntereses = data.intereses.reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
            
            const ganancia = finalAgenciaProfit + totalOscar + totalTransporte + totalRentas + totalBienesRaices + totalIntereses;

            return { ...data, agencia: finalAgenciaProfit, totalOscar, totalTransporte, totalRentas, totalBienesRaices, totalIntereses, ganancia };
        });
    }, [agenciaProfit, selectedMonth, personalData, isNovember]);

    const handleUpdateCategory = (month: string, category: keyof Omit<MonthlyData, 'month' | 'agencia'>, newTransactions: Transaction[]) => {
        setPersonalData(prevData =>
            prevData.map(data =>
                data.month.toLowerCase() === month.toLowerCase()
                    ? { ...data, [category]: newTransactions }
                    : data
            )
        );
    }
    
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
                                <TableRow key={row.month} className={cn(format(new Date(selectedMonth), 'MMMM', {locale:es}).toLowerCase() === row.month.toLowerCase() && 'bg-muted')}>
                                    <TableCell className="font-medium capitalize">{row.month}</TableCell>
                                    <TableCell className={cn(row.agencia < 0 ? "text-red-500" : "")}>{formatCurrency(row.agencia)}</TableCell>
                                    <TableCell className={cn(row.totalOscar < 0 ? "text-red-500" : "")}><CategoryDetailModal categoryName='Oscar' transactions={row.oscar} onUpdate={(t) => handleUpdateCategory(row.month, 'oscar', t)} /></TableCell>
                                    <TableCell className={cn(row.totalTransporte < 0 ? "text-red-500" : "")}><CategoryDetailModal categoryName='Transporte' transactions={row.transporte} onUpdate={(t) => handleUpdateCategory(row.month, 'transporte', t)} /></TableCell>
                                    <TableCell className={cn(row.totalRentas < 0 ? "text-red-500" : "")}><CategoryDetailModal categoryName='Rentas' transactions={row.rentas} onUpdate={(t) => handleUpdateCategory(row.month, 'rentas', t)} /></TableCell>
                                    <TableCell className={cn(row.totalBienesRaices < 0 ? "text-red-500" : "")}><CategoryDetailModal categoryName='Bienes Raíces' transactions={row.bienes_raices} onUpdate={(t) => handleUpdateCategory(row.month, 'bienes_raices', t)} /></TableCell>
                                    <TableCell className={cn(row.totalIntereses < 0 ? "text-red-500" : "")}><CategoryDetailModal categoryName='Intereses' transactions={row.intereses} onUpdate={(t) => handleUpdateCategory(row.month, 'intereses', t)} /></TableCell>
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

             <PersonalFinanceDashboard agenciaProfit={financialSummary.profit} selectedMonth={monthFilter} />
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
