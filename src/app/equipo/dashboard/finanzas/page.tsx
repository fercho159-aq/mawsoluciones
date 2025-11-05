
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
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
import { ArrowUpDown, ArrowRight, PlusCircle, MinusCircle, DollarSign, TrendingUp, TrendingDown, Users } from 'lucide-react';
import WhatsappIcon from '@/components/icons/whatsapp-icon';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format, startOfMonth, endOfMonth, isWithinInterval, parse, addMonths, getDaysInMonth, parseISO, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/lib/auth-provider';
import { 
    initialClients, 
    initialCuentasPorCobrar, 
    initialMovimientosDiarios,
    type Client,
    type CuentasPorCobrar,
    type MovimientoDiario,
    type Periodo,
    type CategoriaIngreso,
    type CategoriaGasto,
    type Cuenta
} from '@/lib/finanzas-data';
import { Alert, AlertDescription } from '@/components/ui/alert';


// --- Helper Functions ---
const generatePeriodOptions = () => {
    const options: string[] = [];
    const today = new Date();
    
    // Generate periods for the last 2 months, current month, and next 3 months
    for (let i = -2; i <= 3; i++) {
        const date = addMonths(today, i);
        
        // Full month period
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        options.push(`${format(start, 'd MMM', { locale: es })} - ${format(end, 'd MMM', { locale: es })}`);

        // 15th to 15th period
        const start15 = new Date(date.getFullYear(), date.getMonth(), 15);
        const end15 = addMonths(start15, 1);
        options.push(`${format(start15, 'd MMM', { locale: es })} - ${format(end15, 'd MMM', { locale: es })}`);
    }
    
    // Sort options chronologically
    return options.sort((a, b) => {
        const dateA = parse(a.split(' - ')[0], 'd MMM', new Date());
        const dateB = parse(b.split(' - ')[0], 'd MMM', new Date());
        return dateA.getTime() - dateB.getTime();
    });
};

const getNextPeriod = (periodo: string): Periodo => {
    try {
        const [startStr] = periodo.split(' - ');
        const startDate = parse(startStr, 'd MMM', new Date(), { locale: es });
        
        const nextStartDate = addMonths(startDate, 1);
        
        if (startDate.getDate() === 1) {
            // Full month period
            const nextEndDate = endOfMonth(nextStartDate);
            return `${format(nextStartDate, 'd MMM', { locale: es })} - ${format(nextEndDate, 'd MMM', { locale: es })}`;
        } else {
            // 15th to 15th period
            const nextEndDate = addMonths(nextStartDate, 1);
            return `${format(nextStartDate, 'd MMM', { locale: es })} - ${format(nextEndDate, 'd MMM', { locale: es })}`;
        }
    } catch(e) {
        console.error("Error parsing period", e);
        return "Error al generar periodo";
    }
}

// --- Components ---
const AddCpcDialog = ({ clients, onAdd }: { clients: Client[], onAdd: (cpc: Omit<CuentasPorCobrar, 'id'>) => void }) => {
    const [clienteId, setClienteId] = useState('');
    const [periodo, setPeriodo] = useState('');
    const [monto, setMonto] = useState('');
    const [tipo, setTipo] = useState<CategoriaIngreso>('Proyecto');
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const periodOptions = useMemo(() => generatePeriodOptions(), []);

    const handleSave = () => {
        if (!clienteId || !periodo || !monto) {
            toast({ title: "Error", description: "Todos los campos son obligatorios.", variant: "destructive" });
            return;
        }
        const cliente = clients.find(c => c.id === clienteId);
        if (!cliente) return;
        onAdd({ clienteId, clienteName: cliente.name, periodo, monto: parseFloat(monto), tipo });
        setOpen(false);
        setClienteId(''); setPeriodo(''); setMonto(''); setTipo('Proyecto');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="w-4 h-4 mr-2" />Añadir Cuenta por Cobrar</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Nueva Cuenta por Cobrar</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                     <div className="space-y-2">
                        <Label>Cliente</Label>
                        <Select value={clienteId} onValueChange={setClienteId}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar cliente" /></SelectTrigger>
                            <SelectContent>
                                {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        {clients.length === 0 ? (
                           <AlertDescription>No hay clientes. Crea uno en la pestaña 'Clientes' primero.</AlertDescription>
                        ) : (
                           <AlertDescription className='text-xs'>
                                ¿No encuentras al cliente? <Link href="/equipo/dashboard/clientes" className="text-primary underline">Añádelo aquí</Link>.
                           </AlertDescription>
                        )}
                    </div>
                    <Select value={periodo} onValueChange={setPeriodo}>
                        <SelectTrigger><SelectValue placeholder="Seleccionar Periodo"/></SelectTrigger>
                        <SelectContent>
                            {periodOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Input type="number" value={monto} onChange={e => setMonto(e.target.value)} placeholder="Monto (MXN)" />
                    <Select value={tipo} onValueChange={(v) => setTipo(v as CategoriaIngreso)}>
                        <SelectTrigger><SelectValue placeholder="Tipo de Servicio"/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Proyecto">Proyecto</SelectItem>
                            <SelectItem value="Iguala Mensual">Iguala Mensual</SelectItem>
                            <SelectItem value="Ads">Ads</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar Cuenta</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const CuentasPorCobrarTab = ({ data, clients, onAddCpc }: { data: CuentasPorCobrar[], clients: Client[], onAddCpc: (cpc: Omit<CuentasPorCobrar, 'id'>) => void }) => {
    const handleWhatsappReminder = (item: CuentasPorCobrar) => {
        const client = clients.find(c => c.id === item.clienteId);
        if (!client || !client.whatsapp) {
            alert("Este cliente no tiene un número de WhatsApp registrado.");
            return;
        }
        const message = `¡Hola ${item.clienteName}! Te recordamos amablemente que el pago de tu servicio de ${item.tipo} para el periodo del ${item.periodo} está pendiente. El monto es de ${item.monto.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}. ¡Gracias!`;
        const whatsappUrl = `https://wa.me/${client.whatsapp}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    return (
        <Card>
            <CardHeader className='flex-row justify-between items-center'>
                <div>
                    <CardTitle>Control de Pagos Pendientes</CardTitle>
                    <CardDescription>Gestiona los pagos pendientes de tus clientes y envía recordatorios.</CardDescription>
                </div>
                <AddCpcDialog clients={clients} onAdd={onAddCpc} />
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader><TableRow><TableHead>Cliente</TableHead><TableHead>Periodo</TableHead><TableHead>Monto Adeudado</TableHead><TableHead>Tipo</TableHead><TableHead className="text-right">Acción</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.clienteName}</TableCell>
                                    <TableCell><Badge variant="outline">{item.periodo}</Badge></TableCell>
                                    <TableCell>{item.monto.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</TableCell>
                                    <TableCell><Badge variant={item.tipo === 'Iguala Mensual' ? 'secondary' : 'default'}>{item.tipo}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="whatsapp" size="sm" onClick={() => handleWhatsappReminder(item)}>
                                            <WhatsappIcon className="w-4 h-4 mr-2" />
                                            Recordar Pago
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

const RegistrarIngresoDialog = ({ isAdmin, cuentasPorCobrar, onSave, onManualSave, children }: { isAdmin: boolean, cuentasPorCobrar: CuentasPorCobrar[], onSave: (pago: any) => void, onManualSave: (pago: any) => void, children: React.ReactNode }) => {
    const [selectedCpcId, setSelectedCpcId] = useState<string>('');
    const [cuentaDestino, setCuentaDestino] = useState<Cuenta | ''>('');
    const [detalleEfectivo, setDetalleEfectivo] = useState('');
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const selectedCpc = useMemo(() => cuentasPorCobrar.find(c => c.id === selectedCpcId), [selectedCpcId, cuentasPorCobrar]);
    
    // Manual state for admin
    const [isManual, setIsManual] = useState(false);
    const [manualAmount, setManualAmount] = useState('');
    const [manualDesc, setManualDesc] = useState('');

    const handleSave = () => {
        if (!selectedCpc || !cuentaDestino) return;
        if (cuentaDestino === 'Efectivo' && !detalleEfectivo) return;
        onSave({ cpc: selectedCpc, cuenta: cuentaDestino, detalleCuenta: detalleEfectivo });
        setOpen(false);
        toast({ title: "Éxito", description: `Ingreso de ${selectedCpc.clienteName} registrado.` });
        resetForm();
    };
    
    const handleManualSave = () => {
        if(!manualAmount || !manualDesc || !cuentaDestino) return;
        onManualSave({ monto: parseFloat(manualAmount), descripcion: manualDesc, cuenta: cuentaDestino, detalleCuenta: detalleEfectivo, categoria: 'Proyecto' });
        setOpen(false);
        toast({ title: "Éxito", description: "Ingreso manual registrado."});
        resetForm();
    }

    const resetForm = () => {
        setSelectedCpcId(''); setCuentaDestino(''); setDetalleEfectivo(''); setManualAmount(''); setManualDesc(''); setIsManual(false);
    };

    return (
        <Dialog open={open} onOpenChange={(o) => {setOpen(o); if(!o) resetForm();}}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Registrar Ingreso</DialogTitle></DialogHeader>
                {isAdmin && (
                  <div className="flex items-center space-x-4 pt-2">
                    <Label htmlFor="manual-mode">Modo:</Label>
                    <RadioGroup onValueChange={(v) => setIsManual(v === 'manual')} defaultValue="cpc" className='flex'>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cpc" id="cpc-mode" />
                            <Label htmlFor="cpc-mode" className='font-normal'>Desde CxC</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="manual" id="manual-mode" />
                            <Label htmlFor="manual-mode" className='font-normal'>Manual (Admin)</Label>
                        </div>
                    </RadioGroup>
                  </div>
                )}
                {isManual && isAdmin ? (
                    <div className="grid gap-4 py-4">
                        <Input value={manualDesc} onChange={e => setManualDesc(e.target.value)} placeholder="Descripción del ingreso" />
                        <Input type="number" value={manualAmount} onChange={e => setManualAmount(e.target.value)} placeholder="Monto (MXN)" />
                    </div>
                ) : (
                    <div className="grid gap-4 py-4">
                        <Select value={selectedCpcId} onValueChange={setSelectedCpcId}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar cliente pendiente" /></SelectTrigger>
                            <SelectContent>{cuentasPorCobrar.map(cpc => <SelectItem key={cpc.id} value={cpc.id}>{cpc.clienteName} - {cpc.periodo}</SelectItem>)}</SelectContent>
                        </Select>
                        {cuentasPorCobrar.length === 0 && <AlertDescription>No hay cuentas por cobrar pendientes.</AlertDescription>}
                        {selectedCpc && <Card className="bg-muted p-4"><p><strong>Monto:</strong> {selectedCpc.monto.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p></Card>}
                    </div>
                )}
                <div className="grid gap-4">
                    <Select value={cuentaDestino} onValueChange={(value) => setCuentaDestino(value as any)}>
                        <SelectTrigger><SelectValue placeholder="Seleccionar cuenta de destino" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Cuenta Paola">Cuenta Paola</SelectItem>
                            <SelectItem value="Cuenta MAW">Cuenta MAW</SelectItem>
                            <SelectItem value="Cuenta Aldo">Cuenta Aldo</SelectItem>
                            <SelectItem value="Efectivo">Efectivo</SelectItem>
                        </SelectContent>
                    </Select>
                    {cuentaDestino === 'Efectivo' && <Input value={detalleEfectivo} onChange={e => setDetalleEfectivo(e.target.value)} placeholder="Especifique (ej. Caja chica, Fany)"/>}
                </div>
                <DialogFooter className='mt-4'>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={isManual ? handleManualSave : handleSave} disabled={isManual ? (!manualAmount || !manualDesc || !cuentaDestino) : (!selectedCpc || !cuentaDestino)}>Registrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const RegistrarGastoDialog = ({ onSave }: { onSave: (gasto: Omit<MovimientoDiario, 'id' | 'fecha' | 'tipo'>) => void }) => {
    const [descripcion, setDescripcion] = useState('');
    const [monto, setMonto] = useState('');
    const [cuenta, setCuenta] = useState<Cuenta | ''>('');
    const [detalleEfectivo, setDetalleEfectivo] = useState('');
    const [categoriaGasto, setCategoriaGasto] = useState<CategoriaGasto | ''>('');
    const [nombreOtro, setNombreOtro] = useState('');
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const handleSave = () => {
         if (!descripcion || !monto || !cuenta || !categoriaGasto) return;
         const gastoData: Omit<MovimientoDiario, 'id' | 'fecha' | 'tipo'> = {
            descripcion, monto: parseFloat(monto), cuenta, categoria: categoriaGasto,
            detalleCuenta: cuenta === 'Efectivo' ? detalleEfectivo : undefined,
            nombreOtro: ['Personales', 'Otros'].includes(categoriaGasto) ? nombreOtro : undefined,
        };
        onSave(gastoData);
        setOpen(false);
        toast({ title: "Éxito", description: `Gasto registrado.` });
        setDescripcion(''); setMonto(''); setCuenta(''); setDetalleEfectivo(''); setCategoriaGasto(''); setNombreOtro('');
    };

    return (
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button variant="destructive"><MinusCircle className="w-4 h-4 mr-2" />Registrar Gasto</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Registrar Gasto</DialogTitle></DialogHeader>
                 <div className="grid gap-4 py-4">
                    <Input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción (Ej. Pago de software)" />
                    <Input type="number" value={monto} onChange={e => setMonto(e.target.value)} placeholder="Monto (MXN)" />
                    <Select value={categoriaGasto} onValueChange={(v) => setCategoriaGasto(v as CategoriaGasto)}>
                        <SelectTrigger><SelectValue placeholder="Categoría de Gasto" /></SelectTrigger>
                        <SelectContent>{(["Publicidad", "Sueldos", "Comisiones", "Impuestos", "Personales", "Renta", "Otros"] as CategoriaGasto[]).map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                    </Select>
                    {(categoriaGasto === 'Personales' || categoriaGasto === 'Otros') && <Input value={nombreOtro} onChange={e => setNombreOtro(e.target.value)} placeholder="Nombre Específico (Ej. Fany)"/>}
                    <Select value={cuenta} onValueChange={(v) => setCuenta(v as any)}>
                        <SelectTrigger><SelectValue placeholder="Cuenta de Origen" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Cuenta Paola">Cuenta Paola</SelectItem>
                            <SelectItem value="Cuenta MAW">Cuenta MAW</SelectItem>
                            <SelectItem value="Cuenta Aldo">Cuenta Aldo</SelectItem>
                            <SelectItem value="Efectivo">Efectivo</SelectItem>
                        </SelectContent>
                    </Select>
                    {cuenta === 'Efectivo' && <Input value={detalleEfectivo} onChange={e => setDetalleEfectivo(e.target.value)} placeholder="Especifique (ej. Caja chica)"/>}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar Gasto</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const TablaDiariaTab = ({ isAdmin, movimientos, onAddMovimiento, cuentasPorCobrar, onUpdateCpc }: { isAdmin: boolean, movimientos: MovimientoDiario[], onAddMovimiento: (pago: any) => void, cuentasPorCobrar: CuentasPorCobrar[], onUpdateCpc: (cpcs: CuentasPorCobrar[]) => void }) => {
    
    const handleRegisterIngreso = (pago: { cpc: CuentasPorCobrar, cuenta: Cuenta | string, detalleCuenta?: string }) => {
        const { cpc, cuenta, detalleCuenta } = pago;
        const nuevoIngreso = { descripcion: `Pago cliente ${cpc.clienteName}`, monto: cpc.monto, cuenta, detalleCuenta, tipo: 'Ingreso', categoria: cpc.tipo };
        onAddMovimiento(nuevoIngreso);

        let updatedCpcList = cuentasPorCobrar.filter(item => item.id !== cpc.id);
        if (cpc.tipo === 'Iguala Mensual' || cpc.tipo === 'Ads') {
            const nextPeriod = getNextPeriod(cpc.periodo);
            updatedCpcList.push({ ...cpc, id: `cpc-${Date.now()}`, periodo: nextPeriod });
        }
        onUpdateCpc(updatedCpcList);
    };

    const handleManualIngreso = (pago: any) => {
        onAddMovimiento({ ...pago, tipo: 'Ingreso' });
    }

    const handleRegisterGasto = (gasto: any) => {
        onAddMovimiento({ ...gasto, tipo: 'Gasto' });
    }

    const [selectedMonth, setSelectedMonth] = useState(format(startOfMonth(new Date(2024, 10, 1)), 'yyyy-MM-dd'));

    const summary = useMemo(() => {
        const start = startOfMonth(parseISO(selectedMonth));
        const end = endOfMonth(start);
        const monthlyData = movimientos.filter(mov => isWithinInterval(mov.fecha, { start, end }));
        
        return monthlyData.reduce((acc, mov) => {
            if (mov.tipo === 'Ingreso') acc.totalIngresos += mov.monto;
            else acc.totalGastos += mov.monto;
            return acc;
        }, { totalIngresos: 0, totalGastos: 0 });
    }, [movimientos, selectedMonth]);
    
    const balance = summary.totalIngresos - summary.totalGastos;

    return (
        <div className='space-y-4'>
            <div className="flex justify-end gap-2">
                <RegistrarIngresoDialog isAdmin={isAdmin} cuentasPorCobrar={cuentasPorCobrar} onSave={handleRegisterIngreso} onManualSave={handleManualIngreso}>
                    <Button><PlusCircle className="w-4 h-4 mr-2" />Registrar Ingreso</Button>
                </RegistrarIngresoDialog>
                <RegistrarGastoDialog onSave={handleRegisterGasto} />
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle><TrendingUp className="h-4 w-4 text-green-500" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-500">{summary.totalIngresos.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</div></CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Gastos del Mes</CardTitle><TrendingDown className="h-4 w-4 text-destructive" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-destructive">{summary.totalGastos.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</div></CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Utilidad Neta Mensual</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader>
                    <CardContent><div className={cn("text-2xl font-bold", balance >= 0 ? 'text-blue-500' : 'text-destructive')}>{balance.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</div></CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Movimientos de {format(parseISO(selectedMonth), 'MMMM yyyy', { locale: es })}</CardTitle>
                    <CardDescription>Registro de todos los ingresos y gastos del mes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader><TableRow><TableHead>Fecha</TableHead><TableHead>Tipo</TableHead><TableHead>Descripción</TableHead><TableHead>Categoría / Detalle</TableHead><TableHead>Cuenta</TableHead><TableHead className="text-right">Monto</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {movimientos.filter(mov => isWithinInterval(mov.fecha, {start: startOfMonth(parseISO(selectedMonth)), end: endOfMonth(parseISO(selectedMonth))})).map(mov => (
                                    <TableRow key={mov.id}>
                                        <TableCell>{format(mov.fecha, 'dd MMM yyyy, HH:mm', { locale: es })}</TableCell>
                                        <TableCell><Badge variant={mov.tipo === 'Ingreso' ? 'default' : 'destructive'} className={cn(mov.tipo === 'Ingreso' && 'bg-green-500 hover:bg-green-500/80')}>{mov.tipo}</Badge></TableCell>
                                        <TableCell>{mov.descripcion}</TableCell>
                                        <TableCell>{mov.categoria}{mov.nombreOtro ? ` (${mov.nombreOtro})` : ''}</TableCell>
                                        <TableCell>{mov.cuenta}{mov.detalleCuenta ? ` (${mov.detalleCuenta})` : ''}</TableCell>
                                        <TableCell className={cn("text-right font-bold", mov.tipo === 'Ingreso' ? 'text-green-500' : 'text-destructive')}>{mov.monto.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function FinanzasPage() {
    const { user } = useAuth();
    const [clients, setClients] = useState<Client[]>(initialClients);
    const [movimientos, setMovimientos] = useState<MovimientoDiario[]>(initialMovimientosDiarios);
    const [cuentasPorCobrar, setCuentasPorCobrar] = useState<CuentasPorCobrar[]>(initialCuentasPorCobrar);
    const [activeTab, setActiveTab] = useState("cuentas-por-cobrar");
    
    const isAdmin = user?.role === 'admin' || user?.role === 'contabilidad';

    const handleAddMovimiento = (nuevoMovimiento: Omit<MovimientoDiario, 'id' | 'fecha'>) => {
        const fullMovimiento: MovimientoDiario = { id: `mov-${Date.now()}`, ...nuevoMovimiento, fecha: new Date() };
        setMovimientos(prev => [fullMovimiento, ...prev].sort((a, b) => b.fecha.getTime() - a.fecha.getTime()));
    };

    const handleAddCpc = (nuevaCpc: Omit<CuentasPorCobrar, 'id'>) => {
        const fullCpc: CuentasPorCobrar = { id: `cpc-${Date.now()}`, ...nuevaCpc };
        setCuentasPorCobrar(prev => [fullCpc, ...prev]);
    }
    
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold font-headline">
                    {activeTab === 'cuentas-por-cobrar' && 'Gestión de Cobranza'}
                    {activeTab === 'tabla-diaria' && 'Control Financiero Mensual'}
                </h1>
            </div>
            <Tabs defaultValue="cuentas-por-cobrar" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="cuentas-por-cobrar"><DollarSign className="w-4 h-4 mr-2"/>Cuentas por Cobrar</TabsTrigger>
                    <TabsTrigger value="tabla-diaria"><TrendingUp className="w-4 h-4 mr-2"/>Tabla Diaria</TabsTrigger>
                </TabsList>
                <TabsContent value="cuentas-por-cobrar" className="mt-4">
                   <CuentasPorCobrarTab data={cuentasPorCobrar} clients={clients} onAddCpc={handleAddCpc} />
                </TabsContent>
                <TabsContent value="tabla-diaria" className="mt-4">
                    <TablaDiariaTab isAdmin={isAdmin} movimientos={movimientos} onAddMovimiento={handleAddMovimiento} cuentasPorCobrar={cuentasPorCobrar} onUpdateCpc={setCuentasPorCobrar} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
