
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
import { Checkbox } from '@/components/ui/checkbox';

type StatusPendiente = "Pendiente del cliente" | "Trabajando" | "No tenemos pendiente";

interface Pendiente {
    id: string;
    cliente: string;
    encargado: string;
    ejecutor: string;
    fechaCorte: number;
    status: StatusPendiente;
    pendientePrincipal: string;
    categoria: 'Contenido' | 'Ads' | 'Web';
}

const mockData: Pendiente[] = [
  // Contenido
  { id: "c1", cliente: "DELICIAS", encargado: "Fany", ejecutor: "Aldair", fechaCorte: 15, status: "Trabajando", pendientePrincipal: "Revisar estrategia de contenido Q4", categoria: 'Contenido' },
  { id: "c2", cliente: "DEASA", encargado: "Luis", ejecutor: "Alexis", fechaCorte: 30, status: "Pendiente del cliente", pendientePrincipal: "Aprobación de parrilla de noviembre", categoria: 'Contenido' },
  { id: "c3", cliente: "CREDITOS", encargado: "Carlos", ejecutor: "Pedro", fechaCorte: 15, status: "No tenemos pendiente", pendientePrincipal: "Escritura de 2 nuevos artículos para blog", categoria: 'Contenido' },
  { id: "c4", cliente: "Shaddai", encargado: "Julio", ejecutor: "Julio", fechaCorte: 15, status: "Trabajando", pendientePrincipal: "Planificar calendario de publicaciones de Diciembre", categoria: 'Contenido' },
  // Ads
  { id: "a1", cliente: "DEASA", encargado: "Luis", ejecutor: "Alexis", fechaCorte: 30, status: "Trabajando", pendientePrincipal: "Lanzar campaña de Google Ads 'Fin de Año'", categoria: 'Ads' },
  { id: "a2", cliente: "Calzones", encargado: "Carlos", ejecutor: "Pedro", fechaCorte: 30, status: "Pendiente del cliente", pendientePrincipal: "Esperando creativos para campaña de San Valentín", categoria: 'Ads' },
  { id: "a3", cliente: "Sinube Pauta", encargado: "Julio", ejecutor: "Bere", fechaCorte: 15, status: "Trabajando", pendientePrincipal: "Optimización de presupuesto de pauta", categoria: 'Ads' },
  { id: "a4", cliente: "MEDICAL TOWER", encargado: "Fany", ejecutor: "Aldair", fechaCorte: 15, status: "No tenemos pendiente", pendientePrincipal: "Reporte de rendimiento de campaña de Octubre", categoria: 'Ads' },
  // Web
  { id: "w1", cliente: "CREDITOS", encargado: "Carlos", ejecutor: "Pedro", fechaCorte: 15, status: "Trabajando", pendientePrincipal: "Optimización SEO de la landing page 'Préstamos'", categoria: 'Web' },
  { id: "w2", cliente: "PROPERTY TRADERS", encargado: "Carlos", ejecutor: "Pedro", fechaCorte: 30, status: "Pendiente del cliente", pendientePrincipal: "Esperando fotos para nueva sección de 'Desarrollos'", categoria: 'Web' },
  { id: "w3", cliente: "ALDO", encargado: "Carlos", ejecutor: "Carlos", fechaCorte: 30, status: "No tenemos pendiente", pendientePrincipal: "Actualización de plugins del sitio", categoria: 'Web' },
  { id: "w4", cliente: "KIBOOK", encargado: "Fany", ejecutor: "Dani", fechaCorte: 15, status: "Trabajando", pendientePrincipal: "Desarrollo de nueva funcionalidad de carrito", categoria: 'Web' },
];


const statusColors: Record<StatusPendiente, string> = {
  "Pendiente del cliente": "bg-orange-500",
  "Trabajando": "bg-blue-500",
  "No tenemos pendiente": "bg-green-500",
};

const encargados = Array.from(new Set(mockData.map(item => item.encargado))).sort();
const statuses = Array.from(new Set(mockData.map(item => item.status)));


const PendientesTable = ({ data }: { data: Pendiente[] }) => {
    if (data.length === 0) {
        return (
            <div className="text-center p-8 text-foreground/70">
                No se encontraron pendientes con los filtros seleccionados.
            </div>
        );
    }

    return (
        <div className="border rounded-lg mt-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[150px]">Cliente</TableHead>
                        <TableHead className="w-[120px]">Encargado</TableHead>
                        <TableHead className="w-[120px]">Ejecutor</TableHead>
                        <TableHead className="w-[100px]">Corte</TableHead>
                        <TableHead className="w-[180px]">Status</TableHead>
                        <TableHead>Pendiente Principal</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
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
                            <TableCell>
                                <div className="flex items-center gap-2">
                                  <Checkbox id={`task-${item.id}`} />
                                  <label htmlFor={`task-${item.id}`}>{item.pendientePrincipal}</label>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};


export default function PendientesPage() {
    const [responsableFilter, setResponsableFilter] = useState('Todos');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [searchFilter, setSearchFilter] = useState('');

    const filteredData = useMemo(() => {
        return mockData.filter(item => {
            const responsableMatch = responsableFilter === 'Todos' || item.encargado === responsableFilter || item.ejecutor === responsableFilter;
            const statusMatch = statusFilter === 'Todos' || item.status === statusFilter;
            const searchMatch = searchFilter === '' || item.cliente.toLowerCase().includes(searchFilter.toLowerCase()) || item.pendientePrincipal.toLowerCase().includes(searchFilter.toLowerCase());
            return responsableMatch && statusMatch && searchMatch;
        });
    }, [responsableFilter, statusFilter, searchFilter]);

    const allPersonal = Array.from(new Set([...mockData.map(item => item.encargado), ...mockData.map(item => item.ejecutor)])).sort();


  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-8">Pendientes de Equipo</h1>
        
        <Card className="mb-4">
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
                        <SelectItem value="Todos">Todo el personal</SelectItem>
                        {allPersonal.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
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

        <Tabs defaultValue="contenido" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="contenido">Pendientes Contenido</TabsTrigger>
                <TabsTrigger value="ads">Pendientes Ads</TabsTrigger>
                <TabsTrigger value="web">Pendientes Web</TabsTrigger>
            </TabsList>
            
            <TabsContent value="contenido">
               <PendientesTable data={filteredData.filter(d => d.categoria === 'Contenido')} />
            </TabsContent>

            <TabsContent value="ads">
                <PendientesTable data={filteredData.filter(d => d.categoria === 'Ads')} />
            </TabsContent>
            
            <TabsContent value="web">
                 <PendientesTable data={filteredData.filter(d => d.categoria === 'Web')} />
            </TabsContent>
        </Tabs>
    </div>
  );
}

    
