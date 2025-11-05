
'use client';

import React, { useState, useMemo } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addDays, format, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { PlusCircle, Video, Camera } from 'lucide-react';

type Evento = {
  date: Date;
  title: string;
  type: 'grabacion' | 'cita' | 'llamada';
  responsable: 'Alma' | 'Julio' | 'Fany' | 'Luis' | 'Carlos' | 'Fer';
};

const today = new Date();
const startOfToday = startOfMonth(today);

const mockEvents: Evento[] = [
  { date: addDays(startOfToday, 2), title: "Grabación Biofert", type: 'grabacion', responsable: 'Fany' },
  { date: addDays(startOfToday, 2), title: "Videollamada con Prospecto 'Tacos El Veloz'", type: 'cita', responsable: 'Julio' },
  { date: addDays(startOfToday, 4), title: "Llamada de seguimiento 'Constructora Edifica'", type: 'llamada', responsable: 'Alma' },
  { date: addDays(startOfToday, 9), title: "Grabación UROLOGO", type: 'grabacion', responsable: 'Luis' },
  { date: addDays(startOfToday, 9), title: "Cita de cierre 'Clínica Dental Sonrisa'", type: 'cita', responsable: 'Fer' },
  { date: addDays(startOfToday, 15), title: "Grabación Benja", type: 'grabacion', responsable: 'Fany' },
  { date: addDays(startOfToday, 17), title: "Videollamada de Demo 'Restaurante La Toscana'", type: 'cita', responsable: 'Julio' },
  { date: addDays(startOfToday, 24), title: "Grabación para Redes", type: 'grabacion', responsable: 'Carlos' },
];

const eventTypeConfig = {
    grabacion: { icon: <Camera className="w-4 h-4 mr-2"/>, color: "bg-blue-500" },
    cita: { icon: <Video className="w-4 h-4 mr-2"/>, color: "bg-green-500" },
    llamada: { icon: <Video className="w-4 h-4 mr-2"/>, color: "bg-purple-500" }
}

export default function CalendarioPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [responsableFilter, setResponsableFilter] = useState('Todos');

  const filteredEvents = useMemo(() => {
    return mockEvents.filter(event => {
        const dateMatch = date ? event.date.toDateString() === date.toDateString() : true;
        const responsableMatch = responsableFilter === 'Todos' || event.responsable === responsableFilter;
        return dateMatch && responsableMatch;
    }).sort((a,b) => a.date.getTime() - b.date.getTime());
  }, [date, responsableFilter]);

  const monthEvents = useMemo(() => {
    const startOfMonthDate = startOfMonth(date || new Date());
    const endOfMonthDate = new Date(startOfMonthDate.getFullYear(), startOfMonthDate.getMonth() + 1, 0);
    return mockEvents.filter(event => event.date >= startOfMonthDate && event.date <= endOfMonthDate);
  }, [date]);

  const DayCell = ({ date, ...props }: { date: Date } & React.HTMLAttributes<HTMLDivElement>) => {
    const eventsForDay = mockEvents.filter(event => event.date.toDateString() === date.toDateString());
    return (
        <div {...props} className="relative h-full">
            {props.children}
            {eventsForDay.length > 0 && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {eventsForDay.slice(0, 3).map((event, index) => (
                        <div key={index} className={`w-1.5 h-1.5 rounded-full ${eventTypeConfig[event.type].color}`} />
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
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          Añadir Evento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
        <Card className="lg:col-span-2">
            <CardHeader>
                 <CardTitle>Calendario Mensual</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="p-0"
                    locale={es}
                    components={{ Day: DayCell }}
                    modifiers={{ events: monthEvents.map(e => e.date) }}
                    modifiersClassNames={{ events: 'font-bold' }}
                />
            </CardContent>
        </Card>
        
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                 <h2 className="text-xl font-bold font-headline">
                    Eventos para {date ? format(date, "d 'de' MMMM", { locale: es }) : 'hoy'}
                </h2>
                <Select value={responsableFilter} onValueChange={setResponsableFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar responsable" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Todos">Todos</SelectItem>
                        <SelectItem value="Alma">Alma</SelectItem>
                        <SelectItem value="Fer">Fer</SelectItem>
                        <SelectItem value="Julio">Julio</SelectItem>
                        <SelectItem value="Fany">Fany</SelectItem>
                        <SelectItem value="Luis">Luis</SelectItem>
                        <SelectItem value="Carlos">Carlos</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Card className="flex-grow">
                <CardContent className="p-4 space-y-4">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event, index) => (
                    <div key={index} className="p-3 bg-card/50 rounded-lg border">
                        <div className={`flex items-center text-sm font-semibold mb-1 ${eventTypeConfig[event.type].color.replace('bg-', 'text-')}`}>
                            {eventTypeConfig[event.type].icon}
                            <span>{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                        </div>
                        <p className="font-semibold">{event.title}</p>
                        <p className="text-xs text-muted-foreground">Responsable: {event.responsable}</p>
                    </div>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-10">
                        <p>No hay eventos programados para este día.</p>
                    </div>
                )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
