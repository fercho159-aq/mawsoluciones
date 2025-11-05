
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
import { Textarea } from '@/components/ui/textarea';

type OrigenLead = "Facebook" | "TikTok" | "Referencia" | "Sitio Web";
type StatusLead = "Lead Nuevo" | "Contactado" | "Videollamada" | "En Negociación" | "Convertido" | "No Interesado";

interface Lead {
  id: string;
  cliente: string;
  email?: string;
  telefono?: string;
  origen: OrigenLead;
  status: StatusLead;
  responsable: "Alma Fer" | "Julio";
}

const mockLeads: Lead[] = [
  { id: 'lead1', cliente: "Gimnasio FitnessPro", email: "contacto@fitnesspro.com", telefono: "5511223344", origen: "Facebook", status: "Videollamada", responsable: "Alma Fer" },
  { id: 'lead2', cliente: "Tacos El Veloz", email: "info@tacoselveloz.com", telefono: "5522334455", origen: "TikTok", status: "Lead Nuevo", responsable: "Julio" },
  { id: 'lead3', cliente: "Clínica Dental Sonrisa", email: "hola@dentalsonrisa.mx", telefono: "5533445566", origen: "Referencia", status: "En Negociación", responsable: "Alma Fer" },
  { id: 'lead4', cliente: "Ecommerce de Ropa 'Moda Hoy'", email: "ventas@modahoy.com", telefono: "5544556677", origen: "Facebook", status: "Contactado", responsable: "Julio" },
  { id: 'lead5', cliente: "Constructora Edifica", email: "proyectos@edifica.com", telefono: "5555667788", origen: "Sitio Web", status: "No Interesado", responsable: "Alma Fer" },
  { id: 'lead6', cliente: "Restaurante La Toscana", email: "reservas@latoscana.com", telefono: "5566778899", origen: "TikTok", status: "Videollamada", responsable: "Julio" },
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
const responsables = ["Alma Fer", "Julio"];
const statuses: StatusLead[] = ["Lead Nuevo", "Contactado", "Videollamada", "En Negociación", "Convertido", "No Interesado"];

const AddLeadDialog = ({ onAddLeads }: { onAddLeads: (leads: Omit<Lead, 'id' | 'status' | 'responsable'>[]) => void }) => {
    const [leadsText, setLeadsText] = useState('');
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const handleAdd = () => {
        if (!leadsText.trim()) {
            toast({
                title: "Error",
                description: "El campo de texto está vacío.",
                variant: "destructive",
            });
            return;
        }

        const lines = leadsText.trim().split('\n');
        const newLeads: Omit<Lead, 'id' | 'status' | 'responsable'>[] = [];
        const validOrigins = origenes.map(o => o.toLowerCase());

        for (const line of lines) {
            const parts = line.split(',').map(p => p.trim());
            if (parts.length === 4) {
                const [cliente, email, telefono, origen] = parts;
                const origenLower = origen.toLowerCase();

                if (!validOrigins.includes(origenLower as any)) {
                     toast({
                        title: "Error de Formato",
                        description: `El origen "${origen}" en la línea "${line}" no es válido. Orígenes válidos: ${origenes.join(', ')}`,
                        variant: "destructive",
                    });
                    return; // Stop processing if one is wrong
                }

                newLeads.push({ 
                    cliente, 
                    email, 
                    telefono, 
                    origen: origenes.find(o => o.toLowerCase() === origenLower) as OrigenLead
                });
            } else {
                 toast({
                    title: "Error de Formato",
                    description: `La línea "${line}" no tiene el formato correcto (Nombre, Email, Teléfono, Origen).`,
                    variant: "destructive",
                });
                return; // Stop processing if one line is wrong
            }
        }
        
        onAddLeads(newLeads);
        setLeadsText('');
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Añadir Prospectos
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Añadir Nuevos Prospectos</DialogTitle>
                    <DialogDescription>
                       Pega la lista de prospectos. Cada línea debe tener el formato:
                       <br />
                       <code className="text-xs font-mono p-1 bg-muted rounded-sm">Nombre, Email, Teléfono, Origen</code>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                     <Textarea
                        placeholder="Ejemplo:&#10;Cafetería El Buen Sabor, cafe@ejemplo.com, 5511223344, Referencia&#10;Constructora Fuerte, contacto@constructora.com, 5599887766, Facebook"
                        value={leadsText}
                        onChange={(e) => setLeadsText(e.target.value)}
                        className="h-48"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleAdd}>Añadir Prospectos</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function VentasPage() {
    const [leads, setLeads] = useState(mockLeads);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
    const [pautaOption, setPautaOption] = useState<'si' | 'no' | 'ambos'>('si');
    const { toast } = useToast();

    // Filtros
    const [responsableFilter, setResponsableFilter] = useState('Todos');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [origenFilter, setOrigenFilter] = useState('Todos');
    const [searchFilter, setSearchFilter] = useState('');

    useEffect(() => {
        const newLeadsJSON = localStorage.getItem('newLeads');
        if (newLeadsJSON) {
            try {
                const newLeads = JSON.parse(newLeadsJSON);
                if (newLeads.length > 0) {
                    handleAddLeads(newLeads); // Use the same logic to distribute
                    localStorage.removeItem('newLeads');
                     toast({
                        title: "¡Nuevos Prospectos!",
                        description: `Se han añadido ${newLeads.length} nuevos prospectos desde el sitio web.`,
                    });
                }
            } catch (e) {
                console.error("Error parsing new leads from localStorage", e);
                localStorage.removeItem('newLeads');
            }
        }
    }, [toast]);

    const handleAddLeads = (newLeadsData: Omit<Lead, 'id' | 'status' | 'responsable'>[]) => {
        let lastSeller = localStorage.getItem('lastAssignedSeller') || 'Julio';
        
        const leadsToAdd: Lead[] = newLeadsData.map((newLeadData, index) => {
            const newSeller = lastSeller === 'Julio' ? 'Alma Fer' : 'Julio';
            lastSeller = newSeller;
            return {
                id: `lead-${Date.now()}-${index}`,
                ...newLeadData,
                status: 'Lead Nuevo',
                responsable: newSeller,
            }
        });

        localStorage.setItem('lastAssignedSeller', lastSeller);

        setLeads(prev => [...leadsToAdd, ...prev]);
        toast({
            title: "Prospectos Añadidos",
            description: `${leadsToAdd.length} nuevos prospectos se han añadido al pipeline.`,
        });
    };

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

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const searchMatch = searchFilter === '' || lead.cliente.toLowerCase().includes(searchFilter.toLowerCase());
            const responsableMatch = responsableFilter === 'Todos' || lead.responsable === responsableFilter;
            const statusMatch = statusFilter === 'Todos' || lead.status === statusFilter;
            const origenMatch = origenFilter === 'Todos' || lead.origen === origenFilter;
            return searchMatch && responsableMatch && statusMatch && origenMatch;
        });
    }, [leads, searchFilter, responsableFilter, statusFilter, origenFilter]);

  return (
    <div>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold font-headline">Pipeline de Ventas</h1>
            <AddLeadDialog onAddLeads={handleAddLeads} />
        </div>
       <Card>
        <CardHeader>
            <CardTitle>Nuevos Prospectos</CardTitle>
            <CardDescription>Gestiona los leads desde el primer contacto hasta la conversión.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <Input 
                    placeholder="Buscar por cliente..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
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

    