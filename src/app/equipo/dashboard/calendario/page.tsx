
'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, subWeeks, addWeeks, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { PlusCircle, Video, Camera, Phone, User, Monitor, Mic, Lightbulb, Grip, X, ChevronLeft, ChevronRight, Users } from 'lucide-react';
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

// Mocks - estos serían reemplazados por datos de Firebase
const mockEquipment = [
  { id: 'eq1', name: 'Micrófono Hollyland', category: 'audio', available: true },
  { id: 'eq2', name: 'Cámara Sony FX3', category: 'video', available: true },
  { id: 'eq3', name: 'Luz Aputure 600d', category: 'iluminacion', available: true },
  { id: 'eq4', name: 'Estabilizador DJI Ronin', category: 'soporte', available: false },
  { id: 'eq5', name: 'iPhone 15 Pro', category: 'video', available: true },
  { id: 'eq6',name: 'Teleprompter', category: 'soporte', available: true}
];

type RecordingEvent = {
  id: string;
  clientName: string;
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

const AddRecordingEventDialog = ({ onAddEvent }: { onAddEvent: (event: RecordingEvent) => void }) => {
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

    const handleSave = () => {
        if (!clientName || !assignedTo || !startDate || !startTime || !endDate || !endTime) {
            toast({ title: "Error", description: "Completa todos los campos de fecha y asignación.", variant: "destructive" });
            return;
        }

        const fullStart = new Date(`${startDate}T${startTime}`);
        const fullEnd = new Date(`${endDate}T${endTime}`);
        
        const newEvent: RecordingEvent = {
            id: `rec-${Date.now()}`,
            clientName,
            assignedToName: teamMembers.find(m => m.id === assignedTo)?.name || '',
            fullStart,
            fullEnd,
            location,
            locationType,
            assignedEquipment,
            equipmentNames: assignedEquipment.map(id => mockEquipment.find(eq => eq.id === id)?.name || 'Equipo no encontrado'),
            project
        };

        onAddEvent(newEvent);
        
        toast({ title: "Éxito", description: `Evento de grabación para "${clientName}" agendado.` });
        setOpen(false);
        // Reset form
        setClientName(''); setAssignedTo(''); setStartDate(''); setStartTime(''); setEndDate(''); setEndTime('');
        setLocation(''); setLocationType('estudio'); setAssignedEquipment([]); setProject('');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Agendar Grabación
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Agendar Nueva Grabación</DialogTitle>
                    <DialogDescription>
                        Planifica una nueva sesión, asigna responsables y reserva el equipo necesario.
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
                                            id={`eq-${item.id}`}
                                            checked={assignedEquipment.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                                setAssignedEquipment(prev => 
                                                    checked ? [...prev, item.id] : prev.filter(id => id !== item.id)
                                                )
                                            }}
                                            disabled={!item.available}
                                        />
                                        <Label htmlFor={`eq-${item.id}`} className={cn("flex-1", !item.available && "text-muted-foreground line-through")}>
                                            <div className="flex items-center gap-2">
                                                {equipmentCategoryIcons[item.category as keyof typeof equipmentCategoryIcons]}
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
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>Agendar Grabación</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function CalendarioPage() {
    const [currentDate, setCurrentDate] = useState(new Date('2024-11-05'));
    const [events, setEvents] = useState<RecordingEvent[]>(initialEvents);
    const [pendientes, setPendientes] = useState<Pendiente[]>(mockPendientesData);

    const weekStartsOn = 1; // Monday
    const currentWeekStart = startOfWeek(currentDate, { weekStartsOn });
    const currentWeekEnd = endOfWeek(currentDate, { weekStartsOn });
    const daysInWeek = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd });

    const handleAddEvent = (newEvent: RecordingEvent) => {
        setEvents(prev => [...prev, newEvent].sort((a, b) => a.fullStart.getTime() - b.fullStart.getTime()));
        
        const newPendiente: Pendiente = {
            id: `pend-${Date.now()}`,
            cliente: newEvent.clientName,
            encargado: newEvent.assignedToName, 
            ejecutor: newEvent.assignedToName,
            fechaCorte: 15,
            status: 'Trabajando' as StatusPendiente,
            pendientePrincipal: newEvent.project || `Grabación para ${newEvent.clientName}`,
            categoria: 'Contenido'
        };
        setPendientes(prev => [...prev, newPendiente]);
    }

    const goToPreviousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
    const goToNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
    const goToCurrentWeek = () => setCurrentDate(new Date());

    const weeklySummary = useMemo(() => {
        const summary: { [key: string]: number } = {};
        
        teamMembers.forEach(member => {
            summary[member.name] = 0;
        });

        const eventsInWeek = events.filter(event => 
            isWithinInterval(event.fullStart, { start: currentWeekStart, end: currentWeekEnd })
        );

        eventsInWeek.forEach(event => {
            if (summary[event.assignedToName] !== undefined) {
                summary[event.assignedToName]++;
            }
        });

        return summary;
    }, [currentWeekStart, currentWeekEnd, events]);


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
                <Button variant="outline" onClick={goToPreviousWeek}><ChevronLeft className="w-4 h-4 mr-2" /> Semana Anterior</Button>
                <Button variant="ghost" onClick={goToCurrentWeek}>Semana Actual</Button>
                <Button variant="outline" onClick={goToNextWeek}>Siguiente Semana <ChevronRight className="w-4 h-4 ml-2" /></Button>
                <AddRecordingEventDialog onAddEvent={handleAddEvent} />
            </div>
          </header>

          <div className="grid grid-cols-7 flex-grow border-t border-l rounded-t-lg overflow-hidden bg-card">
                {daysInWeek.map(day => {
                    const dayEvents = events.filter(event => isSameDay(event.fullStart, day)).sort((a, b) => a.fullStart.getTime() - b.fullStart.getTime());
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
                                    <Card key={event.id} className="p-3 bg-background/50 hover:bg-background transition-colors">
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

