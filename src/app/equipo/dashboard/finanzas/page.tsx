
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
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// --- Types ---
type Periodo = "1-31 Oct" | "15 Oct - 15 Nov" | "1-30 Nov";
type MetodoContacto = "Whatsapp" | "Email";
type MovimientoTipo = "Ingreso" | "Gasto";
type Cuenta = "Cuenta Paola" | "Cuenta MAW" | "Otra";

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

const mockMovimientosDiarios: MovimientoDiario[] = [
    { id: 'm1', fecha: new Date(), tipo: 'Ingreso', descripcion: 'Pago cliente Biofert', monto: 5000, cuenta: 'Cuenta MAW'},
    { id: 'm2', fecha: new Date(), tipo: 'Gasto', descripcion: 'Pago de software de diseño', monto: 1200, cuenta: 'Cuenta Paola'},
    { id: 'm3', fecha: new Date(), tipo: 'Ingreso', descripcion: 'Adelanto proyecto NIU', monto: 4250, cuenta: 'Fer'},
]

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

const MovimientoDialog = ({ tipo, onSave, children }: MovimientoDialogProps) => {
    const [descripcion, setDescripcion] = useState('');
    const [monto, setMonto] = useState('');
    const [cuenta, setCuenta] = useState<Cuenta | ''>('');
    const [otraCuenta, setOtraCuenta] = useState('');
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const handleSave = () => {
        if (!descripcion || !monto || !cuenta) {
            toast({ title: "Error", description: "Todos los campos son obligatorios.", variant: "destructive" });
            return;
        }
        if (cuenta === 'Otra' && !otraCuenta) {
            toast({ title: "Error", description: "Debes especificar el nombre de la otra cuenta.", variant: "destructive" });
            return;
        }

        onSave({
            descripcion,
            monto: parseFloat(monto),
            cuenta: cuenta === 'Otra' ? otraCuenta : cuenta,
        });

        // Reset form
        setDescripcion('');
        setMonto('');
        setCuenta('');
        setOtraCuenta('');
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

const TablaDiariaTab = () => {
    const [movimientos, setMovimientos] = useState<MovimientoDiario[]>(mockMovimientosDiarios);

    const handleAddMovimiento = (nuevoMovimiento: Omit<MovimientoDiario, 'id' | 'fecha'>) => {
        const fullMovimiento: MovimientoDiario = {
            id: `mov-${Date.now()}`,
            fecha: new Date(),
            ...nuevoMovimiento,
        };
        setMovimientos(prev => [fullMovimiento, ...prev]);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tabla Diaria de Movimientos</CardTitle>
                <CardDescription>Registro de todos los ingresos y gastos del día.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg">
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Cuenta</TableHead>
                                <TableHead className="text-right">Monto</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {movimientos.map(mov => (
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
                                    <TableCell>{mov.cuenta}</TableCell>
                                    <TableCell className={cn("text-right font-bold", mov.tipo === 'Ingreso' ? 'text-green-500' : 'text-destructive')}>
                                        {mov.monto.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {movimientos.length === 0 && (
                        <div className="text-center p-8 text-foreground/70">
                            No hay movimientos registrados hoy.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default function FinanzasPage() {
    const [movimientos, setMovimientos] = useState<MovimientoDiario[]>(mockMovimientosDiarios);
    
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
        <h1 className="text-3xl font-bold font-headline">Gestión Financiera</h1>
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
      </div>
      
      <Tabs defaultValue="cuentas-por-cobrar" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cuentas-por-cobrar">Cuentas por Cobrar</TabsTrigger>
                <TabsTrigger value="tabla-diaria">Tabla Diaria</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cuentas-por-cobrar">
               <CuentasPorCobrarTab />
            </TabsContent>

            <TabsContent value="tabla-diaria">
                <TablaDiariaTab />
            </TabsContent>
        </Tabs>
    </div>
  );
}
