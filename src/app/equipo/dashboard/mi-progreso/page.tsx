

'use client';

import React, { useState, useMemo, useEffect, startTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { DollarSign, TrendingUp, TrendingDown, Building, Briefcase, PiggyBank, Handshake, Landmark } from 'lucide-react';
import { useAuth } from '@/lib/auth-provider';
import { Input } from '@/components/ui/input';
import { getMovimientos } from '../finanzas/_actions';
import { MovimientoDiario, ComoVoyEnMisFinanzas } from '@/lib/db/schema';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getPersonalFinance, updatePersonalFinanceEntry, type PersonalFinanceTransaction } from './_actions';
import { useToast } from '@/hooks/use-toast';
import { format, getMonth, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';

const TransactionModal = ({
    month,
    category,
    initialTransactions,
    onSave,
  }: {
    month: string;
    category: string;
    initialTransactions: PersonalFinanceTransaction[];
    onSave: (month: string, category: string, transactions: PersonalFinanceTransaction[]) => void;
  }) => {
    const [open, setOpen] = useState(false);
    const [transactions, setTransactions] = useState<PersonalFinanceTransaction[]>([]);
  
    useEffect(() => {
      if (open) {
        setTransactions(initialTransactions);
      }
    }, [open, initialTransactions]);
  
    const total = transactions.reduce((acc, t) => acc + (t.tipo === 'INGRESO' ? t.monto : -t.monto), 0);
  
    const handleUpdate = (index: number, field: keyof PersonalFinanceTransaction, value: any) => {
      const newTransactions = [...transactions];
      (newTransactions[index] as any)[field] = value;
      setTransactions(newTransactions);
    };

    const handleSaveChanges = () => {
        onSave(month, category, transactions);
        setOpen(false);
    }
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="w-full h-full text-left p-2 rounded hover:bg-muted transition-colors">
            {total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalle de: {category} - {month}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto pr-2">
            {transactions.map((t, i) => (
              <div key={t.id} className="grid grid-cols-3 gap-2 mb-2">
                <Input
                  value={t.descripcion}
                  onChange={(e) => handleUpdate(i, 'descripcion', e.target.value)}
                  placeholder="Concepto"
                  className="col-span-2"
                />
                <Input
                  type="number"
                  value={t.monto}
                  onChange={(e) => handleUpdate(i, 'monto', parseFloat(e.target.value) || 0)}
                  placeholder="Monto"
                />
              </div>
            ))}
          </div>
          <div className="text-right font-bold text-lg mt-4">Total: {total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</div>
           <Button onClick={handleSaveChanges}>Guardar Cambios</Button>
        </DialogContent>
      </Dialog>
    );
};

const EditableCell = ({ value, onSave }: { value: number | undefined, onSave: (newValue: number) => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value || 0);

    useEffect(() => {
        setCurrentValue(value || 0);
    }, [value])

    const handleBlur = () => {
        setIsEditing(false);
        if (currentValue !== value) {
            onSave(currentValue);
        }
    };
    
    if (isEditing) {
        return (
            <Input 
                type="number"
                value={currentValue}
                onChange={(e) => setCurrentValue(parseFloat(e.target.value) || 0)}
                onBlur={handleBlur}
                onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
                autoFocus
                className="w-full h-8 text-right"
            />
        )
    }

    return (
        <div onClick={() => setIsEditing(true)} className="cursor-pointer w-full text-right p-2 h-8">
            { (value || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
        </div>
    )
}

const PersonalFinanceDashboard = ({ financialSummary, selectedMonth, selectedYear }: { financialSummary: any, selectedMonth: string, selectedYear: number }) => {
    const [personalData, setPersonalData] = useState<ComoVoyEnMisFinanzas[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    
    const fetchData = async () => {
        setIsLoading(true);
        const data = await getPersonalFinance();
        setPersonalData(data);
        setIsLoading(false);
    }
    
    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async (itemToUpdate: PersonalFinanceTransaction) => {
        try {
            await updatePersonalFinanceEntry(itemToUpdate);
            toast({ title: 'Éxito', description: 'Dato actualizado correctamente.' });
            fetchData();
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    }
    
    const handleCellSave = (month: string, category: string, newAmount: number) => {
        const monthIndex = new Date(Date.parse(month +" 1, 2024")).getMonth();
        const year = selectedYear;
        const entryDate = new Date(year, monthIndex, 15);

        const entry: PersonalFinanceTransaction = {
            id: -1, // Will be ignored on insert
            fecha: entryDate.toISOString(),
            tipo: newAmount >= 0 ? 'INGRESO' : 'GASTO',
            descripcion: `${category} - ${month} ${year}`,
            monto: Math.abs(newAmount),
            cuenta: 'Efectivo',
            categoria: category
        };
        handleSave(entry)
    }


    const monthlyData = useMemo(() => {
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const categories = ["Agencia", "Oscar", "Transporte", "Rentas", "Bienes Raices", "Intereses", "ALDO HA GASTADO", "Ganancia"];
        const incomeExpenseCategories = ["Agencia", "Oscar", "Transporte", "Rentas", "Bienes Raices", "Intereses"];

        return monthNames.map((month, monthIndex) => {
            const row: { [key: string]: any } = { month };
            
            categories.forEach(category => {
                const entries = personalData.filter(d => {
                    const entryDate = new Date(d.fecha);
                    return getMonth(entryDate) === monthIndex && entryDate.getFullYear() === selectedYear && d.categoria === category;
                });
                row[category] = entries.reduce((sum, item) => sum + (item.tipo === 'INGRESO' ? item.monto : -item.monto), 0);
            });
            
            const currentMonthName = format(new Date(`${selectedMonth}-01T12:00:00`), 'MMMM', {locale:es});
            
            // Lógica especial para Agencia en Octubre y Noviembre
            if (month.toLowerCase() === 'octubre' && selectedYear === 2024) {
                 row['Agencia'] = 91700;
            } else if (month.toLowerCase() === 'noviembre' && selectedYear === 2024) {
                 row['Agencia'] = financialSummary.profit - 527138;
            } else if (month.toLowerCase() === currentMonthName.toLowerCase()) {
                const isCurrentMonthAfterNov2024 = new Date(selectedYear, monthIndex) >= new Date(2024, 10);
                if(isCurrentMonthAfterNov2024) {
                    row['Agencia'] = financialSummary.profit;
                }
            }
            
            // Lógica para Ganancia
            const existingGananciaEntry = personalData.find(d => {
                 const entryDate = new Date(d.fecha);
                 return getMonth(entryDate) === monthIndex && entryDate.getFullYear() === selectedYear && d.categoria === 'Ganancia'
            });

            if (existingGananciaEntry) {
                row['Ganancia'] = existingGananciaEntry.tipo === 'INGRESO' ? existingGananciaEntry.monto : -existingGananciaEntry.monto;
            } else {
                 row['Ganancia'] = incomeExpenseCategories.reduce((acc, cat) => acc + (row[cat] || 0), 0);
            }

            return row;
        });
    }, [personalData, financialSummary.profit, selectedMonth, selectedYear]);

    const formatCurrency = (value: number | undefined) => {
        if (value === undefined || isNaN(value)) return '$0.00';
        return value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
    }
    
    const totals = useMemo(() => {
        return monthlyData.reduce((acc, row) => {
            Object.keys(row).forEach(key => {
                if (key !== 'month') {
                    acc[key] = (acc[key] || 0) + (row[key] || 0);
                }
            });
            return acc;
        }, {} as {[key: string]: number});
    }, [monthlyData]);

    const averages = Object.keys(totals).reduce((acc, key) => {
        acc[key] = totals[key] / 12;
        return acc;
    }, {} as {[key: string]: number});

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building className="w-5 h-5"/>Resumen Financiero Personal</CardTitle>
                <CardDescription>Consolidado de tus fuentes de ingreso para el año {selectedYear}.</CardDescription>
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
                                <TableHead>Aldo ha gastado</TableHead>
                                <TableHead className="font-bold">Ganancia</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({length: 12}).map((_, i) => <TableRow key={i}><TableCell colSpan={9} className="text-center">Cargando...</TableCell></TableRow>)
                            ) : (
                                monthlyData.map((row) => (
                                    <TableRow key={row.month} className={cn(format(new Date(`${selectedMonth}-01T12:00:00`), 'MMMM', {locale:es}).toLowerCase() === row.month.toLowerCase() && 'bg-muted')}>
                                        <TableCell className="font-medium capitalize">{row.month}</TableCell>
                                        <TableCell className={cn(row.Agencia < 0 ? "text-red-500" : "")}><EditableCell value={row.Agencia} onSave={(v) => handleCellSave(row.month, 'Agencia', v)}/></TableCell>
                                        <TableCell className={cn(row.Oscar < 0 ? "text-red-500" : "")}><EditableCell value={row.Oscar} onSave={(v) => handleCellSave(row.month, 'Oscar', v)}/></TableCell>
                                        <TableCell className={cn(row.Transporte < 0 ? "text-red-500" : "")}><EditableCell value={row.Transporte} onSave={(v) => handleCellSave(row.month, 'Transporte', v)}/></TableCell>
                                        <TableCell className={cn(row.Rentas < 0 ? "text-red-500" : "")}><EditableCell value={row.Rentas} onSave={(v) => handleCellSave(row.month, 'Rentas', v)}/></TableCell>
                                        <TableCell className={cn(row['Bienes Raices'] < 0 ? "text-red-500" : "")}><EditableCell value={row['Bienes Raices']} onSave={(v) => handleCellSave(row.month, 'Bienes Raices', v)}/></TableCell>
                                        <TableCell className={cn(row.Intereses < 0 ? "text-red-500" : "")}><EditableCell value={row.Intereses} onSave={(v) => handleCellSave(row.month, 'Intereses', v)}/></TableCell>
                                        <TableCell className={cn(row['ALDO HA GASTADO'] < 0 ? "text-red-500" : "")}><EditableCell value={row['ALDO HA GASTADO']} onSave={(v) => handleCellSave(row.month, 'ALDO HA GASTADO', v)}/></TableCell>
                                        <TableCell className={cn("font-bold", (row.Ganancia || 0) < 0 ? "text-red-500" : "text-green-500")}><EditableCell value={row.Ganancia} onSave={(v) => handleCellSave(row.month, 'Ganancia', v)}/></TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                         <TableFooter>
                            <TableRow className="font-bold bg-muted/50">
                                <TableCell>Promedio Mensual</TableCell>
                                <TableCell>{formatCurrency(averages.Agencia)}</TableCell>
                                <TableCell>{formatCurrency(averages.Oscar)}</TableCell>
                                <TableCell>{formatCurrency(averages.Transporte)}</TableCell>
                                <TableCell>{formatCurrency(averages.Rentas)}</TableCell>
                                <TableCell>{formatCurrency(averages['Bienes Raices'])}</TableCell>
                                <TableCell>{formatCurrency(averages.Intereses)}</TableCell>
                                <TableCell>{formatCurrency(averages['ALDO HA GASTADO'])}</TableCell>
                                <TableCell className={cn((averages.Ganancia || 0) < 0 ? "text-red-500" : "text-green-500")}>{formatCurrency(averages.Ganancia)}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};


const BalanceSheetDashboard = () => {
    const [assets, setAssets] = useState([
        { name: 'Banamex Inversión', amount: 200053 },
        { name: 'CETES', amount: 213858 },
        { name: 'Banamex', amount: 3556 },
        { name: 'MAW Sant', amount: 308376 },
        { name: 'Santander', amount: 19569 },
        { name: 'Paola', amount: 184170 },
        { name: 'Efectivo', amount: 355000 },
        { name: 'Divisas', amount: 109220 },
      ]);
    const [receivables, setReceivables] = useState([
        { name: 'intenet agustin J', amount: 0 },
        { name: 'Internet mirador', amount: 600 },
        { name: 'FER EXTRA', amount: 44050 },
        { name: 'Trans yo juntado', amount: 108000 },
        { name: 'Tanda 2 me deb', amount: 104000 },
        { name: 'paola', amount: 188985 },
        { name: 'oscar me debe 1', amount: 96958 },
        { name: 'vuelo paola', amount: 17752 },
        { name: 'dani montaña', amount: 4000 },
        { name: 'dani granger', amount: 3200 },
        { name: 'FER TREJO CO', amount: 4875 },
        { name: 'DANI CUYO', amount: 8726 },
    ]);
    const [liabilities, setLiabilities] = useState([
        { name: 'terreno cancun - 25 NOV 24 / (420,2)', amount: 0 },
        { name: 'renta - 26,000 - 8Dani - 11,900 Ar', amount: 0 },
        { name: 'Terreno mama queretaro / Cuesta', amount: 341284 },
        { name: 'Loft departamento depto 1,619,00', amount: 1341264 },
        { name: 'gio le debo', amount: 3100 },
      ]);

    const totalAssets = assets.reduce((sum, asset) => sum + asset.amount, 0);
    const totalReceivable = receivables.reduce((sum, item) => sum + item.amount, 0);
    const totalLiabilities = liabilities.reduce((sum, item) => sum + item.amount, 0);
    const netWorth = totalAssets + totalReceivable - totalLiabilities;
    const formatCurrency = (value: number) => value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

    const BalanceSheetItemModal = ({ items, onUpdate, children, title }: { items: any[], onUpdate: (items: any[]) => void, children: React.ReactNode, title: string }) => {
        const [open, setOpen] = useState(false);
        const [localItems, setLocalItems] = useState<any[]>([]);

        useEffect(() => {
            if(open) {
                setLocalItems(JSON.parse(JSON.stringify(items))); // Deep copy
            }
        }, [open, items]);

        const handleAmountChange = (index: number, newAmount: string) => {
            const updatedItems = [...localItems];
            updatedItems[index].amount = parseFloat(newAmount) || 0;
            setLocalItems(updatedItems);
        }
        
        const handleSave = () => {
            onUpdate(localItems);
            setOpen(false);
        }
        
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent>
                    <DialogHeader><DialogTitle>Editar {title}</DialogTitle></DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
                        {localItems.map((item, index) => (
                            <div key={index} className="grid grid-cols-2 gap-4 items-center">
                                <Label>{item.name}</Label>
                                <Input 
                                    type="number" 
                                    value={item.amount} 
                                    onChange={(e) => handleAmountChange(index, e.target.value)} 
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave}>Guardar Cambios</Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
            <BalanceSheetItemModal items={assets} onUpdate={setAssets} title="Activos Líquidos">
                <Card className="cursor-pointer hover:bg-muted transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><PiggyBank className="w-5 h-5 text-green-500"/>Activos Líquidos</CardTitle>
                        <CardDescription className="text-2xl font-bold text-green-500">{formatCurrency(totalAssets)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                            {assets.map(asset => (
                                <div key={asset.name} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{asset.name}</span>
                                    <span className="font-medium">{formatCurrency(asset.amount)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </BalanceSheetItemModal>
             <BalanceSheetItemModal items={receivables} onUpdate={setReceivables} title="Cuentas por Cobrar">
                <Card className="cursor-pointer hover:bg-muted transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Handshake className="w-5 h-5 text-yellow-500"/>Cuentas por Cobrar</CardTitle>
                        <CardDescription className="text-2xl font-bold text-yellow-500">{formatCurrency(totalReceivable)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                            {receivables.map(item => (
                                <div key={item.name} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{item.name}</span>
                                    <span className={cn("font-medium", item.amount < 0 && "text-red-500")}>{formatCurrency(item.amount)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </BalanceSheetItemModal>
             <BalanceSheetItemModal items={liabilities} onUpdate={setLiabilities} title="Pasivos">
                <Card className="cursor-pointer hover:bg-muted transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Landmark className="w-5 h-5 text-red-500"/>Pasivos</CardTitle>
                        <CardDescription className="text-2xl font-bold text-red-500">{formatCurrency(totalLiabilities)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                            {liabilities.map(item => (
                                <div key={item.name} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{item.name}</span>
                                    <span className="font-medium">{formatCurrency(item.amount)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </BalanceSheetItemModal>
            <Card className="bg-primary/10 border-primary">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5 text-primary"/>Patrimonio Neto</CardTitle>
                    <CardDescription className="text-2xl font-bold text-primary">{formatCurrency(netWorth)}</CardDescription>
                </CardHeader>
                <CardContent>
                     <p className="text-sm text-muted-foreground">Este es tu capital total, calculado como (Activos + Cuentas por Cobrar) - Pasivos.</p>
                </CardContent>
            </Card>
        </div>
    )
}

export default function MiProgresoPage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [movimientos, setMovimientos] = useState<MovimientoDiario[]>([]);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    
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

    const availableYears = [new Date().getFullYear(), new Date().getFullYear() - 1];

    return (
    <div>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold font-headline">{user.role === 'admin' ? '¿Cómo va la Empresa?' : 'Mi Progreso'}</h1>
             {user.role === 'admin' && (
                <div className="flex gap-4">
                    <Select value={monthFilter.substring(5,7)} onValueChange={(month) => setMonthFilter(`${currentYear}-${month}`)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                             {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem key={i} value={(i + 1).toString().padStart(2, '0')}>
                                    {format(new Date(currentYear, i), 'MMMM', { locale: es })}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     <Select value={currentYear.toString()} onValueChange={(year) => setCurrentYear(parseInt(year))}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {availableYears.map(year => (
                                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
      
      {user.role === 'admin' ? (
        <>
             <p className="mt-4 text-foreground/80 mb-8">
                Como administrador, puedes ver un resumen del rendimiento y las finanzas del equipo para el periodo seleccionado.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
            </div>
            
            <PersonalFinanceDashboard financialSummary={financialSummary} selectedMonth={monthFilter} selectedYear={currentYear} />

             <BalanceSheetDashboard />
        </>
      ) : (
        <>
            <p className="mt-4 text-foreground/80 mb-8">
                Esta sección está reservada para el administrador. Como miembro del equipo, puedes acceder a otras áreas del dashboard.
            </p>
        </>
      )}
    </div>
  );
}

