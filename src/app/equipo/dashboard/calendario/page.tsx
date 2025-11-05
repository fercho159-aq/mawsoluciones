
'use client';

import React, { useState, useMemo } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { PlusCircle, Video, Camera, Phone, User, Monitor, Mic, Lightbulb, Grip, X } from 'lucide-react';
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
import { addDays, startOfMonth } from 'date-fns';


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

// ** NEW MOCK DATA **
const initialEvents: RecordingEvent[] = [
    {
        id: `rec-${Date.now()}`,
        clientName: "Biofert",
        assignedToName: "Fany",
        fullStart: addDays(startOfMonth(new Date('2024-11-05')), 4), // Approx Nov 5th
        fullEnd: addDays(startOfMonth(new Date('2024-11-05')), 4),
        location: "Estudio Principal",
        locationType: "estudio",
        assignedEquipment: ["eq1", "eq2"],
        equipmentNames: ["Micrófono Hollyland", "Cámara Sony FX3"],
        project: "Videos testimoniales para Q4"
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
  const [date, setDate] = useState<Date | undefined>(new Date('2024-11-05'));
  const [events, setEvents] = useState<RecordingEvent[]>(initialEvents);
  const [pendientes, setPendientes] = useState<Pendiente[]>(mockPendientesData);

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
      // NOTE: In a real app, this would trigger a write to Firebase for both collections
  }

  const filteredEvents = useMemo(() => {
    return events.filter(event => 
        date ? event.fullStart.toDateString() === date.toDateString() : false
    ).sort((a,b) => a.fullStart.getTime() - b.fullStart.getTime());
  }, [date, events]);

  const DayCell = ({ date, ...props }: { date: Date } & React.HTMLAttributes<HTMLDivElement>) => {
    const eventsForDay = events.filter(event => event.fullStart.toDateString() === date.toDateString());
    return (
        <div {...props} className="relative h-full">
            {props.children}
            {eventsForDay.length > 0 && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {eventsForDay.slice(0, 3).map((event, index) => (
                        <div key={index} className="w-1.5 h-1.5 rounded-full bg-primary" />
                    ))}
                </div>
            )}
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Calendario de Grabaciones</h1>
        <AddRecordingEventDialog onAddEvent={handleAddEvent} />
      </div>

      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2 p-4 border-r">
                 <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="p-0 [&_td]:w-14 [&_td]:h-14 [&_th]:w-14"
                    locale={es}
                    components={{ Day: DayCell }}
                    modifiers={{ events: events.map(e => e.fullStart) }}
                    modifiersClassNames={{ events: 'font-bold' }}
                    defaultMonth={new Date('2024-11-01')}
                />
            </div>
            <div className="lg:col-span-1 p-4 bg-card/30">
                 <h2 className="text-xl font-bold font-headline mb-4">
                    Grabaciones para {date ? format(date, "d 'de' MMMM", { locale: es }) : 'el día seleccionado'}
                </h2>
                <ScrollArea className="h-[450px] pr-2">
                  <div className="space-y-4">
                  {filteredEvents.length > 0 ? (
                      filteredEvents.map((event) => (
                      <Card key={event.id} className="p-4 bg-card/50">
                          <CardHeader className="p-0 mb-3">
                            <CardTitle className="text-base">{event.project}</CardTitle>
                            <CardDescription>{event.clientName}</CardDescription>
                          </CardHeader>
                          <CardContent className="p-0 text-sm space-y-2">
                             <p className="flex items-center gap-2 text-muted-foreground"><User className="w-4 h-4" /> Responsable: {event.assignedToName}</p>
                             <p className="font-semibold">{format(event.fullStart, 'HH:mm')} - {format(event.fullEnd, 'HH:mm')}</p>
                             <p className="text-xs text-muted-foreground">{event.locationType === 'estudio' ? 'Estudio MAW' : event.location}</p>
                             <div>
                                <p className="text-xs font-semibold mb-1">Equipo Asignado:</p>
                                <div className="flex flex-wrap gap-1">
                                    {event.equipmentNames.map(name => <Badge key={name} variant="secondary">{name}</Badge>)}
                                </div>
                             </div>
                          </CardContent>
                      </Card>
                      ))
                  ) : (
                      <div className="text-center text-muted-foreground py-10 flex flex-col items-center justify-center h-full">
                          <Camera className="w-16 h-16 mb-4 text-muted-foreground" />
                          <p>No hay grabaciones programadas para este día.</p>
                      </div>
                  )}
                  </div>
                </ScrollArea>
            </div>
        </div>
      </Card>
    </div>
  );
}

