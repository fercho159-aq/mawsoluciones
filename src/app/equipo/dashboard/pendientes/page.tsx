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
import { Checkbox } from '@/components/ui/checkbox';

type Status = "En Proceso" | "Pausado" | "Finalizado" | "Facturación" | "Próximo Inicio" | "Pendiente";

const mockData = [
    { id: "1", cliente: "DELICIAS", responsable: "Fany", ejecutor: "Aldair", pendiente: "Revisar estrategia de contenido Q4", ultimaVisita: "2024-10-15", siguienteVisita: "2024-11-15", status: "En Proceso" as Status, completado: false },
    { id: "2", cliente: "DEASA", responsable: "Fany", ejecutor: "Alexis", pendiente: "Lanzar campaña de Google Ads", ultimaVisita: "2024-10-10", siguienteVisita: "2024-11-10", status: "En Proceso" as Status, completado: false },
    { id: "3", cliente: "CREDITOS", responsable: "Luis", ejecutor: "Carlos", pendiente: "Optimización SEO de la landing page", ultimaVisita: "2024-09-20", siguienteVisita: "2024-11-05", status: "Pendiente" as Status, completado: false },
    { id: "4", cliente: "ALDO", responsable: "Carlos", ejecutor: "Cristian", pendiente: "Facturación de servicios de Octubre", ultimaVisita: "2024-10-25", siguienteVisita: "", status: "Facturación" as Status, completado: true },
    { id: "5", cliente: "Shaddai", responsable: "Julio", ejecutor: "Dani", pendiente: "Planificar calendario de publicaciones de Noviembre", ultimaVisita: "2024-10-18", siguienteVisita: "2024-11-02", status: "En Proceso" as Status, completado: false },
    { id: "6", cliente: "MAQTECH", responsable: "Fany", ejecutor: "Fany", pendiente: "Análisis de métricas de redes sociales", ultimaVisita: "2024-10-22", siguienteVisita: "2024-11-22", status: "En Proceso" as Status, completado: false },
    { id: "7", cliente: "Urologo", responsable: "Luis", ejecutor: "Julio", pendiente: "Creación de 4 videos para TikTok", ultimaVisita: "2024-10-05", siguienteVisita: "2024-11-05", status: "Finalizado" as Status, completado: true },
    { id: "8", cliente: "Calzones", responsable: "Carlos", ejecutor: "Kari", pendiente: "Configuración de campaña de email marketing", ultimaVisita: "2024-10-12", siguienteVisita: "2024-11-12", status: "Pausado" as Status, completado: false },
    { id: "9", cliente: "Bufalo", responsable: "Fany", ejecutor: "Pao", pendiente: "Kick-off de nuevo proyecto", ultimaVisita: "", siguienteVisita: "2024-11-01", status: "Próximo Inicio" as Status, completado: false },
    { id: "10", cliente: "QUESOS", responsable: "Luis", ejecutor: "Pedro", pendiente: "Diseño de carrusel para Instagram", ultimaVisita: "2024-10-19", siguienteVisita: "2024-11-19", status: "En Proceso" as Status, completado: false },
    { id: "11", cliente: "WUAPAS", responsable: "Fany", ejecutor: "Aldair", pendiente: "Reporte de rendimiento de pauta de Octubre", ultimaVisita: "2024-10-28", siguienteVisita: "", status: "Pendiente" as Status, completado: false },
    { id: "12", cliente: "BRAZIL", responsable: "Carlos", ejecutor: "Alexis", pendiente: "Agendar sesión de fotos de producto", ultimaVisita: "2024-09-30", siguienteVisita: "2024-11-10", status: "En Proceso" as Status, completado: false },
    { id: "13", cliente: "CLINICA huesos", responsable: "Julio", ejecutor: "Carlos", pendiente: "Escribir 2 artículos para el blog", ultimaVisita: "2024-10-14", siguienteVisita: "2024-11-14", status: "En Proceso" as Status, completado: false },
    { id: "14", cliente: "ZAPATOS", responsable: "Fany", ejecutor: "Cristian", pendiente: "Revisión de estrategia con el cliente", ultimaVisita: "2024-10-25", siguienteVisita: "2024-11-25", status: "Pendiente" as Status, completado: false },
    { id: "15", cliente: "Biofert", responsable: "Luis", ejecutor: "Dani", pendiente: "Programar contenido de la semana", ultimaVisita: "2024-10-21", siguienteVisita: "2024-11-04", status: "Finalizado" as Status, completado: true },
    { id: "16", cliente: "Tecnosim", responsable: "Fany", ejecutor: "Fany", pendiente: "Hacer 4 videos HOY", ultimaVisita: "2024-10-24", siguienteVisita: "2024-11-24", status: "Pendiente" as Status, completado: false },
    { id: "17", cliente: "Marisqueria", responsable: "Carlos", ejecutor: "Julio", pendiente: "Optimizar campaña de Google Ads", ultimaVisita: "2024-10-20", siguienteVisita: "2024-11-20", status: "En Proceso" as Status, completado: false },
    { id: "18", cliente: "DC Solutions", responsable: "Julio", ejecutor: "Kari", pendiente: "Enviar reporte mensual de resultados", ultimaVisita: "2024-10-30", siguienteVisita: "", status: "Facturación" as Status, completado: true },
    { id: "19", cliente: "MEDICAL TOWER", responsable: "Fany", ejecutor: "Pao", pendiente: "Preparar propuesta para campaña de Navidad", ultimaVisita: "2024-10-16", siguienteVisita: "2024-11-01", status: "En Proceso" as Status, completado: false },
    { id: "20", cliente: "POLAR", responsable: "Luis", ejecutor: "Pedro", pendiente: "Revisar accesos a cuenta publicitaria", ultimaVisita: "2024-10-23", siguienteVisita: "2024-11-23", status: "Pausado" as Status, completado: false },
    { id: "21", cliente: "BATERIAS", responsable: "Fany", ejecutor: "Aldair", pendiente: "Actualizar catálogo de productos en la web", ultimaVisita: "2024-10-11", siguienteVisita: "2024-11-11", status: "En Proceso" as Status, completado: false },
    { id: "22", cliente: "PROPERTY TRADERS", responsable: "Carlos", ejecutor: "Alexis", pendiente: "Creación de landing page para nuevo desarrollo", ultimaVisita: "2024-10-01", siguienteVisita: "2024-11-01", status: "En Proceso" as Status, completado: false },
    { id: "23", cliente: "Sinube Pauta", responsable: "Julio", ejecutor: "Bere", pendiente: "Optimización de presupuesto de pauta", ultimaVisita: "2024-10-25", siguienteVisita: "2024-11-25", status: "En Proceso" as Status, completado: false },
    { id: "24", cliente: "PORTAL VIVIENTE", responsable: "Fany", ejecutor: "Nai", pendiente: "Análisis de la competencia en redes", ultimaVisita: "2024-10-17", siguienteVisita: "2024-11-17", status: "Pendiente" as Status, completado: false },
    { id: "25", cliente: "ELECTRICA", responsable: "Luis", ejecutor: "Enrrique", pendiente: "Plan de medios para el próximo trimestre", ultimaVisita: "2024-10-08", siguienteVisita: "2024-11-08", status: "Finalizado" as Status, completado: true },
    { id: "26", cliente: "BENJA", responsable: "Fany", ejecutor: "Pao", pendiente: "Grabar testimonios de clientes", ultimaVisita: "2024-10-26", siguienteVisita: "2024-11-26", status: "En Proceso" as Status, completado: false },
    { id: "27", cliente: "LUZ SISTEMICA", responsable: "Carlos", ejecutor: "Carlos", pendiente: "Desarrollo de nuevo embudo de ventas", ultimaVisita: "2024-10-03", siguienteVisita: "2024-11-03", status: "En Proceso" as Status, completado: false },
    { id: "28", cliente: "DFAC", responsable: "Julio", ejecutor: "Julio", pendiente: "Enviar factura y seguimiento de pago", ultimaVisita: "2024-10-29", siguienteVisita: "", status: "Facturación" as Status, completado: true },
    { id: "29", cliente: "KIBOOK", responsable: "Fany", ejecutor: "Dani", pendiente: "Reunión de seguimiento semanal", ultimaVisita: "2024-10-24", siguienteVisita: "2024-10-31", status: "En Proceso" as Status, completado: false },
    { id: "30", cliente: "SINUBE contenido", responsable: "Luis", ejecutor: "Cristian", pendiente: "Programación de parrilla de noviembre", ultimaVisita: "2024-10-27", siguienteVisita: "2024-11-27", status: "Pendiente" as Status, completado: false },
    { id: "31", cliente: "Haide", responsable: "Fany", ejecutor: "Kari", pendiente: "Campaña de video terminada, pendiente de revisión", ultimaVisita: "2024-10-29", siguienteVisita: "2024-11-02", status: "Finalizado" as Status, completado: true },
];


const statusColors: Record<Status, string> = {
  "En Proceso": "bg-blue-500",
  "Pausado": "bg-yellow-500",
  "Finalizado": "bg-green-500",
  "Facturación": "bg-purple-500",
  "Próximo Inicio": "bg-gray-500",
  "Pendiente": "bg-orange-500",
};

const responsables = Array.from(new Set(mockData.map(item => item.responsable))).sort();
const statuses = Array.from(new Set(mockData.map(item => item.status)));


export default function PendientesPage() {
    const [tasks, setTasks] = useState(mockData);
    const [responsableFilter, setResponsableFilter] = useState('Todos');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [searchFilter, setSearchFilter] = useState('');

    const filteredData = useMemo(() => {
        return tasks.filter(item => {
            const responsableMatch = responsableFilter === 'Todos' || item.responsable === responsableFilter;
            const statusMatch = statusFilter === 'Todos' || item.status === statusFilter;
            const searchMatch = searchFilter === '' || item.cliente.toLowerCase().includes(searchFilter.toLowerCase()) || item.pendiente.toLowerCase().includes(searchFilter.toLowerCase());
            return responsableMatch && statusMatch && searchMatch;
        });
    }, [tasks, responsableFilter, statusFilter, searchFilter]);

    const handleTaskCompletion = (taskId: string) => {
        setTasks(prevTasks => prevTasks.map(task => 
            task.id === taskId ? { ...task, completado: !task.completado } : task
        ));
    };

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
              <TableHead className="w-[50px]">Comp.</TableHead>
              <TableHead className="w-[150px]">Cliente</TableHead>
              <TableHead className="w-[120px]">Responsable</TableHead>
              <TableHead>Pendiente</TableHead>
              <TableHead className="w-[150px]">Última Visita</TableHead>
              <TableHead className="w-[150px]">Siguiente Visita</TableHead>
              <TableHead className="w-[120px] text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id} className={cn(item.completado && "bg-green-500/10")}>
                 <TableCell>
                    <Checkbox
                        checked={item.completado}
                        onCheckedChange={() => handleTaskCompletion(item.id)}
                        aria-label="Marcar como completado"
                    />
                </TableCell>
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
