
'use client';

import React, { useState, useMemo, useEffect, startTransition } from 'react';
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
import { ArrowUpDown, PlusCircle, MinusCircle, DollarSign, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/lib/auth-provider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { MovimientoDiario, CuentaPorCobrar, NewCuentaPorCobrar, NewMovimientoDiario, Client, ClientFinancialProfile } from '@/lib/db/schema';
import { ClientFormDialog } from '../clientes/page';
import { getCuentasPorCobrar, getMovimientos, addCpc, addMovimiento } from './_actions';
import { getClients } from '../clientes/_actions';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type CategoriaIngreso = "Proyecto" | "Iguala Mensual" | "Renovaciones" | "Otros";
type CategoriaGasto = "Publicidad" | "Sueldos" | "Comisiones" | "Impuestos" | "Personales" | "Otros" | "Renta";
type Cuenta = "Cuenta Paola" | "Cuenta MAW" | "Cuenta Aldo" | "Efectivo";

const AddCpcDialog = ({ clients, onSave, onRefreshClients, children }: { clients: Client[], onSave: () => void, onRefreshClients: () => void, children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    
    const [clientId, setClientId] = useState('');
    const [monto, setMonto] = useState('');
    const [tipo, setTipo] = useState<CategoriaIngreso>('Iguala Mensual');
    const [periodo, setPeriodo] = useState('');

    useEffect(() => {
        if (open) resetForm();
    }, [open]);

    const resetForm = () => {
        setClientId(''); setMonto(''); setTipo('Iguala Mensual'); setPeriodo('');
    }
    
    const handleSave = async () => {
        if (!clientId || !monto || !periodo) {
            toast({ title: "Error", description: "Cliente, monto y periodo son obligatorios.", variant: "destructive" });
            return;
        }
        const cliente = clients.find(c => c.id === parseInt(clientId));
        if (!cliente) {
             toast({ title: "Error", description: "Cliente no encontrado.", variant: 'destructive' });
            return;
        }
        
        const data: Omit<NewCuentaPorCobrar, 'id'> = {
            clienteId: parseInt(clientId),
            clienteName: cliente.name,
            periodo,
            monto: parseFloat(monto),
            tipo,
        };

        try {
            await addCpc(data);
            startTransition(() => {
                onSave();
                setOpen(false);
                toast({ title: "Éxito", description: `Cuenta por cobrar para ${cliente.name} guardada.` });
            });
        } catch (error) {
             toast({ title: "Error", description: `No se pudo guardar la cuenta por cobrar.`, variant: 'destructive' });
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Añadir Cuenta por Cobrar</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                     <div className="space-y-2">
                        <Label>Cliente</Label>
                        {clients.length > 0 ? (
                            <Select value={clientId} onValueChange={setClientId}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar cliente" /></SelectTrigger>
                                <SelectContent>
                                    {clients.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        ) : (
                             <Alert variant="default" className="mt-2">
                                <Info className="h-4 w-4" />
                                <AlertDescription className="text-xs">
                                    No hay clientes. 
                                     <ClientFormDialog onSave={onRefreshClients} isEditing={false}>
                                        <Button variant="link" className="p-0 h-auto ml-1">Añade uno nuevo.</Button>
                                    </ClientFormDialog>
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Tipo de Servicio</Label>
                        <Select value={tipo} onValueChange={(v) => setTipo(v as CategoriaIngreso)}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Iguala Mensual">Iguala Mensual</SelectItem>
                                <SelectItem value="Proyecto">Proyecto</SelectItem>
                                <SelectItem value="Web">Web</SelectItem>
                                <SelectItem value="Renovaciones">Renovaciones</SelectItem>
                                <SelectItem value="Otros">Otros</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label>Periodo</Label>
                           <Input value={periodo} onChange={e => setPeriodo(e.target.value)} placeholder="Ej. Noviembre 2024" />
                        </div>
                        <div className="space-y-2">
                            <Label>Monto (MXN)</Label>
                            <Input type="number" value={monto} onChange={e => setMonto(e.target.value)} placeholder="0.00" />
                        </div>
                     </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar Cuenta</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const CuentasPorCobrarTab = ({ data, clients, onSave, onRefresh }: { data: CuentaPorCobrar[], clients: Client[], onSave: () => void, onRefresh: () => void }) => {
    
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
    const [clientFilter, setClientFilter] = useState('Todos');

    const clientDebts = useMemo(() => {
        const debtMap = new Map<number, { client: Client; totalDebt: number; debts: CuentaPorCobrar[] }>();

        clients.forEach(client => {
            debtMap.set(client.id, { client, totalDebt: 0, debts: [] });
        });

        data.forEach(cpc => {
            const clientEntry = debtMap.get(cpc.clienteId);
            if (clientEntry) {
                clientEntry.totalDebt += cpc.monto;
                clientEntry.debts.push(cpc);
            }
        });

        let clientList = Array.from(debtMap.values());

        if (clientFilter !== 'Todos') {
            clientList = clientList.filter(item => item.client.name === clientFilter);
        }

        if (sortOrder) {
            clientList.sort((a, b) => sortOrder === 'desc' ? b.totalDebt - a.totalDebt : a.totalDebt - b.totalDebt);
        }

        return clientList;
    }, [data, clients, sortOrder, clientFilter]);

    const toggleSort = () => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    };
    
    return (
        <Card>
            <CardHeader className='flex-col md:flex-row justify-between items-start md:items-center'>
                <div>
                    <CardTitle>Control de Pagos</CardTitle>
                    <CardDescription>Gestiona los pagos pendientes de tus clientes.</CardDescription>
                </div>
                 <div className="flex gap-2">
                    <Select value={clientFilter} onValueChange={setClientFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filtrar por cliente" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Todos">Todos los Clientes</SelectItem>
                            {clients.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <AddCpcDialog clients={clients} onSave={onRefresh} onRefreshClients={onRefresh}>
                        <Button><PlusCircle className="w-4 h-4 mr-2" />Añadir Cuenta por Cobrar</Button>
                    </AddCpcDialog>
                 </div>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader><TableRow>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Detalle de Deuda</TableHead>
                            <TableHead className='cursor-pointer' onClick={toggleSort}>
                                <div className="flex items-center gap-1">
                                    Monto Total Pendiente
                                    <ArrowUpDown className="w-4 h-4" />
                                </div>
                            </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clientDebts.map(({client, totalDebt, debts}) => (
                                <TableRow key={client.id}>
                                    <TableCell className="font-medium">{client.name}</TableCell>
                                    <TableCell>
                                        {debts.length > 0 ? (
                                            <ul className='space-y-1'>
                                            {debts.map(d => (
                                                <li key={d.id} className='text-xs flex items-center gap-2'>
                                                     <Badge variant="secondary" className='font-normal'>{d.periodo}</Badge>
                                                     <span>{d.monto.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</span>
                                                </li>
                                            ))}
                                            </ul>
                                        ) : (
                                            <span className='text-xs text-muted-foreground'>Sin deudas pendientes.</span>
                                        )}
                                    </TableCell>
                                    <TableCell className={cn("font-bold", totalDebt > 0 ? 'text-destructive' : 'text-green-500')}>
                                        {totalDebt.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                     {clientDebts.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">No hay clientes en esta vista.</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const RegistrarIngresoDialog = ({ isAdmin, cuentasPorCobrar, onSave }: { isAdmin: boolean, cuentasPorCobrar: CuentaPorCobrar[], onSave: () => void }) => {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    
    const [selectedCpcId, setSelectedCpcId] = useState<string>('');
    const [cuentaDestino, setCuentaDestino] = useState<Cuenta | ''>('');
    const [detalleEfectivo, setDetalleEfectivo] = useState('');
    const [isManual, setIsManual] = useState(false);
    const [manualAmount, setManualAmount] = useState('');
    const [manualDesc, setManualDesc] = useState('');
    
    const selectedCpc = useMemo(() => cuentasPorCobrar.find(c => c.id.toString() === selectedCpcId), [selectedCpcId, cuentasPorCobrar]);

    const resetForm = () => {
        setSelectedCpcId(''); setCuentaDestino(''); setDetalleEfectivo('');
        setManualAmount(''); setManualDesc(''); setIsManual(false);
    };

    useEffect(() => {
        if(open) resetForm();
    }, [open]);
    
    const handleSave = async () => {
        if (isManual) {
            if(!manualAmount || !manualDesc || !cuentaDestino) {
                toast({ title: "Error", description: "Descripción, monto y cuenta son obligatorios.", variant: "destructive" });
                return;
            }
            try {
                await addMovimiento({
                    fecha: new Date(),
                    tipo: 'Ingreso',
                    descripcion: manualDesc,
                    monto: parseFloat(manualAmount),
                    cuenta: cuentaDestino,
                    detalleCuenta: detalleEfectivo || null,
                    categoria: 'Otros',
                });
                toast({ title: "Éxito", description: "Ingreso manual registrado."});
            } catch(e) {
                toast({ title: "Error", description: "No se pudo registrar el ingreso manual.", variant: "destructive" });
            }
        } else {
            if (!selectedCpc || !cuentaDestino) {
                toast({ title: "Error", description: "Selecciona una cuenta por cobrar y una cuenta de destino.", variant: "destructive" });
                return;
            }
            try {
                await addMovimiento({
                    fecha: new Date(),
                    tipo: 'Ingreso',
                    descripcion: `Pago cliente ${selectedCpc.clienteName}`,
                    monto: selectedCpc.monto,
                    cuenta: cuentaDestino,
                    detalleCuenta: detalleEfectivo || null,
                    categoria: selectedCpc.tipo,
                });
                // Here you might want to delete the CPC record or mark it as paid.
                // await deleteCpc(selectedCpc.id);
                toast({ title: "Éxito", description: `Ingreso de ${selectedCpc.clienteName} registrado.` });
            } catch (error) {
                toast({ title: "Error", description: "No se pudo registrar el ingreso.", variant: "destructive" });
                return;
            }
        }
        
        startTransition(() => {
            onSave();
            setOpen(false);
        });
    };
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><PlusCircle className="w-4 h-4 mr-2" />Registrar Ingreso</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Registrar Ingreso</DialogTitle></DialogHeader>
                {isAdmin && (
                  <RadioGroup onValueChange={(v) => setIsManual(v === 'manual')} defaultValue="cpc" className='flex pt-2 space-x-4'>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="cpc" id="cpc-mode" /><Label htmlFor="cpc-mode" className='font-normal'>Desde CxC</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="manual" id="manual-mode" /><Label htmlFor="manual-mode" className='font-normal'>Manual</Label></div>
                  </RadioGroup>
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
                            <SelectContent>{cuentasPorCobrar.map(cpc => <SelectItem key={cpc.id} value={cpc.id.toString()}>{cpc.clienteName} - {cpc.periodo}</SelectItem>)}</SelectContent>
                        </Select>
                        {cuentasPorCobrar.length === 0 && <p className="text-sm text-muted-foreground">No hay cuentas por cobrar pendientes.</p>}
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
                    <Button onClick={handleSave} disabled={isManual ? (!manualAmount || !manualDesc || !cuentaDestino) : (!selectedCpc || !cuentaDestino)}>Registrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const RegistrarGastoDialog = ({ onSave }: { onSave: () => void }) => {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    
    const [descripcion, setDescripcion] = useState('');
    const [monto, setMonto] = useState('');
    const [cuenta, setCuenta] = useState<Cuenta | ''>('');
    const [detalleEfectivo, setDetalleEfectivo] = useState('');
    const [categoriaGasto, setCategoriaGasto] = useState<CategoriaGasto | ''>('');
    const [nombreOtro, setNombreOtro] = useState('');

    const resetForm = () => {
        setDescripcion(''); setMonto(''); setCuenta(''); setDetalleEfectivo('');
        setCategoriaGasto(''); setNombreOtro('');
    };

    useEffect(() => {
        if(open) resetForm();
    }, [open]);

    const handleSave = async () => {
         if (!descripcion || !monto || !cuenta || !categoriaGasto) {
             toast({ title: "Error", description: "Todos los campos son obligatorios.", variant: "destructive" });
             return;
         }
         
        try {
             await addMovimiento({
                fecha: new Date(),
                tipo: 'Gasto',
                descripcion, 
                monto: parseFloat(monto), 
                cuenta: cuenta, 
                categoria: categoriaGasto,
                detalleCuenta: cuenta === 'Efectivo' ? detalleEfectivo : null,
                nombreOtro: ['Personales', 'Otros'].includes(categoriaGasto) ? nombreOtro : null,
            });

            startTransition(() => {
                onSave();
                setOpen(false);
                toast({ title: "Éxito", description: `Gasto registrado.` });
            });
        } catch(error) {
            toast({ title: "Error", description: "No se pudo registrar el gasto.", variant: "destructive" });
        }
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

const TablaDiariaTab = ({ isAdmin, movimientos, onSave, cuentasPorCobrar }: { isAdmin: boolean, movimientos: MovimientoDiario[], onSave: () => void, cuentasPorCobrar: CuentaPorCobrar[] }) => {
    const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM-dd'));

    const summary = useMemo(() => {
        const start = startOfMonth(parseISO(selectedMonth));
        const end = endOfMonth(start);
        const monthlyData = movimientos.filter(mov => isWithinInterval(new Date(mov.fecha), { start, end }));
        
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
                <RegistrarIngresoDialog isAdmin={isAdmin} cuentasPorCobrar={cuentasPorCobrar} onSave={onSave} />
                <RegistrarGastoDialog onSave={onSave} />
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
                                {movimientos.filter(mov => isWithinInterval(new Date(mov.fecha), {start: startOfMonth(parseISO(selectedMonth)), end: endOfMonth(parseISO(selectedMonth))})).map(mov => (
                                    <TableRow key={mov.id}>
                                        <TableCell>{format(new Date(mov.fecha), 'dd MMM yyyy, HH:mm', { locale: es })}</TableCell>
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
    const [clients, setClients] = useState<Client[]>([]);
    const [movimientos, setMovimientos] = useState<MovimientoDiario[]>([]);
    const [cuentasPorCobrar, setCuentasPorCobrar] = useState<CuentaPorCobrar[]>([]);
    const [activeTab, setActiveTab] = useState("cuentas-por-cobrar");
    const [isLoading, setIsLoading] = useState(true);

    const isAdmin = user?.role === 'admin' || user?.role === 'contabilidad';
    const { toast } = useToast();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [clientsData, cpcData, movimientosData] = await Promise.all([
                getClients(),
                getCuentasPorCobrar(),
                getMovimientos()
            ]);
            setClients(clientsData as Client[]);
            setCuentasPorCobrar(cpcData as CuentaPorCobrar[]);
            setMovimientos(movimientosData as MovimientoDiario[]);
        } catch (error) {
             toast({
                title: "Error al cargar datos",
                description: "No se pudieron obtener los datos financieros. Intenta recargar la página.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    }
    
    useEffect(() => {
        fetchData();
    }, []);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div></div>
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
                    <TabsTrigger value="cuentas-por-cobrar"><DollarSign className="w-4 h-4 mr-2"/>Control de Pagos</TabsTrigger>
                    <TabsTrigger value="tabla-diaria"><TrendingUp className="w-4 h-4 mr-2"/>Tabla Diaria</TabsTrigger>
                </TabsList>
                <TabsContent value="cuentas-por-cobrar" className="mt-4">
                   <CuentasPorCobrarTab data={cuentasPorCobrar} clients={clients} onSave={fetchData} onRefresh={fetchData} />
                </TabsContent>
                <TabsContent value="tabla-diaria" className="mt-4">
                    <TablaDiariaTab isAdmin={isAdmin} movimientos={movimientos} onSave={fetchData} cuentasPorCobrar={cuentasPorCobrar} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
