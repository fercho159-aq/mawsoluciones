
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
import { cn } from '@/lib/utils';
import { Check, Send, Sparkles, PlusCircle } from 'lucide-react';
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
import { format, getMonth, getYear } from 'date-fns';
import { es } from 'date-fns/locale';
import { getLeads, addProspect } from './_actions';
import type { Lead } from '@/lib/db/schema';


type OrigenLead = "Facebook" | "TikTok" | "Referencia" | "Sitio Web" | string;
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

const AddLeadDialog = ({ onAddLead }: { onAddLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'responsable' | 'status' | 'data'>) => void }) => {
    const [open, setOpen] = useState(false);
    const [cliente, setCliente] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [origen, setOrigen] = useState<OrigenLead>('Referencia');
    const { toast } = useToast();

    const origenes: OrigenLead[] = ["Facebook", "TikTok", "Referencia"];


    const handleAdd = () => {
        if (!cliente || !origen) {
            toast({
                title: "Error",
                description: "El nombre del cliente y el origen son obligatorios.",
                variant: "destructive",
            });
            return;
        }

        onAddLead({ name: cliente, email, phone: telefono, source: origen, company: cliente });
        
        setCliente('');
        setEmail('');
        setTelefono('');
        setOrigen('Referencia');
        setOpen(false);
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
                        <Label htmlFor="cliente">Nombre del Cliente</Label>
                        <Input id="cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Ej. Tacos El Veloz" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email (Opcional)</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contacto@ejemplo.com" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono (Opcional)</Label>
                        <Input id="telefono" type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="5512345678" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="origen">Origen del Prospecto</Label>
                        <Select value={origen} onValueChange={(value: OrigenLead) => setOrigen(value)}>
                            <SelectTrigger id="origen">
                                <SelectValue placeholder="Seleccionar origen" />
                            </SelectTrigger>
                            <SelectContent>
                                {origenes.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
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

export default function VentasPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
    const [pautaOption, setPautaOption] = useState<'si' | 'no' | 'ambos'>('si');
    const { toast } = useToast();

    // Filtros
    const [responsableFilter, setResponsableFilter] = useState('Todos');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [origenFilter, setOrigenFilter] = useState('Todos');
    const [monthFilter, setMonthFilter] = useState('Todos');
    const [searchFilter, setSearchFilter] = useState('');

    const fetchLeads = async () => {
        setIsLoading(true);
        const leadsData = await getLeads();
        setLeads(leadsData as Lead[]);
        setIsLoading(false);
    }
    
    useEffect(() => {
        fetchLeads();
    }, []);

    const handleAddLead = async (newLeadData: Omit<Lead, 'id' | 'createdAt' | 'responsable' | 'status' | 'data'>) => {
        let lastSellerIndex = parseInt(localStorage.getItem('lastAssignedSellerIndex') || '0');
        const newSeller = responsables[lastSellerIndex % responsables.length];
        lastSellerIndex++;
        localStorage.setItem('lastAssignedSellerIndex', lastSellerIndex.toString());

        try {
            await addProspect({
                ...newLeadData,
                status: 'Lead Nuevo',
                responsable: newSeller,
            });
            toast({
                title: "Prospecto Añadido",
                description: `${newLeadData.name} se ha añadido al pipeline y asignado a ${newSeller}.`,
            });
            fetchLeads();
        } catch(e) {
            toast({
                title: "Error",
                description: "No se pudo añadir el prospecto.",
                variant: 'destructive'
            });
        }
    };


    const handleConvertClick = (lead: Lead) => {
        setSelectedLead(lead);
        setIsConvertModalOpen(true);
    };

    const handleConfirmConversion = () => {
        if (selectedLead) {
            // Here you would typically call a server action to convert the lead
            // For now, we just update the local state
            setLeads(prev => prev.map(lead => lead.id === selectedLead.id ? {...lead, status: 'Convertido'} : lead));
            setIsConvertModalOpen(false);
            
            let toastDescription = `El cliente ${selectedLead.name} ha sido movido a Pendientes.`;
            if (pautaOption === 'si') {
                toastDescription += " Se creó una tarea en Pendientes Ads.";
            } else if (pautaOption === 'no') {
                toastDescription += " Se creó una tarea en Pendientes Contenido/Web.";
            } else {
                 toastDescription += " Se crearon tareas en Contenido y Ads.";
            }

            toast({
                title: "¡Cliente Convertido!",
                description: toastDescription,
                className: "bg-green-500 text-white"
            });
        }
    }
    
    const origenes = useMemo(() => {
        const allOrigins = new Set(leads.map(l => l.source.includes('Calculator') ? 'Sitio Web' : l.source));
        return ['Todos', ...Array.from(allOrigins)];
    }, [leads]);

    const availableMonths = useMemo(() => {
        const months = new Set<string>();
        leads.forEach(lead => {
            if (lead.createdAt) {
                months.add(format(new Date(lead.createdAt), 'yyyy-MM'));
            }
        });
        return Array.from(months).sort().reverse();
    }, [leads]);

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const searchMatch = searchFilter === '' || lead.name?.toLowerCase().includes(searchFilter.toLowerCase());
            const responsableMatch = responsableFilter === 'Todos' || lead.responsable === responsableFilter;
            const statusMatch = statusFilter === 'Todos' || lead.status === statusFilter;
            const leadOrigin = lead.source.includes('Calculator') ? 'Sitio Web' : lead.source;
            const origenMatch = origenFilter === 'Todos' || leadOrigin === origenFilter;
            const monthMatch = monthFilter === 'Todos' || (lead.createdAt && format(new Date(lead.createdAt), 'yyyy-MM') === monthFilter);

            return searchMatch && responsableMatch && statusMatch && origenMatch && monthMatch;
        });
    }, [leads, searchFilter, responsableFilter, statusFilter, origenFilter, monthFilter]);

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
                        {origenes.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
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
                        {filteredLeads.filter(l => l.status !== 'Convertido' && l.status !== 'No Interesado').map((lead) => (
                            <TableRow key={lead.id}>
                                <TableCell className="font-medium">{lead.name}</TableCell>
                                <TableCell>{lead.source.includes('Calculator') ? 'Sitio Web' : lead.source}</TableCell>
                                <TableCell>{lead.responsable}</TableCell>
                                <TableCell>
                                    <Badge className={cn("text-white", statusColors[lead.status as StatusLead])}>
                                        {lead.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                     <Button variant="default" size="sm" onClick={() => handleConvertClick(lead)}>
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Convertir en Cliente
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 {filteredLeads.filter(l => l.status !== 'Convertido' && l.status !== 'No Interesado').length === 0 && (
                    <div className="text-center p-8 text-muted-foreground">
                        No hay prospectos activos con los filtros seleccionados.
                    </div>
                )}
            </div>
        </CardContent>
       </Card>

        <Dialog open={isConvertModalOpen} onOpenChange={setIsConvertModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Convertir a {selectedLead?.name} en Cliente</DialogTitle>
                    <DialogDescription>
                        Esto moverá el lead a la base de datos de clientes activos y creará las tareas iniciales.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label className="font-semibold">¿El nuevo cliente requerirá pauta (Ads)?</Label>
                    <RadioGroup value={pautaOption} onValueChange={(val) => setPautaOption(val as 'si' | 'no' | 'ambos')} className="mt-2 space-y-2">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="si" id="pauta-si" />
                            <Label htmlFor="pauta-si" className="font-normal">Sí, solo Pauta</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="pauta-no" />
                            <Label htmlFor="pauta-no" className="font-normal">No, solo Contenido/Web</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ambos" id="pauta-ambos" />
                            <Label htmlFor="pauta-ambos" className="font-normal">Ambos servicios</Label>
                        </div>
                    </RadioGroup>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsConvertModalOpen(false)}>Cancelar</Button>
                    <Button onClick={handleConfirmConversion}>
                        <Check className="w-4 h-4 mr-2"/>
                        Confirmar Conversión
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    </div>
  );
}
