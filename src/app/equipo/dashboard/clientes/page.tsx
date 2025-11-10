

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
import { PlusCircle, Edit, Trash, X, Instagram, Facebook, Link as LinkIcon } from 'lucide-react';
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
import type { Client as ClientType, ClientFinancialProfile } from '@/lib/db/schema';
import { addClient, updateClient, getClients as fetchClientsDB, deleteClients } from './_actions';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


const adsTeam: TeamMember[] = teamMembers.filter(m => ['Julio', 'Luis', 'Fany', 'Carlos', 'Paola', 'Cristian', 'Daniel'].includes(m.name));
const webTeam: TeamMember[] = teamMembers.filter(m => ['Julio', 'Fernando', 'Alexis'].includes(m.name));

const contenidoEncargados: TeamMember[] = teamMembers.filter(m => ['Luis', 'Carlos', 'Fany'].includes(m.name));

const ejecutoresPorEncargado: Record<string, string[]> = {
    'Luis': ['Luis', 'Paola', 'Kari', 'Alexis'],
    'Carlos': ['Carlos', 'Pedro'],
    'Fany': ['Fany', 'Daniel', 'Cristian', 'Aldair']
};

export const ClientFormDialog = ({ client, children, isEditing, onSave }: { client?: Client, children: React.ReactNode, isEditing: boolean, onSave: () => void }) => {
    const [name, setName] = useState('');
    const [representativeName, setRepresentativeName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState('');
    const [instagramUrl, setInstagramUrl] = useState('');
    const [facebookUrl, setFacebookUrl] = useState('');
    const [tiktokUrl, setTiktokUrl] = useState('');
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
            setInstagramUrl(client.instagramUrl || '');
            setFacebookUrl(client.facebookUrl || '');
            setTiktokUrl(client.tiktokUrl || '');
            setAreas(client.managedAreas || []);
            setResponsables({}); 
        } else {
            resetForm();
        }
    }, [client, open]);

    const resetForm = () => {
        setName(''); setRepresentativeName(''); setWhatsapp(''); setEmail('');
        setInstagramUrl(''); setFacebookUrl(''); setTiktokUrl('');
        setServiceType(''); setAreas([]); setResponsables({}); setAvailableEjecutores([]);
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
        
        const clientData = { 
            name, representativeName, whatsapp, email: email || null, managedAreas: areas,
            instagramUrl: instagramUrl || null, facebookUrl: facebookUrl || null, tiktokUrl: tiktokUrl || null
        };
        
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

                    <Separator className="my-2"/>
                    <h4 className="font-medium">Redes Sociales</h4>
                    <Input value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)} placeholder="URL de Instagram (Opcional)" />
                    <Input value={facebookUrl} onChange={e => setFacebookUrl(e.target.value)} placeholder="URL de Facebook (Opcional)" />
                    <Input value={tiktokUrl} onChange={e => setTiktokUrl(e.target.value)} placeholder="URL de TikTok (Opcional)" />
                    
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

export type Client = ClientType & { financialProfile: ClientFinancialProfile | null };

const mockClients: Client[] = [
    { id: 1, name: 'SIFSA', representativeName: 'Emmanuel', whatsapp: '', email: 'sifsafumigacionescdmx@...', managedAreas: ['WEB'], instagramFollowers: null, facebookFollowers: null, tiktokFollowers: null, createdAt: new Date(), instagramUrl: null, facebookUrl: null, tiktokUrl: null, financialProfile: null },
    { id: 2, name: 'DEASA', representativeName: 'Rebeca', whatsapp: '5527883970', email: 'administracion@gpoauda...', managedAreas: ['CONTENIDO', 'ADS'], instagramFollowers: null, facebookFollowers: null, tiktokFollowers: null, createdAt: new Date(), instagramUrl: null, facebookUrl: null, tiktokUrl: null, financialProfile: null },
    { id: 3, name: 'SINUBE', representativeName: 'Jorge', whatsapp: '', email: 'jcasanas@sinube.mx', managedAreas: ['ADS'], instagramFollowers: null, facebookFollowers: null, tiktokFollowers: null, createdAt: new Date(), instagramUrl: null, facebookUrl: null, tiktokUrl: null, financialProfile: null },
    { id: 4, name: 'CAF', representativeName: '', whatsapp: '', email: 'go@consultorescaf.mx', managedAreas: ['WEB'], instagramFollowers: null, facebookFollowers: null, tiktokFollowers: null, createdAt: new Date(), instagramUrl: null, facebookUrl: null, tiktokUrl: null, financialProfile: null },
    { id: 5, name: 'BENJA CONTADOR', representativeName: 'Benjamin', whatsapp: '5548749477', email: null, managedAreas: ['CONTENIDO', 'ADS'], instagramFollowers: null, facebookFollowers: null, tiktokFollowers: null, createdAt: new Date(), instagramUrl: null, facebookUrl: null, tiktokUrl: null, financialProfile: null },
    { id: 6, name: 'BATERIAS', representativeName: 'Jesus', whatsapp: '5549868279', email: null, managedAreas: ['ADS'], instagramFollowers: null, facebookFollowers: null, tiktokFollowers: null, createdAt: new Date(), instagramUrl: null, facebookUrl: null, tiktokUrl: null, financialProfile: null },
    { id: 7, name: 'DFAC', representativeName: 'Luis', whatsapp: '5564220884', email: null, managedAreas: ['CONTENIDO', 'ADS', 'WEB'], instagramFollowers: null, facebookFollowers: null, tiktokFollowers: null, createdAt: new Date(), instagramUrl: null, facebookUrl: null, tiktokUrl: null, financialProfile: null },
    { id: 8, name: 'FRANK OVNI', representativeName: 'Frank Schwarz', whatsapp: '5214425928924', email: null, managedAreas: ['CONTENIDO', 'WEB'], instagramFollowers: null, facebookFollowers: null, tiktokFollowers: null, createdAt: new Date(), instagramUrl: null, facebookUrl: null, tiktokUrl: null, financialProfile: null },
    { id: 9, name: 'MARISQUERIA', representativeName: 'Omar', whatsapp: '5215536656040', email: null, managedAreas: ['CONTENIDO', 'ADS'], instagramFollowers: null, facebookFollowers: null, tiktokFollowers: null, createdAt: new Date(), instagramUrl: null, facebookUrl: null, tiktokUrl: null, financialProfile: null },
    { id: 10, name: 'CREDITOS - DIMEX', representativeName: 'Luis', whatsapp: '5513931110', email: null, managedAreas: ['CONTENIDO', 'ADS'], instagramFollowers: null, facebookFollowers: null, tiktokFollowers: null, createdAt: new Date(), instagramUrl: null, facebookUrl: null, tiktokUrl: null, financialProfile: null },
    { id: 11, name: 'DELICIAS', representativeName: 'Olivia', whatsapp: '5519915154', email: null, managedAreas: ['CONTENIDO', 'ADS'], instagramFollowers: null, facebookFollowers: null, tiktokFollowers: null, createdAt: new Date(), instagramUrl: null, facebookUrl: null, tiktokUrl: null, financialProfile: null },
    { id: 12, name: 'MEDICAL TOWER', representativeName: 'Erik', whatsapp: '5548508611', email: null, managedAreas: ['CONTENIDO', 'ADS'], instagramFollowers: null, facebookFollowers: null, tiktokFollowers: null, createdAt: new Date(), instagramUrl: null, facebookUrl: null, tiktokUrl: null, financialProfile: null },
    { id: 13, name: 'HAIDE', representativeName: 'Haide Unique', whatsapp: '5519219830', email: null, managedAreas: ['CONTENIDO'], instagramFollowers: null, facebookFollowers: null, tiktokFollowers: null, createdAt: new Date(), instagramUrl: null, facebookUrl: null, tiktokUrl: null, financialProfile: null },
    { id: 14, name: 'TOLTEC', representativeName: '', whatsapp: '', email: null, managedAreas: ['WEB'], instagramFollowers: null, facebookFollowers: null, tiktokFollowers: null, createdAt: new Date(), instagramUrl: null, facebookUrl: null, tiktokUrl: null, financialProfile: null },
    { id: 15, name: 'BUFFALO', representativeName: 'Isaac Buffalo', whatsapp: '5633898168', email: null, managedAreas: ['CONTENIDO', 'ADS'], instagramFollowers: null, facebookFollowers: null, tiktokFollowers: null, createdAt: new Date(), instagramUrl: null, facebookUrl: null, tiktokUrl: null, financialProfile: null },
    { id: 16, name: 'ELECTRICA', representativeName: 'Ana Paula', whatsapp: '5513338087', email: null, managedAreas: ['CONTENIDO', 'ADS'], instagramFollowers: null, facebookFollowers: null, tiktokFollowers: null, createdAt: new Date(), instagramUrl: null, facebookUrl: null, tiktokUrl: null, financialProfile: null },
    { id: 17, name: 'MAQTECH', representativeName: 'Arturo', whatsapp: '5578116222', email: 'anapaula.edtorial@gmai...', managedAreas: ['CONTENIDO', 'ADS'], instagramFollowers: null, facebookFollowers: null, tiktokFollowers: null, createdAt: new Date(), instagramUrl: null, facebookUrl: null, tiktokUrl: null, financialProfile: null },
    { id: 18, name: 'DC SOLUTIONS', representativeName: 'Viviana Huerta', whatsapp: '5580200901', email: 'viviana.huerta@dcsolut...', managedAreas: ['CONTENIDO', 'ADS', 'WEB'], instagramFollowers: null, facebookFollowers: null, tiktokFollowers: null, createdAt: new Date(), instagramUrl: null, facebookUrl: null, tiktokUrl: null, financialProfile: null },
    { id: 19, name: 'CALZADO ALLENDE VERO', representativeName: 'Veronica Tellez', whatsapp: '5218262619570', email: null, managedAreas: ['CONTENIDO', 'ADS'], instagramFollowers: null, facebookFollowers: null, tiktokFollowers: null, createdAt: new Date(), instagramUrl: null, facebookUrl: null, tiktokUrl: null, financialProfile: null },
];

const TikTokIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={cn("w-4 h-4", className)}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.04-5.36-.01-4.03-.01-8.05.02-12.07z" />
    </svg>
)

export default function ClientesPage() {
    const { user, loading } = useAuth();
    
    const [clients, setClients] = useState<Client[]>(mockClients);
    const [selectedClients, setSelectedClients] = useState<number[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false); // Changed to false as we use mock data

    const fetchClients = async () => {
        // We are using mock data, so no need to fetch
        // If you switch back to DB, you can use this:
        /*
        setIsLoading(true);
        try {
            const clientsData = await fetchClientsDB();
            setClients(clientsData as Client[]);
        } catch (error) {
            toast({
                title: "Error al cargar clientes",
                description: "No se pudieron obtener los clientes. Intenta recargar la página.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
        */
       // For now, we just reset to the mock data.
       setClients(mockClients);
    };

    // No need for useEffect to fetch data on mount for mock data
    
    const handleRowClick = (client: Client) => {
        if(user?.permissions?.clientes?.editarClientes) {
            setSelectedClient(client);
            setIsEditModalOpen(true);
        }
    };

    const handleSelectionChange = (clientId: number, checked: boolean) => {
        setSelectedClients(prev => 
            checked ? [...prev, clientId] : prev.filter(id => id !== clientId)
        );
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedClients(clients.map(c => c.id));
        } else {
            setSelectedClients([]);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedClients.length === 0) return;
        try {
            // Simulate deletion for mock data
            const newClients = clients.filter(c => !selectedClients.includes(c.id));
            setClients(newClients);
            toast({ title: 'Éxito', description: `${selectedClients.length} cliente(s) eliminados.` });
            setSelectedClients([]);
        } catch (e) {
            toast({ title: 'Error', description: 'No se pudo completar la acción.', variant: 'destructive' });
        }
    };

    if (loading || isLoading) {
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
    
    const isAllSelected = selectedClients.length > 0 && selectedClients.length === clients.length;

    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-8">Gestión de Clientes</h1>
            <Card>
                <CardHeader className='flex-row justify-between items-center'>
                    <div>
                        <CardTitle>Listado de Clientes</CardTitle>
                        <CardDescription>Añade nuevos clientes y consulta su estado.</CardDescription>
                    </div>
                    { (user?.permissions?.clientes?.agregarClientes) && (
                         <ClientFormDialog onSave={fetchClients} isEditing={false}>
                            <Button><PlusCircle className="w-4 h-4 mr-2" /> Añadir Nuevo Cliente</Button>
                        </ClientFormDialog>
                    )}
                </CardHeader>
                <CardContent>
                    {selectedClients.length > 0 && (
                        <div className="flex items-center gap-4 bg-muted p-2 rounded-md my-4">
                            <span className="text-sm font-medium">{selectedClients.length} seleccionado(s)</span>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm"><Trash className="w-4 h-4 mr-2"/>Eliminar</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                        <AlertDialogDescription>Esta acción es irreversible y eliminará permanentemente los clientes seleccionados.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleBulkDelete}>Confirmar</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedClients([])}><X className="w-4 h-4" /></Button>
                        </div>
                    )}

                    <div className="border rounded-lg mt-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                         <Checkbox
                                            checked={isAllSelected}
                                            onCheckedChange={handleSelectAll}
                                            aria-label="Select all"
                                        />
                                    </TableHead>
                                    <TableHead>Nombre de la Empresa</TableHead>
                                    <TableHead>Representante</TableHead>
                                    <TableHead>Áreas Gestionadas</TableHead>
                                    <TableHead>WhatsApp</TableHead>
                                    <TableHead>Email</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clients.map(client => (
                                    <TableRow 
                                        key={client.id} 
                                        data-state={selectedClients.includes(client.id) && "selected"}
                                        onClick={() => handleRowClick(client)}
                                        className={cn(user?.permissions?.clientes?.editarClientes && "cursor-pointer")}
                                    >
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={selectedClients.includes(client.id)}
                                                onCheckedChange={(checked) => handleSelectionChange(client.id, Boolean(checked))}
                                                aria-label={`Select client ${client.name}`}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{client.name}</TableCell>
                                        <TableCell>{client.representativeName || 'N/A'}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 flex-wrap">
                                                {client.managedAreas?.map(area => (
                                                    <Badge key={area} variant="secondary">{area}</Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>{client.whatsapp || 'N/A'}</TableCell>
                                        <TableCell>{client.email || 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         {clients.length === 0 && (
                            <div className="text-center p-8 text-muted-foreground">
                                No hay clientes en esta vista.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

             <Dialog open={isEditModalOpen} onOpenChange={(open) => { if(!open) { setSelectedClient(null); setIsEditModalOpen(false); } else { setIsEditModalOpen(true); } }}>
                <ClientFormDialog client={selectedClient!} onSave={() => { fetchClients(); setSelectedClient(null); setIsEditModalOpen(false); }} isEditing={true}>
                    <DialogContent onClick={(e) => e.stopPropagation()}>
                    </DialogContent>
                </ClientFormDialog>
            </Dialog>
        </div>
    );
}

