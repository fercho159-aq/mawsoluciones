
'use client';

import React, { useState, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-provider';
import { initialClients, initialCuentasPorCobrar, type Client, type CuentasPorCobrar } from '@/lib/finanzas-data';
import { useRouter } from 'next/navigation';

const AddClientDialog = ({ onAdd, children }: { onAdd: (client: Omit<Client, 'id'>) => void, children: React.ReactNode }) => {
    const [name, setName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState('');
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const handleSave = () => {
        if (!name) {
            toast({ title: "Error", description: "El nombre del cliente es obligatorio.", variant: "destructive" });
            return;
        }
        onAdd({ name, whatsapp, email });
        setOpen(false);
        toast({ title: "Éxito", description: `Cliente "${name}" añadido.` });
        setName(''); setWhatsapp(''); setEmail('');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Nuevo Cliente</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre del Cliente" />
                    <Input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="WhatsApp (Ej. 52155...)" />
                    <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>Guardar Cliente</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function ClientesPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>(initialClients);
    const [cuentasPorCobrar, setCuentasPorCobrar] = useState<CuentasPorCobrar[]>(initialCuentasPorCobrar);
    
    const isAdminOrContabilidad = useMemo(() => user?.role === 'admin' || user?.role === 'contabilidad', [user]);

    // Redirect if user does not have access
    React.useEffect(() => {
        if (!isAdminOrContabilidad) {
            router.push('/equipo/dashboard');
        }
    }, [isAdminOrContabilidad, router]);

    const handleAddClient = (newClientData: Omit<Client, 'id'>) => {
        const newClient: Client = { id: `client-${Date.now()}`, ...newClientData };
        setClients(prev => [...prev, newClient]);
    }

    const clientBalances = useMemo(() => {
        const balances: Record<string, number> = {};
        clients.forEach(c => balances[c.id] = 0);
        cuentasPorCobrar.forEach(cpc => {
            if (balances[cpc.clienteId] !== undefined) {
                balances[cpc.clienteId] += cpc.monto;
            }
        });
        return balances;
    }, [clients, cuentasPorCobrar]);

    if (!isAdminOrContabilidad) {
        return <div className="text-center p-8">No tienes permiso para ver esta sección.</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-8">Gestión de Clientes</h1>
            <Card>
                <CardHeader className='flex-row justify-between items-center'>
                    <div>
                        <CardTitle>Listado de Clientes</CardTitle>
                        <CardDescription>Añade nuevos clientes y consulta su estado financiero.</CardDescription>
                    </div>
                    <AddClientDialog onAdd={handleAddClient}>
                        <Button><PlusCircle className="w-4 h-4 mr-2" /> Añadir Nuevo Cliente</Button>
                    </AddClientDialog>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Teléfono</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-right">Saldo Pendiente</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clients.map(client => (
                                    <TableRow key={client.id}>
                                        <TableCell className="font-medium">{client.name}</TableCell>
                                        <TableCell>{client.whatsapp || 'N/A'}</TableCell>
                                        <TableCell>{client.email || 'N/A'}</TableCell>
                                        <TableCell className={cn("text-right font-bold", clientBalances[client.id] > 0 ? "text-destructive" : "text-green-500")}>
                                            {clientBalances[client.id].toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
