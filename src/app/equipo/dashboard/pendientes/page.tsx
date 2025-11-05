
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

type StatusCliente = "Activo" | "Se quiere ir" | "Esta entrando" | "Ya se fue";

const mockContentData = [
  { id: "1", cliente: "DELICIAS", encargado: "Fany", ejecutor: "Aldair", fechaCorte: 15, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-15", proximaVisita: "2024-11-10", pendientePrincipal: "Revisar estrategia de contenido Q4" },
  { id: "2", cliente: "DEASA", encargado: "Luis", ejecutor: "Alexis", fechaCorte: 30, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-20", proximaVisita: "2024-11-12", pendientePrincipal: "Lanzar campaña de Google Ads" },
  { id: "3", cliente: "CREDITOS", encargado: "Carlos", ejecutor: "Pedro", fechaCorte: 15, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-05", proximaVisita: "2024-11-01", pendientePrincipal: "Optimización SEO de la landing page" },
  { id: "4", cliente: "ALDO", encargado: "Carlos", ejecutor: "Carlos", fechaCorte: 30, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-10-30", proximaVisita: "2024-11-15", pendientePrincipal: "Facturación de servicios de Octubre" },
  { id: "5", cliente: "Shaddai", encargado: "Julio", ejecutor: "Julio", fechaCorte: 15, status: "Esta entrando" as StatusCliente, contenidoProgramadoHasta: "2024-11-10", proximaVisita: "2024-11-02", pendientePrincipal: "Planificar calendario de publicaciones de Noviembre" },
  { id: "6", cliente: "MAQTECH", encargado: "Fany", ejecutor: "Dani", fechaCorte: 30, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-25", proximaVisita: "2024-11-22", pendientePrincipal: "Análisis de métricas de redes sociales" },
  { id: "7", cliente: "Urologo", encargado: "Luis", ejecutor: "Kari", fechaCorte: 15, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-08", proximaVisita: "2024-11-05", pendientePrincipal: "Creación de 4 videos para TikTok" },
  { id: "8", cliente: "Calzones", encargado: "Carlos", ejecutor: "Pedro", fechaCorte: 30, status: "Se quiere ir" as StatusCliente, contenidoProgramadoHasta: "2024-11-01", proximaVisita: "2024-11-12", pendientePrincipal: "Configuración de campaña de email marketing" },
  { id: "9", cliente: "Bufalo", encargado: "Fany", ejecutor: "Cristian", fechaCorte: 15, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-18", proximaVisita: "2024-11-01", pendientePrincipal: "Kick-off de nuevo proyecto" },
  { id: "10", cliente: "QUESOS", encargado: "Luis", ejecutor: "Paola", fechaCorte: 30, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-22", proximaVisita: "2024-11-19", pendientePrincipal: "Diseño de carrusel para Instagram" },
  { id: "11", cliente: "WUAPAS", encargado: "Fany", ejecutor: "Aldair", fechaCorte: 15, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-12", proximaVisita: "2024-11-08", pendientePrincipal: "Reporte de rendimiento de pauta de Octubre" },
  { id: "12", cliente: "BRAZIL", encargado: "Carlos", ejecutor: "Pedro", fechaCorte: 30, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-20", proximaVisita: "2024-11-10", pendientePrincipal: "Agendar sesión de fotos de producto" },
  { id: "13", cliente: "CLINICA huesos", encargado: "Julio", ejecutor: "Julio", fechaCorte: 15, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-15", proximaVisita: "2024-11-14", pendientePrincipal: "Escribir 2 artículos para el blog" },
  { id: "14", cliente: "ZAPATOS", encargado: "Fany", ejecutor: "Dani", fechaCorte: 30, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-28", proximaVisita: "2024-11-25", pendientePrincipal: "Revisión de estrategia con el cliente" },
  { id: "15", cliente: "Biofert", encargado: "Luis", ejecutor: "Alexis", fechaCorte: 15, status: "Ya se fue" as StatusCliente, contenidoProgramadoHasta: "2024-10-15", proximaVisita: "", pendientePrincipal: "Finalizar entrega de assets" },
  { id: "16", cliente: "Tecnosim", encargado: "Fany", ejecutor: "Cristian", fechaCorte: 30, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-30", proximaVisita: "2024-11-24", pendientePrincipal: "Hacer 4 videos HOY" },
  { id: "17", cliente: "Marisqueria", encargado: "Carlos", ejecutor: "Carlos", fechaCorte: 15, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-17", proximaVisita: "2024-11-20", pendientePrincipal: "Optimizar campaña de Google Ads" },
  { id: "18", cliente: "DC Solutions", encargado: "Julio", ejecutor: "Julio", fechaCorte: 30, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-25", proximaVisita: "2024-12-01", pendientePrincipal: "Enviar reporte mensual de resultados" },
  { id: "19", cliente: "MEDICAL TOWER", encargado: "Fany", ejecutor: "Aldair", fechaCorte: 15, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-20", proximaVisita: "2024-11-01", pendientePrincipal: "Preparar propuesta para campaña de Navidad" },
  { id: "20", cliente: "POLAR", encargado: "Luis", ejecutor: "Kari", fechaCorte: 30, status: "Se quiere ir" as StatusCliente, contenidoProgramadoHasta: "2024-11-10", proximaVisita: "2024-11-23", pendientePrincipal: "Revisar accesos a cuenta publicitaria" },
  { id: "21", cliente: "BATERIAS", encargado: "Fany", ejecutor: "Dani", fechaCorte: 15, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-15", proximaVisita: "2024-11-11", pendientePrincipal: "Actualizar catálogo de productos en la web" },
  { id: "22", cliente: "PROPERTY TRADERS", encargado: "Carlos", ejecutor: "Pedro", fechaCorte: 30, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-30", proximaVisita: "2024-11-01", pendientePrincipal: "Creación de landing page para nuevo desarrollo" },
  { id: "23", cliente: "Sinube Pauta", encargado: "Julio", ejecutor: "Bere", fechaCorte: 15, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-20", proximaVisita: "2024-11-25", pendientePrincipal: "Optimización de presupuesto de pauta" },
  { id: "24", cliente: "PORTAL VIVIENTE", encargado: "Fany", ejecutor: "Cristian", fechaCorte: 30, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-17", proximaVisita: "2024-11-17", pendientePrincipal: "Análisis de la competencia en redes" },
  { id: "25", cliente: "ELECTRICA", encargado: "Luis", ejecutor: "Alexis", fechaCorte: 15, status: "Ya se fue" as StatusCliente, contenidoProgramadoHasta: "2024-09-30", proximaVisita: "", pendientePrincipal: "Entrega de reporte final" },
  { id: "26", cliente: "BENJA", encargado: "Fany", ejecutor: "Aldair", fechaCorte: 30, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-26", proximaVisita: "2024-11-26", pendientePrincipal: "Grabar testimonios de clientes" },
  { id: "27", cliente: "LUZ SISTEMICA", encargado: "Carlos", ejecutor: "Carlos", fechaCorte: 15, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-10", proximaVisita: "2024-11-03", pendientePrincipal: "Desarrollo de nuevo embudo de ventas" },
  { id: "28", cliente: "DFAC", encargado: "Julio", ejecutor: "Julio", fechaCorte: 30, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-25", proximaVisita: "2024-11-28", pendientePrincipal: "Enviar factura y seguimiento de pago" },
  { id: "29", cliente: "KIBOOK", encargado: "Fany", ejecutor: "Dani", fechaCorte: 15, status: "Esta entrando" as StatusCliente, contenidoProgramadoHasta: "2024-11-05", proximaVisita: "2024-10-31", pendientePrincipal: "Reunión de seguimiento semanal" },
  { id: "30", cliente: "SINUBE contenido", encargado: "Luis", ejecutor: "Paola", fechaCorte: 30, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-27", proximaVisita: "2024-11-27", pendientePrincipal: "Programación de parrilla de noviembre" },
  { id: "31", cliente: "Haide", encargado: "Fany", ejecutor: "Cristian", fechaCorte: 15, status: "Activo" as StatusCliente, contenidoProgramadoHasta: "2024-11-15", proximaVisita: "2024-11-02", pendientePrincipal: "Campaña de video terminada, pendiente de revisión" },
];


const statusColors: Record<StatusCliente, string> = {
  "Activo": "bg-green-500",
  "Se quiere ir": "bg-orange-500",
  "Esta entrando": "bg-blue-500",
  "Ya se fue": "bg-gray-500",
};

const encargados = Array.from(new Set(mockContentData.map(item => item.encargado))).sort();
const statuses = Array.from(new Set(mockContentData.map(item => item.status)));


export default function PendientesPage() {
    const [responsableFilter, setResponsableFilter] = useState('Todos');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [searchFilter, setSearchFilter] = useState('');

    const filteredData = useMemo(() => {
        return mockContentData.filter(item => {
            const responsableMatch = responsableFilter === 'Todos' || item.encargado === responsableFilter;
            const statusMatch = statusFilter === 'Todos' || item.status === statusFilter;
            const searchMatch = searchFilter === '' || item.cliente.toLowerCase().includes(searchFilter.toLowerCase()) || item.pendientePrincipal.toLowerCase().includes(searchFilter.toLowerCase());
            return responsableMatch && statusMatch && searchMatch;
        });
    }, [responsableFilter, statusFilter, searchFilter]);


  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-8">Pendientes de Equipo</h1>
        
        <Tabs defaultValue="contenido" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="contenido">Pendientes Contenido</TabsTrigger>
                <TabsTrigger value="ads">Pendientes Ads</TabsTrigger>
                <TabsTrigger value="web">Pendientes Web</TabsTrigger>
            </TabsList>
            
            <TabsContent value="contenido">
                <Card className="mt-4">
                    <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                        <Input 
                            placeholder="Buscar por cliente o pendiente..."
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                            className="max-w-xs"
                        />
                        <Select value={responsableFilter} onValueChange={setResponsableFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Filtrar por Encargado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Todos">Todos los Encargados</SelectItem>
                                {encargados.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
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

                <div className="border rounded-lg mt-4">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[150px]">Cliente</TableHead>
                        <TableHead className="w-[120px]">Encargado</TableHead>
                        <TableHead className="w-[120px]">Ejecutor</TableHead>
                        <TableHead className="w-[100px]">Corte</TableHead>
                        <TableHead className="w-[120px]">Status</TableHead>
                        <TableHead>Pendiente Principal</TableHead>
                        <TableHead className="w-[150px]">Cont. Programado</TableHead>
                        <TableHead className="w-[150px]">Próxima Visita</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.cliente}</TableCell>
                            <TableCell>{item.encargado}</TableCell>
                            <TableCell>{item.ejecutor}</TableCell>
                             <TableCell>Día {item.fechaCorte}</TableCell>
                            <TableCell>
                                <Badge className={cn("text-white", statusColors[item.status])}>
                                    {item.status}
                                </Badge>
                            </TableCell>
                             <TableCell>{item.pendientePrincipal}</TableCell>
                             <TableCell>{item.contenidoProgramadoHasta}</TableCell>
                             <TableCell>{item.proximaVisita || "N/A"}</TableCell>
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
            </TabsContent>

            <TabsContent value="ads">
                <Card className="mt-4">
                    <CardContent className="p-6">
                        <p className="text-foreground/80">Aquí se mostrarán los pendientes relacionados con las campañas de publicidad (Ads).</p>
                    </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="web">
                 <Card className="mt-4">
                    <CardContent className="p-6">
                        <p className="text-foreground/80">Aquí se mostrarán los pendientes relacionados con el desarrollo y mantenimiento web.</p>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
