
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, subWeeks, addWeeks, isWithinInterval, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { PlusCircle, Video, Camera, Phone, User, Monitor, Mic, Lightbulb, Grip, X, ChevronLeft, ChevronRight, Users, Trash2, Building, Briefcase } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { mockData as mockPendientesData, type Activity, type StatusPendiente, initialEvents } from '@/lib/activities-data';
import { teamMembers } from '@/lib/team-data';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


// Mocks - estos serían reemplazados por datos de Firebase
const mockEquipment = [
  { id: 'eq1', name: 'Micrófono Hollyland', category: 'audio' as const, available: true },
  { id: 'eq2', name: 'Cámara Sony FX3', category: 'video' as const, available: true },
  { id: 'eq3', name: 'Luz Aputure 600d', category: 'iluminacion' as const, available: true },
  { id: 'eq4', name: 'Estabilizador DJI Ronin', category: 'soporte' as const, available: true },
  { id: 'eq5', name: 'iPhone 15 Pro', category: 'video'as const, available: true },
  { id: 'eq6',name: 'Teleprompter', category: 'soporte' as const, available: true}
];

type EventType = "grabacion" | "cita_venta";

type RecordingEvent = {
  id: string;
  type: EventType;
  clientName: string;
  assignedTo: string;
  assignedToName: string;
  assignedToColor: string;
  fullStart: Date;
  fullEnd: Date;
  location: string;
  locationType: "estudio" | "exterior" | "oficina_cliente" | "videollamada" | "presencial";
  project?: string;
  assignedEquipment?: string[];
  equipmentNames?: string[];
};

const equipmentCategoryIcons = {
    audio: <Mic className="w-4 h-4" />,
    video: <Camera className="w-4 h-4" />,
    iluminacion: <Lightbulb className="w-4 h-4" />,
    soporte: <Grip className="w-4 h-4" />
};

const salesTeam = teamMembers.filter(member => ['julio', 'alma', 'fernando'].includes(member.role));
const productionTeam = teamMembers.filter(member => ['luis', 'fany', 'carlos', 'paola', 'cristian', 'daniel', 'alexis'].includes(member.role));


const EventDialog = ({
    event,
    onSave,
    onDelete,
    children,
    eventType,
    availableEquipment,
    allEvents
}: {
    event?: RecordingEvent | null,
    onSave: (event: Omit<RecordingEvent, 'id' | 'equipmentNames' | 'assignedToName' | 'assignedToColor'>) => void,
    onDelete?: (id: string) => void,
    children: React.ReactNode,
    eventType: EventType,
    availableEquipment: typeof mockEquipment,
    allEvents: RecordingEvent[],
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
    const [locationType, setLocationType] = useState<RecordingEvent['locationType']>(eventType === 'grabacion' ? 'estudio' : 'videollamada');
    const [assignedEquipment, setAssignedEquipment] = useState<string[]>([]);
    const [project, setProject] = useState('');

    const team = eventType === 'grabacion' ? productionTeam : salesTeam;

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
            setProject(event.project || '');
            if(eventType === 'grabacion') setAssignedEquipment(event.assignedEquipment || []);
        } else {
            setClientName(''); setAssignedTo(''); setStartDate(''); setStartTime(''); setEndDate(''); setEndTime('');
            setLocation(''); setLocationType(eventType === 'grabacion' ? 'estudio' : 'videollamada'); setAssignedEquipment([]); setProject('');
        }
    }, [event, open, eventType]);
    
    const handleSave = () => {
        if (!clientName || !assignedTo || !startDate || !startTime || !endDate || !endTime) {
            toast({ title: "Error", description: "Completa todos los campos obligatorios.", variant: "destructive" });
            return;
        }

        const newEventData = {
            type: eventType,
            clientName,
            assignedTo,
            fullStart: new Date(`${startDate}T${startTime}`),
            fullEnd: new Date(`${endDate}T${endTime}`),
            location,
            locationType,
            project,
            ...(eventType === 'grabacion' && { assignedEquipment })
        };

        onSave(newEventData);
        toast({ title: "Éxito", description: `Evento ${event ? 'actualizado' : 'agendado'}.` });
        setOpen(false);
    };

    const handleDelete = () => {
        if(event && onDelete) {
            onDelete(event.id);
            toast({ title: "Eliminado", description: "El evento ha sido eliminado." });
            setOpen(false);
        }
    }
    
    const isEquipmentAvailable = (equipmentId: string): boolean => {
        const newStart = new Date(`${startDate}T${startTime}`);
        const newEnd = new Date(`${endDate}T${endTime}`);
        if(isNaN(newStart.getTime()) || isNaN(newEnd.getTime())) return true; // Don't block if dates are not set

        const conflictingEvents = allEvents.filter(e => 
            e.id !== event?.id &&
            e.type === 'grabacion' &&
            e.assignedEquipment?.includes(equipmentId) &&
            (newStart < e.fullEnd && newEnd > e.fullStart)
        );
        return conflictingEvents.length === 0;
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{event ? `Editar ${eventType === 'grabacion' ? 'Grabación' : 'Cita'}` : `Agendar Nueva ${eventType === 'grabacion' ? 'Grabación' : 'Cita'}`}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] p-4">
                  <div className="grid gap-6">
                      <div className="space-y-2">
                          <Label htmlFor="clientName">Nombre del Cliente</Label>
                          <Input id="clientName" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Ej. Biofert" />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="project">Proyecto / Motivo</Label>
                          <Textarea id="project" value={project} onChange={e => setProject(e.target.value)} placeholder={eventType === 'grabacion' ? 'Ej. Videos testimoniales Q4' : 'Ej. Videollamada de seguimiento'} />
                      </div>
                      <div className="space-y-2">
                          <Label>Responsable</Label>
                          <Select value={assignedTo} onValueChange={setAssignedTo}>
                              <SelectTrigger><SelectValue placeholder="Seleccionar miembro del equipo..." /></SelectTrigger>
                              <SelectContent>
                                  {team.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
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
                                {eventType === 'grabacion' ? (
                                    <>
                                     <div className="flex items-center space-x-2"><RadioGroupItem value="estudio" id="loc-estudio" /><Label htmlFor="loc-estudio">Estudio MAW</Label></div>
                                     <div className="flex items-center space-x-2"><RadioGroupItem value="oficina_cliente" id="loc-oficina" /><Label htmlFor="loc-oficina">Oficina Cliente</Label></div>
                                     <div className="flex items-center space-x-2"><RadioGroupItem value="exterior" id="loc-exterior" /><Label htmlFor="loc-exterior">Exterior</Label></div>
                                    </>
                                ) : (
                                    <>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="videollamada" id="loc-video" /><Label htmlFor="loc-video">Videollamada</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="presencial" id="loc-presencial" /><Label htmlFor="loc-presencial">Presencial</Label></div>
                                    </>
                                )}
                            </RadioGroup>
                          <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Dirección, link de Meet, o detalles..." />
                      </div>
                       {eventType === 'grabacion' && (
                           <div className="space-y-2">
                              <Label>Equipo Requerido</Label>
                               <Card>
                                <CardContent className="p-4 max-h-48 overflow-y-auto">
                                    <div className="space-y-3">
                                    {availableEquipment.map((item) => {
                                        const isAvailable = isEquipmentAvailable(item.id);
                                        return (
                                        <div key={item.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`eq-${item.id}-${event?.id || 'new'}`}
                                                checked={assignedEquipment.includes(item.id)}
                                                onCheckedChange={(checked) => {
                                                    setAssignedEquipment(prev => 
                                                        checked ? [...prev, item.id] : prev.filter(id => id !== item.id)
                                                    )
                                                }}
                                                disabled={!isAvailable}
                                            />
                                            <Label htmlFor={`eq-${item.id}-${event?.id || 'new'}`} className={cn("flex-1", !isAvailable && "text-muted-foreground line-through")}>
                                                <div className="flex items-center gap-2">
                                                    {equipmentCategoryIcons[item.category]}
                                                    {item.name}
                                                    {!isAvailable && <Badge variant="destructive" className="ml-auto">Ocupado</Badge>}
                                                </div>
                                            </Label>
                                        </div>
                                    )})}
                                    </div>
                                </CardContent>
                               </Card>
                           </div>
                       )}
                  </div>
                </ScrollArea>
                <DialogFooter className="justify-between pt-4">
                    <div>
                        {event && onDelete && (
                           <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive"><Trash2 className="w-4 h-4 mr-2" />Eliminar</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>¿Estás seguro?</AlertDialogTitle><AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Continuar</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave}>{event ? 'Guardar Cambios' : 'Agendar'}</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const CalendarSection = ({ title, description, events, team, eventType, onSave, onDelete, allEvents, availableEquipment }: { 
    title: string, description: string, events: RecordingEvent[], team: typeof teamMembers, 
    eventType: EventType, onSave: (data: any, id?: string) => void, onDelete: (id: string) => void,
    allEvents: RecordingEvent[], availableEquipment: typeof mockEquipment
}) => {
    const [currentDate, setCurrentDate] = useState(new Date('2024-11-05'));
    const [memberFilter, setMemberFilter] = useState('Todos');

    const weekStartsOn = 1; // Monday
    const currentWeekStart = startOfWeek(currentDate, { weekStartsOn });
    const currentWeekEnd = endOfWeek(currentDate, { weekStartsOn });
    const daysInWeek = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd });

    const filteredEvents = useMemo(() => {
        return events.filter(event => (memberFilter === 'Todos' || event.assignedToName === memberFilter) && event.type === eventType);
    }, [events, memberFilter, eventType]);

    const weeklySummary = useMemo(() => {
        const summary: { [key: string]: number } = {};
        team.forEach(member => { summary[member.name] = 0; });
        const eventsInWeek = events.filter(event => 
            event.type === eventType &&
            (memberFilter === 'Todos' || event.assignedToName === memberFilter) &&
            isWithinInterval(event.fullStart, { start: currentWeekStart, end: currentWeekEnd })
        );
        eventsInWeek.forEach(event => { if (summary[event.assignedToName] !== undefined) summary[event.assignedToName]++; });
        
        if (memberFilter !== 'Todos') {
            const filteredSummary: { [key: string]: number } = {};
            if(summary[memberFilter] !== undefined) {
                filteredSummary[memberFilter] = summary[memberFilter];
            }
            return filteredSummary;
        }

        return summary;
    }, [currentWeekStart, currentWeekEnd, events, team, eventType, memberFilter]);

    const goToPreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
    const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
    const goToCurrentWeek = () => setCurrentDate(new Date());

    const eventTypeIcons = {
        grabacion: <Camera className="w-4 h-4 mr-2" />,
        cita_venta: <Briefcase className="w-4 h-4 mr-2" />
    };

    return (
        <div className="flex flex-col h-full bg-card rounded-lg border p-4">
          <header className="flex justify-between items-center mb-6 px-1">
            <div>
                <h2 className="text-xl font-bold font-headline">{title}</h2>
                <p className="text-muted-foreground">{format(currentWeekStart, "d MMM", { locale: es })} - {format(currentWeekEnd, "d MMMM, yyyy", { locale: es })}</p>
            </div>
            <div className="flex items-center gap-2">
                <Select value={memberFilter} onValueChange={setMemberFilter}>
                    <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Todos">Todos</SelectItem>{team.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={goToPreviousWeek}><ChevronLeft className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" onClick={goToCurrentWeek}>Hoy</Button>
                <Button variant="outline" size="sm" onClick={goToNextWeek}><ChevronRight className="w-4 h-4" /></Button>
                <EventDialog onSave={(data) => onSave(data)} eventType={eventType} allEvents={allEvents} availableEquipment={availableEquipment}>
                    <Button size="sm"><PlusCircle className="w-4 h-4 mr-2" />Agendar</Button>
                </EventDialog>
            </div>
          </header>

          <div className="grid grid-cols-7 flex-grow border-t border-l rounded-t-lg overflow-hidden bg-background">
                {daysInWeek.map(day => {
                    const dayEvents = filteredEvents.filter(event => isSameDay(event.fullStart, day)).sort((a, b) => a.fullStart.getTime() - b.fullStart.getTime());
                    return (
                        <div key={day.toString()} className="border-r border-b flex flex-col min-h-[400px]">
                            <div className="p-2 border-b text-center">
                                <p className="text-sm font-semibold uppercase text-muted-foreground">{format(day, 'EEE', { locale: es })}</p>
                                <p className="text-2xl font-bold">{format(day, 'd')}</p>
                            </div>
                            <ScrollArea className="flex-grow">
                                <div className="p-2 space-y-2">
                                <TooltipProvider>
                                {dayEvents.map(event => (
                                    <EventDialog key={event.id} event={event} onSave={(data) => onSave(data, event.id)} onDelete={onDelete} eventType={eventType} allEvents={allEvents} availableEquipment={availableEquipment}>
                                        <Card className="p-3 hover:bg-card/80 transition-colors cursor-pointer" style={{ borderLeft: `4px solid ${event.assignedToColor}`}}>
                                            <CardHeader className="p-0 mb-2">
                                                <CardTitle className="text-sm">{event.project || event.clientName}</CardTitle>
                                                <CardDescription className="text-xs">{event.clientName}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-0 text-xs space-y-1">
                                                <p className="flex items-center gap-1.5 text-muted-foreground"><User className="w-3 h-3" /> {event.assignedToName}</p>
                                                <p className="font-semibold">{format(event.fullStart, 'HH:mm')} - {format(event.fullEnd, 'HH:mm')}</p>
                                                {event.type === 'grabacion' && event.equipmentNames && event.equipmentNames.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 pt-1">
                                                        {event.assignedEquipment?.map(id => {
                                                            const equipment = mockEquipment.find(e => e.id === id);
                                                            if (!equipment) return null;
                                                            return (
                                                                <Tooltip key={id}>
                                                                    <TooltipTrigger asChild>
                                                                        <div className="p-1.5 bg-secondary rounded-md">
                                                                            {equipmentCategoryIcons[equipment.category]}
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>{equipment.name}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                                {event.type === 'cita_venta' && (
                                                    <Badge variant="outline">{event.locationType === 'videollamada' ? 'Videollamada' : 'Presencial'}</Badge>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </EventDialog>
                                ))}
                                </TooltipProvider>
                                </div>
                            </ScrollArea>
                        </div>
                    )
                })}
          </div>
          <Card className="mt-4">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Users className="w-4 h-4"/>Resumen Semanal</CardTitle></CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Object.entries(weeklySummary).map(([name, count]) => (
                        <div key={name} className="flex items-center justify-between p-3 rounded-lg bg-background">
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

export default function CalendarioPage() {
    const [events, setEvents] = useState<RecordingEvent[]>(initialEvents);
    const [pendientes, setPendientes] = useState<Activity[]>(mockPendientesData);

    const handleAddOrUpdateEvent = (eventData: Omit<RecordingEvent, 'id' | 'equipmentNames' | 'assignedToName' | 'assignedToColor'>, existingId?: string) => {
        const teamMember = teamMembers.find(m => m.id === eventData.assignedTo);
        
        const fullEventData = {
            ...eventData,
            id: existingId || `evt-${Date.now()}`,
            assignedToName: teamMember?.name || 'N/A',
            assignedToColor: teamMember?.color || '#FFFFFF',
            ...(eventData.type === 'grabacion' && { equipmentNames: eventData.assignedEquipment?.map(id => mockEquipment.find(eq => eq.id === id)?.name || '') || [] }),
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
        
        if (!existingId) {
            const newPendiente: Activity = {
                id: `pend-${Date.now()}`,
                cliente: eventData.clientName,
                encargado: teamMember?.name || 'N/A', 
                ejecutor: teamMember?.name || 'N/A',
                fechaCorte: 15,
                status: 'Trabajando' as StatusPendiente,
                pendientePrincipal: eventData.project || `${eventData.type === 'grabacion' ? 'Grabación' : 'Cita'} para ${eventData.clientName}`,
                categoria: eventData.type === 'grabacion' ? 'Contenido' : 'Ventas',
                subTasks: [],
            };
            setPendientes(prev => [...prev, newPendiente]);
        }
    }

    const handleDeleteEvent = (id: string) => {
        setEvents(prev => prev.filter(e => e.id !== id));
    }

    return (
        <div>
            <h1 className="text-2xl font-bold font-headline mb-4">Planificación Semanal</h1>
            <div className="grid grid-cols-1 gap-8">
                 <CalendarSection
                    title="Calendario de Grabaciones"
                    description="Planifica sesiones de fotos, videos y producciones."
                    events={events}
                    team={productionTeam}
                    eventType="grabacion"
                    onSave={handleAddOrUpdateEvent}
                    onDelete={handleDeleteEvent}
                    allEvents={events}
                    availableEquipment={mockEquipment}
                />
                 <CalendarSection
                    title="Calendario de Citas de Venta"
                    description="Gestiona videollamadas y reuniones presenciales con prospectos y clientes."
                    events={events}
                    team={salesTeam}
                    eventType="cita_venta"
                    onSave={handleAddOrUpdateEvent}
                    onDelete={handleDeleteEvent}
                    allEvents={events}
                    availableEquipment={[]}
                />
            </div>
        </div>
    )
}
