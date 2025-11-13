
'use client';

import React, { useState, useMemo, useEffect, startTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { DollarSign, Building } from 'lucide-react';
import { useAuth } from '@/lib/auth-provider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getPersonalFinance, updatePersonalFinanceEntry, type PersonalFinanceTransaction } from './_actions';
import { ComoVoyEnMisFinanzas } from '@/lib/db/schema';
import { useToast } from '@/hooks/use-toast';
import { getMonth, getYear } from 'date-fns';

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
                className="w-full h-8 text-right bg-transparent border-primary"
            />
        )
    }

    return (
        <div onClick={() => setIsEditing(true)} className="cursor-pointer w-full text-right p-2 h-8 rounded-md hover:bg-muted/50">
            { (value || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
        </div>
    )
}

const PersonalFinanceDashboard = ({ personalData, selectedYear, onRefresh }: { personalData: ComoVoyEnMisFinanzas[], selectedYear: number, onRefresh: () => void }) => {
    const { toast } = useToast();
    
    const handleCellSave = async (month: string, category: string, newAmount: number) => {
        const monthNames: Record<string, number> = { "enero": 0, "febrero": 1, "marzo": 2, "abril": 3, "mayo": 4, "junio": 5, "julio": 6, "agosto": 7, "septiembre": 8, "octubre": 9, "noviembre": 10, "diciembre": 11 };
        const monthIndex = monthNames[month.toLowerCase() as keyof typeof monthNames];
        const year = selectedYear;
        
        if (monthIndex === undefined) {
            toast({ title: 'Error', description: `Mes inválido: ${month}`, variant: 'destructive' });
            return;
        }

        const entryDate = new Date(year, monthIndex, 15);

        const entry: PersonalFinanceTransaction = {
            id: -1,
            fecha: entryDate.toISOString(),
            tipo: 'INGRESO',
            descripcion: `${category} - ${month} ${year}`,
            monto: newAmount,
            cuenta: 'Efectivo',
            categoria: category
        };
        
        try {
            await updatePersonalFinanceEntry(entry);
            toast({ title: 'Éxito', description: 'Dato actualizado correctamente.' });
            onRefresh();
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    }

    const monthlyData = useMemo(() => {
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const incomeCategories = ["Agencia", "Oscar", "Transporte", "Rentas", "Bienes Raices", "Intereses", "Ganancia"];

        return monthNames.map((month, monthIndex) => {
            const row: { [key: string]: any } = { month };
            
            incomeCategories.forEach(category => {
                 const entries = personalData.filter(d => {
                    const entryDate = new Date(d.fecha);
                    const categoryMatch = d.categoria?.toLowerCase() === category.toLowerCase();
                    return getMonth(entryDate) === monthIndex && getYear(entryDate) === selectedYear && categoryMatch;
                });
                const totalAmount = entries.reduce((sum, item) => sum + (item.tipo.toUpperCase() === 'GASTO' ? -item.monto : item.monto), 0);
                row[category] = totalAmount;
            });
            
            if (row['Ganancia'] === 0 || !row['Ganancia']) {
                row['Ganancia'] = incomeCategories
                    .filter(cat => cat !== 'Ganancia')
                    .reduce((sum, cat) => sum + (row[cat] || 0), 0);
            }
            
            return row;
        });
    }, [personalData, selectedYear]);

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
    
    const averages = useMemo(() => {
        const avg: { [key: string]: number } = {};
        const monthsWithData = monthlyData.filter((row, index) => {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            return selectedYear < currentYear || (selectedYear === currentYear && index <= currentMonth);
        }).length || 1;
        
        Object.keys(totals).forEach(key => {
            avg[key] = totals[key] / monthsWithData;
        });
        return avg;
    }, [totals, monthlyData, selectedYear]);

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
                                {["Agencia", "Oscar", "Transporte", "Rentas", "Bienes Raices", "Intereses"].map(cat => <TableHead key={cat}>{cat}</TableHead>)}
                                <TableHead className="font-bold text-right">Ganancia</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {monthlyData.map((row) => (
                                <TableRow key={row.month} className="h-12">
                                    <TableCell className="font-medium capitalize">{row.month}</TableCell>
                                    {["Agencia", "Oscar", "Transporte", "Rentas", "Bienes Raices", "Intereses"].map(cat => (
                                        <TableCell key={cat}><EditableCell value={row[cat]} onSave={(v) => handleCellSave(row.month, cat, v)}/></TableCell>
                                    ))}
                                    <TableCell className={cn("font-bold", (row.Ganancia || 0) < 0 ? "text-red-500" : "text-green-500")}><EditableCell value={row.Ganancia} onSave={(v) => handleCellSave(row.month, 'Ganancia', v)}/></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                         <TableFooter>
                            <TableRow className="font-bold bg-muted/50 text-base">
                                <TableCell>Total Anual</TableCell>
                                {["Agencia", "Oscar", "Transporte", "Rentas", "Bienes Raices", "Intereses"].map(cat => (
                                     <TableCell key={`total-${cat}`} className="text-right">{totals[cat]?.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</TableCell>
                                ))}
                                <TableCell className={cn("text-right", (totals.Ganancia || 0) < 0 ? "text-red-500" : "text-green-500")}>
                                  {totals.Ganancia?.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                                </TableCell>
                            </TableRow>
                             <TableRow className="font-semibold bg-muted/20 text-sm">
                                <TableCell>Promedio Mensual</TableCell>
                                 {["Agencia", "Oscar", "Transporte", "Rentas", "Bienes Raices", "Intereses"].map(cat => (
                                     <TableCell key={`avg-${cat}`} className="text-right text-muted-foreground">{averages[cat]?.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</TableCell>
                                 ))}
                                <TableCell className={cn("text-right text-muted-foreground", (averages.Ganancia || 0) < 0 ? "text-red-500/80" : "")}>
                                  {averages.Ganancia?.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};


export default function MiProgresoPage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [personalData, setPersonalData] = useState<ComoVoyEnMisFinanzas[]>([]);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    
    const fetchPersonalData = async () => {
        setIsLoading(true);
        try {
            const data = await getPersonalFinance();
            setPersonalData(data as ComoVoyEnMisFinanzas[]);
        } catch (error) {
            console.error("Failed to fetch personal finance data:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchPersonalData();
    }, []);

    if (isLoading) {
       return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div></div>
    }

    if (!user) {
        return <div className="text-center text-foreground/70">Cargando datos de usuario...</div>
    }

    const availableYears = Array.from(new Set([new Date().getFullYear(), ...personalData.map(d => getYear(new Date(d.fecha)))])).sort((a,b) => b-a);

    return (
    <div>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold font-headline">{user.role === 'admin' ? '¿Cómo va la Empresa?' : 'Mi Progreso'}</h1>
             {user.role === 'admin' && (
                <div className="flex gap-4">
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
            <PersonalFinanceDashboard personalData={personalData} selectedYear={currentYear} onRefresh={fetchPersonalData} />
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

