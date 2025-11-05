
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Circle, RefreshCw, Send } from "lucide-react";
import AnimatedDiv from "@/components/animated-div";
import WebDevelopmentContent from "@/components/web-development-content";

type Step = 'start' | 'analyzer' | 'calculator' | 'info' | 'portfolio' | 'contact';
type Journey = 'improve' | 'create' | null;

const GuidedExperience = ({ onComplete }: { onComplete: () => void }) => {
  const [journey, setJourney] = useState<Journey>(null);
  const [currentStep, setCurrentStep] = useState<Step>('start');

  const handleSetJourney = (type: Journey) => {
    setJourney(type);
    setCurrentStep(type === 'improve' ? 'analyzer' : 'calculator');
  };

  const handleNextStep = () => {
    if (journey === 'improve') {
      const sequence: Step[] = ['analyzer', 'info', 'portfolio', 'contact'];
      const currentIndex = sequence.indexOf(currentStep);
      if (currentIndex < sequence.length - 1) {
        setCurrentStep(sequence[currentIndex + 1]);
      } else {
        onComplete();
      }
    } else if (journey === 'create') {
      const sequence: Step[] = ['calculator', 'info', 'portfolio', 'contact'];
      const currentIndex = sequence.indexOf(currentStep);
      if (currentIndex < sequence.length - 1) {
        setCurrentStep(sequence[currentIndex + 1]);
      } else {
        onComplete();
      }
    }
  };
  
  const handleStartOver = () => {
    setJourney(null);
    setCurrentStep('start');
  }

  if (currentStep === 'start') {
    return (
      <section className="py-24 sm:py-32 md:py-40 bg-card">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <AnimatedDiv className="max-w-2xl mx-auto">
            <h1 className="font-headline text-3xl sm:text-4xl font-bold">
              ¿Ya tienes un sitio web?
            </h1>
            <p className="mt-4 text-lg text-foreground/80">
              Selecciona una opción para que podamos guiarte a la solución perfecta para ti.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" onClick={() => handleSetJourney('improve')}>
                <CheckCircle className="w-5 h-5 mr-2" />
                Sí, y quiero mejorarlo
              </Button>
              <Button size="lg" variant="outline" onClick={() => handleSetJourney('create')}>
                <Send className="w-5 h-5 mr-2" />
                No, es mi primera vez
              </Button>
            </div>
          </AnimatedDiv>
        </div>
      </section>
    );
  }

  const isLastStep = currentStep === 'contact';
  const ctaText = journey === 'improve' ? 'Agendar sesión para rediseñar tu sitio' : 'Agendar consultoría para crear tu primer sitio';

  return (
    <div>
        <WebDevelopmentContent
            showAnalyzer={currentStep === 'analyzer'}
            showCalculator={currentStep === 'calculator'}
            showInfo={currentStep === 'info' || currentStep === 'portfolio' || currentStep === 'contact'}
            showPortfolio={currentStep === 'portfolio' || currentStep === 'contact'}
        />
        <div className="py-12 bg-background text-center">
             <div className="container mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button size="lg" onClick={isLastStep ? onComplete : handleNextStep}>
                   {isLastStep ? ctaText : 'Siguiente Paso'} <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="ghost" onClick={handleStartOver}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Empezar de nuevo
                </Button>
             </div>
        </div>
    </div>
  );
};


const ServicePage = () => {
    const [isGuidedExperience, setIsGuidedExperience] = useState(true);

    useEffect(() => {
        const hasCompletedFlow = localStorage.getItem('webDevFlowCompleted');
        if (hasCompletedFlow === 'true') {
            setIsGuidedExperience(false);
        }
    }, []);

    const handleCompleteFlow = () => {
        localStorage.setItem('webDevFlowCompleted', 'true');
        setIsGuidedExperience(false);
    };

    if (isGuidedExperience) {
        return <GuidedExperience onComplete={handleCompleteFlow} />;
    }

    return (
       <div className="bg-background">
        <WebDevelopmentContent
            showAnalyzer={true}
            showCalculator={true}
            showInfo={true}
            showPortfolio={true}
            isFullPage={true}
        />
       </div>
    );
};

export default ServicePage;
