
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
import { cn } from '@/lib/utils';
import { Check, Sparkles, PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getProspects, addMawProspect, convertProspectToClient } from './_actions';
import type { Prospect, NewProspect } from '@/lib/db/schema';
import { teamMembers, type TeamMember } from '@/lib/team-data';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';


type OrigenLead = "Facebook" | "TikTok" | "Referencia" | "Sitio Web" | "Instagram" | string;
type StatusLead = "Lead Nuevo" | "Contactado" | "Videollamada" | "En Negociación" | "Convertido" | "No Interesado";
type ResponsableVentas = "Alma" | "Fer" | "Julio";

const statusColors: Record<StatusLead, string> = {
    "Lead Nuevo": "bg-blue-500",
    "Contactado": "bg-cyan-500",
    "Videollamada": "bg-purple-500",
    "En Negociación": "bg-yellow-500 text-black",
    "Convertido": "bg-green-500",
    "No Interesado": "bg-gray-500",
};

const responsables: ResponsableVentas[] = ["Alma", "Fer", "Julio"];
const statuses: StatusLead[] = ["Lead Nuevo", "Contactado", "Videollamada", "En Negociación", "Convertido", "No Interesado"];
const leadSources: OrigenLead[] = ["Referencia", "Sitio Web", "TikTok", "Facebook", "Instagram"];

const AddLeadDialog = ({ onAddLead }: { onAddLead: (lead: Partial<Omit<NewProspect, 'id' | 'createdAt'>>) => void }) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [source, setSource] = useState<OrigenLead>('Referencia');
    const { toast } = useToast();

    const handleAdd = async () => {
        if (!name && !company) {
            toast({
                title: "Error",
                description: "El nombre del cliente o de la empresa es obligatorio.",
                variant: "destructive",
            });
            return;
        }

        try {
            await onAddLead({ name, company, email, phone, source });
            toast({
                title: "Prospecto Añadido",
                description: `${name || company} se ha añadido al pipeline.`,
            });
            setName('');
            setCompany('');
            setEmail('');
            setPhone('');
            setSource('Referencia');
            setOpen(false);
        } catch (error) {
             toast({
                title: "Error",
                description: "No se pudo añadir el prospecto.",
                variant: 'destructive'
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Añadir Prospecto
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Añadir Nuevo Prospecto</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="cliente">Nombre del Contacto</Label>
                        <Input id="cliente" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Juan Pérez" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="empresa">Nombre de la Empresa</Label>
                        <Input id="empresa" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Ej. Tacos El Veloz" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email (Opcional)</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contacto@ejemplo.com" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono (Opcional)</Label>
                        <Input id="telefono" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="5512345678" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="source">Origen del Prospecto</Label>
                        <Select value={source} onValueChange={(value) => setSource(value as OrigenLead)}>
                            <SelectTrigger id="source"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {leadSources.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleAdd}>Añadir Prospecto</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const adsTeam: TeamMember[] = teamMembers.filter(m => ['Julio', 'Luis', 'Fany', 'Carlos', 'Paola', 'Cristian', 'Daniel'].includes(m.name));
const webTeam: TeamMember[] = teamMembers.filter(m => ['Julio', 'Fernando', 'Alexis'].includes(m.name));
const contenidoEncargados: TeamMember[] = teamMembers.filter(m => ['Luis', 'Carlos', 'Fany'].includes(m.name));
const ejecutoresPorEncargado: Record<string, string[]> = {
    'Luis': ['Luis', 'Paola', 'Kari', 'Alexis'],
    'Carlos': ['Carlos', 'Pedro'],
    'Fany': ['Fany', 'Daniel', 'Cristian', 'Aldair']
};

const ConvertLeadDialog = ({ prospect, onSave, children }: { prospect: Prospect | null, onSave: () => void, children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    
    // Client Form State
    const [name, setName] = useState('');
    const [representativeName, setRepresentativeName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState('');
    const [serviceType, setServiceType] = useState<'Iguala' | 'Proyecto' | 'Ambos' | ''>('');
    const [areas, setAreas] = useState<string[]>([]);
    const [responsables, setResponsables] = useState<{
        contenido?: { encargado: string; ejecutor: string };
        ads?: { responsable: string };
        web?: { responsable: string };
    }>({});
    const [availableEjecutores, setAvailableEjecutores] = useState<TeamMember[]>([]);

    useEffect(() => {
        if (prospect && open) {
            setName(prospect.company || '');
            setRepresentativeName(prospect.name || '');
            setWhatsapp(prospect.phone || '');
            setEmail(prospect.email || '');
            // Reset other fields
            setServiceType('');
            setAreas([]);
            setResponsables({});
            setAvailableEjecutores([]);
        }
    }, [prospect, open]);

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
            contenido: { encargado: encargadoName, ejecutor: '' }
        }));
    };

    const handleSave = async () => {
        if (!prospect) return;

        if (!name || !representativeName || !whatsapp || !serviceType || areas.length === 0) {
            toast({ title: "Error", description: "Completa todos los campos obligatorios para crear el cliente.", variant: "destructive" });
            return;
        }

        if (
            (areas.includes('Contenido') && (!responsables.contenido?.encargado || !responsables.contenido?.ejecutor)) ||
            (areas.includes('Ads') && !responsables.ads?.responsable) ||
            (areas.includes('Web') && !responsables.web?.responsable)
        ) {
            toast({ title: "Error", description: "Debes asignar responsables para todas las áreas seleccionadas.", variant: "destructive" });
            return;
        }

        const clientData: NewClientData = {
            name,
            representativeName,
            whatsapp,
            email: email || null,
            managedAreas: areas,
            responsables
        };

        try {
            await convertProspectToClient(prospect.id, clientData);
            toast({
                title: "¡Cliente Convertido!",
                description: `${prospect.name || prospect.company} ahora es un cliente y se crearon sus pendientes iniciales.`,
                className: "bg-green-500 text-white"
            });
            startTransition(() => {
                onSave();
                setOpen(false);
                resetForm();
            });
        } catch (error) {
            console.error("Conversion Error:", error);
            toast({ title: "Error", description: "No se pudo convertir el prospecto.", variant: "destructive" });
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => {setOpen(o); if(!o) resetForm();}}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Convertir a "{prospect?.name || prospect?.company}" en Cliente</DialogTitle>
                    <DialogDescription>Completa la información para registrar al nuevo cliente y crear sus pendientes iniciales.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-2">
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre de la Empresa*" />
                    <Input value={representativeName} onChange={e => setRepresentativeName(e.target.value)} placeholder="Nombre del Representante*" />
                    <Input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="WhatsApp* (Ej. 52155...)" />
                    <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (Opcional)" />
                    
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
                                    <Checkbox id={`area-${area}`} checked={areas.includes(area)} onCheckedChange={(checked) => setAreas(prev => checked ? [...prev, area] : prev.filter(a => a !== area))} />
                                    <Label htmlFor={`area-${area}`}>{area}</Label>
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
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}><Check className="w-4 h-4 mr-2"/>Confirmar Conversión</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function VentasPage() {
    const [prospects, setProspects] = useState<Prospect[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<Prospect | null>(null);

    // Filtros
    const [responsableFilter, setResponsableFilter] = useState('Todos');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [origenFilter, setOrigenFilter] = useState('Todos');
    const [monthFilter, setMonthFilter] = useState('Todos');
    const [searchFilter, setSearchFilter] = useState('');

    const fetchProspects = async () => {
        setIsLoading(true);
        const prospectsData = await getProspects();
        setProspects(prospectsData as Prospect[]);
        setIsLoading(false);
    }
    
    useEffect(() => {
        fetchProspects();
    }, []);

    const handleAddLead = async (newProspectData: Partial<Omit<NewProspect, 'id' | 'createdAt'>>) => {
        await addMawProspect(newProspectData);
        fetchProspects();
    };

    const origenes = useMemo(() => {
        const allOrigins = new Set(prospects.map(l => l.source || 'N/A' ));
        return ['Todos', ...Array.from(allOrigins)];
    }, [prospects]);

    const availableMonths = useMemo(() => {
        const months = new Set<string>();
        prospects.forEach(lead => {
            if (lead.createdAt) {
                months.add(format(new Date(lead.createdAt), 'yyyy-MM'));
            }
        });
        return Array.from(months).sort().reverse();
    }, [prospects]);

    const filteredProspects = useMemo(() => {
        return prospects.filter(lead => {
            const searchMatch = searchFilter === '' || lead.name?.toLowerCase().includes(searchFilter.toLowerCase()) || lead.company?.toLowerCase().includes(searchFilter.toLowerCase());
            const responsableMatch = responsableFilter === 'Todos' || lead.responsable === responsableFilter;
            const statusMatch = statusFilter === 'Todos' || lead.status === statusFilter;
            const origenMatch = origenFilter === 'Todos' || lead.source === origenFilter;
            const monthMatch = monthFilter === 'Todos' || (lead.createdAt && format(new Date(lead.createdAt), 'yyyy-MM') === monthFilter);

            return searchMatch && responsableMatch && statusMatch && origenMatch && monthMatch;
        });
    }, [prospects, searchFilter, responsableFilter, statusFilter, origenFilter, monthFilter]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div></div>;
  }

  return (
    <div>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold font-headline">Pipeline de Ventas</h1>
            <AddLeadDialog onAddLead={handleAddLead} />
        </div>
       <Card>
        <CardHeader>
            <CardTitle>Nuevos Prospectos</CardTitle>
            <CardDescription>Gestiona los leads desde el primer contacto hasta la conversión.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <Input 
                    placeholder="Buscar por cliente..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="col-span-2 md:col-span-1"
                />
                <Select value={responsableFilter} onValueChange={setResponsableFilter}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Todos">Todos los Responsables</SelectItem>
                        {responsables.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Todos">Todos los Status</SelectItem>
                        {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={origenFilter} onValueChange={setOrigenFilter}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {origenes.map(o => <SelectItem key={o} value={o!}>{o}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={monthFilter} onValueChange={setMonthFilter}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Todos">Todos los Meses</SelectItem>
                        {availableMonths.map(month => (
                            <SelectItem key={month} value={month}>{format(new Date(month), "MMMM yyyy", {locale: es})}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Origen</TableHead>
                            <TableHead>Responsable</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProspects.filter(l => l.status !== 'Convertido' && l.status !== 'No Interesado').map((lead) => (
                            <TableRow key={lead.id}>
                                <TableCell className="font-medium">{lead.name || lead.company}</TableCell>
                                <TableCell>{lead.source}</TableCell>
                                <TableCell>{lead.responsable}</TableCell>
                                <TableCell>
                                    <Badge className={cn("text-white", statusColors[lead.status as StatusLead])}>
                                        {lead.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                     <ConvertLeadDialog prospect={lead} onSave={fetchProspects}>
                                         <Button variant="default" size="sm">
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Convertir en Cliente
                                        </Button>
                                     </ConvertLeadDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 {filteredProspects.filter(l => l.status !== 'Convertido' && l.status !== 'No Interesado').length === 0 && (
                    <div className="text-center p-8 text-muted-foreground">
                        No hay prospectos activos con los filtros seleccionados.
                    </div>
                )}
            </div>
        </CardContent>
       </Card>
    </div>
  );
}
