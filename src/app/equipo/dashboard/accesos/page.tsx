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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

type Platform = "Facebook Ads" | "TikTok Ads" | "Google Ads";

interface AccountAccess {
  platform: Platform;
  client: string;
  email: string;
  password: string;
}

const mockAccessData: AccountAccess[] = [
  { platform: "Facebook Ads", client: "Biofert", email: "fb.biofert@cliente.com", password: "PasswordBiofert123" },
  { platform: "Facebook Ads", client: "Medical Tower", email: "meta.medical@cliente.com", password: "PasswordMedicalFB" },
  { platform: "TikTok Ads", client: "Tacos El Veloz", email: "tiktok.veloz@cliente.com", password: "TacosTikTokPass" },
  { platform: "Google Ads", client: "Constructora Edifica", email: "google.edifica@cliente.com", password: "EdificaGoogle2024" },
  { platform: "Google Ads", client: "Clínica Dental Sonrisa", email: "ads.sonrisa@cliente.com", password: "SonrisaDental!Ads" },
  { platform: "Facebook Ads", client: "NIU Coliving", email: "fb.niu@cliente.com", password: "NiuLivingFBPass" },
  { platform: "TikTok Ads", client: "Moda Hoy", email: "tiktok.modahoy@cliente.com", password: "ModaHoyTT2024" },
].sort((a, b) => a.client.localeCompare(b.client));

export default function AccesosPage() {
  const [searchFilter, setSearchFilter] = useState('');

  const filteredData = (platform: Platform) => 
    mockAccessData.filter(item => 
      item.platform === platform &&
      item.client.toLowerCase().includes(searchFilter.toLowerCase())
    );

  const AccessTable = ({ platform }: { platform: Platform }) => {
    const data = filteredData(platform);
    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Correo</TableHead>
                        <TableHead>Contraseña</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? data.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{item.client}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>{item.password}</TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center">
                                No se encontraron registros.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline">Accesos a Plataformas</h1>
       <p className="text-foreground/80 mb-8">
        Gestiona y consulta las credenciales de acceso a las plataformas publicitarias de los clientes.
      </p>

        <Card>
            <CardHeader>
                <CardTitle>Credenciales de Clientes</CardTitle>
                <CardDescription>Usa las pestañas para filtrar por plataforma y busca por cliente.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                      placeholder="Buscar por cliente..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="max-w-xs pl-8"
                  />
                </div>
                <Tabs defaultValue="facebook">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="facebook">Facebook Ads</TabsTrigger>
                        <TabsTrigger value="tiktok">TikTok Ads</TabsTrigger>
                        <TabsTrigger value="google">Google Ads</TabsTrigger>
                    </TabsList>
                    <TabsContent value="facebook" className="mt-4">
                       <AccessTable platform="Facebook Ads" />
                    </TabsContent>
                    <TabsContent value="tiktok" className="mt-4">
                        <AccessTable platform="TikTok Ads" />
                    </TabsContent>
                    <TabsContent value="google" className="mt-4">
                        <AccessTable platform="Google Ads" />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    </div>
  );
}
