
'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
import { ArrowUpDown, ArrowRight, PlusCircle, MinusCircle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import WhatsappIcon from '@/components/icons/whatsapp-icon';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format, startOfMonth, endOfMonth, isWithinInterval, parse, addMonths, getDaysInMonth } from 'date-fns';
import { es } from 'date-fns/locale';

// --- Types ---
type Periodo = "15 Oct - 15 Nov" | "15 Nov - 15 Dic";
type MetodoContacto = "Whatsapp" | "Email";
type MovimientoTipo = "Ingreso" | "Gasto";
type CategoriaIngreso = "Proyecto" | "Iguala Mensual" | "Ads";
type CategoriaGasto = "Publicidad" | "Sueldos" | "Comisiones" | "Impuestos" | "Personales" | "Otros" | "Renta";
type Cuenta = "Cuenta Paola" | "Cuenta MAW" | "Cuenta Aldo";

interface CuentasPorCobrar {
  id: string;
  cliente: string;
  periodo: Periodo;
  monto: number;
  metodo: MetodoContacto;
  whatsapp: string;
  tipo: CategoriaIngreso;
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

// --- Initial Data ---
const initialCuentasPorCobrar: CuentasPorCobrar[] = [
  { id: 'cpc1', cliente: "Bateiras", periodo: "15 Nov - 15 Dic", monto: 3944, metodo: "Whatsapp", whatsapp: "5215512345678", tipo: "Ads" },
];

const mockMovimientosDiarios: MovimientoDiario[] = [
    // Ingreso
    { id: 'mov1', fecha: new Date('2024-11-04T10:00:00'), tipo: 'Ingreso', descripcion: 'Pago cliente Bateiras', monto: 3944, cuenta: 'Cuenta MAW', categoria: 'Ads' },
    // Gastos Aldo
    { id: 'mov2', fecha: new Date('2024-11-01T09:00:00'), tipo: 'Gasto', descripcion: 'Pago Dani', monto: 9000, cuenta: 'Cuenta Aldo', categoria: 'Sueldos' },
    { id: 'mov3', fecha: new Date('2024-11-01T09:01:00'), tipo: 'Gasto', descripcion: 'Pago Didi Den', monto: 9900, cuenta: 'Cuenta Aldo', categoria: 'Sueldos' },
    { id: 'mov4', fecha: new Date('2024-11-01T09:02:00'), tipo: 'Gasto', descripcion: 'Renta Abajo', monto: 4500, cuenta: 'Cuenta Aldo', categoria: 'Renta' },
    // Gastos MAW
    { id: 'mov5', fecha: new Date('2024-11-01T10:00:00'), tipo: 'Gasto', descripcion: 'Paypal google', monto: 779, cuenta: 'Cuenta MAW', categoria: 'Publicidad' },
    { id: 'mov6', fecha: new Date('2024-11-01T10:01:00'), tipo: 'Gasto', descripcion: 'Paypal facebook', monto: 1188, cuenta: 'Cuenta MAW', categoria: 'Publicidad' },
    { id: 'mov7', fecha: new Date('2024-11-01T10:02:00'), tipo: 'Gasto', descripcion: 'Paypal facebook', monto: 1000, cuenta: 'Cuenta MAW', categoria: 'Publicidad' },
    { id: 'mov8', fecha: new Date('2024-11-01T10:03:00'), tipo: 'Gasto', descripcion: 'Paypal shopify', monto: 370, cuenta: 'Cuenta MAW', categoria: 'Otros' },
    { id: 'mov9', fecha: new Date('2024-11-01T10:04:00'), tipo: 'Gasto', descripcion: 'Paypal facebook', monto: 1141, cuenta: 'Cuenta MAW', categoria: 'Publicidad' },
    { id: 'mov10', fecha: new Date('2024-11-01T10:05:00'), tipo: 'Gasto', descripcion: 'Encuadre por centavos', monto: 2, cuenta: 'Cuenta MAW', categoria: 'Otros' },
    { id: 'mov11', fecha: new Date('2024-11-03T11:00:00'), tipo: 'Gasto', descripcion: 'Pago Kari', monto: 500, cuenta: 'Cuenta MAW', categoria: 'Otros' },
    { id: 'mov12', fecha: new Date('2024-11-03T11:01:00'), tipo: 'Gasto', descripcion: 'Paypal facebook', monto: 1303, cuenta: 'Cuenta MAW', categoria: 'Publicidad' },
    { id: 'mov13', fecha: new Date('2024-11-05T12:00:00'), tipo: 'Gasto', descripcion: 'Tiktok MAW', monto: 4640, cuenta: 'Cuenta MAW', categoria: 'Publicidad' },
];

// --- Components ---
const CuentasPorCobrarTab = ({ data: cuentasPorCobrar }: { data: CuentasPorCobrar[] }) => {
    const [searchFilter, setSearchFilter] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof CuentasPorCobrar | null; direction: 'ascending' | 'descending' }>({ key: 'cliente', direction: 'ascending' });

    const filteredData = useMemo(() => {
        return cuentasPorCobrar.filter(item =>
            item.cliente.toLowerCase().includes(searchFilter.toLowerCase())
        );
    }, [cuentasPorCobrar, searchFilter]);

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

    const requestSort = (key: keyof CuentasPorCobrar) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleWhatsappReminder = (item: CuentasPorCobrar) => {
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
                        <TableHead>Monto Adeudado</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.cliente}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{item.periodo}</Badge>
                            </TableCell>
                            <TableCell>{item.monto.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</TableCell>
                            <TableCell>
                                <Badge variant={item.tipo === 'Iguala Mensual' ? 'secondary' : 'default'}>{item.tipo}</Badge>
                            </TableCell>
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

const RegistrarIngresoDialog = ({ cuentasPorCobrar, onSave, children }: { cuentasPorCobrar: CuentasPorCobrar[], onSave: (pago: any) => void, children: React.ReactNode }) => {
    const [selectedCpcId, setSelectedCpcId] = useState<string>('');
    const [cuentaDestino, setCuentaDestino] = useState<Cuenta | ''>('');
    const [otraCuenta, setOtraCuenta] = useState('');
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const selectedCpc = useMemo(() => cuentasPorCobrar.find(c => c.id === selectedCpcId), [selectedCpcId, cuentasPorCobrar]);

    const handleSave = () => {
        if (!selectedCpc || !cuentaDestino) {
            toast({ title: "Error", description: "Debes seleccionar un cliente y una cuenta de destino.", variant: "destructive" });
            return;
        }
        
        if (cuentaDestino === 'Otra' && !otraCuenta) {
            toast({ title: "Error", description: "Debes especificar el nombre de la otra cuenta.", variant: "destructive" });
            return;
        }

        const pago = {
            cpc: selectedCpc,
            cuenta: cuentaDestino === 'Otra' ? otraCuenta : cuentaDestino,
        };
        
        onSave(pago);
        setOpen(false);
        toast({ title: "Éxito", description: `Ingreso de ${selectedCpc.cliente} registrado correctamente.` });
        
        // Reset form
        setSelectedCpcId('');
        setCuentaDestino('');
        setOtraCuenta('');
    };

    return (
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Registrar Ingreso de Cliente</DialogTitle>
                    <DialogDescription>Selecciona el pago pendiente que quieres registrar.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="cliente-cpc">Cliente</Label>
                        <Select value={selectedCpcId} onValueChange={setSelectedCpcId}>
                            <SelectTrigger id="cliente-cpc">
                                <SelectValue placeholder="Seleccionar cliente pendiente" />
                            </SelectTrigger>
                            <SelectContent>
                                {cuentasPorCobrar.map(cpc => (
                                    <SelectItem key={cpc.id} value={cpc.id}>{cpc.cliente} - {cpc.periodo}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedCpc && (
                        <Card className="bg-muted p-4">
                            <p><strong>Monto:</strong> {selectedCpc.monto.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                            <p><strong>Periodo:</strong> {selectedCpc.periodo}</p>
                            <p><strong>Tipo:</strong> {selectedCpc.tipo}</p>
                        </Card>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="cuenta-ingreso">Cuenta de Destino</Label>
                        <Select value={cuentaDestino} onValueChange={(value) => setCuentaDestino(value as Cuenta)}>
                            <SelectTrigger id="cuenta-ingreso">
                                <SelectValue placeholder="Seleccionar cuenta" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cuenta Paola">Cuenta Paola</SelectItem>
                                <SelectItem value="Cuenta MAW">Cuenta MAW</SelectItem>
                                <SelectItem value="Cuenta Aldo">Cuenta Aldo</SelectItem>
                                <SelectItem value="Otra">Otra</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     {cuentaDestino === 'Otra' && (
                         <div className="space-y-2">
                            <Label htmlFor="otra-cuenta-ingreso">Nombre de la otra cuenta</Label>
                            <Input id="otra-cuenta-ingreso" value={otraCuenta} onChange={e => setOtraCuenta(e.target.value)} placeholder="Ej. Fer, Alma, etc."/>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={!selectedCpc || !cuentaDestino}>Registrar Pago</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const RegistrarGastoDialog = ({ onSave, children }: { onSave: (gasto: Omit<MovimientoDiario, 'id' | 'fecha' | 'tipo'>) => void, children: React.ReactNode }) => {
    const [descripcion, setDescripcion] = useState('');
    const [monto, setMonto] = useState('');
    const [cuenta, setCuenta] = useState<Cuenta | ''>('');
    const [otraCuenta, setOtraCuenta] = useState('');
    const [categoriaGasto, setCategoriaGasto] = useState<CategoriaGasto | ''>('');
    const [nombreOtro, setNombreOtro] = useState('');
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const gastoCategorias: CategoriaGasto[] = ["Publicidad", "Sueldos", "Comisiones", "Impuestos", "Personales", "Renta", "Otros"];

    const handleSave = () => {
         if (!descripcion || !monto || !cuenta || !categoriaGasto) {
            toast({ title: "Error", description: "Todos los campos son obligatorios.", variant: "destructive" });
            return;
        }

        const datosGasto: Omit<MovimientoDiario, 'id' | 'fecha' | 'tipo'> = {
            descripcion,
            monto: parseFloat(monto),
            cuenta: cuenta === 'Otra' ? otraCuenta : cuenta,
            categoria: categoriaGasto,
        };

        if (['Personales', 'Otros'].includes(categoriaGasto) && !nombreOtro) {
             toast({ title: "Error", description: "Debes especificar el nombre para esta categoría.", variant: "destructive" });
             return;
        }
        if (['Personales', 'Otros'].includes(categoriaGasto)) {
            datosGasto.nombreOtro = nombreOtro;
        }
        
        onSave(datosGasto);
        setOpen(false);
        toast({ title: "Éxito", description: `Gasto registrado correctamente.` });
        
        // Reset
        setDescripcion('');
        setMonto('');
        setCuenta('');
        setOtraCuenta('');
        setCategoriaGasto('');
        setNombreOtro('');
    };

    return (
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Registrar Gasto</DialogTitle>
                    <DialogDescription>Añade un nuevo gasto al registro diario.</DialogDescription>
                </DialogHeader>
                 <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="desc-gasto">Descripción</Label>
                        <Input id="desc-gasto" value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder={`Ej. Pago de software`} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="monto-gasto">Monto (MXN)</Label>
                        <Input id="monto-gasto" type="number" value={monto} onChange={e => setMonto(e.target.value)} placeholder="Ej. 500" />
                    </div>
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
                    {(categoriaGasto === 'Personales' || categoriaGasto === 'Otros') && (
                        <div className="space-y-2">
                            <Label htmlFor="nombre-otro-gasto">Nombre Específico</Label>
                            <Input id="nombre-otro-gasto" value={nombreOtro} onChange={e => setNombreOtro(e.target.value)} placeholder="Ej. Fany, Compra de café" />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="cuenta-gasto">Cuenta de Origen</Label>
                        <Select value={cuenta} onValueChange={(value) => setCuenta(value as Cuenta)}>
                            <SelectTrigger id="cuenta-gasto">
                                <SelectValue placeholder={`Seleccionar cuenta`} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Cuenta Paola">Cuenta Paola</SelectItem>
                                <SelectItem value="Cuenta MAW">Cuenta MAW</SelectItem>
                                <SelectItem value="Cuenta Aldo">Cuenta Aldo</SelectItem>
                                <SelectItem value="Otra">Otra</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {cuenta === 'Otra' && (
                         <div className="space-y-2">
                            <Label htmlFor="otra-cuenta-gasto">Nombre de la otra cuenta</Label>
                            <Input id="otra-cuenta-gasto" value={otraCuenta} onChange={e => setOtraCuenta(e.target.value)} placeholder="Ej. Fer, Alma, etc."/>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar Gasto</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const TablaDiariaTab = ({ movimientos, onAddMovimiento, onAddGasto, cuentasPorCobrar, onUpdateCpc }: { movimientos: MovimientoDiario[], onAddMovimiento: (pago: any) => void, onAddGasto: (gasto: any) => void, cuentasPorCobrar: CuentasPorCobrar[], onUpdateCpc: (cpcs: CuentasPorCobrar[]) => void }) => {
    
    const handleRegisterIngreso = (pago: { cpc: CuentasPorCobrar, cuenta: Cuenta | string }) => {
        const { cpc, cuenta } = pago;
        
        onAddMovimiento({
            descripcion: `Pago cliente ${cpc.cliente}`,
            monto: cpc.monto,
            cuenta: cuenta,
            tipo: 'Ingreso',
            categoria: cpc.tipo,
        });

        let updatedCpc = cuentasPorCobrar.filter(item => item.id !== cpc.id);
        
        if (cpc.tipo === 'Iguala Mensual' || cpc.tipo === 'Ads') {
            const periodRegex = /(\d{1,2})\s+de\s+(\w+)/g;
            const dates = Array.from(cpc.periodo.matchAll(periodRegex)).map(match => {
                const day = parseInt(match[1]);
                const monthName = match[2].toLowerCase();
                const monthIndex = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'].indexOf(monthName.substring(0,3));
                return new Date(2024, monthIndex, day);
            });

            if(dates.length === 2){
                const nextStartDate = addMonths(dates[0], 1);
                const nextEndDate = addMonths(dates[1], 1);
                
                const formatDayMonth = (d:Date) => format(d, "d 'de' MMM", {locale: es}).toLowerCase();

                const newPeriodo = `${formatDayMonth(nextStartDate)} - ${formatDayMonth(nextEndDate)}` as Periodo;
                
                const newIguala: CuentasPorCobrar = {
                    ...cpc,
                    id: `cpc-${Date.now()}`,
                    periodo: newPeriodo,
                };
                updatedCpc.push(newIguala);
            }
        }
        
        onUpdateCpc(updatedCpc);
    };

    const [selectedMonth, setSelectedMonth] = useState(format(new Date(2024, 10, 1), 'yyyy-MM-dd'));

    const monthOptions = useMemo(() => {
        const uniqueMonths = new Set(
            movimientos.map(mov => format(startOfMonth(mov.fecha), 'yyyy-MM-dd'))
        );
        const currentMonthStart = format(startOfMonth(new Date(2024, 10, 1)), 'yyyy-MM-dd');
        if (!uniqueMonths.has(currentMonthStart)) {
            uniqueMonths.add(currentMonthStart);
        }
        return Array.from(uniqueMonths).sort((a, b) => b.localeCompare(a));
    }, [movimientos]);

    const monthlyData = useMemo(() => {
        const start = parse(selectedMonth, 'yyyy-MM-dd', new Date());
        const end = endOfMonth(start);
        return movimientos.filter(mov => isWithinInterval(mov.fecha, { start, end }));
    }, [movimientos, selectedMonth]);

    const accountSummary = useMemo(() => {
        const initialBalanceMaw = 305624;
        const initialBalancePaola = 188864;

        const totals = monthlyData.reduce((acc, mov) => {
             const cuenta = mov.cuenta;
            if (mov.tipo === 'Ingreso') {
                acc.totalIngresos += mov.monto;
                if (cuenta === 'Cuenta Paola') acc.ingresosPaola += mov.monto;
                else if (cuenta === 'Cuenta MAW') acc.ingresosMaw += mov.monto;
                else {
                    acc.ingresosOtros[cuenta] = (acc.ingresosOtros[cuenta] || 0) + mov.monto;
                }
            } else {
                acc.totalGastos += mov.monto;
            }
            return acc;
        }, { totalIngresos: 0, totalGastos: 0, ingresosPaola: 0, ingresosMaw: 0, ingresosOtros: {} as Record<string, number> });

        return {
            totalIngresos: totals.totalIngresos,
            totalGastos: totals.totalGastos,
            balance: totals.totalIngresos - totals.totalGastos,
            balancePaola: initialBalancePaola,
            balanceMaw: initialBalanceMaw,
            ingresosOtros: totals.ingresosOtros
        };
    }, [monthlyData]);


    return (
        <div className='space-y-4'>
            <div className="flex justify-end gap-2">
                <RegistrarIngresoDialog cuentasPorCobrar={cuentasPorCobrar} onSave={handleRegisterIngreso}>
                    <Button>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Registrar Ingreso
                    </Button>
                </RegistrarIngresoDialog>
                <RegistrarGastoDialog onSave={(gasto) => onAddGasto({ ...gasto, tipo: 'Gasto' })}>
                    <Button variant="destructive">
                        <MinusCircle className="w-4 h-4 mr-2" />
                        Registrar Gasto
                    </Button>
                </RegistrarGastoDialog>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">{accountSummary.totalIngresos.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Gastos del Mes</CardTitle>
                        <TrendingDown className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{accountSummary.totalGastos.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Utilidad Neta Mensual</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={cn("text-2xl font-bold", accountSummary.balance >= 0 ? 'text-blue-500' : 'text-destructive')}>
                           {accountSummary.balance.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                             <CardTitle>Movimientos de {format(parse(selectedMonth, 'yyyy-MM-dd', new Date()), 'MMMM yyyy', { locale: es })}</CardTitle>
                             <CardDescription>Registro de todos los ingresos y gastos del mes.</CardDescription>
                        </div>
                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="Seleccionar mes" />
                            </SelectTrigger>
                            <SelectContent>
                                {monthOptions.map(month => (
                                    <SelectItem key={month} value={month}>
                                        {format(parse(month, 'yyyy-MM-dd', new Date()), 'MMMM yyyy', { locale: es })}
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
    const [cuentasPorCobrar, setCuentasPorCobrar] = useState<CuentasPorCobrar[]>(initialCuentasPorCobrar);
    const [activeTab, setActiveTab] = useState("cuentas-por-cobrar");

    const handleAddMovimiento = (nuevoMovimiento: Omit<MovimientoDiario, 'id' | 'fecha'>) => {
        const fullMovimiento: MovimientoDiario = {
            id: `mov-${Date.now()}`,
            ...nuevoMovimiento,
            fecha: new Date(),
        };
        setMovimientos(prev => [fullMovimiento, ...prev].sort((a,b) => b.fecha.getTime() - a.fecha.getTime()));
    };
    
  return (
    <div>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold font-headline">{activeTab === 'cuentas-por-cobrar' ? 'Gestión de Cobranza' : 'Control Financiero Mensual'}</h1>
             {activeTab === 'tabla-diaria' && (
                <div className="flex gap-2">
                    <RegistrarIngresoDialog cuentasPorCobrar={cuentasPorCobrar} onSave={pago => handleAddMovimiento(pago)}>
                        <Button>
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Registrar Ingreso
                        </Button>
                    </RegistrarIngresoDialog>
                    <RegistrarGastoDialog onSave={(gasto) => handleAddMovimiento({ ...gasto, tipo: 'Gasto' })}>
                        <Button variant="destructive">
                            <MinusCircle className="w-4 h-4 mr-2" />
                            Registrar Gasto
                        </Button>
                    </RegistrarGastoDialog>
                </div>
            )}
        </div>
      
        <Tabs defaultValue="cuentas-por-cobrar" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cuentas-por-cobrar">Cuentas por Cobrar</TabsTrigger>
                <TabsTrigger value="tabla-diaria">Tabla Diaria</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cuentas-por-cobrar" className="mt-4">
               <CuentasPorCobrarTab data={cuentasPorCobrar} />
            </TabsContent>

            <TabsContent value="tabla-diaria" className="mt-4">
                <TablaDiariaTab movimientos={movimientos} onAddMovimiento={handleAddMovimiento} onAddGasto={handleAddMovimiento} cuentasPorCobrar={cuentasPorCobrar} onUpdateCpc={setCuentasPorCobrar} />
            </TabsContent>
        </Tabs>
    </div>
  );
}
