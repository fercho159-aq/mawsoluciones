

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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/lib/auth-provider';
import { Button } from '@/components/ui/button';
import { PlusCircle, CalendarIcon, Plus, ChevronRight, Lightbulb, Kanban, List, Edit, Facebook, Bot, Youtube, Linkedin, Forward, Trash2, X, CheckCircle } from 'lucide-react';
import type { PendienteMaw, Client, RecordingEvent, Colaborador } from '@/lib/db/schema';
import { getPendientes, addPendiente, updatePendiente, deletePendientes } from './_actions';
import { getClients } from '../clientes/_actions';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { teamMembers } from '@/lib/team-data';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ScheduleRecordingDialog } from '@/components/schedule-recording-dialog';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { TikTokIcon } from '@/components/icons/tiktok-icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';


const statusColors: Record<string, string> = {
  "Pendiente del cliente": "bg-orange-500",
  "Trabajando": "bg-blue-500",
  "No tenemos pendiente": "bg-green-500",
  "Resuelto": "bg-gray-500"
};

const AddPendienteDialog = ({ clients, onAdd, children }: { clients: Client[], onAdd: (data: Omit<PendienteMaw, 'id' | 'createdAt'>) => void, children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const [clientId, setClientId] = useState<string>('');
    const [encargado, setEncargado] = useState<string>('');
    const [ejecutor, setEjecutor] = useState<string>('');
    const [categoria, setCategoria] = useState<string>('');
    const [pendientePrincipal, setPendientePrincipal] = useState<string>('');
    const [status, setStatus] = useState<string>('Trabajando');

    const resetForm = () => {
        setClientId('');
        setEncargado('');
        setEjecutor('');
        setCategoria('');
        setPendientePrincipal('');
        setStatus('Trabajando');
    }

    const handleSave = () => {
        const client = clients.find(c => c.id === parseInt(clientId));
        if (!client || !encargado || !ejecutor || !categoria || !pendientePrincipal) {
            toast({ title: "Error", description: "Todos los campos son obligatorios.", variant: "destructive" });
            return;
        }

        onAdd({
            clientId: client.id,
            clienteName: client.name,
            encargado,
            ejecutor,
            categoria,
            pendientePrincipal,
            status,
            completed: false,
        });

        toast({ title: "Éxito", description: "Pendiente añadido correctamente." });
        resetForm();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader><DialogTitle>Añadir Pendiente Manual</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Cliente</Label>
                        <Select value={clientId} onValueChange={setClientId}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar cliente" /></SelectTrigger>
                            <SelectContent>
                                {clients.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Encargado</Label>
                            <Select value={encargado} onValueChange={setEncargado}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                <SelectContent>{teamMembers.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label>Ejecutor</Label>
                            <Select value={ejecutor} onValueChange={setEjecutor}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                <SelectContent>{teamMembers.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Categoría</Label>
                        <Select value={categoria} onValueChange={setCategoria}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Contenido">Contenido</SelectItem>
                                <SelectItem value="Ads">Ads</SelectItem>
                                <SelectItem value="Web">Web</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Pendiente</Label>
                        <Textarea value={pendientePrincipal} onChange={e => setPendientePrincipal(e.target.value)} placeholder="Descripción del pendiente..." />
                    </div>
                     <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                               {Object.keys(statusColors).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar Pendiente</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export type PendienteWithRelations = PendienteMaw & { recordingEvent?: RecordingEvent | null };

const PendienteDialog = ({ pendiente, onSave, canReassign }: { pendiente: PendienteWithRelations, onSave: (data: Partial<PendienteMaw>) => void, canReassign: boolean }) => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState(pendiente.pendientePrincipal);
    const [encargado, setEncargado] = useState(pendiente.encargado);
    const [ejecutor, setEjecutor] = useState(pendiente.ejecutor);
    const [status, setStatus] = useState(pendiente.status);

    useEffect(() => {
        if(open) {
            setText(pendiente.pendientePrincipal);
            setEncargado(pendiente.encargado);
            setEjecutor(pendiente.ejecutor);
            setStatus(pendiente.status);
        }
    }, [open, pendiente]);

    const handleSave = () => {
        const dataToSave: Partial<PendienteMaw> = {};
        if (text !== pendiente.pendientePrincipal) dataToSave.pendientePrincipal = text;
        if (encargado !== pendiente.encargado) dataToSave.encargado = encargado;
        if (ejecutor !== pendiente.ejecutor) dataToSave.ejecutor = ejecutor;
        if (status !== pendiente.status) dataToSave.status = status;
        
        if (Object.keys(dataToSave).length > 0) {
            onSave(dataToSave);
        }
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="p-2 cursor-pointer">{pendiente.pendientePrincipal}</div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Editar Pendiente</DialogTitle>
                    <DialogDescription>Cliente: {pendiente.clienteName}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                     <div className="space-y-2">
                        <Label>Pendiente</Label>
                        <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[100px]" />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Encargado</Label>
                            <Select value={encargado} onValueChange={setEncargado} disabled={!canReassign}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{teamMembers.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Ejecutor</Label>
                            <Select value={ejecutor} onValueChange={setEjecutor} disabled={!canReassign}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{teamMembers.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                           <SelectTrigger className={cn("text-white w-full justify-center", statusColors[status])}>
                             <SelectValue />
                           </SelectTrigger>
                            <SelectContent>
                                {Object.keys(statusColors).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar Cambios</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

const AdsMetricsDialog = ({ pendiente, onSave, children }: { pendiente: PendienteWithRelations, onSave: (data: Partial<PendienteMaw>) => void, children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [metrics, setMetrics] = useState<Partial<PendienteMaw>>({});

    useEffect(() => {
        if (open) {
            setMetrics({
                hasFacebookAds: pendiente.hasFacebookAds, facebookAdsMessages: pendiente.facebookAdsMessages || '', facebookAdsInteraction: pendiente.facebookAdsInteraction || '',
                hasTiktokAds: pendiente.hasTiktokAds, tiktokAdsMessages: pendiente.tiktokAdsMessages || '', tiktokAdsInteraction: pendiente.tiktokAdsInteraction || '',
                hasGoogleAds: pendiente.hasGoogleAds, googleAdsMessages: pendiente.googleAdsMessages || '', googleAdsInteraction: pendiente.googleAdsInteraction || '',
                hasLinkedinAds: pendiente.hasLinkedinAds, linkedinAdsMessages: pendiente.linkedinAdsMessages || '', linkedinAdsInteraction: pendiente.linkedinAdsInteraction || '',
            });
        }
    }, [open, pendiente]);

    const handleSave = () => {
        onSave(metrics);
        setOpen(false);
    }
    
    const platforms: (keyof PendienteMaw)[] = ['Facebook', 'Tiktok', 'Google', 'Linkedin'];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Métricas de Ads para {pendiente.clienteName}</DialogTitle>
                    <DialogDescription>Actualiza los datos de las campañas publicitarias.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto px-1">
                    {platforms.map(platform => {
                        const platformLower = platform.toLowerCase();
                        return (
                            <div key={platform} className="space-y-4 p-4 border rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`has-${platformLower}`}
                                        checked={metrics[`has${platform}Ads` as keyof typeof metrics]}
                                        onCheckedChange={(checked) => setMetrics(prev => ({...prev, [`has${platform}Ads`]: checked}))}
                                    />
                                    <Label htmlFor={`has-${platformLower}`} className="text-lg font-semibold flex items-center gap-2">
                                        {platform === 'Facebook' && <Facebook className='w-5 h-5'/>}
                                        {platform === 'Tiktok' && <TikTokIcon className='w-5 h-5'/>}
                                        {platform === 'Google' && <Bot className='w-5 h-5'/>}
                                        {platform === 'Linkedin' && <Linkedin className='w-5 h-5'/>}
                                        ¿Tiene en {platform}?
                                    </Label>
                                </div>
                                {metrics[`has${platform}Ads` as keyof typeof metrics] && (
                                    <div className="grid grid-cols-2 gap-4 pl-6">
                                        <div className="space-y-2">
                                            <Label htmlFor={`${platformLower}-messages`}>Mensajes</Label>
                                            <Input id={`${platformLower}-messages`} value={metrics[`${platformLower}AdsMessages` as keyof typeof metrics] as string} onChange={e => setMetrics(prev => ({...prev, [`${platformLower}AdsMessages`]: e.target.value}))} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`${platformLower}-interaction`}>Interacción</Label>
                                            <Input id={`${platformLower}-interaction`} value={metrics[`${platformLower}AdsInteraction` as keyof typeof metrics] as string} onChange={e => setMetrics(prev => ({...prev, [`${platformLower}AdsInteraction`]: e.target.value}))} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar Métricas</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

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

const ClientProgress = ({ pendientes }: { pendientes: PendienteWithRelations[] }) => {
    const total = pendientes.length;
    if (total === 0) return null;

    const completed = pendientes.filter(p => p.completed).length;
    const percentage = (completed / total) * 100;
    
    const getIndicatorColor = (value: number) => {
        if (value < 50) return "bg-red-500";
        if (value < 100) return "bg-yellow-500";
        return "bg-green-500";
    };

    return (
        <div className="mt-1 px-2">
            <Progress value={percentage} indicatorClassName={getIndicatorColor(percentage)} className="h-2" />
        </div>
    );
}

const ClientDataDialog = ({ pendientes, onSave, onRefresh, children }: { pendientes: PendienteWithRelations[], onSave: (id: number, data: Partial<PendienteMaw>) => void, onRefresh: () => void, children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [pubsMes, setPubsMes] = useState<string>('');
    const [pubsSemana, setPubsSemana] = useState<string>('');
    
    const firstPendiente = pendientes[0];

    useEffect(() => {
        if (open && firstPendiente) {
            setPubsMes(firstPendiente.publicacionesAlMes ?? '');
            setPubsSemana(firstPendiente.publicacionesALaSemana ?? '');
        }
    }, [open, firstPendiente]);

    const handleSave = async () => {
        const dataToSave = {
            publicacionesAlMes: pubsMes,
            publicacionesALaSemana: pubsSemana,
        };

        try {
            await Promise.all(pendientes.map(p => updatePendiente(p.id, dataToSave)));
            onRefresh();
            setOpen(false);
        } catch (error) {
            console.error("Error updating client data:", error);
        }
    }

    if (!firstPendiente) {
        return <>{children}</>;
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                 <DialogHeader>
                    <DialogTitle>Editar Datos del Cliente: {firstPendiente.clienteName}</DialogTitle>
                    <DialogDescription>Estos valores se aplicarán a todos los pendientes de este cliente.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Publicaciones al Mes</Label>
                        <Input value={pubsMes} onChange={(e) => setPubsMes(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Publicaciones a la Semana</Label>
                        <Input value={pubsSemana} onChange={(e) => setPubsSemana(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label>Próxima Grabación</Label>
                        <ScheduleRecordingDialog 
                            event={firstPendiente.recordingEvent}
                            pendienteId={firstPendiente.id}
                            clientName={firstPendiente.clienteName}
                            project={firstPendiente.pendientePrincipal}
                            assignedToName={firstPendiente.ejecutor}
                            onSave={onRefresh}
                        >
                            {firstPendiente.recordingEvent ? (
                                <Button variant="outline" className="w-full justify-start gap-2">
                                    <CalendarIcon className='w-4 h-4' />
                                    {format(new Date(firstPendiente.recordingEvent.fullStart), 'dd MMM yyyy, HH:mm', { locale: es })}
                                </Button>
                            ) : (
                                <Button variant="secondary" className="w-full justify-start gap-2">
                                    <CalendarIcon className='w-4 h-4' />
                                    Agendar Grabación
                                </Button>
                            )}
                        </ScheduleRecordingDialog>
                    </div>
                </div>
                 <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar</Button>
                </DialogFooter>
            </DialogContent>
    </Dialog>
    )
}

const PendientesTable = ({ data, onUpdateTask, currentUser, onRefresh, onUpdatePendienteText, clients, categoria }: { 
    data: PendienteWithRelations[]; 
    onUpdateTask: (task: PendienteWithRelations, data: Partial<PendienteMaw>) => void; 
    currentUser: any; 
    onRefresh: () => void;
    onUpdatePendienteText: (id: number, text: string) => void;
    clients: Client[];
    categoria: string;
}) => {
    const { toast } = useToast();
    const [addingToClientId, setAddingToClientId] = useState<number | null>(null);
    
    const canReassign = currentUser?.role === 'admin' || currentUser?.permissions?.pendientes?.reasignarResponsables;
    const isContenido = categoria === 'Contenido';
    const isAds = categoria === 'Ads';


    const handleTogglePendiente = async (pendiente: PendienteWithRelations) => {
        try {
            await updatePendiente(pendiente.id, { completed: !pendiente.completed });
            onRefresh();
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
        const sortedData = [...data].sort((a,b)=> a.clienteName.localeCompare(b.clienteName));
        return sortedData.reduce((acc, pendiente) => {
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
        <div className="border rounded-lg mt-4 overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px] min-w-[200px]">Cliente</TableHead>
                        <TableHead>Pendiente</TableHead>
                         {(isContenido || isAds) && <TableHead className="w-[150px] min-w-[150px]">Fecha de Corte</TableHead>}
                         {isContenido && <TableHead className="w-[150px] min-w-[150px]">Pubs. al Mes</TableHead>}
                        {isContenido && <TableHead className="w-[150px] min-w-[150px]">Pubs. a la Semana</TableHead>}
                        {isAds && <TableHead className="w-[100px] min-w-[100px] text-center"><div className='flex flex-col items-center'><Facebook className="w-5 h-5 mx-auto text-blue-600" /><span>Facebook</span></div></TableHead>}
                        {isAds && <TableHead className="w-[100px] min-w-[100px] text-center"><div className='flex flex-col items-center'><TikTokIcon className="w-5 h-5 mx-auto" /><span>TikTok</span></div></TableHead>}
                        {isAds && <TableHead className="w-[100px] min-w-[100px] text-center"><div className='flex flex-col items-center'><Bot className="w-5 h-5 mx-auto text-green-500" /><span>Google</span></div></TableHead>}
                        {isAds && <TableHead className="w-[100px] min-w-[100px] text-center"><div className='flex flex-col items-center'><Linkedin className="w-5 h-5 mx-auto text-sky-700" /><span>LinkedIn</span></div></TableHead>}
                        <TableHead className="w-[180px] min-w-[180px]">Encargado</TableHead>
                        <TableHead className="w-[180px] min-w-[180px]">Ejecutor</TableHead>
                        <TableHead className="w-[180px] min-w-[180px]">Status</TableHead>
                        {isContenido && <TableHead className="w-[180px] min-w-[180px]">Próxima Grabación</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.entries(groupedData).map(([clienteName, pendientes]) => {
                        const client = clients.find(c => c.name === clienteName);
                        if (!client) return null;

                        return (
                        <React.Fragment key={clienteName}>
                            {pendientes.map((pendiente, index) => (
                                <TableRow key={pendiente.id}>
                                    {index === 0 && (
                                        <TableCell 
                                            rowSpan={pendientes.length + (currentUser?.permissions?.pendientes?.reasignarResponsables ? 1 : 0)} 
                                            className="align-top font-medium p-2 border-r"
                                        >
                                            <ClientDataDialog pendientes={pendientes} onSave={(id, data) => onUpdateTask(pendientes.find(p => p.id === id)!, data)} onRefresh={onRefresh}>
                                                <div className='flex flex-col h-full justify-between cursor-pointer hover:bg-muted p-2 rounded-md'>
                                                    <span className="flex items-center gap-1">{clienteName} <Edit className="w-3 h-3 text-muted-foreground"/></span>
                                                    <ClientProgress pendientes={pendientes} />
                                                </div>
                                            </ClientDataDialog>
                                        </TableCell>
                                    )}
                                    <TableCell className={cn("p-0 align-middle text-sm", pendiente.completed && "line-through text-muted-foreground")}>
                                        <div className="flex items-center">
                                            <Checkbox 
                                                id={`pendiente-${pendiente.id}`}
                                                className='ml-2' 
                                                checked={pendiente.completed}
                                                onCheckedChange={() => handleTogglePendiente(pendiente)}
                                            />
                                            <PendienteDialog
                                                key={pendiente.id}
                                                pendiente={pendiente} 
                                                onSave={(data) => onUpdateTask(pendiente, data)}
                                                canReassign={canReassign}
                                            >
                                                <div className="cursor-pointer flex-1 p-2">{pendiente.pendientePrincipal}</div>
                                            </PendienteDialog>
                                        </div>
                                    </TableCell>
                                    {(isContenido || isAds) && index === 0 && (
                                        <TableCell rowSpan={pendientes.length  + (currentUser?.permissions?.pendientes?.reasignarResponsables ? 1 : 0)} className="p-2 align-middle text-center border-l">
                                             <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-start text-left font-normal h-auto py-1 px-2 text-xs">
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {pendiente.fechaCorte ? format(new Date(pendiente.fechaCorte), "d 'de' MMMM", { locale: es }) : <span>Sin fecha</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={pendiente.fechaCorte ? new Date(pendiente.fechaCorte) : undefined}
                                                        onSelect={(date) => onUpdateTask(pendiente, { fechaCorte: date })}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    )}
                                    {isContenido && index === 0 && (
                                        <>
                                            <TableCell rowSpan={pendientes.length  + (currentUser?.permissions?.pendientes?.reasignarResponsables ? 1 : 0)} className="p-2 align-middle text-center border-l">{pendientes[0].publicacionesAlMes || '-'}</TableCell>
                                            <TableCell rowSpan={pendientes.length  + (currentUser?.permissions?.pendientes?.reasignarResponsables ? 1 : 0)} className="p-2 align-middle text-center border-l">{pendientes[0].publicacionesALaSemana || '-'}</TableCell>
                                        </>
                                    )}
                                     {isAds && (
                                        <>
                                            <TableCell className="p-2 align-middle text-center border-l">
                                                <AdsMetricsDialog pendiente={pendiente} onSave={(data) => onUpdateTask(pendiente, data)}>
                                                    <div className="cursor-pointer hover:bg-muted p-1 rounded-md text-xs">
                                                        <p><span className="font-semibold text-muted-foreground">Msj:</span> {pendiente.facebookAdsMessages || '-'}</p>
                                                        <p><span className="font-semibold text-muted-foreground">Int:</span> {pendiente.facebookAdsInteraction || '-'}</p>
                                                    </div>
                                                </AdsMetricsDialog>
                                            </TableCell>
                                            <TableCell className="p-2 align-middle text-center border-l">
                                                <AdsMetricsDialog pendiente={pendiente} onSave={(data) => onUpdateTask(pendiente, data)}>
                                                     <div className="cursor-pointer hover:bg-muted p-1 rounded-md text-xs">
                                                        <p><span className="font-semibold text-muted-foreground">Msj:</span> {pendiente.tiktokAdsMessages || '-'}</p>
                                                        <p><span className="font-semibold text-muted-foreground">Int:</span> {pendiente.tiktokAdsInteraction || '-'}</p>
                                                    </div>
                                                </AdsMetricsDialog>
                                            </TableCell>
                                            <TableCell className="p-2 align-middle text-center border-l">
                                                <AdsMetricsDialog pendiente={pendiente} onSave={(data) => onUpdateTask(pendiente, data)}>
                                                    <div className="cursor-pointer hover:bg-muted p-1 rounded-md text-xs">
                                                        <p><span className="font-semibold text-muted-foreground">Msj:</span> {pendiente.googleAdsMessages || '-'}</p>
                                                        <p><span className="font-semibold text-muted-foreground">Int:</span> {pendiente.googleAdsInteraction || '-'}</p>
                                                    </div>
                                                </AdsMetricsDialog>
                                            </TableCell>
                                            <TableCell className="p-2 align-middle text-center border-l">
                                                <AdsMetricsDialog pendiente={pendiente} onSave={(data) => onUpdateTask(pendiente, data)}>
                                                     <div className="cursor-pointer hover:bg-muted p-1 rounded-md text-xs">
                                                        <p><span className="font-semibold text-muted-foreground">Msj:</span> {pendiente.linkedinAdsMessages || '-'}</p>
                                                        <p><span className="font-semibold text-muted-foreground">Int:</span> {pendiente.linkedinAdsInteraction || '-'}</p>
                                                    </div>
                                                </AdsMetricsDialog>
                                            </TableCell>
                                        </>
                                    )}
                                    <TableCell className="p-2 align-middle text-xs">
                                         <Select value={pendiente.encargado} onValueChange={(newEncargado) => onUpdateTask(pendiente, { encargado: newEncargado })} disabled={!canReassign}>
                                            <SelectTrigger className="text-xs h-8 border-0 bg-transparent focus:ring-0">
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {teamMembers.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="p-2 align-middle text-xs">
                                        <Select value={pendiente.ejecutor} onValueChange={(newEjecutor) => onUpdateTask(pendiente, { ejecutor: newEjecutor })} disabled={!canReassign}>
                                            <SelectTrigger className="text-xs h-8 border-0 bg-transparent focus:ring-0">
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {teamMembers.map(m => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="p-2 align-middle">
                                        <Select value={pendiente.status} onValueChange={(newStatus) => onUpdateTask(pendiente, { status: newStatus })}>
                                            <SelectTrigger className={cn("text-white w-full justify-center text-xs h-8 border-0", statusColors[pendiente.status])}>
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.keys(statusColors).map(s => (
                                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    {isContenido && index === 0 && (
                                        <TableCell className="p-2 text-center align-middle" rowSpan={pendientes.length  + (currentUser?.permissions?.pendientes?.reasignarResponsables ? 1 : 0)}>
                                            <ScheduleRecordingDialog
                                                event={pendiente.recordingEvent}
                                                pendienteId={pendiente.id}
                                                clientName={pendiente.clienteName}
                                                project={pendiente.pendientePrincipal}
                                                assignedToName={pendiente.ejecutor}
                                                onSave={onRefresh}
                                            >
                                            <div className="cursor-pointer hover:bg-muted p-2 rounded-md h-full flex flex-col justify-center">
                                                {pendiente.recordingEvent ? (
                                                    <div className="flex flex-col h-auto text-xs font-semibold">
                                                        <span>{format(new Date(pendiente.recordingEvent.fullStart), 'dd MMM', { locale: es })}</span>
                                                        <span className='text-xs text-muted-foreground'>{format(new Date(pendiente.recordingEvent.fullStart), 'HH:mm')}</span>
                                                    </div>
                                                ) : <span className="text-xs text-muted-foreground">No agendado</span>}
                                            </div>
                                            </ScheduleRecordingDialog>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                             {currentUser?.permissions?.pendientes?.reasignarResponsables && (
                                <TableRow>
                                    <TableCell colSpan={isAds ? 5 : isContenido ? 2 : 1} className="p-0 h-full">
                                        {addingToClientId === client.id ? (
                                            <AddPendienteInline 
                                                client={client}
                                                categoria={categoria}
                                                onAdd={(text) => handleAddPendiente(text, client, pendientes[0])}
                                                onCancel={() => setAddingToClientId(null)}
                                            />
                                        ) : (
                                            <div className="h-full">
                                                <Button variant="ghost" size="sm" className="w-full h-full justify-start text-muted-foreground" onClick={() => setAddingToClientId(client.id)}>
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Añadir pendiente
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell colSpan={3}></TableCell>
                                </TableRow>
                             )}
                        </React.Fragment>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

const BoardView = ({ data, onUpdateTask, currentUser, onRefresh }: {
    data: PendienteWithRelations[];
    onUpdateTask: (task: PendienteWithRelations, data: Partial<PendienteMaw>) => void;
    currentUser: any;
    onRefresh: () => void;
}) => {
    const statuses = Object.keys(statusColors);
    const canReassign = currentUser?.role === 'admin' || currentUser?.permissions?.pendientes?.reasignarResponsables;
    
    const groupedByStatus = useMemo(() => {
        const initialGroups: Record<string, PendienteWithRelations[]> = {};
        statuses.forEach(status => initialGroups[status] = []);
        return data.reduce((acc, pendiente) => {
            if (acc[pendiente.status]) {
                acc[pendiente.status].push(pendiente);
            }
            return acc;
        }, initialGroups);
    }, [data, statuses]);


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 overflow-x-auto pb-4">
            {statuses.map(status => (
                <div
                    key={status}
                    className="bg-card/50 rounded-lg flex flex-col min-w-[300px]"
                >
                    <div className="p-4 border-b">
                        <h3 className="font-semibold flex items-center gap-2">
                           <span className={cn("w-3 h-3 rounded-full", statusColors[status])}></span>
                           {status}
                           <Badge variant="secondary" className="ml-2">{groupedByStatus[status].length}</Badge>
                        </h3>
                    </div>
                    <div className="p-2 space-y-3 flex-grow overflow-y-auto min-h-[200px]">
                        {groupedByStatus[status].map((pendiente) => (
                           <PendienteDialog
                                key={pendiente.id}
                                pendiente={pendiente}
                                onSave={(data) => onUpdateTask(pendiente, data)}
                                canReassign={canReassign}
                           >
                                <Card className="p-3 bg-background cursor-pointer hover:bg-accent space-y-2">
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold text-sm">{pendiente.clienteName}</p>
                                        <Badge variant="outline" className="text-xs">{pendiente.categoria}</Badge>
                                    </div>
                                    <p className={cn("text-sm", pendiente.completed && "line-through text-muted-foreground")}>
                                        {pendiente.pendientePrincipal}
                                    </p>
                                    <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                                        <div className='space-y-1'>
                                            <p><span className='font-medium'>Enc:</span> {pendiente.encargado}</p>
                                            <p><span className='font-medium'>Eje:</span> {pendiente.ejecutor}</p>
                                        </div>
                                        {pendiente.categoria === 'Contenido' && pendiente.recordingEvent && (
                                            <ScheduleRecordingDialog
                                                event={pendiente.recordingEvent}
                                                pendienteId={pendiente.id}
                                                clientName={pendiente.clienteName}
                                                project={pendiente.pendientePrincipal}
                                                assignedToName={pendiente.ejecutor}
                                                onSave={onRefresh}
                                            >
                                                <div className="flex flex-col items-center cursor-pointer hover:bg-muted p-1 rounded-md">
                                                    <CalendarIcon className="w-4 h-4"/>
                                                    <span>{format(new Date(pendiente.recordingEvent.fullStart), 'dd MMM', { locale: es })}</span>
                                                </div>
                                            </ScheduleRecordingDialog>
                                        )}
                                    </div>
                                </Card>
                            </PendienteDialog>
                        ))}
                         {groupedByStatus[status].length === 0 && (
                            <div className="text-center py-8 text-xs text-muted-foreground">
                                No hay pendientes en este estado.
                            </div>
                         )}
                    </div>
                </div>
            ))}
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
    const [viewMode, setViewMode] = useState<'table' | 'board'>('table');
    const [selectedCompleted, setSelectedCompleted] = useState<number[]>([]);

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
            setClients(clientsData as Client[]);
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
    
    const handleUpdateTask = async (task: PendienteWithRelations, data: Partial<PendienteMaw>) => {
       try {
            await updatePendiente(task.id, data);
            toast({ title: 'Éxito', description: 'El pendiente ha sido actualizado.' });
            fetchData();
        } catch (error) {
            toast({ title: "Error", description: "No se pudo actualizar el pendiente.", variant: "destructive" });
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

    const tasksPerCategory = useMemo(() => {
        const activePendientes = filteredData.filter(d => !d.completed);
        return {
            contenido: activePendientes.some(d => d.categoria.toLowerCase() === 'contenido'),
            ads: activePendientes.some(d => d.categoria.toLowerCase() === 'ads'),
            web: activePendientes.some(d => d.categoria.toLowerCase() === 'web'),
        };
    }, [filteredData]);
    
    const canManage = user?.role === 'admin' || user?.permissions?.pendientes?.reasignarResponsables;

    const handleBulkDelete = async () => {
        if (selectedCompleted.length === 0) return;
        try {
            await deletePendientes(selectedCompleted);
            toast({ title: 'Éxito', description: `${selectedCompleted.length} pendiente(s) eliminado(s) permanentemente.` });
            setSelectedCompleted([]);
            fetchData();
        } catch (e: any) {
            toast({ title: 'Error', description: `No se pudo completar la acción: ${e.message}`, variant: 'destructive' });
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
  
    const getFilteredDataForTab = (categoria: string, completed: boolean) => {
        return filteredData.filter(d => d.categoria.toLowerCase() === categoria.toLowerCase() && d.completed === completed);
    }
    
    const allCompleted = filteredData.filter(d => d.completed);

    return (
        <div>
            <div className='flex justify-between items-center mb-8'>
                <h1 className="text-3xl font-bold font-headline">Pendientes de Equipo</h1>
                 {canManage && (
                    <AddPendienteDialog clients={clients} onAdd={addPendiente}>
                        <Button><PlusCircle className="w-4 h-4 mr-2" /> Añadir Pendiente Manual</Button>
                    </AddPendienteDialog>
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
                    <div className="flex items-center gap-2 ml-auto">
                        <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('table')}><List className="w-5 h-5"/></Button>
                        <Button variant={viewMode === 'board' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('board')}><Kanban className="w-5 h-5"/></Button>
                    </div>
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
                <TabsList className={cn("grid w-full", canManage ? "grid-cols-4" : "grid-cols-3")}>
                    <TabsTrigger value="contenido" className="flex items-center gap-2">
                        {tasksPerCategory.contenido && (
                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Lightbulb className="w-4 h-4 text-primary" />
                            </motion.div>
                        )}
                        Contenido
                    </TabsTrigger>
                    <TabsTrigger value="ads" className="flex items-center gap-2">
                        {tasksPerCategory.ads && (
                           <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Lightbulb className="w-4 h-4 text-primary" />
                            </motion.div>
                        )}
                        Ads
                    </TabsTrigger>
                    <TabsTrigger value="web" className="flex items-center gap-2">
                        {tasksPerCategory.web && (
                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Lightbulb className="w-4 h-4 text-primary" />
                            </motion.div>
                        )}
                        Web
                    </TabsTrigger>
                    {canManage && (
                         <TabsTrigger value="completados" className="flex items-center gap-2">
                           <CheckCircle className="w-4 h-4" />
                           Completados
                        </TabsTrigger>
                    )}
                </TabsList>
                
                <TabsContent value="contenido">
                   {viewMode === 'table' ? (
                        <PendientesTable 
                            data={getFilteredDataForTab('contenido', false)} 
                            onUpdateTask={handleUpdateTask} 
                            currentUser={user} 
                            onRefresh={fetchData}
                            onUpdatePendienteText={handleUpdatePendienteText}
                            clients={clients}
                            categoria="Contenido"
                        />
                   ) : (
                        <BoardView 
                            data={getFilteredDataForTab('contenido', false)}
                            onUpdateTask={handleUpdateTask}
                            currentUser={user}
                            onRefresh={fetchData}
                        />
                   )}
                </TabsContent>

                <TabsContent value="ads">
                    {viewMode === 'table' ? (
                        <PendientesTable 
                            data={getFilteredDataForTab('ads', false)} 
                            onUpdateTask={handleUpdateTask} 
                            currentUser={user} 
                            onRefresh={fetchData}
                            onUpdatePendienteText={handleUpdatePendienteText}
                            clients={clients}
                            categoria="Ads"
                        />
                    ) : (
                         <BoardView 
                            data={getFilteredDataForTab('ads', false)}
                            onUpdateTask={handleUpdateTask}
                            currentUser={user}
                            onRefresh={fetchData}
                        />
                    )}
                </TabsContent>
                
                <TabsContent value="web">
                     {viewMode === 'table' ? (
                        <PendientesTable 
                            data={getFilteredDataForTab('web', false)} 
                            onUpdateTask={handleUpdateTask} 
                            currentUser={user} 
                            onRefresh={fetchData}
                            onUpdatePendienteText={handleUpdatePendienteText}
                            clients={clients}
                            categoria="Web"
                        />
                     ) : (
                         <BoardView 
                            data={getFilteredDataForTab('web', false)}
                            onUpdateTask={handleUpdateTask}
                            currentUser={user}
                            onRefresh={fetchData}
                        />
                     )}
                </TabsContent>
                
                {canManage && (
                    <TabsContent value="completados">
                       <Card className="mt-4">
                            <CardHeader>
                                <CardTitle>Pendientes Completados</CardTitle>
                                <CardDescription>Aquí puedes revisar las tareas finalizadas y eliminarlas si es necesario.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {selectedCompleted.length > 0 && (
                                     <div className="flex items-center gap-4 bg-muted p-2 rounded-md my-4">
                                        <span className="text-sm font-medium">{selectedCompleted.length} seleccionado(s)</span>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm"><Trash2 className="w-4 h-4 mr-2"/>Eliminar</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                    <AlertDialogDescription>Esta acción es irreversible y eliminará permanentemente los pendientes seleccionados.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleBulkDelete}>Confirmar</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        <Button variant="ghost" size="icon" onClick={() => setSelectedCompleted([])}><X className="w-4 h-4" /></Button>
                                    </div>
                                )}
                                <div className="border rounded-lg">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[50px]">
                                                    <Checkbox
                                                        checked={selectedCompleted.length > 0 && selectedCompleted.length === allCompleted.length}
                                                        onCheckedChange={(checked) => setSelectedCompleted(checked ? allCompleted.map(p => p.id) : [])}
                                                    />
                                                </TableHead>
                                                <TableHead>Cliente</TableHead>
                                                <TableHead>Pendiente</TableHead>
                                                <TableHead>Categoría</TableHead>
                                                <TableHead>Ejecutor</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {allCompleted.map(p => (
                                                <TableRow key={p.id}>
                                                    <TableCell>
                                                         <Checkbox
                                                            checked={selectedCompleted.includes(p.id)}
                                                            onCheckedChange={(checked) => setSelectedCompleted(prev => checked ? [...prev, p.id] : prev.filter(id => id !== p.id))}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{p.clienteName}</TableCell>
                                                    <TableCell className="line-through text-muted-foreground">{p.pendientePrincipal}</TableCell>
                                                    <TableCell><Badge variant="secondary">{p.categoria}</Badge></TableCell>
                                                    <TableCell>{p.ejecutor}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    {allCompleted.length === 0 && <div className="text-center p-8 text-muted-foreground">No hay pendientes completados.</div>}
                                </div>
                            </CardContent>
                       </Card>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}
