
'use client';

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowRight, PlusCircle, MinusCircle, DollarSign, TrendingUp, TrendingDown, Wallet, Briefcase, Landmark } from 'lucide-react';
import WhatsappIcon from '@/components/icons/whatsapp-icon';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// --- Types ---
type Periodo = "1-31 Oct" | "15 Oct - 15 Nov" | "1-30 Nov";
type MetodoContacto = "Whatsapp" | "Email";
type MovimientoTipo = "Ingreso" | "Gasto";
type Cuenta = "Cuenta Paola" | "Cuenta MAW" | "Otra";
type CategoriaIngreso = "Proyecto" | "Iguala Mensual";
type CategoriaGasto = "Publicidad" | "Sueldos" | "Comisiones" | "Impuestos" | "Personales" | "Otros";


interface FinanzasData {
  cliente: string;
  periodo: Periodo;
  monto: number;
  metodo: MetodoContacto;
  whatsapp: string;
}

interface MovimientoDiario {
  id: string;
  fecha: Date;
  tipo: MovimientoTipo;
  descripcion: string;
  monto: number;
  cuenta: Cuenta | string;
  categoria?: CategoriaIngreso | CategoriaGasto;
  nombreOtro?: string;
}

// --- Mock Data ---
const mockCuentasPorCobrar: FinanzasData[] = [
  { cliente: "Biofert", periodo: "1-31 Oct", monto: 5000, metodo: "Whatsapp", whatsapp: "5215512345678" },
  { cliente: "Medical Tower", periodo: "15 Oct - 15 Nov", monto: 12000, metodo: "Email", whatsapp: "" },
  { cliente: "NIU Coliving", periodo: "1-31 Oct", monto: 8500, metodo: "Whatsapp", whatsapp: "5215587654321" },
  { cliente: "Cenote San Isidro", periodo: "1-30 Nov", monto: 3500, metodo: "Whatsapp", whatsapp: "5215511223344" },
  { cliente: "Saudade do Brazil", periodo: "15 Oct - 15 Nov", monto: 15000, metodo: "Email", whatsapp: "" },
  { cliente: "Polanco Santino", periodo: "1-30 Nov", monto: 9200, metodo: "Whatsapp", whatsapp: "5215555667788" },
];

const mockMovimientosDiarios: MovimientoDiario[] = [];

// --- Components ---
const CuentasPorCobrarTab = () => {
    const [searchFilter, setSearchFilter] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof FinanzasData | null; direction: 'ascending' | 'descending' }>({ key: 'cliente', direction: 'ascending' });

    const filteredData = useMemo(() => {
        return mockCuentasPorCobrar.filter(item => 
            item.cliente.toLowerCase().includes(searchFilter.toLowerCase())
        );
    }, [searchFilter]);

    const sortedData = useMemo(() => {
        let sortableItems = [...filteredData];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key!] < b[sortConfig.key!]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key!] > b[sortConfig.key!]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredData, sortConfig]);

    const requestSort = (key: keyof FinanzasData) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleWhatsappReminder = (item: FinanzasData) => {
        const message = `¡Hola ${item.cliente}! Te recordamos amablemente que el pago de tu servicio para el periodo del ${item.periodo} está pendiente. El monto es de ${item.monto.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}. ¡Gracias!`;
        const whatsappUrl = `https://wa.me/${item.whatsapp}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Control de Pagos Pendientes</CardTitle>
                <CardDescription>Gestiona los pagos pendientes de tus clientes y envía recordatorios.</CardDescription>
            </CardHeader>
            <CardContent>
                <Input 
                    placeholder="Buscar por cliente..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="max-w-xs mb-4"
                />
                <div className="border rounded-lg">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[200px]">
                            <Button variant="ghost" onClick={() => requestSort('cliente')}>
                                Cliente
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead>Periodo</TableHead>
                        <TableHead>
                            <Button variant="ghost" onClick={() => requestSort('monto')}>
                                Monto Adeudado
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead className="text-right">Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{item.cliente}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{item.periodo}</Badge>
                            </TableCell>
                            <TableCell>{item.monto.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</TableCell>
                            <TableCell className="text-right">
                            {item.metodo === 'Whatsapp' ? (
                                <Button variant="whatsapp" size="sm" onClick={() => handleWhatsappReminder(item)}>
                                    <WhatsappIcon className="w-4 h-4 mr-2" />
                                    Recordar Pago
                                </Button>
                            ) : (
                                <Button variant="outline" size="sm">
                                    Enviar Email
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            )}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                    {sortedData.length === 0 && (
                        <div className="text-center p-8 text-foreground/70">
                            No se encontraron registros con los filtros seleccionados.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

interface MovimientoDialogProps {
  tipo: MovimientoTipo;
  onSave: (movimiento: Omit<MovimientoDiario, 'id' | 'fecha' | 'tipo'>) => void;
  children: React.ReactNode;
}

const gastoCategorias: CategoriaGasto[] = ["Publicidad", "Sueldos", "Comisiones", "Impuestos", "Personales", "Otros"];

const MovimientoDialog = ({ tipo, onSave, children }: MovimientoDialogProps) => {
    const [descripcion, setDescripcion] = useState('');
    const [monto, setMonto] = useState('');
    const [cuenta, setCuenta] = useState<Cuenta | ''>('');
    const [otraCuenta, setOtraCuenta] = useState('');
    const [categoriaIngreso, setCategoriaIngreso] = useState<CategoriaIngreso>('Proyecto');
    const [categoriaGasto, setCategoriaGasto] = useState<CategoriaGasto | ''>('');
    const [nombreOtroGasto, setNombreOtroGasto] = useState('');
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const handleSave = () => {
        if (!descripcion || !monto || !cuenta) {
            toast({ title: "Error", description: "Todos los campos son obligatorios.", variant: "destructive" });
            return;
        }

        const datosMovimiento: Omit<MovimientoDiario, 'id' | 'fecha' | 'tipo'> = {
            descripcion,
            monto: parseFloat(monto),
            cuenta: cuenta === 'Otra' ? otraCuenta : cuenta,
        };

        if (tipo === 'Ingreso') {
            datosMovimiento.categoria = categoriaIngreso;
        } else {
            if (!categoriaGasto) {
                toast({ title: "Error", description: "Debes seleccionar una categoría de gasto.", variant: "destructive" });
                return;
            }
            datosMovimiento.categoria = categoriaGasto;
            if (['Personales', 'Otros'].includes(categoriaGasto) && !nombreOtroGasto) {
                toast({ title: "Error", description: "Debes especificar el nombre para esta categoría.", variant: "destructive" });
                return;
            }
            if (['Personales', 'Otros'].includes(categoriaGasto)) {
                datosMovimiento.nombreOtro = nombreOtroGasto;
            }
        }
        
        onSave(datosMovimiento);

        // Reset form
        setDescripcion('');
        setMonto('');
        setCuenta('');
        setOtraCuenta('');
        setCategoriaIngreso('Proyecto');
        setCategoriaGasto('');
        setNombreOtroGasto('');
        setOpen(false);
        toast({ title: "Éxito", description: `${tipo} registrado correctamente.` });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Registrar {tipo}</DialogTitle>
                    <DialogDescription>Añade un nuevo {tipo.toLowerCase()} al registro diario.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Input id="descripcion" value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder={`Ej. Pago cliente X / Compra de software`} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="monto">Monto (MXN)</Label>
                        <Input id="monto" type="number" value={monto} onChange={e => setMonto(e.target.value)} placeholder="Ej. 5000" />
                    </div>

                    {tipo === 'Ingreso' ? (
                        <div className="space-y-2">
                            <Label>Tipo de Ingreso</Label>
                            <RadioGroup value={categoriaIngreso} onValueChange={(value) => setCategoriaIngreso(value as CategoriaIngreso)} className='flex gap-4'>
                               <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Proyecto" id="r-proyecto" />
                                    <Label htmlFor="r-proyecto" className="font-normal">Proyecto</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Iguala Mensual" id="r-iguala" />
                                    <Label htmlFor="r-iguala" className="font-normal">Iguala Mensual</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Label htmlFor="categoria-gasto">Categoría de Gasto</Label>
                            <Select value={categoriaGasto} onValueChange={(value) => setCategoriaGasto(value as CategoriaGasto)}>
                                <SelectTrigger id="categoria-gasto">
                                    <SelectValue placeholder="Seleccionar categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {gastoCategorias.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    
                    {(categoriaGasto === 'Personales' || categoriaGasto === 'Otros') && (
                        <div className="space-y-2">
                            <Label htmlFor="nombre-otro-gasto">Nombre Específico</Label>
                            <Input id="nombre-otro-gasto" value={nombreOtroGasto} onChange={e => setNombreOtroGasto(e.target.value)} placeholder="Ej. Fany, Compra de café" />
                        </div>
                    )}


                    <div className="space-y-2">
                        <Label htmlFor="cuenta">Cuenta</Label>
                        <Select value={cuenta} onValueChange={(value) => setCuenta(value as Cuenta)}>
                            <SelectTrigger id="cuenta">
                                <SelectValue placeholder={`Seleccionar cuenta de ${tipo === 'Ingreso' ? 'destino' : 'origen'}`} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cuenta Paola">Cuenta Paola</SelectItem>
                                <SelectItem value="Cuenta MAW">Cuenta MAW</SelectItem>
                                <SelectItem value="Otra">Otra</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {cuenta === 'Otra' && (
                         <div className="space-y-2">
                            <Label htmlFor="otra-cuenta">Nombre de la otra cuenta</Label>
                            <Input id="otra-cuenta" value={otraCuenta} onChange={e => setOtraCuenta(e.target.value)} placeholder="Ej. Fer, Alma, etc."/>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar {tipo}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const TablaDiariaTab = ({ movimientos, onAddMovimiento }: { movimientos: MovimientoDiario[], onAddMovimiento: (mov: Omit<MovimientoDiario, 'id'|'fecha'>) => void }) => {
    
    const [selectedMonth, setSelectedMonth] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));

    const monthOptions = useMemo(() => {
        const uniqueMonths = new Set(
            movimientos.map(mov => format(startOfMonth(mov.fecha), 'yyyy-MM-dd'))
        );
        // Ensure current month is always an option
        const currentMonthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
        if (!uniqueMonths.has(currentMonthStart)) {
            uniqueMonths.add(currentMonthStart);
        }
    
        return Array.from(uniqueMonths).sort((a, b) => b.localeCompare(a));
    }, [movimientos]);

    const monthlyData = useMemo(() => {
        const start = parseISO(selectedMonth);
        const end = endOfMonth(start);
        return movimientos.filter(mov => isWithinInterval(mov.fecha, { start, end }));
    }, [movimientos, selectedMonth]);

    const accountSummary = useMemo(() => {
        const initialBalancePaola = 188864;
        const initialBalanceMaw = 305624;

        const monthlyTotals = monthlyData.reduce((acc, mov) => {
            const amount = mov.monto;
            if (mov.tipo === 'Ingreso') {
                acc.totalIngresos += amount;
                if (!acc.ingresosPorCuenta[mov.cuenta]) {
                    acc.ingresosPorCuenta[mov.cuenta] = 0;
                }
                acc.ingresosPorCuenta[mov.cuenta] += amount;
            } else { // Gasto
                acc.totalGastos += amount;
            }
            return acc;
        }, {
            totalIngresos: 0,
            totalGastos: 0,
            ingresosPorCuenta: {} as Record<string, number>
        });

        const totalPaola = initialBalancePaola + (monthlyTotals.ingresosPorCuenta['Cuenta Paola'] || 0);
        const totalMaw = initialBalanceMaw + (monthlyTotals.ingresosPorCuenta['Cuenta MAW'] || 0);
        const totalOtros = Object.entries(monthlyTotals.ingresosPorCuenta)
            .filter(([key]) => key !== 'Cuenta MAW' && key !== 'Cuenta Paola')
            .reduce((sum, [, val]) => sum + val, 0);

        const balanceFinal = (totalPaola + totalMaw + totalOtros) - monthlyTotals.totalGastos;


        return { 
            totalPaola,
            totalMaw,
            totalOtros,
            totalGastos: monthlyTotals.totalGastos,
            totalIngresos: monthlyTotals.totalIngresos + initialBalanceMaw + initialBalancePaola,
            balance: balanceFinal
        };
    }, [monthlyData]);


    return (
        <div className='space-y-4'>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{accountSummary.totalIngresos.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</div>
                        <p className="text-xs text-muted-foreground">Saldo inicial + ingresos del mes</p>
                        <hr className="my-2" />
                        <div className="text-sm space-y-1">
                            <p className='flex justify-between'><span>Cuenta MAW:</span> <strong>{accountSummary.totalMaw.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</strong></p>
                            <p className='flex justify-between'><span>Cuenta Paola:</span> <strong>{accountSummary.totalPaola.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</strong></p>
                            <p className='flex justify-between'><span>Otras Cuentas:</span> <strong>{accountSummary.totalOtros.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</strong></p>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
                        <TrendingDown className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{accountSummary.totalGastos.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</div>
                         <p className="text-xs text-muted-foreground">Gastos del mes seleccionado</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Balance Neto Mensual</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold", accountSummary.balance >= 0 ? 'text-blue-500' : 'text-destructive')}>
                            {accountSummary.balance.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                        </div>
                         <p className="text-xs text-muted-foreground">Ingresos Totales - Gastos Totales</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                             <CardTitle>Movimientos de {format(parseISO(selectedMonth), 'MMMM yyyy', { locale: es })}</CardTitle>
                             <CardDescription>Registro de todos los ingresos y gastos del mes.</CardDescription>
                        </div>
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="Seleccionar mes" />
                            </SelectTrigger>
                            <SelectContent>
                                {monthOptions.map(month => (
                                    <SelectItem key={month} value={month}>
                                        {format(parseISO(month), 'MMMM yyyy', { locale: es })}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Descripción</TableHead>
                                    <TableHead>Categoría / Detalle</TableHead>
                                    <TableHead>Cuenta</TableHead>
                                    <TableHead className="text-right">Monto</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {monthlyData.map(mov => (
                                    <TableRow key={mov.id}>
                                        <TableCell>{format(mov.fecha, 'dd MMM yyyy, HH:mm', { locale: es })}</TableCell>
                                        <TableCell>
                                            <Badge variant={mov.tipo === 'Ingreso' ? 'default' : 'destructive'} className={cn(
                                                mov.tipo === 'Ingreso' && 'bg-green-500 hover:bg-green-500/80'
                                            )}>
                                                {mov.tipo === 'Ingreso' ? <TrendingUp className="w-4 h-4 mr-1"/> : <TrendingDown className="w-4 h-4 mr-1"/>}
                                                {mov.tipo}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">{mov.descripcion}</TableCell>
                                        <TableCell>{mov.categoria}{mov.nombreOtro ? ` (${mov.nombreOtro})` : ''}</TableCell>
                                        <TableCell>{mov.cuenta}</TableCell>
                                        <TableCell className={cn("text-right font-bold", mov.tipo === 'Ingreso' ? 'text-green-500' : 'text-destructive')}>
                                            {mov.monto.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {monthlyData.length === 0 && (
                            <div className="text-center p-8 text-foreground/70">
                                No hay movimientos registrados este mes.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function FinanzasPage() {
    const [movimientos, setMovimientos] = useState<MovimientoDiario[]>(mockMovimientosDiarios);
    const [activeTab, setActiveTab] = useState("cuentas-por-cobrar");
    
    const handleAddMovimiento = (nuevoMovimiento: Omit<MovimientoDiario, 'id' | 'fecha'>) => {
        const fullMovimiento: MovimientoDiario = {
            id: `mov-${Date.now()}`,
            ...nuevoMovimiento,
            fecha: new Date(),
        };
        setMovimientos(prev => [fullMovimiento, ...prev]);
    };
    
  return (
    <div>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold font-headline">{activeTab === 'cuentas-por-cobrar' ? 'Gestión de Cobranza' : 'Control Financiero Mensual'}</h1>
            {activeTab === 'tabla-diaria' && (
                <div className="flex gap-2">
                    <MovimientoDialog tipo="Ingreso" onSave={(data) => handleAddMovimiento({ ...data, tipo: 'Ingreso' })}>
                        <Button>
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Registrar Ingreso
                        </Button>
                    </MovimientoDialog>
                    <MovimientoDialog tipo="Gasto" onSave={(data) => handleAddMovimiento({ ...data, tipo: 'Gasto' })}>
                        <Button variant="destructive">
                            <MinusCircle className="w-4 h-4 mr-2" />
                            Registrar Gasto
                        </Button>
                    </MovimientoDialog>
                </div>
            )}
        </div>
      
        <Tabs defaultValue="cuentas-por-cobrar" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cuentas-por-cobrar">Cuentas por Cobrar</TabsTrigger>
                <TabsTrigger value="tabla-diaria">Tabla Diaria</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cuentas-por-cobrar" className="mt-4">
               <CuentasPorCobrarTab />
            </TabsContent>

            <TabsContent value="tabla-diaria" className="mt-4">
                <TablaDiariaTab movimientos={movimientos} onAddMovimiento={handleAddMovimiento} />
            </TabsContent>
        </Tabs>
    </div>
  );
}
