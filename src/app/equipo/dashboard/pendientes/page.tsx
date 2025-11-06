
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
import { PlusCircle, CalendarIcon, ArrowRight } from 'lucide-react';
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

    if (isEditing) {
        return (
            <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={handleBlur}
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

const PendientesTable = ({ data, onUpdateTask, currentUser, clients, onRefresh, onAddPendiente, onUpdatePendienteText }: { 
    data: PendienteWithRelations[]; 
    onUpdateTask: (task: PendienteWithRelations) => void; 
    currentUser: any; 
    clients: Client[]; 
    onRefresh: () => void;
    onAddPendiente: (newPendiente: Omit<Pendiente, 'id' | 'createdAt'>) => void;
    onUpdatePendienteText: (id: number, text: string) => void;
}) => {
    const [newPendienteText, setNewPendienteText] = useState<Record<string, string>>({});
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

    const handleAddNewPendiente = (cliente: string, categoria: string) => {
        const text = newPendienteText[cliente];
        if (!text) return;
        
        const lastPendiente = data.filter(p => p.cliente === cliente).slice(-1)[0];

        const newPendiente: Omit<Pendiente, 'id' | 'createdAt'> = {
            cliente: cliente,
            encargado: lastPendiente?.encargado || currentUser.name,
            ejecutor: lastPendiente?.ejecutor || currentUser.name,
            fechaCorte: 15,
            status: 'Trabajando',
            pendientePrincipal: text,
            categoria: categoria as any,
            completed: false,
        };

        onAddPendiente(newPendiente);
        setNewPendienteText(prev => ({...prev, [cliente]: ''}));
    };
    
    const groupedData = data.reduce((acc, item) => {
        if (!acc[item.cliente]) {
            acc[item.cliente] = [];
        }
        acc[item.cliente].push(item);
        return acc;
    }, {} as Record<string, PendienteWithRelations[]>);

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
                        <TableHead>Pendientes</TableHead>
                        <TableHead className="w-[180px]">Próxima Grabación</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.entries(groupedData).map(([cliente, pendientes]) => {
                        const firstPendiente = pendientes[0];
                         const isEncargado = currentUser.name === firstPendiente.encargado;
                        const isAdmin = currentUser.role === 'admin';
                        const canEdit = isAdmin || isEncargado;

                        return (
                            <TableRow key={cliente}>
                                <TableCell className="font-medium align-top">
                                    <EditPendienteDialog pendiente={firstPendiente} clients={clients} onUpdate={onRefresh}>
                                        <span className={cn(canEdit && "cursor-pointer hover:text-primary")}>{cliente}</span>
                                    </EditPendienteDialog>
                                </TableCell>
                                <TableCell className="align-top">{firstPendiente.encargado}</TableCell>
                                <TableCell className="align-top">{firstPendiente.ejecutor}</TableCell>
                                <TableCell className="align-top">Día {firstPendiente.fechaCorte}</TableCell>
                                <TableCell className="align-top">
                                     <Select value={firstPendiente.status} onValueChange={(newStatus) => updatePendiente(firstPendiente.id, {status: newStatus}).then(onRefresh)}>
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
                                <TableCell>
                                    <div className="flex flex-col gap-2">
                                        {pendientes.map(item => (
                                            <div key={item.id} className="flex items-center gap-2">
                                                 <Checkbox 
                                                    id={`pendiente-${item.id}`} 
                                                    checked={item.completed}
                                                    onCheckedChange={() => handleTogglePendiente(item)}
                                                />
                                                <div className={cn("flex-grow", item.completed && "line-through text-muted-foreground")}>
                                                    <EditablePendiente pendiente={item} onUpdate={onUpdatePendienteText}/>
                                                </div>
                                            </div>
                                        ))}
                                         <div className="flex items-center gap-2 pl-4 mt-2">
                                            <Input 
                                                placeholder="Añadir pendiente..."
                                                className="h-8 text-sm"
                                                value={newPendienteText[cliente] || ''}
                                                onChange={(e) => setNewPendienteText(prev => ({...prev, [cliente]: e.target.value}))}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleAddNewPendiente(cliente, firstPendiente.categoria);
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                            <Button size="sm" variant="ghost" onClick={() => handleAddNewPendiente(cliente, firstPendiente.categoria)}>
                                                <PlusCircle className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="align-top text-center">
                                    <ScheduleRecordingDialog 
                                        event={firstPendiente.recordingEvent}
                                        pendienteId={firstPendiente.id}
                                        clientName={firstPendiente.cliente}
                                        project={firstPendiente.pendientePrincipal}
                                        assignedToName={firstPendiente.ejecutor}
                                        onSave={onRefresh}
                                    >
                                        {firstPendiente.recordingEvent ? (
                                             <Button variant="outline" size="sm" className="flex flex-col h-auto">
                                                <span className='font-bold'>{format(new Date(firstPendiente.recordingEvent.fullStart), 'dd MMM', { locale: es })}</span>
                                                <span className='text-xs text-muted-foreground'>{format(new Date(firstPendiente.recordingEvent.fullStart), 'HH:mm')}</span>
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

// Other components (AddPendienteDialog, EditPendienteDialog) remain the same

export default function PendientesPage() {
    const { user } = useAuth();
    const [pendientes, setPendientes] = useState<PendienteWithRelations[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [encargadoFilter, setEncargadoFilter] = useState('Todos');
    const [ejecutorFilter, setEjecutorFilter] = useState('Todos');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [searchFilter, setSearchFilter] = useState('');

    const [activeTab, setActiveTab] = useState('contenido');
    const [highlightedTab, setHighlightedTab] = useState<string | null>(null);

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

    const handleAddPendiente = async (newPendienteData: Omit<Pendiente, 'id' | 'createdAt'>) => {
        try {
            await addPendiente(newPendienteData);
            toast({ title: "Éxito", description: "Pendiente añadido correctamente." });
            fetchData();
        } catch (error) {
             toast({ title: "Error", description: "No se pudo añadir el pendiente.", variant: "destructive" });
        }
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
    const statuses = useMemo(() => Array.from(new Set(pendientes.map(item => item.status))), [pendientes]);

    const filteredData = useMemo(() => {
        return pendientes.filter(item => {
            const encargadoMatch = encargadoFilter === 'Todos' || item.encargado === encargadoFilter;
            const ejecutorMatch = ejecutorFilter === 'Todos' || item.ejecutor === ejecutorFilter;
            const statusMatch = statusFilter === 'Todos' || item.status === statusFilter;
            const searchMatch = searchFilter === '' || item.cliente.toLowerCase().includes(searchFilter.toLowerCase()) || item.pendientePrincipal.toLowerCase().includes(searchFilter.toLowerCase());
            return encargadoMatch && ejecutorMatch && statusMatch && searchMatch;
        });
    }, [encargadoFilter, ejecutorFilter, statusFilter, searchFilter, pendientes]);
    
    const canAddPendiente = user?.role === 'admin' || user?.permissions?.pendientes?.reasignarResponsables;

    const handleSearchChange = (value: string) => {
        setSearchFilter(value);
        setHighlightedTab(null);
        if (value) {
            const foundPendiente = pendientes.find(p => p.cliente.toLowerCase().includes(value.toLowerCase()));
            if (foundPendiente) {
                setActiveTab(foundPendiente.categoria.toLowerCase());
                setHighlightedTab(foundPendiente.categoria.toLowerCase());
            }
        }
    };

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
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="max-w-xs"
                />
                <Select value={encargadoFilter} onValueChange={(v) => { setEncargadoFilter(v); setHighlightedTab(null); }}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filtrar por Encargado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Todos">Todos los Encargados</SelectItem>
                        {encargados.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={ejecutorFilter} onValueChange={(v) => { setEjecutorFilter(v); setHighlightedTab(null); }}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filtrar por Ejecutor" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Todos">Todos los Ejecutores</SelectItem>
                        {ejecutoresDisponibles.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setHighlightedTab(null); }}>
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="contenido" className="relative">
                    Pendientes Contenido
                    {highlightedTab === 'contenido' && <ArrowRight className="absolute -right-5 h-6 w-6 text-primary animate-bounce" />}
                </TabsTrigger>
                <TabsTrigger value="ads" className="relative">
                    Pendientes Ads
                    {highlightedTab === 'ads' && <ArrowRight className="absolute -right-5 h-6 w-6 text-primary animate-bounce" />}
                </TabsTrigger>
                <TabsTrigger value="web" className="relative">
                    Pendientes Web
                    {highlightedTab === 'web' && <ArrowRight className="absolute -right-5 h-6 w-6 text-primary animate-bounce" />}
                </TabsTrigger>
            </TabsList>
            
            <TabsContent value="contenido">
               <PendientesTable 
                    data={filteredData.filter(d => d.categoria === 'Contenido')} 
                    onUpdateTask={handleUpdateTask} 
                    currentUser={user} 
                    clients={clients} 
                    onRefresh={fetchData}
                    onAddPendiente={handleAddPendiente}
                    onUpdatePendienteText={handleUpdatePendienteText}
                />
            </TabsContent>

            <TabsContent value="ads">
                <PendientesTable 
                    data={filteredData.filter(d => d.categoria === 'Ads')} 
                    onUpdateTask={handleUpdateTask} 
                    currentUser={user} 
                    clients={clients} 
                    onRefresh={fetchData}
                    onAddPendiente={handleAddPendiente}
                    onUpdatePendienteText={handleUpdatePendienteText}
                />
            </TabsContent>
            
            <TabsContent value="web">
                 <PendientesTable 
                    data={filteredData.filter(d => d.categoria === 'Web')} 
                    onUpdateTask={handleUpdateTask} 
                    currentUser={user} 
                    clients={clients} 
                    onRefresh={fetchData}
                    onAddPendiente={handleAddPendiente}
                    onUpdatePendienteText={handleUpdatePendienteText}
                />
            </TabsContent>
        </Tabs>
    </div>
  );
}

// Dialog components (AddPendienteDialog, EditPendienteDialog) remain mostly the same,
// but their internal logic will adapt to not having subtasks.

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
                fechaCorte: 15,
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

const EditPendienteDialog = ({ pendiente, clients, onUpdate, children }: { pendiente: PendienteWithRelations, clients: Client[], onUpdate: () => void, children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const [cliente, setCliente] = useState(pendiente.cliente);
    const [encargado, setEncargado] = useState(pendiente.encargado);
    const [ejecutor, setEjecutor] = useState(pendiente.ejecutor);
    const [categoria, setCategoria] = useState(pendiente.categoria);
    const [status, setStatus] = useState(pendiente.status);
    const [pendientePrincipal, setPendientePrincipal] = useState(pendiente.pendientePrincipal);

    const encargadosTeam = teamMembers.filter(m => ['Julio', 'Luis', 'Fany', 'Carlos', 'Paola', 'Cristian', 'Daniel'].includes(m.name));
    const ejecutoresTeam = teamMembers;

    const handleSave = async () => {
        try {
            await updatePendiente(pendiente.id, {
                cliente,
                encargado,
                ejecutor,
                categoria,
                status,
                pendientePrincipal,
            });
            toast({ title: "Éxito", description: "Pendiente actualizado." });
            onUpdate();
            setOpen(false);
        } catch (error) {
            toast({ title: "Error", description: "No se pudo actualizar el pendiente.", variant: "destructive" });
        }
    };
    
    useEffect(() => {
        if(open) {
            setCliente(pendiente.cliente);
            setEncargado(pendiente.encargado);
            setEjecutor(pendiente.ejecutor);
            setCategoria(pendiente.categoria);
            setStatus(pendiente.status);
            setPendientePrincipal(pendiente.pendientePrincipal);
        }
    }, [open, pendiente]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Editar Pendiente</DialogTitle></DialogHeader>
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
                    <Select value={status} onValueChange={(newStatus) => setStatus(newStatus)}>
                        <SelectTrigger><SelectValue placeholder="Seleccionar Status" /></SelectTrigger>
                        <SelectContent>
                            {Object.keys(statusColors).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Textarea value={pendientePrincipal} onChange={(e) => setPendientePrincipal(e.target.value)} placeholder="Descripción del pendiente principal..." />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar Cambios</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
