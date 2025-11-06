
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-provider';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { teamMembers, type TeamMember } from '@/lib/team-data';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { Client } from '@/lib/db/schema';
import { addClient, updateClient, getClients } from './_actions';


const adsTeam: TeamMember[] = teamMembers.filter(m => ['Julio', 'Luis', 'Fany', 'Carlos', 'Paola', 'Cristian', 'Daniel'].includes(m.name));
const webTeam: TeamMember[] = teamMembers.filter(m => ['Julio', 'Fernando', 'Alexis'].includes(m.name));

const contenidoEncargados: TeamMember[] = teamMembers.filter(m => ['Luis', 'Carlos', 'Fany'].includes(m.name));

const ejecutoresPorEncargado: Record<string, string[]> = {
    'Luis': ['Luis', 'Paola', 'Kari', 'Alexis'],
    'Carlos': ['Carlos', 'Pedro'],
    'Fany': ['Fany', 'Daniel', 'Cristian', 'Aldair']
};

const ClientFormDialog = ({ client, children, isEditing, onSave }: { client?: Client, children: React.ReactNode, isEditing: boolean, onSave: () => void }) => {
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

    const [availableEjecutores, setAvailableEjecutores] = useState<TeamMember[]>([]);

    useEffect(() => {
        if (client && open) {
            setName(client.name);
            setRepresentativeName(client.representativeName);
            setWhatsapp(client.whatsapp);
            setEmail(client.email || '');
            setAreas(client.managedAreas || []);
            setResponsables({}); 
        } else {
            resetForm();
        }
    }, [client, open]);

    const resetForm = () => {
        setName(''); setRepresentativeName(''); setWhatsapp(''); setEmail(''); setServiceType('');
        setAreas([]); setResponsables({}); setAvailableEjecutores([]);
    }

    const handleEncargadoContenidoChange = (encargadoName: string) => {
        const ejecutoresNombres = ejecutoresPorEncargado[encargadoName] || [];
        const ejecutoresFiltrados = teamMembers.filter(m => ejecutoresNombres.includes(m.name));
        setAvailableEjecutores(ejecutoresFiltrados);
        
        setResponsables(prev => ({
            ...prev,
            contenido: {
                encargado: encargadoName,
                ejecutor: '' // Reset ejecutor when encargado changes
            }
        }));
    };

    const handleSave = async () => {
        if (!name || !representativeName || !whatsapp) {
             toast({ title: "Error", description: "Nombre de la empresa, representante y WhatsApp son obligatorios.", variant: "destructive" });
            return;
        }

        if (!isEditing && (!serviceType || areas.length === 0)) {
            toast({ title: "Error", description: "Debes configurar los servicios para un nuevo cliente.", variant: "destructive" });
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
        
        const clientData = { name, representativeName, whatsapp, email: email || null, managedAreas: areas };
        
        const dataToSend = {
            ...clientData,
            responsables: {
                ...((areas.includes('Contenido') && responsables.contenido) && { contenido: responsables.contenido }),
                ...((areas.includes('Ads') && responsables.ads) && { ads: responsables.ads }),
                ...((areas.includes('Web') && responsables.web) && { web: responsables.web }),
            }
        };
        
        try {
            if (isEditing && client?.id) {
                await updateClient(client.id, clientData);
            } else {
                await addClient(dataToSend);
            }
            startTransition(() => {
                onSave();
                setOpen(false);
                toast({ title: "Éxito", description: `Cliente "${name}" ${isEditing ? 'actualizado' : 'añadido'}.` });
                if(!isEditing) resetForm();
            });
        } catch (error) {
            console.error("Error saving client:", error);
            toast({ title: "Error", description: "No se pudo guardar el cliente.", variant: "destructive" });
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if(!o) resetForm();}}>
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
                            <Select onValueChange={handleEncargadoContenidoChange} value={responsables.contenido?.encargado || ''}>
                                <SelectTrigger><SelectValue placeholder="Encargado*" /></SelectTrigger>
                                <SelectContent>{contenidoEncargados.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                            </Select>
                            <Select 
                                onValueChange={(v) => setResponsables(p => ({...p, contenido: {...p.contenido!, ejecutor: v}}))}
                                value={responsables.contenido?.ejecutor || ''}
                                disabled={!responsables.contenido?.encargado}
                            >
                                <SelectTrigger><SelectValue placeholder="Ejecutor*" /></SelectTrigger>
                                <SelectContent>{availableEjecutores.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                            </Select>
                            </div>
                        )}
                        {areas.includes('Ads') && (
                            <div className="border p-3 rounded-md space-y-2">
                            <Label className="font-semibold">Responsable Ads*</Label>
                            <Select onValueChange={(v) => setResponsables(p => ({...p, ads: {responsable: v}}))} value={responsables.ads?.responsable || ''}>
                                    <SelectTrigger><SelectValue placeholder="Seleccionar responsable*" /></SelectTrigger>
                                    <SelectContent>{adsTeam.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                            </Select>
                            </div>
                        )}
                        {areas.includes('Web') && (
                            <div className="border p-3 rounded-md space-y-2">
                            <Label className="font-semibold">Responsable Web*</Label>
                            <Select onValueChange={(v) => setResponsables(p => ({...p, web: {responsable: v}}))} value={responsables.web?.responsable || ''}>
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
                    <Button onClick={handleSave}>{isEditing ? 'Guardar Cambios' : 'Guardar Cliente'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function ClientesPage() {
    const { user, loading } = useAuth();
    
    const [clients, setClients] = useState<Client[]>([]);
    const [cuentasPorCobrar, setCuentasPorCobrar] = useState<any[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const router = useRouter();

    const fetchClients = async () => {
        const clientsData = await getClients();
        setClients(clientsData);
    };

    useEffect(() => {
        fetchClients();
    }, []);
    
    const handleRowClick = (client: Client) => {
        if(user?.permissions?.clientes?.editarClientes) {
            setSelectedClient(client);
            setIsEditModalOpen(true);
        }
    };

    const clientBalances = useMemo(() => {
        const balances: Record<number, number> = {};
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

    if (!user || !user.accessSections?.clientes) {
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
                         <ClientFormDialog onSave={fetchClients} isEditing={false}>
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
                                    <TableRow key={client.id} onClick={() => handleRowClick(client)} className={cn(user?.permissions?.clientes?.editarClientes && "cursor-pointer")}>
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
                                            <TableCell className={cn("text-right font-bold", (clientBalances[client.id] || 0) > 0 ? "text-destructive" : "text-green-500")}>
                                                {(clientBalances[client.id] || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

             <Dialog open={isEditModalOpen} onOpenChange={(open) => { if(!open) { setSelectedClient(null); setIsEditModalOpen(false); } else { setIsEditModalOpen(true); } }}>
                <DialogContent>
                    <ClientFormDialog client={selectedClient!} onSave={() => { fetchClients(); setSelectedClient(null); setIsEditModalOpen(false); }} isEditing={true}>
                        <div></div>
                    </ClientFormDialog>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export type { Client };
