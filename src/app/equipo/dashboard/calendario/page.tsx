
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, subWeeks, addWeeks, isWithinInterval, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { PlusCircle, Video, Camera, Phone, User, Monitor, Mic, Lightbulb, Grip, X, ChevronLeft, ChevronRight, Users, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { mockData as mockPendientesData, type Pendiente, type StatusPendiente } from '@/lib/activities-data';
import { teamMembers } from '@/lib/team-data';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


// Mocks - estos serían reemplazados por datos de Firebase
const mockEquipment = [
  { id: 'eq1', name: 'Micrófono Hollyland', category: 'audio' as const, available: true },
  { id: 'eq2', name: 'Cámara Sony FX3', category: 'video' as const, available: true },
  { id: 'eq3', name: 'Luz Aputure 600d', category: 'iluminacion' as const, available: true },
  { id: 'eq4', name: 'Estabilizador DJI Ronin', category: 'soporte' as const, available: false },
  { id: 'eq5', name: 'iPhone 15 Pro', category: 'video'as const, available: true },
  { id: 'eq6',name: 'Teleprompter', category: 'soporte' as const, available: true}
];

type RecordingEvent = {
  id: string;
  clientName: string;
  assignedTo: string;
  assignedToName: string;
  fullStart: Date;
  fullEnd: Date;
  location: string;
  locationType: "estudio" | "exterior" | "oficina_cliente";
  assignedEquipment: string[];
  equipmentNames: string[];
  project: string;
};

const initialEvents: RecordingEvent[] = [
    {
        id: `rec-1730812800000`,
        clientName: "Biofert",
        assignedTo: "fany-01",
        assignedToName: "Fany",
        fullStart: new Date('2024-11-05T10:00:00'),
        fullEnd: new Date('2024-11-05T12:00:00'),
        location: "Estudio Principal",
        locationType: "estudio",
        assignedEquipment: ["eq1", "eq2"],
        equipmentNames: ["Micrófono Hollyland", "Cámara Sony FX3"],
        project: "Videos testimoniales para Q4"
    },
     {
        id: `rec-1730985600000`,
        clientName: "Constructora Edifica",
        assignedTo: "luis-01",
        assignedToName: "Luis",
        fullStart: new Date('2024-11-07T14:00:00'),
        fullEnd: new Date('2024-11-07T16:30:00'),
        location: "Oficinas del Cliente",
        locationType: "oficina_cliente",
        assignedEquipment: ["eq5"],
        equipmentNames: ["iPhone 15 Pro"],
        project: "Entrevistas para video corporativo"
    }
];


const equipmentCategoryIcons = {
    audio: <Mic className="w-4 h-4" />,
    video: <Monitor className="w-4 h-4" />,
    iluminacion: <Lightbulb className="w-4 h-4" />,
    soporte: <Grip className="w-4 h-4" />
};

const EventDialog = ({ 
    event, 
    onSave, 
    onDelete, 
    children 
}: { 
    event?: RecordingEvent | null, 
    onSave: (event: Omit<RecordingEvent, 'id' | 'equipmentNames' | 'assignedToName'>) => void, 
    onDelete?: (id: string) => void, 
    children: React.ReactNode 
}) => {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const [clientName, setClientName] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [location, setLocation] = useState('');
    const [locationType, setLocationType] = useState<'estudio' | 'exterior' | 'oficina_cliente'>('estudio');
    const [assignedEquipment, setAssignedEquipment] = useState<string[]>([]);
    const [project, setProject] = useState('');

    useEffect(() => {
        if (event) {
            setClientName(event.clientName);
            setAssignedTo(event.assignedTo);
            setStartDate(format(event.fullStart, 'yyyy-MM-dd'));
            setStartTime(format(event.fullStart, 'HH:mm'));
            setEndDate(format(event.fullEnd, 'yyyy-MM-dd'));
            setEndTime(format(event.fullEnd, 'HH:mm'));
            setLocation(event.location);
            setLocationType(event.locationType);
            setAssignedEquipment(event.assignedEquipment);
            setProject(event.project);
        } else {
             // Reset form for new event
            setClientName(''); setAssignedTo(''); setStartDate(''); setStartTime(''); setEndDate(''); setEndTime('');
            setLocation(''); setLocationType('estudio'); setAssignedEquipment([]); setProject('');
        }
    }, [event, open]);
    

    const handleSave = () => {
        if (!clientName || !assignedTo || !startDate || !startTime || !endDate || !endTime) {
            toast({ title: "Error", description: "Completa todos los campos de fecha y asignación.", variant: "destructive" });
            return;
        }

        const newEventData = {
            clientName,
            assignedTo,
            fullStart: new Date(`${startDate}T${startTime}`),
            fullEnd: new Date(`${endDate}T${endTime}`),
            location,
            locationType,
            assignedEquipment,
            project
        };

        onSave(newEventData);
        
        toast({ title: "Éxito", description: `Evento de grabación para "${clientName}" ${event ? 'actualizado' : 'agendado'}.` });
        setOpen(false);
    };

    const handleDelete = () => {
        if(event && onDelete) {
            onDelete(event.id);
            toast({ title: "Eliminado", description: "El evento de grabación ha sido eliminado." });
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{event ? 'Editar Grabación' : 'Agendar Nueva Grabación'}</DialogTitle>
                    <DialogDescription>
                        {event ? 'Modifica los detalles de la sesión.' : 'Planifica una nueva sesión, asigna responsables y reserva el equipo necesario.'}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] p-4">
                  <div className="grid gap-6">
                      <div className="space-y-2">
                          <Label htmlFor="clientName">Nombre del Cliente</Label>
                          <Input id="clientName" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Ej. Biofert" />
                      </div>
                       <div className="space-y-2">
                          <Label htmlFor="project">Proyecto / Descripción</Label>
                          <Textarea id="project" value={project} onChange={e => setProject(e.target.value)} placeholder="Ej. Videos testimoniales Q4" />
                      </div>
                      <div className="space-y-2">
                          <Label>Responsable</Label>
                          <Select value={assignedTo} onValueChange={setAssignedTo}>
                              <SelectTrigger><SelectValue placeholder="Seleccionar miembro del equipo..." /></SelectTrigger>
                              <SelectContent>
                                  {teamMembers.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
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
                          <Label>Ubicación</Label>
                          <div className="flex gap-2">
                            <Select value={locationType} onValueChange={(v) => setLocationType(v as any)}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="estudio">Estudio MAW</SelectItem>
                                    <SelectItem value="oficina_cliente">Oficina del Cliente</SelectItem>
                                    <SelectItem value="exterior">Exterior</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Dirección o detalles..." />
                          </div>
                      </div>
                       <div className="space-y-2">
                          <Label>Equipo Requerido</Label>
                           <Card>
                            <CardContent className="p-4 max-h-48 overflow-y-auto">
                                <div className="space-y-3">
                                {mockEquipment.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`eq-${item.id}-${event?.id || 'new'}`}
                                            checked={assignedEquipment.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                                setAssignedEquipment(prev => 
                                                    checked ? [...prev, item.id] : prev.filter(id => id !== item.id)
                                                )
                                            }}
                                            disabled={!item.available}
                                        />
                                        <Label htmlFor={`eq-${item.id}-${event?.id || 'new'}`} className={cn("flex-1", !item.available && "text-muted-foreground line-through")}>
                                            <div className="flex items-center gap-2">
                                                {equipmentCategoryIcons[item.category]}
                                                {item.name}
                                                {!item.available && <Badge variant="destructive" className="ml-auto">Ocupado</Badge>}
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
                <DialogFooter className="justify-between">
                    <div>
                        {event && onDelete && (
                           <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Eliminar
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Se eliminará permanentemente el evento de grabación.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>Continuar</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave}>{event ? 'Guardar Cambios' : 'Agendar Grabación'}</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function CalendarioPage() {
    const [currentDate, setCurrentDate] = useState(new Date('2024-11-05'));
    const [events, setEvents] = useState<RecordingEvent[]>(initialEvents);
    const [pendientes, setPendientes] = useState<Pendiente[]>(mockPendientesData);
    const [selectedEvent, setSelectedEvent] = useState<RecordingEvent | null>(null);
    const [memberFilter, setMemberFilter] = useState('Todos');

    const weekStartsOn = 1; // Monday
    const currentWeekStart = startOfWeek(currentDate, { weekStartsOn });
    const currentWeekEnd = endOfWeek(currentDate, { weekStartsOn });
    const daysInWeek = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd });

    const filteredEvents = useMemo(() => {
        return events.filter(event => memberFilter === 'Todos' || event.assignedToName === memberFilter);
    }, [events, memberFilter]);


    const handleAddOrUpdateEvent = (eventData: Omit<RecordingEvent, 'id' | 'equipmentNames' | 'assignedToName'>, existingId?: string) => {
        const fullEventData = {
            ...eventData,
            id: existingId || `rec-${Date.now()}`,
            assignedToName: teamMembers.find(m => m.id === eventData.assignedTo)?.name || 'N/A',
            equipmentNames: eventData.assignedEquipment.map(id => mockEquipment.find(eq => eq.id === id)?.name || 'Equipo no encontrado'),
        };

        setEvents(prev => {
            const existingIndex = prev.findIndex(e => e.id === existingId);
            if (existingIndex > -1) {
                const updatedEvents = [...prev];
                updatedEvents[existingIndex] = fullEventData;
                return updatedEvents.sort((a, b) => a.fullStart.getTime() - b.fullStart.getTime());
            }
            return [...prev, fullEventData].sort((a, b) => a.fullStart.getTime() - b.fullStart.getTime());
        });
        
        // Add to pendientes if it's a new event
        if (!existingId) {
            const newPendiente: Pendiente = {
                id: `pend-${Date.now()}`,
                cliente: eventData.clientName,
                encargado: fullEventData.assignedToName, 
                ejecutor: fullEventData.assignedToName,
                fechaCorte: 15,
                status: 'Trabajando' as StatusPendiente,
                pendientePrincipal: eventData.project || `Grabación para ${eventData.clientName}`,
                categoria: 'Contenido'
            };
            setPendientes(prev => [...prev, newPendiente]);
        }
    }

    const handleDeleteEvent = (id: string) => {
        setEvents(prev => prev.filter(e => e.id !== id));
    }


    const goToPreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
    const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
    const goToCurrentWeek = () => setCurrentDate(new Date());

    const weeklySummary = useMemo(() => {
        const summary: { [key: string]: number } = {};
        
        teamMembers.forEach(member => {
            summary[member.name] = 0;
        });

        const eventsInWeek = filteredEvents.filter(event => 
            isWithinInterval(event.fullStart, { start: currentWeekStart, end: currentWeekEnd })
        );

        eventsInWeek.forEach(event => {
            if (summary[event.assignedToName] !== undefined) {
                summary[event.assignedToName]++;
            }
        });

        return summary;
    }, [currentWeekStart, currentWeekEnd, filteredEvents]);


    return (
        <div className="flex flex-col h-full">
          <header className="flex justify-between items-center mb-6 px-1">
            <div>
                <h1 className="text-2xl font-bold font-headline">Calendario de Grabaciones</h1>
                <p className="text-muted-foreground">
                    {format(currentWeekStart, "d 'de' MMMM", { locale: es })} - {format(currentWeekEnd, "d 'de' MMMM 'de' yyyy", { locale: es })}
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Select value={memberFilter} onValueChange={setMemberFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por responsable" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Todos">Todos los Miembros</SelectItem>
                        {teamMembers.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Button variant="outline" onClick={goToPreviousWeek}><ChevronLeft className="w-4 h-4 mr-2" /> Semana Anterior</Button>
                <Button variant="ghost" onClick={goToCurrentWeek}>Semana Actual</Button>
                <Button variant="outline" onClick={goToNextWeek}>Siguiente Semana <ChevronRight className="w-4 h-4 ml-2" /></Button>
                <EventDialog onSave={(data) => handleAddOrUpdateEvent(data)} >
                    <Button>
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Agendar Grabación
                    </Button>
                </EventDialog>
            </div>
          </header>

          <div className="grid grid-cols-7 flex-grow border-t border-l rounded-t-lg overflow-hidden bg-card">
                {daysInWeek.map(day => {
                    const dayEvents = filteredEvents.filter(event => isSameDay(event.fullStart, day)).sort((a, b) => a.fullStart.getTime() - b.fullStart.getTime());
                    return (
                        <div key={day.toString()} className="border-r border-b flex flex-col">
                            <div className="p-2 border-b text-center">
                                <p className="text-sm font-semibold uppercase text-muted-foreground">{format(day, 'EEE', { locale: es })}</p>
                                <p className="text-2xl font-bold">{format(day, 'd')}</p>
                            </div>
                            <ScrollArea className="flex-grow">
                                <div className="p-2 space-y-2">
                                {dayEvents.length > 0 ? (
                                    dayEvents.map(event => (
                                    <EventDialog 
                                        key={event.id}
                                        event={event} 
                                        onSave={(data) => handleAddOrUpdateEvent(data, event.id)}
                                        onDelete={handleDeleteEvent}
                                    >
                                        <Card className="p-3 bg-background/50 hover:bg-background transition-colors cursor-pointer">
                                            <CardHeader className="p-0 mb-2">
                                                <CardTitle className="text-sm">{event.project}</CardTitle>
                                                <CardDescription className="text-xs">{event.clientName}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-0 text-xs space-y-1">
                                                <p className="flex items-center gap-1.5 text-muted-foreground"><User className="w-3 h-3" /> {event.assignedToName}</p>
                                                <p className="font-semibold">{format(event.fullStart, 'HH:mm')} - {format(event.fullEnd, 'HH:mm')}</p>
                                                <div className="flex flex-wrap gap-1 pt-1">
                                                    {event.equipmentNames.map(name => <Badge key={name} variant="secondary" className="text-xs">{name}</Badge>)}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </EventDialog>
                                    ))
                                ) : (
                                    <div className="text-center text-xs text-muted-foreground pt-10">
                                        <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p>Sin grabaciones</p>
                                    </div>
                                )}
                                </div>
                            </ScrollArea>
                        </div>
                    )
                })}
          </div>
          <Card className="mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5"/>
                    Resumen de Actividad Semanal
                </CardTitle>
                <CardDescription>Número de grabaciones asignadas a cada miembro del equipo para la semana seleccionada.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Object.entries(weeklySummary).map(([name, count]) => (
                        <div key={name} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                            <span className="font-medium">{name}</span>
                            <Badge variant={count > 0 ? 'default' : 'outline'} className="text-lg">{count}</Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
           </Card>
        </div>
      );
}

