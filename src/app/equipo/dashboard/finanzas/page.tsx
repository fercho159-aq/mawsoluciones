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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowRight } from 'lucide-react';
import WhatsappIcon from '@/components/icons/whatsapp-icon';
import { cn } from '@/lib/utils';

type Periodo = "1-31 Oct" | "15 Oct - 15 Nov" | "1-30 Nov";
type MetodoContacto = "Whatsapp" | "Email";

interface FinanzasData {
  cliente: string;
  periodo: Periodo;
  monto: number;
  metodo: MetodoContacto;
  whatsapp: string;
}

const mockData: FinanzasData[] = [
  { cliente: "Biofert", periodo: "1-31 Oct", monto: 5000, metodo: "Whatsapp", whatsapp: "5215512345678" },
  { cliente: "Medical Tower", periodo: "15 Oct - 15 Nov", monto: 12000, metodo: "Email", whatsapp: "" },
  { cliente: "NIU Coliving", periodo: "1-31 Oct", monto: 8500, metodo: "Whatsapp", whatsapp: "5215587654321" },
  { cliente: "Cenote San Isidro", periodo: "1-30 Nov", monto: 3500, metodo: "Whatsapp", whatsapp: "5215511223344" },
  { cliente: "Saudade do Brazil", periodo: "15 Oct - 15 Nov", monto: 15000, metodo: "Email", whatsapp: "" },
  { cliente: "Polanco Santino", periodo: "1-30 Nov", monto: 9200, metodo: "Whatsapp", whatsapp: "5215555667788" },
];

export default function FinanzasPage() {
    const [searchFilter, setSearchFilter] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof FinanzasData | null; direction: 'ascending' | 'descending' }>({ key: 'cliente', direction: 'ascending' });

    const filteredData = useMemo(() => {
        return mockData.filter(item => 
            item.cliente.toLowerCase().includes(searchFilter.toLowerCase())
        );
    }, [searchFilter]);

    const sortedData = useMemo(() => {
        let sortableItems = [...filteredData];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key!] < b[sortConfig.key!]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key!] > b[sortConfig.key!]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredData, sortConfig]);

    const requestSort = (key: keyof FinanzasData) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleWhatsappReminder = (item: FinanzasData) => {
        const message = `¡Hola ${item.cliente}! Te recordamos amablemente que el pago de tu servicio para el periodo del ${item.periodo} está pendiente. El monto es de ${item.monto.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}. ¡Gracias!`;
        const whatsappUrl = `https://wa.me/${item.whatsapp}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-8">Gestión de Cobranza</h1>
       <Card className="mb-8">
        <CardHeader>
            <CardTitle>Control de Pagos</CardTitle>
            <CardDescription>Gestiona los pagos pendientes de tus clientes.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <Input 
                placeholder="Buscar por cliente..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="max-w-xs"
            />
        </CardContent>
       </Card>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <Button variant="ghost" onClick={() => requestSort('cliente')}>
                    Cliente
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Periodo</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('monto')}>
                    Monto Adeudado
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.cliente}</TableCell>
                <TableCell>
                    <Badge variant="outline">{item.periodo}</Badge>
                </TableCell>
                <TableCell>{item.monto.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</TableCell>
                <TableCell className="text-right">
                  {item.metodo === 'Whatsapp' ? (
                     <Button variant="whatsapp" size="sm" onClick={() => handleWhatsappReminder(item)}>
                        <WhatsappIcon className="w-4 h-4 mr-2" />
                        Recordar Pago
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                        Enviar Email
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {sortedData.length === 0 && (
            <div className="text-center p-8 text-foreground/70">
                No se encontraron registros con los filtros seleccionados.
            </div>
        )}
      </div>
    </div>
  );
}
