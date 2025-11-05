'use client';

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

type Status = "En Proceso" | "Pausado" | "Finalizado" | "Facturación" | "Próximo Inicio";

const mockData = [
  {
    cliente: "Biofert",
    responsable: "Angel",
    pendiente: "Hacer video para redes sociales sobre la empresa",
    ultimaVisita: "2024-10-25",
    siguienteVisita: "2024-11-05",
    status: "En Proceso" as Status,
  },
  {
    cliente: "Medical Tower",
    responsable: "Daniel",
    pendiente: "Optimización de campaña de Google Ads",
    ultimaVisita: "2024-10-28",
    siguienteVisita: "2024-11-10",
    status: "En Proceso" as Status,
  },
  {
    cliente: "NIU Coliving",
    responsable: "Javier",
    pendiente: "Desarrollo de nueva sección en la web",
    ultimaVisita: "2024-09-15",
    siguienteVisita: "2024-11-01",
    status: "Pausado" as Status,
  },
  {
    cliente: "Cenote San Isidro",
    responsable: "Angel",
    pendiente: "Facturación de servicios de gestión de redes",
    ultimaVisita: "2024-10-30",
    siguienteVisita: "",
    status: "Facturación" as Status,
  },
  {
    cliente: "Saudade do Brazil",
    responsable: "Daniel",
    pendiente: "Planificación de campaña para Diciembre",
    ultimaVisita: "2024-10-20",
    siguienteVisita: "2024-11-08",
    status: "En Proceso" as Status,
  },
  {
    cliente: "Polanco Santino",
    responsable: "Javier",
    pendiente: "Campaña de video terminada, pendiente de revisión",
    ultimaVisita: "2024-10-29",
    siguienteVisita: "2024-11-02",
    status: "Finalizado" as Status,
  },
   {
    cliente: "Nuevo Cliente Web",
    responsable: "Angel",
    pendiente: "Kick-off de proyecto web",
    ultimaVisita: "",
    siguienteVisita: "2024-11-15",
    status: "Próximo Inicio" as Status,
  },
];

const statusColors: Record<Status, string> = {
  "En Proceso": "bg-blue-500",
  "Pausado": "bg-yellow-500",
  "Finalizado": "bg-green-500",
  "Facturación": "bg-purple-500",
  "Próximo Inicio": "bg-gray-500",
};

const responsables = Array.from(new Set(mockData.map(item => item.responsable)));
const statuses = Array.from(new Set(mockData.map(item => item.status)));


export default function PendientesPage() {
    const [responsableFilter, setResponsableFilter] = useState('Todos');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [searchFilter, setSearchFilter] = useState('');

    const filteredData = useMemo(() => {
        return mockData.filter(item => {
            const responsableMatch = responsableFilter === 'Todos' || item.responsable === responsableFilter;
            const statusMatch = statusFilter === 'Todos' || item.status === statusFilter;
            const searchMatch = searchFilter === '' || item.cliente.toLowerCase().includes(searchFilter.toLowerCase()) || item.pendiente.toLowerCase().includes(searchFilter.toLowerCase());
            return responsableMatch && statusMatch && searchMatch;
        });
    }, [responsableFilter, statusFilter, searchFilter]);

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-8">Pendientes de Equipo</h1>
       <Card className="mb-8">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <Input 
                placeholder="Buscar por cliente o pendiente..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="max-w-xs"
            />
            <Select value={responsableFilter} onValueChange={setResponsableFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filtrar por Responsable" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Todos">Todos los Responsables</SelectItem>
                    {responsables.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
            </Select>
             <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filtrar por Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Todos">Todos los Status</SelectItem>
                     {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
            </Select>
        </CardContent>
       </Card>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Cliente</TableHead>
              <TableHead className="w-[120px]">Responsable</TableHead>
              <TableHead>Pendiente</TableHead>
              <TableHead className="w-[150px]">Última Visita</TableHead>
              <TableHead className="w-[150px]">Siguiente Visita</TableHead>
              <TableHead className="w-[120px] text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.cliente}</TableCell>
                <TableCell>{item.responsable}</TableCell>
                <TableCell>{item.pendiente}</TableCell>
                <TableCell>{item.ultimaVisita || "N/A"}</TableCell>
                <TableCell>{item.siguienteVisita || "N/A"}</TableCell>
                <TableCell className="text-right">
                  <Badge className={cn("text-white", statusColors[item.status])}>
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredData.length === 0 && (
            <div className="text-center p-8 text-foreground/70">
                No se encontraron pendientes con los filtros seleccionados.
            </div>
        )}
      </div>
    </div>
  );
}
