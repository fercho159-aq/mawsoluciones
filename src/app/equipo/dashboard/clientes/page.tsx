
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
import { PlusCircle, Edit } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';

const contenidoTeam = teamMembers.filter(m => ['Julio', 'Luis', 'Fany', 'Carlos', 'Paola', 'Cristian', 'Daniel'].includes(m.name));
const adsTeam = teamMembers.filter(m => ['Julio', 'Luis', 'Fany', 'Carlos', 'Paola', 'Cristian', 'Daniel', 'Bere'].includes(m.name));
const webTeam = teamMembers.filter(m => ['Julio', 'Fernando', 'Alexis'].includes(m.name));

const ClientFormDialog = ({ client, onSave, children, isEditing }: { client?: Client, onSave: (clientData: any, pendientes: Omit<Activity, 'id'>[]) => void, children: React.ReactNode, isEditing: boolean }) => {
    const [name, setName] = useState('');
    const [representativeName, setRepresentativeName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState('');
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const [serviceType, setServiceType] = useState<'Iguala' | 'Proyecto' | 'Ambos' | ''>('');
    const [areas, setAreas] = useState<string[]>([]);
    const [responsables, setResponsables] = useState<{
        contenido?: { encargado: string; ejecutor: string };
        ads?: { responsable: string };
        web?: { responsable: string };
    }>({});
    
    useEffect(() => {
        if(client && open) {
            setName(client.name);
            setRepresentativeName(client.representativeName);
            setWhatsapp(client.whatsapp);
            setEmail(client.email || '');
            setAreas(client.managedAreas || []);
        } else {
            resetForm();
        }
    }, [client, open]);

    const resetForm = () => {
        setName(''); setRepresentativeName(''); setWhatsapp(''); setEmail(''); setServiceType('');
        setAreas([]); setResponsables({});
    }

    const handleSave = () => {
        if (!name || !representativeName || !whatsapp || (!isEditing && ( !serviceType || areas.length === 0))) {
            toast({ title: "Error", description: "Todos los campos marcados con * son obligatorios.", variant: "destructive" });
            return;
        }
        
        if (!isEditing && (
            (areas.includes('Contenido') && (!responsables.contenido?.encargado || !responsables.contenido?.ejecutor)) ||
            (areas.includes('Ads') && !responsables.ads?.responsable) ||
            (areas.includes('Web') && !responsables.web?.responsable)
        )) {
            toast({ title: "Error", description: "Debes asignar responsables para todas las áreas seleccionadas.", variant: "destructive" });
            return;
        }
        
        const clientData = { id: client?.id, name, representativeName, whatsapp, email, managedAreas: areas };
        const nuevosPendientes: Omit<Activity, 'id'>[] = [];

        if (!isEditing) {
             areas.forEach(area => {
                let pendiente: Omit<Activity, 'id' | 'status' | 'fechaCorte'>;
                if (area === 'Contenido' && responsables.contenido) {
                    pendiente = { cliente: name, encargado: responsables.contenido.encargado, ejecutor: responsables.contenido.ejecutor, pendientePrincipal: `Definir estrategia inicial de Contenido para ${serviceType}`, categoria: 'Contenido' }
                    nuevosPendientes.push({ ...pendiente, status: 'Trabajando', fechaCorte: 15 });
                } else if (area === 'Ads' && responsables.ads) {
                    pendiente = { cliente: name, encargado: responsables.ads.responsable, ejecutor: responsables.ads.responsable, pendientePrincipal: `Configurar campaña inicial de Ads para ${serviceType}`, categoria: 'Ads' }
                    nuevosPendientes.push({ ...pendiente, status: 'Trabajando', fechaCorte: 15 });
                } else if (area === 'Web' && responsables.web) {
                    pendiente = { cliente: name, encargado: responsables.web.responsable, ejecutor: responsables.web.responsable, pendientePrincipal: `Planear desarrollo/ajustes Web para ${serviceType}`, categoria: 'Web' }
                    nuevosPendientes.push({ ...pendiente, status: 'Trabajando', fechaCorte: 15 });
                }
            });
        }
       
        onSave(clientData, nuevosPendientes);
        setOpen(false);
        toast({ title: "Éxito", description: `Cliente "${name}" ${isEditing ? 'actualizado' : 'añadido y tareas creadas'}.` });
        if(!isEditing) resetForm();
    };

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) resetForm(); setOpen(o); }}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader><DialogTitle>{isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre de la Empresa*" />
                    <Input value={representativeName} onChange={e => setRepresentativeName(e.target.value)} placeholder="Nombre del Representante*" />
                    <Input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="WhatsApp* (Ej. 52155...)" />
                    <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (Opcional)" />
                    
                    {!isEditing && (
                        <>
                        <Separator className="my-2"/>
                        <h4 className="font-medium">Configuración de Servicios*</h4>
                        <Select value={serviceType} onValueChange={(v) => setServiceType(v as any)}>
                            <SelectTrigger><SelectValue placeholder="Tipo de Servicio*"/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Iguala">Iguala</SelectItem>
                                <SelectItem value="Proyecto">Proyecto</SelectItem>
                                <SelectItem value="Ambos">Ambos</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        <div>
                            <Label>Áreas a Gestionar en Pendientes*</Label>
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
                            <Label className="col-span-2 font-semibold">Responsables Contenido*</Label>
                            <Select onValueChange={(v) => setResponsables(p => ({...p, contenido: {...p.contenido!, encargado: v}}))}>
                                    <SelectTrigger><SelectValue placeholder="Encargado*" /></SelectTrigger>
                                    <SelectContent>{contenidoTeam.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                            </Select>
                            <Select onValueChange={(v) => setResponsables(p => ({...p, contenido: {...p.contenido!, ejecutor: v}}))}>
                                    <SelectTrigger><SelectValue placeholder="Ejecutor*" /></SelectTrigger>
                                    <SelectContent>{contenidoTeam.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                            </Select>
                            </div>
                        )}
                        {areas.includes('Ads') && (
                            <div className="border p-3 rounded-md space-y-2">
                            <Label className="font-semibold">Responsable Ads*</Label>
                            <Select onValueChange={(v) => setResponsables(p => ({...p, ads: {responsable: v}}))}>
                                    <SelectTrigger><SelectValue placeholder="Seleccionar responsable*" /></SelectTrigger>
                                    <SelectContent>{adsTeam.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                            </Select>
                            </div>
                        )}
                        {areas.includes('Web') && (
                            <div className="border p-3 rounded-md space-y-2">
                            <Label className="font-semibold">Responsable Web*</Label>
                            <Select onValueChange={(v) => setResponsables(p => ({...p, web: {responsable: v}}))}>
                                    <SelectTrigger><SelectValue placeholder="Seleccionar responsable*" /></SelectTrigger>
                                    <SelectContent>{webTeam.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                            </Select>
                            </div>
                        )}
                        </>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>{isEditing ? 'Guardar Cambios' : 'Guardar Cliente y Crear Tareas'}</Button>
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
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    const handleSaveClient = (clientData: Client, nuevosPendientes: Omit<Activity, 'id'>[]) => {
        const isEditing = !!clientData.id;
        
        setClients(prev => {
            if (isEditing) {
                return prev.map(c => c.id === clientData.id ? clientData : c);
            } else {
                return [...prev, { ...clientData, id: `client-${Date.now()}` }];
            }
        });

        if (!isEditing && nuevosPendientes.length > 0) {
            console.log('Nuevas tareas para pendientes:', nuevosPendientes);
            const currentPendientes = JSON.parse(localStorage.getItem('pendientes') || JSON.stringify(pendientesData));
            const updatedPendientes = [...currentPendientes, ...nuevosPendientes.map((p, i) => ({...p, id: `pend-${Date.now()}-${i}`}))];
            localStorage.setItem('pendientes', JSON.stringify(updatedPendientes));
        }
    }
    
    const handleRowClick = (client: Client) => {
        setSelectedClient(client);
        setIsEditModalOpen(true);
    };

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
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!user || (user.role !== 'admin' && user.role !== 'contabilidad')) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Acceso Denegado</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>No tienes permiso para ver esta sección.</p>
                </CardContent>
            </Card>
        );
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
                         <ClientFormDialog onSave={handleSaveClient} isEditing={false}>
                            <Button><PlusCircle className="w-4 h-4 mr-2" /> Añadir Nuevo Cliente</Button>
                        </ClientFormDialog>
                    )}
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre de la Empresa</TableHead>
                                    <TableHead>Nombre Representante</TableHead>
                                    <TableHead>Teléfono</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Áreas Gestionadas</TableHead>
                                    { (user?.permissions?.clientes?.verSaldo) && (
                                       <TableHead className="text-right">Saldo Pendiente</TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clients.map(client => (
                                    <TableRow key={client.id} onClick={() => handleRowClick(client)} className="cursor-pointer">
                                        <TableCell className="font-medium">{client.name}</TableCell>
                                        <TableCell>{client.representativeName || 'N/A'}</TableCell>
                                        <TableCell>{client.whatsapp || 'N/A'}</TableCell>
                                        <TableCell>{client.email || 'N/A'}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 flex-wrap">
                                                {client.managedAreas?.map(area => (
                                                    <Badge key={area} variant="secondary">{area}</Badge>
                                                ))}
                                            </div>
                                        </TableCell>
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

            {selectedClient && (
                <ClientFormDialog client={selectedClient} onSave={handleSaveClient} isEditing={true}>
                    <div style={{ display: 'none' }} />
                </ClientFormDialog>
            )}
             {isEditModalOpen && selectedClient && (
                 <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <ClientFormDialog client={selectedClient} onSave={handleSaveClient} isEditing={true}>
                       <></>
                    </ClientFormDialog>
                 </Dialog>
            )}
        </div>
    );
}
