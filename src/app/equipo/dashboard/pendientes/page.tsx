
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
import { PlusCircle, Trash2, CalendarIcon } from 'lucide-react';
import type { Pendiente, SubTask, Client, RecordingEvent } from '@/lib/db/schema';
import { getPendientes, addSubTask, toggleSubTask, addPendiente, updatePendiente, scheduleRecording, deleteRecording } from './_actions';
import { getClients } from '../clientes/_actions';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { teamMembers, type TeamMember } from '@/lib/team-data';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, Camera, Lightbulb, Grip } from 'lucide-react';


const statusColors: Record<string, string> = {
  "Pendiente del cliente": "bg-orange-500",
  "Trabajando": "bg-blue-500",
  "No tenemos pendiente": "bg-green-500",
};

type PendienteWithRelations = Pendiente & { subTasks: SubTask[], recordingEvent?: RecordingEvent | null };

const mockEquipment = [
  { id: 'eq1', name: 'Micrófono Hollyland', category: 'audio' as const, available: true },
  { id: 'eq2', name: 'Cámara Sony FX3', category: 'video' as const, available: true },
  { id: 'eq3', name: 'Luz Aputure 600d', category: 'iluminacion' as const, available: true },
  { id: 'eq4', name: 'Estabilizador DJI Ronin', category: 'soporte' as const, available: true },
  { id: 'eq5', name: 'iPhone 15 Pro', category: 'video'as const, available: true },
  { id: 'eq6',name: 'Teleprompter', category: 'soporte' as const, available: true}
];
const productionTeam = teamMembers.filter(member => ['luis', 'fany', 'carlos', 'paola', 'cristian', 'daniel', 'alexis'].includes(member.role));

const equipmentCategoryIcons = {
    audio: <Mic className="w-4 h-4" />,
    video: <Camera className="w-4 h-4" />,
    iluminacion: <Lightbulb className="w-4 h-4" />,
    soporte: <Grip className="w-4 h-4" />
};

const ScheduleRecordingDialog = ({ pendiente, children, onSave, onDelete }: { pendiente: PendienteWithRelations, children: React.ReactNode, onSave: () => void, onDelete: (id: number) => void }) => {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    
    const [assignedTo, setAssignedTo] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [location, setLocation] = useState('');
    const [locationType, setLocationType] = useState<RecordingEvent['locationType']>('estudio');
    const [assignedEquipment, setAssignedEquipment] = useState<string[]>([]);

    useEffect(() => {
        if(open) {
            const event = pendiente.recordingEvent;
            if (event) {
                setAssignedTo(event.assignedTo);
                setStartDate(format(new Date(event.fullStart), 'yyyy-MM-dd'));
                setStartTime(format(new Date(event.fullStart), 'HH:mm'));
                setEndDate(format(new Date(event.fullEnd), 'yyyy-MM-dd'));
                setEndTime(format(new Date(event.fullEnd), 'HH:mm'));
                setLocation(event.location || '');
                setLocationType(event.locationType || 'estudio');
                setAssignedEquipment(event.assignedEquipment || []);
            } else {
                 setAssignedTo(productionTeam.find(m => m.name === pendiente.ejecutor)?.id || '');
                 setStartDate(''); setStartTime(''); setEndDate(''); setEndTime('');
                 setLocation(''); setLocationType('estudio'); setAssignedEquipment([]);
            }
        }
    }, [open, pendiente]);
    
    const handleSave = async () => {
        if (!assignedTo || !startDate || !startTime || !endDate || !endTime) {
            toast({ title: "Error", description: "Completa todos los campos de fecha y responsable.", variant: "destructive" });
            return;
        }

        const teamMember = teamMembers.find(m => m.id === assignedTo);
        if (!teamMember) return;
        
        const newEventData = {
            pendienteId: pendiente.id,
            clientName: pendiente.cliente,
            assignedTo: teamMember.id,
            assignedToName: teamMember.name,
            fullStart: new Date(`${startDate}T${startTime}`),
            fullEnd: new Date(`${endDate}T${endTime}`),
            location: location || '',
            locationType: locationType || 'estudio',
            project: pendiente.pendientePrincipal,
            assignedEquipment,
            equipmentNames: assignedEquipment.map(id => mockEquipment.find(eq => eq.id === id)?.name || '')
        };

        try {
            await scheduleRecording(newEventData);
            toast({ title: "Éxito", description: `Grabación ${pendiente.recordingEvent ? 'actualizada' : 'agendada'}.` });
            onSave();
            setOpen(false);
        } catch (error) {
            toast({ title: "Error", description: "No se pudo agendar la grabación.", variant: "destructive" });
        }
    };
    
    const handleDelete = async () => {
        if (!pendiente.recordingEvent) return;
        try {
            await deleteRecording(pendiente.id);
            toast({ title: "Eliminado", description: "La grabación ha sido eliminada." });
            onDelete(pendiente.id);
            setOpen(false);
        } catch (error) {
             toast({ title: "Error", description: "No se pudo eliminar la grabación.", variant: "destructive" });
        }
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{pendiente.recordingEvent ? 'Editar' : 'Agendar'} Grabación</DialogTitle>
                    <DialogDescription>Para el pendiente: "{pendiente.pendientePrincipal}"</DialogDescription>
                </DialogHeader>
                 <ScrollArea className="max-h-[70vh] p-4">
                  <div className="grid gap-6">
                      <div className="space-y-2">
                          <Label>Responsable</Label>
                          <Select value={assignedTo} onValueChange={setAssignedTo}>
                              <SelectTrigger><SelectValue placeholder="Seleccionar miembro del equipo..." /></SelectTrigger>
                              <SelectContent>
                                  {productionTeam.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                              </SelectContent>
                          </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="startDate">Fecha de Inicio</Label>
                            <Input id="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                         </div>
                         <div className="space-y-2">
                            <Label htmlFor="startTime">Hora de Inicio</Label>
                            <Input id="startTime" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                         </div>
                      </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="endDate">Fecha de Fin</Label>
                            <Input id="endDate" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                         </div>
                         <div className="space-y-2">
                            <Label htmlFor="endTime">Hora de Fin</Label>
                            <Input id="endTime" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                         </div>
                      </div>
                      <div className="space-y-2">
                          <Label>Ubicación / Tipo</Label>
                           <RadioGroup value={locationType} onValueChange={(v) => setLocationType(v as any)} className="flex gap-4">
                                <div className="flex items-center space-x-2"><RadioGroupItem value="estudio" id="loc-estudio" /><Label htmlFor="loc-estudio">Estudio MAW</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="oficina_cliente" id="loc-oficina" /><Label htmlFor="loc-oficina">Oficina Cliente</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="exterior" id="loc-exterior" /><Label htmlFor="loc-exterior">Exterior</Label></div>
                            </RadioGroup>
                          <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Dirección, detalles..." />
                      </div>
                       <div className="space-y-2">
                          <Label>Equipo Requerido</Label>
                           <Card>
                            <CardContent className="p-4 max-h-48 overflow-y-auto">
                                <div className="space-y-3">
                                {mockEquipment.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`eq-${item.id}-${pendiente.id}`}
                                            checked={assignedEquipment.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                                setAssignedEquipment(prev => 
                                                    checked ? [...prev, item.id] : prev.filter(id => id !== item.id)
                                                )
                                            }}
                                        />
                                        <Label htmlFor={`eq-${item.id}-${pendiente.id}`} className="flex-1">
                                            <div className="flex items-center gap-2">
                                                {equipmentCategoryIcons[item.category]}
                                                {item.name}
                                            </div>
                                        </Label>
                                    </div>
                                ))}
                                </div>
                            </CardContent>
                           </Card>
                       </div>
                  </div>
                </ScrollArea>
                <DialogFooter className="justify-between pt-4">
                    <div>
                        {pendiente.recordingEvent && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild><Button variant="destructive"><Trash2 className="w-4 h-4 mr-2" />Eliminar</Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>¿Eliminar esta grabación?</AlertDialogTitle><AlertDialogDescription>Esta acción es irreversible.</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Confirmar</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave}>{pendiente.recordingEvent ? 'Guardar Cambios' : 'Agendar'}</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
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
                fechaCorte: 15,
                status: 'Trabajando'
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
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger><SelectValue placeholder="Seleccionar Status" /></SelectTrigger>
                        <SelectContent>{Object.keys(statusColors).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
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

const PendientesTable = ({ data, onUpdateTask, currentUser, clients, onRefresh }: { data: PendienteWithRelations[]; onUpdateTask: (task: PendienteWithRelations) => void; currentUser: any; clients: Client[]; onRefresh: () => void; }) => {
    const [newSubTaskText, setNewSubTaskText] = useState<Record<string, string>>({});
    const { toast } = useToast();

    if (data.length === 0) {
        return (
            <div className="text-center p-8 text-foreground/70">
                No se encontraron pendientes con los filtros seleccionados.
            </div>
        );
    }
    
    const handleAddSubTask = async (taskId: number) => {
        const text = newSubTaskText[taskId.toString()];
        if (!text) return;

        try {
            const newSubTask = await addSubTask({ text, pendienteId: taskId });
            const task = data.find(t => t.id === taskId);
            if (task && newSubTask) {
                const updatedTask = { ...task, subTasks: [...(task.subTasks || []), newSubTask] };
                onUpdateTask(updatedTask);
            }
            setNewSubTaskText(prev => ({...prev, [taskId.toString()]: ''}));
            toast({ title: "Sub-tarea añadida" });
        } catch (error) {
            toast({ title: "Error", description: "No se pudo añadir la sub-tarea.", variant: "destructive" });
        }
    };
    
    const handleToggleSubTask = async (taskId: number, subTaskId: number, currentStatus: boolean) => {
        try {
            await toggleSubTask(subTaskId, !currentStatus);
            const task = data.find(t => t.id === taskId);
            if (task) {
                const updatedSubTasks = task.subTasks.map(st => 
                    st.id === subTaskId ? { ...st, completed: !st.completed } : st
                );
                const updatedTask = { ...task, subTasks: updatedSubTasks };
                onUpdateTask(updatedTask);
            }
        } catch (error) {
            toast({ title: "Error", description: "No se pudo actualizar la sub-tarea.", variant: "destructive" });
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
                        <TableHead className="w-[180px]">Próxima Grabación</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => {
                        const isEncargado = currentUser.name === item.encargado;
                        const isAdmin = currentUser.role === 'admin';
                        const canEdit = isAdmin || isEncargado;

                        return (
                             <TableRow key={item.id}>
                                <TableCell className="font-medium align-top">
                                     <EditPendienteDialog pendiente={item} clients={clients} onUpdate={onRefresh}>
                                        <span className={cn(canEdit && "cursor-pointer hover:text-primary")}>{item.cliente}</span>
                                     </EditPendienteDialog>
                                </TableCell>
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
                                                        onCheckedChange={(e) => {
                                                            handleToggleSubTask(item.id, subTask.id, subTask.completed)
                                                        }}
                                                    />
                                                    <label htmlFor={`subtask-${subTask.id}`} className={cn("text-sm", subTask.completed && "line-through text-muted-foreground")}>{subTask.text}</label>
                                                </div>
                                            ))}
                                        </div>
                                        {(isAdmin || isEncargado) && (
                                            <div className="flex items-center gap-2 pl-4 mt-2">
                                                <Input 
                                                    placeholder="Añadir sub-pendiente..."
                                                    className="h-8 text-sm"
                                                    value={newSubTaskText[item.id.toString()] || ''}
                                                    onChange={(e) => setNewSubTaskText(prev => ({...prev, [item.id.toString()]: e.target.value}))}
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
                                <TableCell className="align-top text-center">
                                    <ScheduleRecordingDialog 
                                        pendiente={item} 
                                        onSave={onRefresh}
                                        onDelete={() => onRefresh()}
                                    >
                                        {item.recordingEvent ? (
                                             <Button variant="outline" size="sm" className="flex flex-col h-auto">
                                                <span className='font-bold'>{format(new Date(item.recordingEvent.fullStart), 'dd MMM', { locale: es })}</span>
                                                <span className='text-xs text-muted-foreground'>{format(new Date(item.recordingEvent.fullStart), 'HH:mm')}</span>
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
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [searchFilter, setSearchFilter] = useState('');

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
               <PendientesTable data={filteredData.filter(d => d.categoria === 'Contenido')} onUpdateTask={handleUpdateTask} currentUser={user} clients={clients} onRefresh={fetchData} />
            </TabsContent>

            <TabsContent value="ads">
                <PendientesTable data={filteredData.filter(d => d.categoria === 'Ads')} onUpdateTask={handleUpdateTask} currentUser={user} clients={clients} onRefresh={fetchData} />
            </TabsContent>
            
            <TabsContent value="web">
                 <PendientesTable data={filteredData.filter(d => d.categoria === 'Web')} onUpdateTask={handleUpdateTask} currentUser={user} clients={clients} onRefresh={fetchData} />
            </TabsContent>
        </Tabs>
    </div>
  );
}

    
