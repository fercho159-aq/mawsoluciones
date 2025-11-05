
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

type OrigenLead = "Facebook" | "TikTok" | "Referencia" | "Sitio Web";
type StatusLead = "Lead Nuevo" | "Contactado" | "Videollamada" | "En Negociación" | "Convertido" | "No Interesado";
type ResponsableVentas = "Alma" | "Fer" | "Julio";

interface Lead {
  id: string;
  cliente: string;
  email?: string;
  telefono?: string;
  origen: OrigenLead;
  status: StatusLead;
  responsable: ResponsableVentas;
  createdAt: Date;
}

const mockLeads: Lead[] = [
  { id: 'lead1', cliente: "Gimnasio FitnessPro", email: "contacto@fitnesspro.com", telefono: "5511223344", origen: "Facebook", status: "Videollamada", responsable: "Alma", createdAt: new Date('2024-10-05T10:00:00Z') },
  { id: 'lead2', cliente: "Tacos El Veloz", email: "info@tacoselveloz.com", telefono: "5522334455", origen: "TikTok", status: "Lead Nuevo", responsable: "Julio", createdAt: new Date('2024-10-15T11:00:00Z') },
  { id: 'lead3', cliente: "Clínica Dental Sonrisa", email: "hola@dentalsonrisa.mx", telefono: "5533445566", origen: "Referencia", status: "En Negociación", responsable: "Fer", createdAt: new Date('2024-09-20T12:00:00Z') },
  { id: 'lead4', cliente: "Ecommerce de Ropa 'Moda Hoy'", email: "ventas@modahoy.com", telefono: "5544556677", origen: "Facebook", status: "Contactado", responsable: "Julio", createdAt: new Date('2024-09-25T14:00:00Z') },
  { id: 'lead5', cliente: "Constructora Edifica", email: "proyectos@edifica.com", telefono: "5555667788", origen: "Sitio Web", status: "No Interesado", responsable: "Alma", createdAt: new Date('2024-08-10T16:00:00Z') },
  { id: 'lead6', cliente: "Restaurante La Toscana", email: "reservas@latoscana.com", telefono: "5566778899", origen: "TikTok", status: "Videollamada", responsable: "Fer", createdAt: new Date('2024-10-01T18:00:00Z') },
];

const statusColors: Record<StatusLead, string> = {
    "Lead Nuevo": "bg-blue-500",
    "Contactado": "bg-cyan-500",
    "Videollamada": "bg-purple-500",
    "En Negociación": "bg-yellow-500 text-black",
    "Convertido": "bg-green-500",
    "No Interesado": "bg-gray-500",
};

const origenes: OrigenLead[] = ["Facebook", "TikTok", "Referencia", "Sitio Web"];
const responsables: ResponsableVentas[] = ["Alma", "Fer", "Julio"];
const statuses: StatusLead[] = ["Lead Nuevo", "Contactado", "Videollamada", "En Negociación", "Convertido", "No Interesado"];

const AddLeadDialog = ({ onAddLead }: { onAddLead: (lead: Omit<Lead, 'id' | 'status' | 'responsable' | 'createdAt'>) => void }) => {
    const [open, setOpen] = useState(false);
    const [cliente, setCliente] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [origen, setOrigen] = useState<OrigenLead>('Facebook');
    const { toast } = useToast();

    const handleAdd = () => {
        if (!cliente || !origen) {
            toast({
                title: "Error",
                description: "El nombre del cliente y el origen son obligatorios.",
                variant: "destructive",
            });
            return;
        }

        onAddLead({ cliente, email, telefono, origen });
        
        // Reset form and close
        setCliente('');
        setEmail('');
        setTelefono('');
        setOrigen('Facebook');
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

    const handleAddLead = (newLeadData: Omit<Lead, 'id' | 'status' | 'responsable'| 'createdAt'>) => {
        setLeads(prevLeads => {
            let lastSellerIndex = parseInt(localStorage.getItem('lastAssignedSellerIndex') || '0');
            
            const newSeller = responsables[lastSellerIndex % responsables.length];
            lastSellerIndex++;
            
            const leadToAdd: Lead = {
                id: `lead-${Date.now()}-${Math.random()}`,
                ...newLeadData,
                status: 'Lead Nuevo',
                responsable: newSeller,
                createdAt: new Date(),
            };
    
            localStorage.setItem('lastAssignedSellerIndex', lastSellerIndex.toString());
            
            toast({
                title: "Prospecto Añadido",
                description: `${leadToAdd.cliente} se ha añadido al pipeline y asignado a ${newSeller}.`,
            });

            return [leadToAdd, ...prevLeads];
        });
    };

    useEffect(() => {
        // This effect runs only once on mount to load initial and stored leads.
        const loadLeads = () => {
            let initialLeads = [...mockLeads];
            const newLeadsJSON = localStorage.getItem('newLeads');

            if (newLeadsJSON) {
                try {
                    const newLeadsFromStorage: Omit<Lead, 'id' | 'status' | 'responsable' | 'createdAt'>[] = JSON.parse(newLeadsJSON);
                    if (Array.isArray(newLeadsFromStorage) && newLeadsFromStorage.length > 0) {
                        let lastSellerIndex = parseInt(localStorage.getItem('lastAssignedSellerIndex') || '0');
                        
                        const leadsToAdd: Lead[] = newLeadsFromStorage.map((newLeadData) => {
                            const newSeller = responsables[lastSellerIndex % responsables.length];
                            lastSellerIndex++;
                            return {
                                id: `lead-${Date.now()}-${Math.random()}`,
                                ...newLeadData,
                                status: 'Lead Nuevo',
                                responsable: newSeller,
                                createdAt: new Date(),
                            };
                        });

                        initialLeads = [...leadsToAdd, ...initialLeads];
                        localStorage.setItem('lastAssignedSellerIndex', lastSellerIndex.toString());
                        localStorage.removeItem('newLeads');
                    }
                } catch (e) {
                    console.error("Error parsing new leads from localStorage", e);
                    localStorage.removeItem('newLeads');
                }
            }
            setLeads(initialLeads);
        };

        loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleConvertClick = (lead: Lead) => {
        setSelectedLead(lead);
        setIsConvertModalOpen(true);
    };

    const handleConfirmConversion = () => {
        if (selectedLead) {
            setLeads(prev => prev.map(lead => lead.id === selectedLead.id ? {...lead, status: 'Convertido'} : lead));
            setIsConvertModalOpen(false);
            
            let toastDescription = `El cliente ${selectedLead.cliente} ha sido movido a Pendientes.`;
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
    
    const availableMonths = useMemo(() => {
        const months = new Set<string>();
        leads.forEach(lead => {
            months.add(format(lead.createdAt, 'yyyy-MM'));
        });
        return Array.from(months).sort().reverse();
    }, [leads]);

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const searchMatch = searchFilter === '' || lead.cliente.toLowerCase().includes(searchFilter.toLowerCase());
            const responsableMatch = responsableFilter === 'Todos' || lead.responsable === responsableFilter;
            const statusMatch = statusFilter === 'Todos' || lead.status === statusFilter;
            const origenMatch = origenFilter === 'Todos' || lead.origen === origenFilter;
            const monthMatch = monthFilter === 'Todos' || format(lead.createdAt, 'yyyy-MM') === monthFilter;

            return searchMatch && responsableMatch && statusMatch && origenMatch && monthMatch;
        });
    }, [leads, searchFilter, responsableFilter, statusFilter, origenFilter, monthFilter]);

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
                        <SelectItem value="Todos">Todos los Orígenes</SelectItem>
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
                                <TableCell className="font-medium">{lead.cliente}</TableCell>
                                <TableCell>{lead.origen}</TableCell>
                                <TableCell>{lead.responsable}</TableCell>
                                <TableCell>
                                    <Badge className={cn("text-white", statusColors[lead.status])}>
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
                    <DialogTitle>Convertir a {selectedLead?.cliente} en Cliente</DialogTitle>
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
