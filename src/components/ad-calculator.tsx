"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, ArrowRight, BarChart, Users, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Data from the user's plan
const girosNegocio = ["Restaurante", "Servicios Profesionales", "Retail/Ropa", "Salud/Medicina", "Bienes Raíces", "Educación", "Entretenimiento", "Turismo", "Automotriz", "Tecnología", "Otro"];
const estadosMexico: Record<string, string[]> = {
  "CDMX": ["Álvaro Obregón", "Benito Juárez", "Coyoacán", "Cuauhtémoc", "Miguel Hidalgo", "Tlalpan", "Azcapotzalco", "Coyoacán", "Cuajimalpa de Morelos", "Gustavo A. Madero", "Iztacalco", "Iztapalapa", "La Magdalena Contreras", "Milpa Alta", "Tláhuac", "Venustiano Carranza", "Xochimilco"],
  "Estado de México": ["Todos los municipios"], "Jalisco": ["Guadalajara", "Zapopan", "Tlaquepaque", "Tonalá"], "Nuevo León": ["Monterrey", "San Pedro Garza García", "Guadalupe", "Apodaca"], "Puebla": ["Puebla", "Angelópolis", "Cholula"], "Querétaro": ["Querétaro", "Corregidora", "El Marqués"], "Guanajuato": ["León", "Irapuato", "Celaya", "Salamanca"], "Baja California": ["Tijuana", "Mexicali", "Ensenada"], "Yucatán": ["Mérida", "Progreso", "Umán"], "Otro estado": ["Especificar municipio"]
};
const plataformasPauta: Record<string, { minInversion: number }> = { "Facebook": { minInversion: 2000 }, "Instagram": { minInversion: 2000 }, "TikTok": { minInversion: 3000 }, "LinkedIn": { minInversion: 8000 }, "YouTube": { minInversion: 5000 }, "Google Ads": { minInversion: 3000 } };
const rangosPresupuesto = [{ rango: "4,000 - 8,000 MXN", min: 4000, max: 8000 }, { rango: "8,001 - 20,000 MXN", min: 8001, max: 20000 }, { rango: "20,001 - 150,000 MXN", min: 20001, max: 150000 }];
const tabuladorAlcance: Record<string, Record<string, string>> = { "4000-8000": { "Facebook": "15,000 - 30,000 personas", "Instagram": "12,000 - 25,000 personas", "TikTok": "20,000 - 40,000 personas", "LinkedIn": "5,000 - 10,000 profesionales", "YouTube": "8,000 - 15,000 visualizaciones", "Google Ads": "500 - 1,200 clics" }, "8001-20000": { "Facebook": "30,000 - 80,000 personas", "Instagram": "25,000 - 60,000 personas", "TikTok": "40,000 - 100,000 personas", "LinkedIn": "10,000 - 25,000 profesionales", "YouTube": "15,000 - 40,000 visualizaciones", "Google Ads": "1,200 - 3,000 clics" }, "20001-150000": { "Facebook": "80,000 - 600,000 personas", "Instagram": "60,000 - 450,000 personas", "TikTok": "100,000 - 750,000 personas", "LinkedIn": "25,000 - 200,000 profesionales", "YouTube": "40,000 - 300,000 visualizaciones", "Google Ads": "3,000 - 22,500 clics" } };

const steps = [
  { id: 1, title: 'Giro del Negocio', description: 'Ayúdanos a entender tu industria.' },
  { id: 2, title: 'Ubicación', description: '¿Dónde se encuentran tus clientes?' },
  { id: 3, title: 'Plataformas', description: 'Elige dónde quieres que aparezcan tus anuncios.' },
  { id: 4, title: 'Presupuesto', description: 'Define tu inversión mensual para pauta.' },
  { id: 5, title: 'Resultados', description: 'Tu alcance estimado.' }
];

const AdCalculator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    giro: '',
    estado: 'CDMX',
    municipios: ['Benito Juárez'],
    otroMunicipio: '',
    plataformas: ['Facebook', 'Instagram'],
    presupuesto: 4000
  });
  const [error, setError] = useState('');

  const minInversion = useMemo(() => {
    if (formData.plataformas.length === 0) return 0;
    return Math.max(...formData.plataformas.map(p => plataformasPauta[p]?.minInversion || 0));
  }, [formData.plataformas]);

  const handleNext = () => {
    if (currentStep === 3 && formData.plataformas.length === 0) {
      setError('Debes seleccionar al menos una plataforma.');
      return;
    }
    if (currentStep === 4 && formData.presupuesto < minInversion) {
      setError(`El presupuesto debe ser de al menos ${minInversion.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} para las plataformas seleccionadas.`);
      return;
    }
    setError('');
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setError('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handlePlatformChange = (platform: string) => {
    setFormData(prev => {
      const newPlataformas = prev.plataformas.includes(platform)
        ? prev.plataformas.filter(p => p !== platform)
        : [...prev.plataformas, platform];
      return { ...prev, plataformas: newPlataformas };
    });
  };

  const handleMunicipioChange = (municipio: string) => {
     setFormData(prev => {
      const newMunicipios = prev.municipios.includes(municipio)
        ? prev.municipios.filter(m => m !== municipio)
        : [...prev.municipios, municipio];
      return { ...prev, municipios: newMunicipios };
    });
  }

  const getBudgetRangeKey = (budget: number) => {
    if (budget <= 8000) return "4000-8000";
    if (budget <= 20000) return "8001-20000";
    return "20001-150000";
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <Label>Selecciona tu Giro de Negocio</Label>
            <Select value={formData.giro} onValueChange={(value) => setFormData({ ...formData, giro: value })}>
              <SelectTrigger><SelectValue placeholder="Ej. Restaurante, Servicios, etc." /></SelectTrigger>
              <SelectContent>
                {girosNegocio.map(giro => <SelectItem key={giro} value={giro}>{giro}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
                <Label>Estado</Label>
                <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value, municipios: [] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    {Object.keys(estadosMexico).map(estado => <SelectItem key={estado} value={estado}>{estado}</SelectItem>)}
                </SelectContent>
                </Select>
            </div>
            {formData.estado && estadosMexico[formData.estado] && estadosMexico[formData.estado][0] !== 'Todos los municipios' && formData.estado !== 'Otro estado' && (
            <div>
                <Label>Alcaldías / Municipios</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {estadosMexico[formData.estado].map(m => (
                        <div key={m} className="flex items-center space-x-2">
                        <Checkbox id={m} checked={formData.municipios.includes(m)} onCheckedChange={() => handleMunicipioChange(m)} />
                        <Label htmlFor={m} className="font-normal">{m}</Label>
                        </div>
                    ))}
                </div>
            </div>
            )}
             {formData.estado === 'Otro estado' && (
                <div>
                    <Label htmlFor="otro-municipio">Especificar Municipio(s)</Label>
                    <Input id="otro-municipio" value={formData.otroMunicipio} onChange={(e) => setFormData({...formData, otroMunicipio: e.target.value})} placeholder="Ej. San Miguel de Allende" />
                </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-2">
             <Label>Plataformas para Anuncios</Label>
             <p className="text-sm text-muted-foreground">Selecciona una o más opciones.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              {Object.keys(plataformasPauta).map(p => (
                <div key={p} className="flex items-center space-x-2">
                  <Checkbox id={p} checked={formData.plataformas.includes(p)} onCheckedChange={() => handlePlatformChange(p)} />
                  <Label htmlFor={p} className="font-normal">{p}</Label>
                </div>
              ))}
            </div>
            {formData.plataformas.length > 0 && (
                 <p className="text-sm text-muted-foreground pt-4">Inversión mínima recomendada para tu selección: <strong>{minInversion.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</strong></p>
            )}
          </div>
        );
      case 4:
        return (
            <div className="space-y-4">
                <Label htmlFor="presupuesto">Inversión Mensual (MXN)</Label>
                <Input
                id="presupuesto"
                type="number"
                value={formData.presupuesto}
                onChange={(e) => setFormData({ ...formData, presupuesto: Number(e.target.value) })}
                min={minInversion}
                step={500}
                />
                 <p className="text-sm text-muted-foreground">Recomendado: al menos {minInversion.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}.</p>
            </div>
        )
      case 5:
        const budgetKey = getBudgetRangeKey(formData.presupuesto);
        const estimatedReach = tabuladorAlcance[budgetKey] || {};
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Resumen de tu Cotización</CardTitle>
                        <CardDescription>Basado en una inversión de {formData.presupuesto.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })} mensuales.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold flex items-center gap-2"><BarChart className="w-5 h-5 text-primary" /> Alcance Estimado por Plataforma</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-foreground/80 pl-2">
                                {formData.plataformas.map(p => (
                                    <li key={p}><strong>{p}:</strong> {estimatedReach[p] || 'No disponible'}</li>
                                ))}
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-semibold flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> Promedio General</h4>
                            <p className="text-sm text-foreground/80 mt-1 pl-2">Entre <strong>25,000 - 75,000</strong> personas mensuales aproximadamente.</p>
                        </div>
                    </CardContent>
                </Card>
                <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Nota Importante</AlertTitle>
                    <AlertDescription>
                        Estos números son estimaciones. El alcance real puede variar según la segmentación, la calidad del anuncio y la competencia.
                    </AlertDescription>
                </Alert>
            </div>
        )
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl">
      <CardHeader>
        <CardTitle>{steps[currentStep-1].title}</CardTitle>
        <CardDescription>{steps[currentStep-1].description}</CardDescription>
        {currentStep < 5 && <Progress value={(currentStep / (steps.length -1)) * 100} className="mt-4" />}
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
            >
                {renderStep()}
            </motion.div>
        </AnimatePresence>

         {error && (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="mt-4">
                <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                </Alert>
            </motion.div>
        )}

        <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
            </Button>
            {currentStep < steps.length ? (
                <Button onClick={handleNext}>
                   {currentStep === steps.length - 1 ? 'Calcular' : 'Siguiente'}
                   <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            ) : (
                <Button onClick={() => setCurrentStep(1)}>
                    Reiniciar
                </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdCalculator;
