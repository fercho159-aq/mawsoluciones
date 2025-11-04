
"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Briefcase, Bot, ShoppingCart, Send, Link as LinkIcon, Building, Palette, Sparkles, Redo } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WhatsappIcon from './icons/whatsapp-icon';

const webGoals = [
    { id: 'ecommerce', label: 'Vender productos directamente', icon: <ShoppingCart />, recommendation: 'Sitio E-commerce' },
    { id: 'connective', label: 'Presentar mi empresa y servicios', icon: <Building />, recommendation: 'Sitio Conectivo/Corporativo' },
    { id: 'landing', label: 'Promocionar un producto o evento', icon: <Send />, recommendation: 'Landing Page' },
    { id: 'catalog', label: 'Mostrar un catálogo (sin venta directa)', icon: <Briefcase />, recommendation: 'Sitio de Catálogo' },
];

const designStyles = [
    { id: 'minimalist', label: 'Minimalista', icon: <div className="w-6 h-6 border-2 border-primary rounded-full"></div> },
    { id: 'bold', label: 'Colores Fuertes / Gen Z', icon: <Palette /> },
    { id: 'animated', label: 'Animado', icon: <Sparkles /> },
];

const steps = [
  { id: 1, title: 'Tu Negocio', description: 'Cuéntanos sobre tu proyecto.' },
  { id: 2, 'title': 'Tu Objetivo Principal', description: '¿Qué quieres lograr con tu sitio web?' },
  { id: 3, title: 'Estilo y Diseño', description: 'Define la apariencia que buscas.' },
  { id: 4, title: 'Inspiración', description: 'Ayúdanos a entender tu visión.' },
  { id: 5, title: 'Recomendación', description: 'Tu tipo de sitio web ideal.' }
];

const WebCalculator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    personName: '',
    mainGoal: 'connective',
    competitors: '',
    designStyle: 'minimalist',
    isRedesign: 'No',
  });
  const [error, setError] = useState('');

  const recommendation = useMemo(() => {
    const goal = webGoals.find(g => g.id === formData.mainGoal);
    return goal?.recommendation || 'Sitio Web';
  }, [formData.mainGoal]);

  const handleNext = () => {
    if (currentStep === 1 && (!formData.companyName || !formData.personName)) {
        setError('Por favor, completa todos los campos.');
        return;
    }
    setError('');
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsResultModalOpen(true);
    }
  };

  const handleBack = () => {
    setError('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSendToWhatsapp = () => {
    const designStyleLabel = designStyles.find(d => d.id === formData.designStyle)?.label || 'No especificado';
    const message = `
*¡Hola! Quiero una cotización para mi sitio web!*
\n*Empresa:* ${formData.companyName}
*Nombre:* ${formData.personName}
*Objetivo Principal:* ${recommendation}
*¿Busca rediseño?:* ${formData.isRedesign}
*Estilo de diseño preferido:* ${designStyleLabel}
*Sitios de referencia:* 
${formData.competitors || 'No especificados'}
\n*Mi número es:* ${whatsappNumber}
    `;
    const whatsappUrl = `https://wa.me/5542314150?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setIsResultModalOpen(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="companyName">Nombre de tu Empresa o Proyecto</Label>
                  <Input id="companyName" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} placeholder="Ej. Mi Marca Increíble" />
                </div>
                <div>
                  <Label htmlFor="personName">Tu Nombre</Label>
                  <Input id="personName" value={formData.personName} onChange={(e) => setFormData({...formData, personName: e.target.value})} placeholder="Ej. Alex Smith" />
                </div>
            </div>
          </div>
        );
      case 2:
        return (
            <div className="space-y-4">
                <Label>¿Cuál es el objetivo principal de tu nuevo sitio web?</Label>
                <RadioGroup value={formData.mainGoal} onValueChange={(value) => setFormData({...formData, mainGoal: value})} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {webGoals.map(goal => (
                        <div key={goal.id}>
                            <RadioGroupItem value={goal.id} id={goal.id} className="peer sr-only" />
                            <Label 
                                htmlFor={goal.id}
                                className="flex items-center gap-4 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                            >
                                {React.cloneElement(goal.icon, { className: "w-6 h-6 text-primary" })}
                                <span className="font-semibold">{goal.label}</span>
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>
        );
       case 3:
        return (
            <div className="space-y-8">
                <div>
                    <Label>¿Qué estilo de diseño visual prefieres?</Label>
                    <RadioGroup value={formData.designStyle} onValueChange={(value) => setFormData({...formData, designStyle: value})} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        {designStyles.map(style => (
                            <div key={style.id}>
                                <RadioGroupItem value={style.id} id={style.id} className="peer sr-only" />
                                <Label htmlFor={style.id} className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 h-28 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                    {React.cloneElement(style.icon, { className: "w-6 h-6 text-primary mb-2" })}
                                    <span className="font-semibold text-center">{style.label}</span>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                <div>
                    <Label>¿Ya tienes un sitio web y buscas un rediseño?</Label>
                    <RadioGroup value={formData.isRedesign} onValueChange={(value) => setFormData({...formData, isRedesign: value})} className="flex gap-4 mt-2">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Sí" id="redesign-yes" />
                            <Label htmlFor="redesign-yes" className='font-normal'>Sí</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="No" id="redesign-no" />
                            <Label htmlFor="redesign-no" className='font-normal'>No</Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>
        );
      case 4:
        return (
            <div className="space-y-4">
                <Label htmlFor="competitors">Inspiración y Competencia</Label>
                <p className="text-sm text-muted-foreground">Menciona algunos sitios web que te gusten (pueden ser de tu competencia o no). Esto nos ayuda a entender el estilo que buscas. Pega las URLs aquí.</p>
                <Textarea 
                    id="competitors"
                    value={formData.competitors}
                    onChange={(e) => setFormData({...formData, competitors: e.target.value})}
                    placeholder="Ej: www.competidor1.com, www.marcafavorita.com"
                    className="h-32"
                />
            </div>
        );
      case 5:
        const recommendedGoal = webGoals.find(g => g.id === formData.mainGoal);
        return (
            <div className="text-center py-8">
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                    <div className="inline-block bg-primary/10 p-6 rounded-full mb-4">
                        {recommendedGoal?.icon && React.cloneElement(recommendedGoal.icon, { className: "w-16 h-16 text-primary" })}
                    </div>
                    <p className="text-xl text-muted-foreground">Basado en tus respuestas, tu sitio ideal es un</p>
                    <p className="text-5xl sm:text-6xl font-bold text-primary my-2">{recommendation}</p>
                    <Card className="mt-6 text-left">
                        <CardHeader>
                            <CardTitle>¿Qué significa esto?</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <p className="text-foreground/80">
                                Un <strong>{recommendation}</strong> está diseñado específicamente para <strong>{recommendedGoal?.label.toLowerCase()}</strong>. Es la herramienta perfecta para alcanzar tus objetivos porque se centra en funcionalidades clave para ello, ya sea un catálogo de productos, un sistema de reservaciones, o una vía directa para generar contactos.
                             </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        )
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl">
      <CardHeader>
        <Progress value={(currentStep / steps.length) * 100} className="mb-4" />
        <div className="space-y-2 text-center">
            <CardTitle>{steps[currentStep-1].title}</CardTitle>
            <CardDescription>{steps[currentStep-1].description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="min-h-[250px]"
            >
                {renderStep()}
            </motion.div>
        </AnimatePresence>

         {error && (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="mt-4 text-center">
                 <p className="text-sm font-medium text-destructive">{error}</p>
            </motion.div>
        )}

        <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
            </Button>
            <Button onClick={handleNext}>
                   {currentStep < steps.length ? 'Siguiente' : 'Recibir Recomendación'}
                   <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
        </div>
      </CardContent>

      <Dialog open={isResultModalOpen} onOpenChange={setIsResultModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Bot className="w-6 h-6 text-primary"/>¡Recomendación Lista!</DialogTitle>
                <DialogDescription>
                    Ingresa tu número de WhatsApp para enviarte el resultado detallado y que un experto se ponga en contacto contigo para una cotización.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <Label htmlFor="whatsapp-number">Tu número de WhatsApp</Label>
                <Input 
                    id="whatsapp-number" 
                    type="tel" 
                    placeholder="Ej. 55 1234 5678" 
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                />
            </div>
            <Button onClick={handleSendToWhatsapp} size="lg" className="w-full">
                <WhatsappIcon className="w-5 h-5 mr-2" />
                Enviar y Recibir Recomendación
            </Button>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default WebCalculator;
