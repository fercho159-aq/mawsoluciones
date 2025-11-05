
"use client";

import { useState } from 'react';
import { courseData, Topic, Section, Question } from '@/lib/course-data';
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, PlayCircle, Eye, Target, Users, Wand, TrendingUp, Bot, Calendar, Phone, Building, Send, ChevronRight, X, ThumbsDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from '@/lib/utils';
import Header from '@/components/header';
import Footer from '@/components/footer';
import WhatsappIcon from '@/components/icons/whatsapp-icon';
import GlitchTitle from '@/components/glitch-title';
import DonkeyIcon from '@/components/icons/donkey-icon';

const sectionIcons: Record<number, React.ReactNode> = {
  1: <Eye className="w-5 h-5 mr-3 text-primary" />,
  2: <Users className="w-5 h-5 mr-3 text-primary" />,
  3: <Wand className="w-5 h-5 mr-3 text-primary" />,
  4: <Target className="w-5 h-5 mr-3 text-primary" />,
  5: <TrendingUp className="w-5 h-5 mr-3 text-primary" />,
  6: <Bot className="w-5 h-5 mr-3 text-primary" />,
};

interface LeadFormData {
    name: string;
    phone: string;
    company: string;
    reason: string;
}

const LeadCaptureDialog = ({ trigger }: { trigger: React.ReactNode }) => {
    const [formData, setFormData] = useState<LeadFormData>({
        name: '',
        phone: '',
        company: '',
        reason: 'Quiero contratar sus servicios de implementación en mi empresa',
    });

    const handleSendToWhatsapp = () => {
        const message = `
*¡Hola! Quiero agendar una sesión con un experto.*

*Nombre:* ${formData.name}
*Celular:* ${formData.phone}
*Empresa:* ${formData.company}
*Motivo de contacto:* ${formData.reason}
        `.trim().replace(/\n\s*\n/g, '\n');
        
        const whatsappUrl = `https://wa.me/525542314150?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Agenda una Sesión</DialogTitle>
                    <DialogDescription>
                        Completa el formulario y un experto se pondrá en contacto contigo a la brevedad.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Nombre
                        </Label>
                        <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Celular
                        </Label>
                        <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="company" className="text-right">
                            Empresa
                        </Label>
                        <Input id="company" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-start gap-4">
                        <Label className="text-right pt-2">Motivo</Label>
                        <RadioGroup value={formData.reason} onValueChange={(value) => setFormData({...formData, reason: value})} className="col-span-3 space-y-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Quiero aprender tomando clases" id="r1" />
                                <Label htmlFor="r1" className="font-normal">Quiero aprender tomando clases</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Quiero contratar sus servicios de implementación en mi empresa" id="r2" />
                                <Label htmlFor="r2" className="font-normal">Quiero contratar sus servicios para mi empresa</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Quiero saber más sobre su empresa" id="r3" />
                                <Label htmlFor="r3" className="font-normal">Quiero saber más sobre su empresa</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                <Button onClick={handleSendToWhatsapp} type="submit" size="lg" className="w-full">
                    <WhatsappIcon className="w-5 h-5 mr-2" />
                    Enviar por WhatsApp
                </Button>
            </DialogContent>
        </Dialog>
    );
};

const QuizComponent = ({ topic, onComplete }: { topic: Topic; onComplete: (score: number) => void; }) => {
    const [answers, setAnswers] = useState<{[key: number]: number}>({});
    
    const handleAnswerChange = (questionIndex: number, optionIndex: number) => {
        setAnswers(prev => ({...prev, [questionIndex]: optionIndex}));
    };

    const handleSubmit = () => {
        let score = 0;
        topic.questions.forEach((q, index) => {
            if (answers[index] === q.correct) {
                score++;
            }
        });
        onComplete(score);
    };

    return (
        <div className="prose prose-lg max-w-none text-foreground/80 prose-headings:font-headline prose-headings:text-foreground prose-strong:text-foreground">
            <h3 className="font-bold">Examen Final de Sección</h3>
            <p>Es hora de poner a prueba tus conocimientos. Responde las siguientes preguntas.</p>
            <div className="space-y-8 mt-8">
                {topic.questions.map((q, qIndex) => (
                    <div key={qIndex} className="p-4 border rounded-lg">
                        <p className="font-semibold">{qIndex + 1}. {q.question}</p>
                        <RadioGroup onValueChange={(value) => handleAnswerChange(qIndex, parseInt(value))}>
                            <div className="space-y-2 mt-4">
                                {q.options.map((option, oIndex) => (
                                    <div key={oIndex} className="flex items-center">
                                        <RadioGroupItem value={oIndex.toString()} id={`q${qIndex}o${oIndex}`} />
                                        <Label htmlFor={`q${qIndex}o${oIndex}`} className="ml-2 font-normal">{option}</Label>
                                    </div>
                                ))}
                            </div>
                        </RadioGroup>
                    </div>
                ))}
            </div>
            <Button onClick={handleSubmit} size="lg" className="mt-8" disabled={Object.keys(answers).length !== topic.questions.length}>
                Verificar Respuestas
            </Button>
        </div>
    );
};


export default function CoursePage() {
  const [currentTopic, setCurrentTopic] = useState<Topic>(courseData.sections[0].topics[0]);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const progress = (completedTopics.length / courseData.total_topics) * 100;
  
  const [quizResult, setQuizResult] = useState<'win' | 'lose' | null>(null);

  const handleTopicClick = (topic: Topic) => {
    setCurrentTopic(topic);
    setQuizResult(null); 
  };

  const handleCompleteTopic = () => {
    if (!completedTopics.includes(currentTopic.topic_id)) {
      setCompletedTopics([...completedTopics, currentTopic.topic_id]);
    }
  };

  const handleQuizComplete = (score: number) => {
      if (score > 4) {
          setQuizResult('win');
          handleCompleteTopic();
      } else {
          setQuizResult('lose');
      }
  };

  const isQuiz = currentTopic.questions && currentTopic.questions.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <div className="flex-grow">
            <header className="bg-card shadow-md sticky top-20 z-40">
                <div className="container mx-auto px-4 md:px-6 py-4">
                    <h1 className="text-xl md:text-2xl font-bold font-headline">{courseData.title}</h1>
                    <div className="flex items-center gap-4 mt-2">
                        <Progress value={progress} className="w-full" />
                        <span className="text-sm font-semibold whitespace-nowrap">{Math.round(progress)}% Completado</span>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 md:px-6 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="w-full md:w-1/3 lg:w-1/4">
                        <div className="sticky top-40">
                             <Accordion type="single" collapsible defaultValue={`section-${currentTopic.section_id}`} className="w-full">
                                {courseData.sections.map((section) => (
                                    <AccordionItem value={`section-${section.section_id}`} key={section.section_id}>
                                        <AccordionTrigger className="font-headline text-lg hover:no-underline">
                                           <div className="flex items-center">
                                                {sectionIcons[section.section_id as keyof typeof sectionIcons] || <Eye className="w-5 h-5 mr-3 text-primary" />}
                                                <span>{section.title}</span>
                                           </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="flex flex-col gap-1 pl-4 border-l-2 border-primary/20">
                                                {section.topics.map((topic) => {
                                                    const isCompleted = completedTopics.includes(topic.topic_id);
                                                    const isCurrent = currentTopic.topic_id === topic.topic_id;
                                                    return (
                                                        <button
                                                            key={topic.topic_id}
                                                            onClick={() => handleTopicClick(topic)}
                                                            className={cn(
                                                                "flex items-center gap-3 text-left p-2 rounded-md transition-colors text-sm",
                                                                isCurrent ? "bg-primary/20 text-primary-foreground font-semibold" : "hover:bg-accent",
                                                                isCompleted ? "text-muted-foreground line-through" : "text-foreground/80"
                                                            )}
                                                        >
                                                            {isCompleted ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> : <Circle className="w-4 h-4 flex-shrink-0" />}
                                                            <span className="flex-1">{topic.title}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    </aside>

                    <main className="w-full md:w-2/3 lg:w-3/4">
                        <div className="bg-card p-6 rounded-lg shadow-lg">
                             <h2 className="font-headline text-2xl sm:text-3xl font-bold mb-4">{currentTopic.title}</h2>
                            
                             {isQuiz ? (
                                <>
                                {quizResult === 'win' && (
                                    <div className="text-center py-10">
                                        <GlitchTitle text="YOU WIN" />
                                    </div>
                                )}
                                {quizResult === 'lose' && (
                                    <div className="text-center py-10">
                                        <GlitchTitle text="GAME OVER" />
                                        <DonkeyIcon className="w-24 h-24 mx-auto mt-4 text-primary" />
                                    </div>
                                )}
                                {quizResult === null && (
                                    <QuizComponent topic={currentTopic} onComplete={handleQuizComplete} />
                                )}
                                </>
                             ) : (
                                <>
                                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-6 relative overflow-hidden">
                                        {currentTopic.video_url ? (
                                            <video controls src={currentTopic.video_url} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center text-muted-foreground">
                                                <PlayCircle className="w-16 h-16 mx-auto mb-2" />
                                                <p>Video no disponible.</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="prose prose-lg max-w-none text-foreground/80 prose-headings:font-headline prose-headings:text-foreground prose-strong:text-foreground mb-8">
                                        <h3 className="font-bold">Habilidades que ganarás:</h3>
                                        <ul className="list-disc list-inside space-y-1">
                                            {currentTopic.summary.map((point, index) => (
                                                <li key={index}><span className="font-semibold">{point.split(':')[0]}:</span>{point.split(':')[1]}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                     <div className="flex flex-col sm:flex-row gap-4">
                                        <Button onClick={handleCompleteTopic} disabled={completedTopics.includes(currentTopic.topic_id)} size="lg">
                                            {completedTopics.includes(currentTopic.topic_id) ? 'Lección Completada' : 'Marcar como Completada'}
                                        </Button>
                                        <LeadCaptureDialog 
                                            trigger={
                                                <Button variant="outline" size="lg">
                                                    <Calendar className="w-4 h-4 mr-2" />
                                                    Quiero Agendar una Sesión
                                                </Button>
                                            }
                                        />
                                    </div>
                                </>
                             )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
        <Footer />
    </div>
  );
}
