
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
import { PlusCircle, CalendarIcon } from 'lucide-react';
import type { Pendiente, Client, RecordingEvent } from '@/lib/db/schema';
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

export type PendienteWithRelations = Pendiente & { recordingEvent?: RecordingEvent | null };

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
                    if (e.key === 'Enter') {
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
        <p className="font-semibold text-sm cursor-pointer" onClick={() => setIsEditing(true)}>
            {pendiente.pendientePrincipal}
        </p>
    );
};

const PendientesTable = ({ data, onUpdateTask, currentUser, onRefresh, onUpdatePendienteText }: { 
    data: PendienteWithRelations[]; 
    onUpdateTask: (task: PendienteWithRelations) => void; 
    currentUser: any; 
    onRefresh: () => void;
    onUpdatePendienteText: (id: number, text: string) => void;
}) => {
    const { toast } = useToast();

    if (data.length === 0) {
        return (
            <div className="text-center p-8 text-foreground/70">
                No se encontraron pendientes con los filtros seleccionados.
            </div>
        );
    }

    const handleTogglePendiente = async (pendiente: PendienteWithRelations) => {
        try {
            const updatedPendiente = { ...pendiente, completed: !pendiente.completed };
            await updatePendiente(pendiente.id, { completed: updatedPendiente.completed });
            onUpdateTask(updatedPendiente); 
        } catch (error) {
            toast({ title: "Error", description: "No se pudo actualizar el pendiente.", variant: "destructive" });
        }
    };
    
    return (
        <div className="border rounded-lg mt-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='w-4'></TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Pendiente</TableHead>
                        <TableHead className="w-[120px]">Encargado</TableHead>
                        <TableHead className="w-[120px]">Ejecutor</TableHead>
                        <TableHead className="w-[100px]">Corte</TableHead>
                        <TableHead className="w-[180px]">Status</TableHead>
                        <TableHead className="w-[180px]">Próxima Grabación</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((pendiente) => {
                        const isEncargado = currentUser.name === pendiente.encargado;
                        const isAdmin = currentUser.role === 'admin';
                        const canEdit = isAdmin || isEncargado;

                        return (
                            <TableRow key={pendiente.id}>
                                <TableCell>
                                    <Checkbox 
                                        id={`pendiente-${pendiente.id}`} 
                                        checked={pendiente.completed}
                                        onCheckedChange={() => handleTogglePendiente(pendiente)}
                                    />
                                </TableCell>
                                <TableCell className="font-medium align-top">
                                   {pendiente.cliente}
                                </TableCell>
                                <TableCell className={cn("align-top", pendiente.completed && "line-through text-muted-foreground")}>
                                     <EditablePendiente pendiente={pendiente} onUpdate={onUpdatePendienteText}/>
                                </TableCell>
                                <TableCell className="align-top">{pendiente.encargado}</TableCell>
                                <TableCell className="align-top">{pendiente.ejecutor}</TableCell>
                                <TableCell className="align-top">Día {pendiente.fechaCorte}</TableCell>
                                <TableCell className="align-top">
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
                                <TableCell className="align-top text-center">
                                    <ScheduleRecordingDialog 
                                        event={pendiente.recordingEvent}
                                        pendienteId={pendiente.id}
                                        clientName={pendiente.cliente}
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
        const [pendientesData, clientsData] = await Promise.all([
            getPendientes(),
            getClients()
        ]);
        setPendientes(pendientesData as PendienteWithRelations[]);
        setClients(clientsData);
        setIsLoading(false);
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

    const encargados = useMemo(() => Array.from(new Set(pendientes.map(item => item.encargado))).sort(), [pendientes]);
    const ejecutoresDisponibles = useMemo(() => Array.from(new Set(pendientes.map(item => item.ejecutor))).sort(), [pendientes]);

    const filteredData = useMemo(() => {
        return pendientes.filter(item => {
            const encargadoMatch = encargadoFilter === 'Todos' || item.encargado === encargadoFilter;
            const ejecutorMatch = ejecutorFilter === 'Todos' || item.ejecutor === ejecutorFilter;
            const searchMatch = searchFilter === '' || item.cliente.toLowerCase().includes(searchFilter.toLowerCase()) || item.pendientePrincipal.toLowerCase().includes(searchFilter.toLowerCase());
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
                <AddPendienteDialog clients={clients} onAddPendiente={fetchData} />
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
                        {ejecutoresDisponibles.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                    </SelectContent>
                </Select>
            </CardContent>
        </Card>

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
                />
            </TabsContent>

            <TabsContent value="ads">
                <PendientesTable 
                    data={getFilteredDataForTab('Ads')} 
                    onUpdateTask={handleUpdateTask} 
                    currentUser={user} 
                    onRefresh={fetchData}
                    onUpdatePendienteText={handleUpdatePendienteText}
                />
            </TabsContent>
            
            <TabsContent value="web">
                 <PendientesTable 
                    data={getFilteredDataForTab('Web')} 
                    onUpdateTask={handleUpdateTask} 
                    currentUser={user} 
                    onRefresh={fetchData}
                    onUpdatePendienteText={handleUpdatePendienteText}
                />
            </TabsContent>
        </Tabs>
    </div>
  );
}

const AddPendienteDialog = ({ clients, onAddPendiente }: { clients: Client[], onAddPendiente: () => void }) => {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const [cliente, setCliente] = useState('');
    const [encargado, setEncargado] = useState('');
    const [ejecutor, setEjecutor] = useState('');
    const [categoria, setCategoria] = useState('');
    const [pendientePrincipal, setPendientePrincipal] = useState('');

    const encargadosTeam = teamMembers.filter(m => ['Julio', 'Luis', 'Fany', 'Carlos', 'Paola', 'Cristian', 'Daniel'].includes(m.name));
    const ejecutoresTeam = teamMembers;

    const handleSave = async () => {
        if (!cliente || !encargado || !ejecutor || !categoria || !pendientePrincipal) {
            toast({ title: "Error", description: "Todos los campos son obligatorios.", variant: "destructive" });
            return;
        }

        try {
            await addPendiente({
                cliente,
                encargado,
                ejecutor,
                categoria,
                pendientePrincipal,
                status: 'Trabajando',
                completed: false,
            });
            toast({ title: "Éxito", description: "Pendiente creado correctamente." });
            onAddPendiente();
            setOpen(false);
        } catch (error) {
            toast({ title: "Error", description: "No se pudo crear el pendiente.", variant: "destructive" });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="w-4 h-4 mr-2" /> Añadir Pendiente Manual</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Nuevo Pendiente Manual</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                    <Select value={cliente} onValueChange={setCliente}>
                        <SelectTrigger><SelectValue placeholder="Seleccionar Cliente" /></SelectTrigger>
                        <SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={categoria} onValueChange={setCategoria}>
                        <SelectTrigger><SelectValue placeholder="Seleccionar Categoría" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Contenido">Contenido</SelectItem>
                            <SelectItem value="Ads">Ads</SelectItem>
                            <SelectItem value="Web">Web</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={encargado} onValueChange={setEncargado}>
                        <SelectTrigger><SelectValue placeholder="Seleccionar Encargado" /></SelectTrigger>
                        <SelectContent>{encargadosTeam.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={ejecutor} onValueChange={setEjecutor}>
                        <SelectTrigger><SelectValue placeholder="Seleccionar Ejecutor" /></SelectTrigger>
                        <SelectContent>{ejecutoresTeam.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <Textarea value={pendientePrincipal} onChange={(e) => setPendientePrincipal(e.target.value)} placeholder="Descripción del pendiente principal..." />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar Pendiente</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
