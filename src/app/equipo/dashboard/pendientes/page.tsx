
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/lib/auth-provider';
import { Button } from '@/components/ui/button';
import { PlusCircle, CalendarIcon, Plus, ChevronRight } from 'lucide-react';
import type { PendienteMaw, Client, RecordingEvent } from '@/lib/db/schema';
import { getPendientes, addPendiente, updatePendiente } from './_actions';
import { getClients } from '../clientes/_actions';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { teamMembers } from '@/lib/team-data';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ScheduleRecordingDialog } from '@/components/schedule-recording-dialog';

const statusColors: Record<string, string> = {
  "Pendiente del cliente": "bg-orange-500",
  "Trabajando": "bg-blue-500",
  "No tenemos pendiente": "bg-green-500",
  "Resuelto": "bg-gray-500"
};

export type PendienteWithRelations = PendienteMaw & { recordingEvent?: RecordingEvent | null };

const EditablePendiente = ({ pendiente, onUpdate }: { pendiente: PendienteWithRelations, onUpdate: (id: number, text: string) => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(pendiente.pendientePrincipal);

    const handleBlur = () => {
        setIsEditing(false);
        if(text !== pendiente.pendientePrincipal) {
            onUpdate(pendiente.id, text);
        }
    };
    
    useEffect(() => {
        setText(pendiente.pendientePrincipal);
    }, [pendiente.pendientePrincipal]);

    if (isEditing) {
        return (
            <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        handleBlur();
                        e.preventDefault();
                    }
                    if (e.key === 'Escape') {
                        setIsEditing(false);
                        setText(pendiente.pendientePrincipal);
                    }
                }}
                autoFocus
                className="w-full text-sm"
            />
        );
    }
    return (
        <p className="text-sm cursor-pointer" onClick={() => setIsEditing(true)}>
            {pendiente.pendientePrincipal}
        </p>
    );
};


const AddPendienteInline = ({ client, categoria, onAdd, onCancel }: { client: Client, categoria: string, onAdd: (pendienteText: string) => void, onCancel: () => void }) => {
    const [text, setText] = useState('');

    const handleSave = () => {
        if (text.trim()) {
            onAdd(text.trim());
            setText('');
        }
    }

    return (
        <div className="p-2 space-y-2">
            <Textarea 
                placeholder="Escribe el nuevo pendiente..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        handleSave();
                        e.preventDefault();
                    }
                     if (e.key === 'Escape') {
                        onCancel();
                    }
                }}
            />
            <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={onCancel}>Cancelar</Button>
                <Button size="sm" onClick={handleSave}>Guardar</Button>
            </div>
        </div>
    )
}


const PendientesTable = ({ data, onUpdateTask, currentUser, onRefresh, onUpdatePendienteText, clients, categoria }: { 
    data: PendienteWithRelations[]; 
    onUpdateTask: (task: PendienteWithRelations) => void; 
    currentUser: any; 
    onRefresh: () => void;
    onUpdatePendienteText: (id: number, text: string) => void;
    clients: Client[];
    categoria: string;
}) => {
    const { toast } = useToast();
    const [addingToClientId, setAddingToClientId] = useState<number | null>(null);
    
    const handleTogglePendiente = async (pendiente: PendienteWithRelations) => {
        try {
            const updatedPendiente = { ...pendiente, completed: !pendiente.completed };
            await updatePendiente(pendiente.id, { completed: updatedPendiente.completed });
            onUpdateTask(updatedPendiente); 
        } catch (error) {
            toast({ title: "Error", description: "No se pudo actualizar el pendiente.", variant: "destructive" });
        }
    };

    const handleAddPendiente = async (pendienteText: string, client: Client, firstPendiente: PendienteMaw) => {
        try {
             await addPendiente({
                clientId: client.id,
                clienteName: client.name,
                encargado: firstPendiente.encargado,
                ejecutor: firstPendiente.ejecutor,
                categoria,
                pendientePrincipal: pendienteText,
                status: 'Trabajando',
                completed: false,
            });
            toast({ title: "Éxito", description: "Pendiente creado." });
            onRefresh();
            setAddingToClientId(null);
        } catch (error) {
            toast({ title: "Error", description: "No se pudo crear el pendiente.", variant: "destructive" });
        }
    }

    const groupedData = useMemo(() => {
        return data.reduce((acc, pendiente) => {
            (acc[pendiente.clienteName] = acc[pendiente.clienteName] || []).push(pendiente);
            return acc;
        }, {} as Record<string, PendienteWithRelations[]>);
    }, [data]);
    
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
                        <TableHead className="w-[200px]">Cliente</TableHead>
                        <TableHead className="w-[40px]"></TableHead>
                        <TableHead>Pendiente</TableHead>
                        <TableHead className="w-[180px]">Status</TableHead>
                        <TableHead className="w-[180px]">Próxima Grabación</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.entries(groupedData).map(([clienteName, pendientes]) => {
                        const client = clients.find(c => c.name === clienteName);
                        if (!client) return null;

                        return (
                        <React.Fragment key={clienteName}>
                            <tr className="group/client-group">
                                <TableCell rowSpan={pendientes.length + 1} className="align-middle text-center font-medium p-2 border-r">
                                    {clienteName}
                                </TableCell>
                            </tr>
                            {pendientes.map((pendiente) => (
                                <TableRow key={pendiente.id} className="group-hover/client-group:bg-muted/30">
                                    <TableCell className="p-2">
                                         <Checkbox 
                                            id={`pendiente-${pendiente.id}`} 
                                            checked={pendiente.completed}
                                            onCheckedChange={() => handleTogglePendiente(pendiente)}
                                        />
                                    </TableCell>
                                    <TableCell className={cn("p-2", pendiente.completed && "line-through text-muted-foreground")}>
                                        <EditablePendiente pendiente={pendiente} onUpdate={onUpdatePendienteText}/>
                                    </TableCell>
                                    <TableCell className="p-2">
                                        <Select value={pendiente.status} onValueChange={(newStatus) => updatePendiente(pendiente.id, {status: newStatus}).then(onRefresh)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(statusColors).map(([status, color]) => (
                                                    <SelectItem key={status} value={status}>
                                                        <Badge className={cn("text-white", color)}>{status}</Badge>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="p-2 text-center">
                                        <ScheduleRecordingDialog 
                                            event={pendiente.recordingEvent}
                                            pendienteId={pendiente.id}
                                            clientName={pendiente.clienteName}
                                            project={pendiente.pendientePrincipal}
                                            assignedToName={pendiente.ejecutor}
                                            onSave={onRefresh}
                                        >
                                            {pendiente.recordingEvent ? (
                                                <Button variant="outline" size="sm" className="flex flex-col h-auto">
                                                    <span className='font-bold'>{format(new Date(pendiente.recordingEvent.fullStart), 'dd MMM', { locale: es })}</span>
                                                    <span className='text-xs text-muted-foreground'>{format(new Date(pendiente.recordingEvent.fullStart), 'HH:mm')}</span>
                                                </Button>
                                            ) : (
                                                <Button variant="secondary" size="sm">
                                                    <CalendarIcon className='w-4 h-4 mr-2' />
                                                    Agendar
                                                </Button>
                                            )}
                                        </ScheduleRecordingDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={4} className="p-0">
                                    {addingToClientId === client.id ? (
                                        <AddPendienteInline 
                                            client={client}
                                            categoria={categoria}
                                            onAdd={(text) => handleAddPendiente(text, client, pendientes[0])}
                                            onCancel={() => setAddingToClientId(null)}
                                        />
                                    ) : (
                                        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground pl-4" onClick={() => setAddingToClientId(client.id)}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Añadir pendiente
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        </React.Fragment>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    );
};


export default function PendientesPage() {
    const { user } = useAuth();
    const [pendientes, setPendientes] = useState<PendienteWithRelations[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [encargadoFilter, setEncargadoFilter] = useState('Todos');
    const [ejecutorFilter, setEjecutorFilter] = useState('Todos');
    const [searchFilter, setSearchFilter] = useState('');

    const [activeTab, setActiveTab] = useState('contenido');
    const { toast } = useToast();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [pendientesData, clientsData] = await Promise.all([
                getPendientes(),
                getClients()
            ]);
            setPendientes(pendientesData as PendienteWithRelations[]);
            setClients(clientsData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            toast({
                title: "Error al cargar datos",
                description: "No se pudieron obtener los pendientes o clientes. Intenta recargar la página.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    }
    
    useEffect(() => {
        fetchData();
    }, []);
    
    const handleUpdateTask = (updatedTask: PendienteWithRelations) => {
        startTransition(() => {
            setPendientes(prevPendientes => 
                prevPendientes.map(p => p.id === updatedTask.id ? updatedTask : p)
            );
        });
    };
    
    const handleUpdatePendienteText = async (id: number, text: string) => {
        try {
            await updatePendiente(id, { pendientePrincipal: text });
            toast({ title: "Éxito", description: "Pendiente actualizado." });
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "No se pudo actualizar el pendiente.", variant: "destructive" });
        }
    };
    
    const encargados = useMemo(() => {
        return Array.from(new Set(teamMembers.map(m => m.name))).sort();
    }, [teamMembers]);
    const ejecutores = useMemo(() => {
        return Array.from(new Set(teamMembers.map(m => m.name))).sort();
    }, [teamMembers]);


    const filteredData = useMemo(() => {
        return pendientes.filter(item => {
            const encargadoMatch = encargadoFilter === 'Todos' || item.encargado === encargadoFilter;
            const ejecutorMatch = ejecutorFilter === 'Todos' || item.ejecutor === ejecutorFilter;
            const searchMatch = searchFilter === '' || item.clienteName.toLowerCase().includes(searchFilter.toLowerCase()) || item.pendientePrincipal.toLowerCase().includes(searchFilter.toLowerCase());
            return encargadoMatch && ejecutorMatch && searchMatch;
        });
    }, [encargadoFilter, ejecutorFilter, searchFilter, pendientes]);
    
    const canAddPendiente = user?.role === 'admin' || user?.permissions?.pendientes?.reasignarResponsables;

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
    )
  }

  if (!user) {
    return <div>Cargando...</div>
  }
  
  const getFilteredDataForTab = (categoria: string) => {
      return filteredData.filter(d => d.categoria === categoria);
  }

  return (
    <div>
        <div className='flex justify-between items-center mb-8'>
            <h1 className="text-3xl font-bold font-headline">Pendientes de Equipo</h1>
             {canAddPendiente && (
                 <Button disabled><PlusCircle className="w-4 h-4 mr-2" /> Añadir Pendiente Manual</Button>
            )}
        </div>
        
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
                        {ejecutores.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                    </SelectContent>
                </Select>
            </CardContent>
        </Card>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <span>Filtros:</span>
            <span className="font-semibold text-foreground">{searchFilter || 'Todos'}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-semibold text-foreground">{encargadoFilter}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-semibold text-foreground">{ejecutorFilter}</span>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="contenido">
                    Pendientes Contenido
                </TabsTrigger>
                <TabsTrigger value="ads">
                    Pendientes Ads
                </TabsTrigger>
                <TabsTrigger value="web">
                    Pendientes Web
                </TabsTrigger>
            </TabsList>
            
            <TabsContent value="contenido">
               <PendientesTable 
                    data={getFilteredDataForTab('Contenido')} 
                    onUpdateTask={handleUpdateTask} 
                    currentUser={user} 
                    onRefresh={fetchData}
                    onUpdatePendienteText={handleUpdatePendienteText}
                    clients={clients}
                    categoria="Contenido"
                />
            </TabsContent>

            <TabsContent value="ads">
                <PendientesTable 
                    data={getFilteredDataForTab('Ads')} 
                    onUpdateTask={handleUpdateTask} 
                    currentUser={user} 
                    onRefresh={fetchData}
                    onUpdatePendienteText={handleUpdatePendienteText}
                    clients={clients}
                    categoria="Ads"
                />
            </TabsContent>
            
            <TabsContent value="web">
                 <PendientesTable 
                    data={getFilteredDataForTab('Web')} 
                    onUpdateTask={handleUpdateTask} 
                    currentUser={user} 
                    onRefresh={fetchData}
                    onUpdatePendienteText={handleUpdatePendienteText}
                    clients={clients}
                    categoria="Web"
                />
            </TabsContent>
        </Tabs>
    </div>
  );
}



