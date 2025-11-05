
"use client";

import { useState } from 'react';
import { courseData, Topic } from '@/lib/course-data';
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, PlayCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Header from '@/components/header';
import Footer from '@/components/footer';

export default function CoursePage() {
  const [currentTopic, setCurrentTopic] = useState<Topic>(courseData.sections[0].topics[0]);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const progress = (completedTopics.length / courseData.total_topics) * 100;

  const handleTopicClick = (topic: Topic) => {
    setCurrentTopic(topic);
  };

  const handleCompleteTopic = () => {
    if (!completedTopics.includes(currentTopic.topic_id)) {
      setCompletedTopics([...completedTopics, currentTopic.topic_id]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <div className="flex-grow">
            {/* Header */}
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
                    {/* Sidebar */}
                    <aside className="w-full md:w-1/3 lg:w-1/4">
                        <div className="sticky top-40">
                             <Accordion type="multiple" defaultValue={courseData.sections.map(s => `section-${s.section_id}`)} className="w-full">
                                {courseData.sections.map((section) => (
                                    <AccordionItem value={`section-${section.section_id}`} key={section.section_id}>
                                        <AccordionTrigger className="font-headline text-lg hover:no-underline">
                                            Sección {section.order}: {section.title}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="flex flex-col gap-1">
                                                {section.topics.map((topic) => {
                                                    const isCompleted = completedTopics.includes(topic.topic_id);
                                                    const isCurrent = currentTopic.topic_id === topic.topic_id;
                                                    return (
                                                        <button
                                                            key={topic.topic_id}
                                                            onClick={() => handleTopicClick(topic)}
                                                            className={cn(
                                                                "flex items-center gap-3 text-left p-2 rounded-md transition-colors text-sm",
                                                                isCurrent ? "bg-primary/20 text-primary-foreground" : "hover:bg-accent",
                                                                isCompleted && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {isCompleted ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Circle className="w-4 h-4" />}
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

                    {/* Content Area */}
                    <main className="w-full md:w-2/3 lg:w-3/4">
                        <div className="bg-card p-6 rounded-lg shadow-lg">
                             <h2 className="font-headline text-2xl sm:text-3xl font-bold mb-4">{currentTopic.title}</h2>
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

                            <div className="prose prose-lg max-w-none text-foreground/80 prose-headings:font-headline prose-headings:text-foreground prose-strong:text-foreground mb-6">
                                <h3>En este video verás:</h3>
                                <ul>
                                    {currentTopic.summary.map((point, index) => (
                                        <li key={index}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                            
                            <Button onClick={handleCompleteTopic} disabled={completedTopics.includes(currentTopic.topic_id)}>
                                {completedTopics.includes(currentTopic.topic_id) ? 'Lección Completada' : 'Marcar como Completada'}
                            </Button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
        <Footer />
    </div>
  );
}
