
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { mockData, type Activity, type StatusPendiente, type SubTask } from '@/lib/activities-data';
import { useAuth } from '@/lib/auth-provider';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const statusColors: Record<StatusPendiente, string> = {
  "Pendiente del cliente": "bg-orange-500",
  "Trabajando": "bg-blue-500",
  "No tenemos pendiente": "bg-green-500",
};

const encargados = Array.from(new Set(mockData.map(item => item.encargado))).sort();
const statuses = Array.from(new Set(mockData.map(item => item.status)));


const PendientesTable = ({ data, onUpdateTask, currentUser }: { data: Activity[]; onUpdateTask: (task: Activity) => void; currentUser: any; }) => {
    const [newSubTaskText, setNewSubTaskText] = useState<Record<string, string>>({});

    if (data.length === 0) {
        return (
            <div className="text-center p-8 text-foreground/70">
                No se encontraron pendientes con los filtros seleccionados.
            </div>
        );
    }
    
    const handleAddSubTask = (taskId: string) => {
        const text = newSubTaskText[taskId];
        if (!text) return;

        const task = data.find(t => t.id === taskId);
        if (task) {
            const newSubTask: SubTask = {
                id: `sub-${Date.now()}`,
                text,
                completed: false,
            };
            const updatedTask = { ...task, subTasks: [...task.subTasks, newSubTask] };
            onUpdateTask(updatedTask);
            setNewSubTaskText(prev => ({...prev, [taskId]: ''}));
        }
    };
    
    const handleToggleSubTask = (taskId: string, subTaskId: string) => {
        const task = data.find(t => t.id === taskId);
        if (task) {
            const updatedSubTasks = task.subTasks.map(st => 
                st.id === subTaskId ? { ...st, completed: !st.completed } : st
            );
            const updatedTask = { ...task, subTasks: updatedSubTasks };
            onUpdateTask(updatedTask);
        }
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
                        <TableHead>Pendiente Principal y Sub-tareas</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => {
                        const isEncargado = currentUser.name === item.encargado;

                        return (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium align-top">{item.cliente}</TableCell>
                                <TableCell className="align-top">{item.encargado}</TableCell>
                                <TableCell className="align-top">{item.ejecutor}</TableCell>
                                <TableCell className="align-top">Día {item.fechaCorte}</TableCell>
                                <TableCell className="align-top">
                                    <Badge className={cn("text-white", statusColors[item.status])}>
                                        {item.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-2">
                                        <p className="font-semibold">{item.pendientePrincipal}</p>
                                        <div className="pl-4 space-y-2">
                                            {item.subTasks?.map(subTask => (
                                                <div key={subTask.id} className="flex items-center gap-2">
                                                    <Checkbox 
                                                        id={`subtask-${subTask.id}`} 
                                                        checked={subTask.completed}
                                                        onCheckedChange={() => handleToggleSubTask(item.id, subTask.id)}
                                                    />
                                                    <label htmlFor={`subtask-${subTask.id}`} className={cn("text-sm", subTask.completed && "line-through text-muted-foreground")}>{subTask.text}</label>
                                                </div>
                                            ))}
                                        </div>
                                         {isEncargado && (
                                            <div className="flex items-center gap-2 pl-4 mt-2">
                                                <Input 
                                                    placeholder="Añadir sub-pendiente..."
                                                    className="h-8 text-sm"
                                                    value={newSubTaskText[item.id] || ''}
                                                    onChange={(e) => setNewSubTaskText(prev => ({...prev, [item.id]: e.target.value}))}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleAddSubTask(item.id);
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                                <Button size="sm" variant="ghost" onClick={() => handleAddSubTask(item.id)}>
                                                    <PlusCircle className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    );
};


export default function PendientesPage() {
    const { user } = useAuth();
    const [pendientes, setPendientes] = useState<Activity[]>([]);
    const [encargadoFilter, setEncargadoFilter] = useState('Todos');
    const [ejecutorFilter, setEjecutorFilter] = useState('Todos');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [searchFilter, setSearchFilter] = useState('');

    useEffect(() => {
        try {
            const storedPendientes = localStorage.getItem('pendientes');
            if (storedPendientes) {
                setPendientes(JSON.parse(storedPendientes));
            } else {
                setPendientes(mockData);
            }
        } catch (e) {
            console.error("Failed to load pendientes from local storage", e);
            setPendientes(mockData);
        }
    }, []);
    
    const handleUpdateTask = (updatedTask: Activity) => {
        const newPendientes = pendientes.map(p => p.id === updatedTask.id ? updatedTask : p);
        setPendientes(newPendientes);
         try {
            localStorage.setItem('pendientes', JSON.stringify(newPendientes));
        } catch (e) {
            console.error("Failed to save pendientes to local storage", e);
        }
    };

    const ejecutoresDisponibles = useMemo(() => {
        if (encargadoFilter === 'Todos') {
            return Array.from(new Set(pendientes.map(item => item.ejecutor))).sort();
        }
        return Array.from(new Set(pendientes.filter(item => item.encargado === encargadoFilter).map(item => item.ejecutor))).sort();
    }, [encargadoFilter, pendientes]);

    const filteredData = useMemo(() => {
        return pendientes.filter(item => {
            const encargadoMatch = encargadoFilter === 'Todos' || item.encargado === encargadoFilter;
            const ejecutorMatch = ejecutorFilter === 'Todos' || item.ejecutor === ejecutorFilter;
            const statusMatch = statusFilter === 'Todos' || item.status === statusFilter;
            const searchMatch = searchFilter === '' || item.cliente.toLowerCase().includes(searchFilter.toLowerCase()) || item.pendientePrincipal.toLowerCase().includes(searchFilter.toLowerCase());
            return encargadoMatch && ejecutorMatch && statusMatch && searchMatch;
        });
    }, [encargadoFilter, ejecutorFilter, statusFilter, searchFilter, pendientes]);

  if (!user) {
    return <div>Cargando...</div>
  }

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
                <Select value={encargadoFilter} onValueChange={setEncargadoFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filtrar por Encargado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Todos">Todos los Encargados</SelectItem>
                        {encargados.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={ejecutorFilter} onValueChange={setEjecutorFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filtrar por Ejecutor" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Todos">Todos los Ejecutores</SelectItem>
                        {ejecutoresDisponibles.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
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
               <PendientesTable data={filteredData.filter(d => d.categoria === 'Contenido')} onUpdateTask={handleUpdateTask} currentUser={user} />
            </TabsContent>

            <TabsContent value="ads">
                <PendientesTable data={filteredData.filter(d => d.categoria === 'Ads')} onUpdateTask={handleUpdateTask} currentUser={user} />
            </TabsContent>
            
            <TabsContent value="web">
                 <PendientesTable data={filteredData.filter(d => d.categoria === 'Web')} onUpdateTask={handleUpdateTask} currentUser={user} />
            </TabsContent>
        </Tabs>
    </div>
  );
}
