'use client';

import React, { useState, useMemo } from 'react';
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
import { Check, Send, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type OrigenLead = "Facebook" | "TikTok" | "Referencia" | "Sitio Web";
type StatusLead = "Lead Nuevo" | "Contactado" | "Videollamada" | "En Negociación" | "Convertido" | "No Interesado";

interface Lead {
  id: string;
  cliente: string;
  origen: OrigenLead;
  status: StatusLead;
  responsable: "Alma Fer" | "Julio";
}

const mockLeads: Lead[] = [
  { id: 'lead1', cliente: "Gimnasio FitnessPro", origen: "Facebook", status: "Videollamada", responsable: "Alma Fer" },
  { id: 'lead2', cliente: "Tacos El Veloz", origen: "TikTok", status: "Lead Nuevo", responsable: "Julio" },
  { id: 'lead3', cliente: "Clínica Dental Sonrisa", origen: "Referencia", status: "En Negociación", responsable: "Alma Fer" },
  { id: 'lead4', cliente: "Ecommerce de Ropa 'Moda Hoy'", origen: "Facebook", status: "Contactado", responsable: "Julio" },
  { id: 'lead5', cliente: "Constructora Edifica", origen: "Sitio Web", status: "No Interesado", responsable: "Alma Fer" },
  { id: 'lead6', cliente: "Restaurante La Toscana", origen: "TikTok", status: "Videollamada", responsable: "Julio" },
];

const statusColors: Record<StatusLead, string> = {
    "Lead Nuevo": "bg-blue-500",
    "Contactado": "bg-cyan-500",
    "Videollamada": "bg-purple-500",
    "En Negociación": "bg-yellow-500 text-black",
    "Convertido": "bg-green-500",
    "No Interesado": "bg-gray-500",
};

export default function VentasPage() {
    const [leads, setLeads] = useState(mockLeads);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
    const [pautaOption, setPautaOption] = useState<'si' | 'no' | 'ambos'>('si');
    const { toast } = useToast();

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


  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-8">Pipeline de Ventas</h1>
       <Card>
        <CardHeader>
            <CardTitle>Nuevos Prospectos</CardTitle>
            <CardDescription>Gestiona los leads desde el primer contacto hasta la conversión.</CardDescription>
        </CardHeader>
        <CardContent>
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
                        {leads.filter(l => l.status !== 'Convertido' && l.status !== 'No Interesado').map((lead) => (
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
                                     <Button variant="gooeyLeft" size="sm" onClick={() => handleConvertClick(lead)}>
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Convertir en Cliente
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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
