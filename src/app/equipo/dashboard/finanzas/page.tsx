
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format, startOfMonth, endOfMonth, isWithinInterval, parse, addMonths, getDaysInMonth, parseISO, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/lib/auth-provider';

// --- Types ---
type Periodo = string;
type MovimientoTipo = "Ingreso" | "Gasto";
type CategoriaIngreso = "Proyecto" | "Iguala Mensual" | "Ads";
type CategoriaGasto = "Publicidad" | "Sueldos" | "Comisiones" | "Impuestos" | "Personales" | "Otros" | "Renta";
type Cuenta = "Cuenta Paola" | "Cuenta MAW" | "Cuenta Aldo" | "Efectivo";

interface Client {
  id: string;
  name: string;
  whatsapp?: string;
  email?: string;
}

interface CuentasPorCobrar {
  id: string;
  clienteId: string;
  clienteName: string; 
  periodo: Periodo;
  monto: number;
  tipo: CategoriaIngreso;
}

export interface MovimientoDiario {
  id: string;
  fecha: Date;
  tipo: MovimientoTipo;
  descripcion: string;
  monto: number;
  cuenta: Cuenta | string;
  detalleCuenta?: string;
  categoria?: CategoriaIngreso | CategoriaGasto;
  nombreOtro?: string;
}

// --- Initial Data ---
const initialClients: Client[] = [
    { id: 'client-1', name: "Bateiras", whatsapp: "5215512345678", email: "contacto@bateiras.com" }
];

const initialCuentasPorCobrar: CuentasPorCobrar[] = [
  { id: 'cpc1', clienteId: 'client-1', clienteName: 'Bateiras', periodo: "15 Nov - 15 Dic", monto: 3944, tipo: "Ads" },
];

export const initialMovimientosDiarios: MovimientoDiario[] = [
    { id: 'mov-bateiras', fecha: parseISO('2024-11-04T10:00:00'), tipo: 'Ingreso', descripcion: 'Pago cliente Bateiras', monto: 3944, cuenta: 'Cuenta Paola', categoria: 'Ads' },
    { id: 'mov2', fecha: new Date('2024-11-01T09:00:00'), tipo: 'Gasto', descripcion: 'Pago Dani', monto: 9000, cuenta: 'Cuenta Aldo', categoria: 'Sueldos' },
    { id: 'mov3', fecha: new Date('2024-11-01T09:01:00'), tipo: 'Gasto', descripcion: 'Pago Didi Den', monto: 9900, cuenta: 'Cuenta Aldo', categoria: 'Sueldos' },
    { id: 'mov4', fecha: new Date('2024-11-01T09:02:00'), tipo: 'Gasto', descripcion: 'Renta Abajo', monto: 4500, cuenta: 'Cuenta Aldo', categoria: 'Renta' },
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
        const startDate = parse(startStr, 'd MMM', new Date());
        
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

const AddClientDialog = ({ onAdd, children }: { onAdd: (client: Client) => void, children: React.ReactNode }) => {
    const [name, setName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState('');
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const handleSave = () => {
        if (!name) {
            toast({ title: "Error", description: "El nombre del cliente es obligatorio.", variant: "destructive" });
            return;
        }
        const newClient: Client = { id: `client-${Date.now()}`, name, whatsapp, email };
        onAdd(newClient);
        setOpen(false);
        toast({ title: "Éxito", description: `Cliente "${name}" añadido.` });
        setName(''); setWhatsapp(''); setEmail('');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Nuevo Cliente</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del Cliente" />
                    <Input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="WhatsApp (Ej. 52155...)" />
                    <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar Cliente</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const AddCpcDialog = ({ clients, onAdd, onAddClient }: { clients: Client[], onAdd: (cpc: Omit<CuentasPorCobrar, 'id'>) => void, onAddClient: (client: Client) => void }) => {
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
                        <div className="flex gap-2">
                           <Select value={clienteId} onValueChange={setClienteId}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar cliente" /></SelectTrigger>
                                <SelectContent>
                                    {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <AddClientDialog onAdd={onAddClient}>
                                <Button variant="outline" size="icon"><PlusCircle className="w-4 h-4"/></Button>
                            </AddClientDialog>
                        </div>
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

const CuentasPorCobrarTab = ({ data, clients, onAddCpc, onAddClient }: { data: CuentasPorCobrar[], clients: Client[], onAddCpc: (cpc: Omit<CuentasPorCobrar, 'id'>) => void, onAddClient: (client: Client) => void }) => {
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
                <AddCpcDialog clients={clients} onAdd={onAddCpc} onAddClient={onAddClient} />
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

    const handleAddMovimiento = (nuevoMovimiento: Omit<MovimientoDiario, 'id' | 'fecha'>) => {
        const fullMovimiento: MovimientoDiario = { id: `mov-${Date.now()}`, ...nuevoMovimiento, fecha: new Date() };
        setMovimientos(prev => [fullMovimiento, ...prev].sort((a, b) => b.fecha.getTime() - a.fecha.getTime()));
    };

    const handleAddClient = (newClient: Client) => {
        setClients(prev => [...prev, newClient]);
    }

    const handleAddCpc = (nuevaCpc: Omit<CuentasPorCobrar, 'id'>) => {
        const fullCpc: CuentasPorCobrar = { id: `cpc-${Date.now()}`, ...nuevaCpc };
        setCuentasPorCobrar(prev => [fullCpc, ...prev]);
    }
    
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold font-headline">{activeTab === 'cuentas-por-cobrar' ? 'Gestión de Cobranza' : 'Control Financiero Mensual'}</h1>
            </div>
            <Tabs defaultValue="cuentas-por-cobrar" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="cuentas-por-cobrar">Cuentas por Cobrar</TabsTrigger>
                    <TabsTrigger value="tabla-diaria">Tabla Diaria</TabsTrigger>
                </TabsList>
                <TabsContent value="cuentas-por-cobrar" className="mt-4">
                   <CuentasPorCobrarTab data={cuentasPorCobrar} clients={clients} onAddCpc={handleAddCpc} onAddClient={handleAddClient} />
                </TabsContent>
                <TabsContent value="tabla-diaria" className="mt-4">
                    <TablaDiariaTab isAdmin={user?.role === 'admin'} movimientos={movimientos} onAddMovimiento={handleAddMovimiento} cuentasPorCobrar={cuentasPorCobrar} onUpdateCpc={setCuentasPorCobrar} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
