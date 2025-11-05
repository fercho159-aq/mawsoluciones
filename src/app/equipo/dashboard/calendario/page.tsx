'use client';

import React, { useState, useMemo } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { PlusCircle, Video, Camera, Phone, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { mockEvents, mockData as mockPendientesData, type Evento, type Pendiente, type StatusPendiente } from '@/lib/activities-data';
import { teamMembers } from '@/lib/team-data';

const eventTypeConfig = {
    grabacion: { icon: <Camera className="w-4 h-4 mr-2"/>, color: "bg-blue-500" },
    cita: { icon: <Video className="w-4 h-4 mr-2"/>, color: "bg-green-500" },
    llamada: { icon: <Phone className="w-4 h-4 mr-2"/>, color: "bg-purple-500" }
}

const responsables = Array.from(new Set(mockEvents.map(item => item.responsable))).sort();

const AddEventDialog = ({ onAddEvent }: { onAddEvent: (event: Evento) => void }) => {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const [title, setTitle] = useState('');
    const [client, setClient] = useState('');
    const [date, setDate] = useState<Date | undefined>();
    const [type, setType] = useState<Evento['type']>('cita');
    const [responsable, setResponsable] = useState<string>('');

    const handleSave = () => {
        if (!title || !client || !date || !type || !responsable) {
            toast({ title: "Error", description: "Todos los campos son obligatorios.", variant: "destructive" });
            return;
        }

        const newEvent: Evento = {
            id: `evt-${Date.now()}`,
            date,
            title: `${title} - ${client}`,
            client,
            type,
            responsable
        };

        onAddEvent(newEvent);
        
        toast({ title: "Éxito", description: `Evento "${title}" creado y pendiente añadido.` });
        setOpen(false);
        setTitle(''); setClient(''); setDate(undefined); setType('cita'); setResponsable('');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Añadir Evento
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Añadir Nuevo Evento</DialogTitle>
                    <DialogDescription>
                        Esto creará un evento en el calendario y una tarea en la sección de "Pendientes".
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título del Evento</Label>
                        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej. Grabación de Contenido" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="client">Cliente</Label>
                        <Input id="client" value={client} onChange={e => setClient(e.target.value)} placeholder="Ej. Biofert" />
                    </div>
                     <div className="space-y-2">
                        <Label>Tipo de Evento</Label>
                        <Select value={type} onValueChange={(v) => setType(v as Evento['type'])}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="grabacion">Grabación</SelectItem>
                                <SelectItem value="cita">Cita / Videollamada</SelectItem>
                                <SelectItem value="llamada">Llamada</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Responsable</Label>
                        <Select value={responsable} onValueChange={setResponsable}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                            <SelectContent>
                                {teamMembers.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Fecha del Evento</Label>
                        <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar Evento</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function CalendarioPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Evento[]>(mockEvents);
  const [pendientes, setPendientes] = useState<Pendiente[]>(mockPendientesData);

  const handleAddEvent = (newEvent: Evento) => {
      setEvents(prev => [...prev, newEvent]);
      
      const responsableDelEquipo = teamMembers.find(m => m.name === newEvent.responsable);
      
      const newPendiente: Pendiente = {
          id: `pend-${Date.now()}`,
          cliente: newEvent.client,
          encargado: responsableDelEquipo?.role === 'admin' || responsableDelEquipo?.role === 'julio' ? newEvent.responsable : 'Admin', // Lógica de ejemplo
          ejecutor: newEvent.responsable,
          fechaCorte: newEvent.date.getDate() > 15 ? 30 : 15,
          status: 'Trabajando' as StatusPendiente,
          pendientePrincipal: newEvent.title,
          categoria: 'Contenido'
      };
      setPendientes(prev => [...prev, newPendiente]);
      // NOTE: In a real app, this state would be lifted or managed globally (e.g. with Context or Zustand)
      // to actually update the pendientes page. For now, this just demonstrates the logic.
  }

  const filteredEvents = useMemo(() => {
    return events.filter(event => 
        date ? event.date.toDateString() === date.toDateString() : false
    ).sort((a,b) => a.date.getTime() - b.date.getTime());
  }, [date, events]);

  const DayCell = ({ date, ...props }: { date: Date } & React.HTMLAttributes<HTMLDivElement>) => {
    const eventsForDay = events.filter(event => event.date.toDateString() === date.toDateString());
    return (
        <div {...props} className="relative h-full">
            {props.children}
            {eventsForDay.length > 0 && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {eventsForDay.slice(0, 3).map((event, index) => (
                        <div key={index} className={`w-1.5 h-1.5 rounded-full ${eventTypeConfig[event.type]?.color || 'bg-gray-400'}`} />
                    ))}
                </div>
            )}
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Calendario de Actividades</h1>
        <AddEventDialog onAddEvent={handleAddEvent} />
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
                    modifiers={{ events: events.map(e => e.date) }}
                    modifiersClassNames={{ events: 'font-bold' }}
                />
            </div>
            <div className="lg:col-span-1 p-4">
                 <h2 className="text-xl font-bold font-headline mb-4">
                    Eventos para {date ? format(date, "d 'de' MMMM", { locale: es }) : 'el día seleccionado'}
                </h2>
                <div className="space-y-4 h-[450px] overflow-y-auto pr-2">
                 {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                    <div key={event.id} className="p-3 bg-card/50 rounded-lg border">
                        <div className={`flex items-center text-sm font-semibold mb-2 ${(eventTypeConfig[event.type]?.color || 'bg-gray-400').replace('bg-', 'text-')}`}>
                            {eventTypeConfig[event.type]?.icon || null}
                            <span>{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                        </div>
                        <p className="font-semibold">{event.title}</p>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                            <User className="w-3 h-3" />
                            <span>{event.responsable}</span>
                        </div>
                    </div>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-10 flex flex-col items-center justify-center h-full">
                        <Calendar className="w-16 h-16 mb-4 text-muted-foreground" />
                        <p>No hay eventos programados para este día.</p>
                    </div>
                )}
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
}
