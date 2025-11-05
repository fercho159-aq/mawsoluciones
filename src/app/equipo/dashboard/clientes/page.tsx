
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-provider';
import { initialClients, initialCuentasPorCobrar, type Client, type CuentasPorCobrar } from '@/lib/finanzas-data';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { teamMembers } from '@/lib/team-data';
import { mockData as pendientesData, type Activity, type StatusPendiente } from '@/lib/activities-data';
import { Separator } from '@/components/ui/separator';

const contenidoTeam = teamMembers.filter(m => ['Fany', 'Luis', 'Carlos', 'Julio', 'Aldair', 'Alexis', 'Pedro', 'Dani', 'Bere'].includes(m.name));
const adsTeam = teamMembers.filter(m => ['Luis', 'Carlos', 'Julio', 'Alexis', 'Pedro', 'Bere'].includes(m.name));
const webTeam = teamMembers.filter(m => ['Carlos', 'Pedro', 'Dani'].includes(m.name));


const AddClientDialog = ({ onAdd, children }: { onAdd: (client: Omit<Client, 'id'>, pendientes: Omit<Activity, 'id'>[]) => void, children: React.ReactNode }) => {
    const [name, setName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState('');
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    // New state for services
    const [serviceType, setServiceType] = useState<'Iguala' | 'Proyecto' | 'Ambos' | ''>('');
    const [areas, setAreas] = useState<string[]>([]);
    const [responsables, setResponsables] = useState<{
        contenido?: { encargado: string; ejecutor: string };
        ads?: { responsable: string };
        web?: { responsable: string };
    }>({});
    
    const resetForm = () => {
        setName(''); setWhatsapp(''); setEmail(''); setServiceType('');
        setAreas([]); setResponsables({});
    }

    const handleSave = () => {
        if (!name) {
            toast({ title: "Error", description: "El nombre del cliente es obligatorio.", variant: "destructive" });
            return;
        }

        const nuevosPendientes: Omit<Activity, 'id'>[] = [];
        const clienteNuevoData = { name, whatsapp, email };

        areas.forEach(area => {
            let pendiente: Omit<Activity, 'id' | 'status' | 'fechaCorte'>;
            if (area === 'Contenido' && responsables.contenido) {
                pendiente = {
                    cliente: name,
                    encargado: responsables.contenido.encargado,
                    ejecutor: responsables.contenido.ejecutor,
                    pendientePrincipal: `Definir estrategia inicial de Contenido para ${serviceType}`,
                    categoria: 'Contenido',
                }
                 nuevosPendientes.push({ ...pendiente, status: 'Trabajando', fechaCorte: 15 });
            } else if (area === 'Ads' && responsables.ads) {
                 pendiente = {
                    cliente: name,
                    encargado: responsables.ads.responsable,
                    ejecutor: responsables.ads.responsable,
                    pendientePrincipal: `Configurar campaña inicial de Ads para ${serviceType}`,
                    categoria: 'Ads',
                }
                 nuevosPendientes.push({ ...pendiente, status: 'Trabajando', fechaCorte: 15 });
            } else if (area === 'Web' && responsables.web) {
                 pendiente = {
                    cliente: name,
                    encargado: responsables.web.responsable,
                    ejecutor: responsables.web.responsable,
                    pendientePrincipal: `Planear desarrollo/ajustes Web para ${serviceType}`,
                    categoria: 'Web',
                }
                 nuevosPendientes.push({ ...pendiente, status: 'Trabajando', fechaCorte: 15 });
            }
        });

        onAdd(clienteNuevoData, nuevosPendientes);
        setOpen(false);
        toast({ title: "Éxito", description: `Cliente "${name}" añadido y tareas creadas.` });
        resetForm();
    };

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) resetForm(); setOpen(o); }}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader><DialogTitle>Nuevo Cliente</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del Cliente" />
                    <Input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="WhatsApp (Ej. 52155...)" />
                    <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                    <Separator className="my-2"/>
                    <h4 className="font-medium">Configuración de Servicios</h4>
                    <Select value={serviceType} onValueChange={(v) => setServiceType(v as any)}>
                        <SelectTrigger><SelectValue placeholder="Tipo de Servicio"/></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Iguala">Iguala</SelectItem>
                            <SelectItem value="Proyecto">Proyecto</SelectItem>
                            <SelectItem value="Ambos">Ambos</SelectItem>
                        </SelectContent>
                    </Select>
                    
                    <div>
                        <Label>Áreas a Gestionar en Pendientes</Label>
                        <div className="grid grid-cols-3 gap-4 mt-2">
                           {['Contenido', 'Ads', 'Web'].map(area => (
                               <div key={area} className="flex items-center space-x-2">
                                    <Checkbox id={area} checked={areas.includes(area)} onCheckedChange={(checked) => setAreas(prev => checked ? [...prev, area] : prev.filter(a => a !== area))} />
                                    <Label htmlFor={area}>{area}</Label>
                               </div>
                           ))}
                        </div>
                    </div>
                    {areas.includes('Contenido') && (
                        <div className="grid grid-cols-2 gap-4 border p-3 rounded-md">
                           <Label className="col-span-2 font-semibold">Responsables Contenido</Label>
                           <Select onValueChange={(v) => setResponsables(p => ({...p, contenido: {...p.contenido!, encargado: v}}))}>
                                <SelectTrigger><SelectValue placeholder="Encargado" /></SelectTrigger>
                                <SelectContent>{contenidoTeam.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                           </Select>
                           <Select onValueChange={(v) => setResponsables(p => ({...p, contenido: {...p.contenido!, ejecutor: v}}))}>
                                <SelectTrigger><SelectValue placeholder="Ejecutor" /></SelectTrigger>
                                <SelectContent>{contenidoTeam.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                           </Select>
                        </div>
                    )}
                    {areas.includes('Ads') && (
                        <div className="border p-3 rounded-md space-y-2">
                           <Label className="font-semibold">Responsable Ads</Label>
                           <Select onValueChange={(v) => setResponsables(p => ({...p, ads: {responsable: v}}))}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar responsable" /></SelectTrigger>
                                <SelectContent>{adsTeam.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                           </Select>
                        </div>
                    )}
                     {areas.includes('Web') && (
                        <div className="border p-3 rounded-md space-y-2">
                           <Label className="font-semibold">Responsable Web</Label>
                           <Select onValueChange={(v) => setResponsables(p => ({...p, web: {responsable: v}}))}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar responsable" /></SelectTrigger>
                                <SelectContent>{webTeam.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                           </Select>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar Cliente y Crear Tareas</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function ClientesPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>(initialClients);
    const [cuentasPorCobrar, setCuentasPorCobrar] = useState<CuentasPorCobrar[]>(initialCuentasPorCobrar);

    // Redirect if user does not have access. Waits for user data to be loaded.
    useEffect(() => {
        if (!loading && user && !user.accessSections?.clientes) {
            router.push('/equipo/dashboard');
        }
    }, [user, loading, router]);

    const handleAddClient = (newClientData: Omit<Client, 'id'>, nuevosPendientes: Omit<Activity, 'id'>[]) => {
        const newClient: Client = { id: `client-${Date.now()}`, ...newClientData };
        setClients(prev => [...prev, newClient]);
        
        // This is a simulation. In a real app, this state would be managed globally (e.g. via Context, Redux, Zustand)
        // or fetched again. For now, we'll log it to show it's working.
        if (nuevosPendientes.length > 0) {
            console.log('Nuevas tareas para pendientes:', nuevosPendientes);
            const currentPendientes = JSON.parse(localStorage.getItem('pendientes') || JSON.stringify(pendientesData));
            const updatedPendientes = [...currentPendientes, ...nuevosPendientes.map(p => ({...p, id: `pend-${Date.now()}-${Math.random()}`}))];
            localStorage.setItem('pendientes', JSON.stringify(updatedPendientes));
        }
    }

    const clientBalances = useMemo(() => {
        const balances: Record<string, number> = {};
        clients.forEach(c => balances[c.id] = 0);
        cuentasPorCobrar.forEach(cpc => {
            if (balances[cpc.clienteId] !== undefined) {
                balances[cpc.clienteId] += cpc.monto;
            }
        });
        return balances;
    }, [clients, cuentasPorCobrar]);

    if (loading) {
         return <div className="text-center p-8">Cargando...</div>;
    }

    if (!user || !user.accessSections?.clientes) {
        return <div className="text-center p-8">No tienes permiso para ver esta sección.</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-8">Gestión de Clientes</h1>
            <Card>
                <CardHeader className='flex-row justify-between items-center'>
                    <div>
                        <CardTitle>Listado de Clientes</CardTitle>
                        <CardDescription>Añade nuevos clientes y consulta su estado financiero.</CardDescription>
                    </div>
                    { (user?.permissions?.clientes?.agregarClientes) && (
                         <AddClientDialog onAdd={handleAddClient}>
                            <Button><PlusCircle className="w-4 h-4 mr-2" /> Añadir Nuevo Cliente</Button>
                        </AddClientDialog>
                    )}
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Teléfono</TableHead>
                                    <TableHead>Email</TableHead>
                                    { (user?.permissions?.clientes?.verSaldo) && (
                                       <TableHead className="text-right">Saldo Pendiente</TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clients.map(client => (
                                    <TableRow key={client.id}>
                                        <TableCell className="font-medium">{client.name}</TableCell>
                                        <TableCell>{client.whatsapp || 'N/A'}</TableCell>
                                        <TableCell>{client.email || 'N/A'}</TableCell>
                                        { (user?.permissions?.clientes?.verSaldo) && (
                                            <TableCell className={cn("text-right font-bold", clientBalances[client.id] > 0 ? "text-destructive" : "text-green-500")}>
                                                {clientBalances[client.id].toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
