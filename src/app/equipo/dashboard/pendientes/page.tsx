

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
import { PlusCircle, CalendarIcon, Plus, ChevronRight, Lightbulb, Kanban, List, Edit, Facebook, Bot, Youtube, Linkedin, Forward } from 'lucide-react';
import type { PendienteMaw, Client, RecordingEvent, Colaborador } from '@/lib/db/schema';
import { getPendientes, addPendiente, updatePendiente } from './_actions';
import { getClients } from '../clientes/_actions';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { teamMembers } from '@/lib/team-data';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ScheduleRecordingDialog } from '@/components/schedule-recording-dialog';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { TikTokIcon } from '@/components/icons/tiktok-icon';


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
                           <SelectTrigger><SelectValue asChild><Badge className={cn("text-white w-full justify-center", statusColors[status])}>{status}</Badge></SelectValue></SelectTrigger>
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
        if (open) {
            setPubsMes(firstPendiente?.publicacionesAlMes ?? '');
            setPubsSemana(firstPendiente?.publicacionesALaSemana ?? '');
        }
    }, [open, firstPendiente]);

    const handleSave = async () => {
        // We assume all pendientes for a client should have the same publication counts.
        // We'll update all of them.
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

    if (!firstPendiente) return null;

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
        return data.reduce((acc, pendiente) => {
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
        <div className="border rounded-lg mt-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px]">Cliente</TableHead>
                        <TableHead className="w-[40px]"></TableHead>
                        <TableHead>Pendiente</TableHead>
                         {isContenido && <TableHead className="w-[150px]">Pubs. al Mes</TableHead>}
                        {isContenido && <TableHead className="w-[150px]">Pubs. a la Semana</TableHead>}
                        {isAds && <TableHead className="w-[180px]">Métricas Ads</TableHead>}
                        <TableHead className="w-[180px]">Encargado</TableHead>
                        <TableHead className="w-[180px]">Ejecutor</TableHead>
                        <TableHead className="w-[180px]">Status</TableHead>
                        {isContenido && <TableHead className="w-[180px]">Próxima Grabación</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.entries(groupedData).map(([clienteName, pendientes]) => {
                        const client = clients.find(c => c.name === clienteName);
                        if (!client) return null;

                        return (
                        <React.Fragment key={clienteName}>
                            {pendientes.map((pendiente, index) => (
                                <TableRow className="h-12 p-0" key={pendiente.id}>
                                    {index === 0 && (
                                        <>
                                            <TableCell 
                                                rowSpan={pendientes.length} 
                                                className="align-top font-medium p-2 border-r"
                                            >
                                                <ClientDataDialog pendientes={pendientes} onSave={(id, data) => onUpdateTask(pendientes.find(p => p.id === id)!, data)} onRefresh={onRefresh}>
                                                    <div className='flex flex-col h-full justify-between cursor-pointer hover:bg-muted p-2 rounded-md'>
                                                        <span className="flex items-center gap-1">{clienteName} <Edit className="w-3 h-3 text-muted-foreground"/></span>
                                                        <ClientProgress pendientes={pendientes} />
                                                    </div>
                                                </ClientDataDialog>
                                            </TableCell>
                                        </>
                                    )}
                                    <TableCell className="p-2 align-middle">
                                        <Checkbox 
                                            id={`pendiente-${pendiente.id}`} 
                                            checked={pendiente.completed}
                                            onCheckedChange={() => handleTogglePendiente(pendiente)}
                                        />
                                    </TableCell>
                                    <TableCell className={cn("p-0 align-middle", pendiente.completed && "line-through text-muted-foreground")}>
                                       <PendienteDialog
                                            key={pendiente.id}
                                            pendiente={pendiente} 
                                            onSave={(data) => onUpdateTask(pendiente, data)}
                                            canReassign={canReassign}
                                        />
                                    </TableCell>
                                    {isContenido && index === 0 && (
                                        <>
                                            <TableCell rowSpan={pendientes.length} className="p-2 align-middle text-center border-l">{pendientes[0].publicacionesAlMes || '-'}</TableCell>
                                            <TableCell rowSpan={pendientes.length} className="p-2 align-middle text-center border-l">{pendientes[0].publicacionesALaSemana || '-'}</TableCell>
                                        </>
                                    )}
                                     {isAds && index === 0 && (
                                        <TableCell rowSpan={pendientes.length} className="p-2 align-middle text-center border-l">
                                            <AdsMetricsDialog pendiente={pendiente} onSave={(data) => onUpdateTask(pendiente, data)}>
                                                <Button variant="ghost" className="h-auto p-1">
                                                    <div className="flex gap-2">
                                                        <Facebook className={cn("w-5 h-5", pendiente.hasFacebookAds ? "text-blue-600" : "text-muted-foreground")} />
                                                        <TikTokIcon className={cn("w-5 h-5", pendiente.hasTiktokAds ? "text-white" : "text-muted-foreground")} />
                                                        <Bot className={cn("w-5 h-5", pendiente.hasGoogleAds ? "text-green-500" : "text-muted-foreground")} />
                                                        <Linkedin className={cn("w-5 h-5", pendiente.hasLinkedinAds ? "text-sky-700" : "text-muted-foreground")} />
                                                    </div>
                                                </Button>
                                            </AdsMetricsDialog>
                                        </TableCell>
                                    )}
                                    <TableCell className="p-2 align-middle text-xs">{pendiente.encargado}</TableCell>
                                    <TableCell className="p-2 align-middle text-xs">{pendiente.ejecutor}</TableCell>
                                    <TableCell className="p-2 align-middle">
                                        <Badge className={cn("text-white w-full justify-center", statusColors[pendiente.status])}>{pendiente.status}</Badge>
                                    </TableCell>
                                    {isContenido && index === 0 && (
                                        <TableCell className="p-2 text-center align-middle" rowSpan={pendientes.length}>
                                            {pendiente.recordingEvent ? (
                                                <div className="flex flex-col h-auto text-xs font-semibold">
                                                    <span>{format(new Date(pendiente.recordingEvent.fullStart), 'dd MMM', { locale: es })}</span>
                                                    <span className='text-xs text-muted-foreground'>{format(new Date(pendiente.recordingEvent.fullStart), 'HH:mm')}</span>
                                                </div>
                                            ) : <span className="text-xs text-muted-foreground">No agendado</span>}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                             {currentUser?.permissions?.pendientes?.reasignarResponsables && (
                                <TableRow>
                                    <TableCell colSpan={isContenido ? 9 : isAds ? 8 : 7} className="p-0">
                                        {addingToClientId === client.id ? (
                                            <AddPendienteInline 
                                                client={client}
                                                categoria={categoria}
                                                onAdd={(text) => handleAddPendiente(text, client, pendientes[0])}
                                                onCancel={() => setAddingToClientId(null)}
                                            />
                                        ) : (
                                            <div className="flex justify-between items-center">
                                                <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground pl-4 h-8" onClick={() => setAddingToClientId(client.id)}>
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Añadir pendiente
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
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
                                <Card className="p-3 bg-background cursor-pointer hover:bg-accent">
                                    <p className="font-semibold text-sm mb-1">{pendiente.clienteName}</p>
                                    <p className={cn("text-sm", pendiente.completed && "line-through text-muted-foreground")}>
                                        {pendiente.pendientePrincipal}
                                    </p>
                                    <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                                        <span>{pendiente.ejecutor}</span>
                                        {pendiente.recordingEvent && (
                                            <span className="flex items-center gap-1">
                                                <CalendarIcon className="w-3 h-3"/>
                                                {format(new Date(pendiente.recordingEvent.fullStart), 'dd MMM', { locale: es })}
                                            </span>
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
        return {
            contenido: filteredData.some(d => d.categoria.toLowerCase() === 'contenido'),
            ads: filteredData.some(d => d.categoria.toLowerCase() === 'ads'),
            web: filteredData.some(d => d.categoria.toLowerCase() === 'web'),
        };
    }, [filteredData]);
    
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
      return filteredData.filter(d => d.categoria.toLowerCase() === categoria.toLowerCase());
  }

  return (
    <div>
        <div className='flex justify-between items-center mb-8'>
            <h1 className="text-3xl font-bold font-headline">Pendientes de Equipo</h1>
             {canAddPendiente && (
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
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="contenido" className="flex items-center gap-2">
                    {tasksPerCategory.contenido && (
                        <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Lightbulb className="w-4 h-4 text-primary" />
                        </motion.div>
                    )}
                    Pendientes Contenido
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
                    Pendientes Ads
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
                    Pendientes Web
                </TabsTrigger>
            </TabsList>
            
            <TabsContent value="contenido">
               {viewMode === 'table' ? (
                    <PendientesTable 
                        data={getFilteredDataForTab('contenido')} 
                        onUpdateTask={handleUpdateTask} 
                        currentUser={user} 
                        onRefresh={fetchData}
                        onUpdatePendienteText={handleUpdatePendienteText}
                        clients={clients}
                        categoria="Contenido"
                    />
               ) : (
                    <BoardView 
                        data={getFilteredDataForTab('contenido')}
                        onUpdateTask={handleUpdateTask}
                        currentUser={user}
                        onRefresh={fetchData}
                    />
               )}
            </TabsContent>

            <TabsContent value="ads">
                {viewMode === 'table' ? (
                    <PendientesTable 
                        data={getFilteredDataForTab('ads')} 
                        onUpdateTask={handleUpdateTask} 
                        currentUser={user} 
                        onRefresh={fetchData}
                        onUpdatePendienteText={handleUpdatePendienteText}
                        clients={clients}
                        categoria="Ads"
                    />
                ) : (
                     <BoardView 
                        data={getFilteredDataForTab('ads')}
                        onUpdateTask={handleUpdateTask}
                        currentUser={user}
                        onRefresh={fetchData}
                    />
                )}
            </TabsContent>
            
            <TabsContent value="web">
                 {viewMode === 'table' ? (
                    <PendientesTable 
                        data={getFilteredDataForTab('web')} 
                        onUpdateTask={handleUpdateTask} 
                        currentUser={user} 
                        onRefresh={fetchData}
                        onUpdatePendienteText={handleUpdatePendienteText}
                        clients={clients}
                        categoria="Web"
                    />
                 ) : (
                     <BoardView 
                        data={getFilteredDataForTab('web')}
                        onUpdateTask={handleUpdateTask}
                        currentUser={user}
                        onRefresh={fetchData}
                    />
                 )}
            </TabsContent>
        </Tabs>
    </div>
  );
}
