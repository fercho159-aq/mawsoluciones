
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ConfiguracionPage() {
    const { user, updateUser } = useAuth();
    const { toast } = useToast();
    
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [birthday, setBirthday] = useState<Date | undefined>(undefined);
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setPhone(user.phone || '');
            setAvatarUrl(user.avatarUrl || '');
            if (user.birthday) {
                setBirthday(new Date(user.birthday));
            }
        }
    }, [user]);

    const handleSave = () => {
        if (!user) return;
        
        const updatedUserData = {
            ...user,
            name: name,
            phone: phone,
            avatarUrl: avatarUrl,
            birthday: birthday ? birthday.toISOString() : undefined,
        };

        updateUser(updatedUserData);
        toast({
            title: "¡Éxito!",
            description: "Tu información ha sido actualizada.",
        });
    };

    if (!user) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-8">Configuración de Perfil</h1>
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Tu Información</CardTitle>
                    <CardDescription>Actualiza tu nombre, foto, teléfono y fecha de cumpleaños.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="w-20 h-20">
                            <AvatarImage src={avatarUrl || user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className='flex-grow space-y-2'>
                           <Label htmlFor="avatarUrl">URL de la Foto de Perfil</Label>
                           <Input 
                            id="avatarUrl"
                            placeholder="https://ejemplo.com/foto.jpg"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                           />
                           <p className="text-xs text-muted-foreground">Pega la URL de una imagen. Asegúrate de que pese menos de 1MB.</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input 
                            id="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input 
                            id="phone" 
                            type="tel"
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                        />
                    </div>
                     <div className="space-y-2">
                        <Label>Fecha de Cumpleaños</Label>
                         <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !birthday && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {birthday ? format(birthday, "d 'de' MMMM, yyyy", { locale: es }) : <span>Selecciona una fecha</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={birthday}
                                onSelect={setBirthday}
                                initialFocus
                                captionLayout="dropdown-buttons"
                                fromYear={1950}
                                toYear={new Date().getFullYear()}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Button onClick={handleSave}>Guardar Cambios</Button>
                </CardContent>
            </Card>
        </div>
    )
}
