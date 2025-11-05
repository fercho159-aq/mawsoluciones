"use client";

import { useState } from 'react';
import { nosotrosCourseData, type Section } from '@/lib/nosotros-data';
import { CheckCircle, Circle, Building, Users, Handshake, Briefcase } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const sectionIcons: Record<number, React.ReactNode> = {
  1: <Building className="w-5 h-5 mr-3 text-primary" />,
  2: <Users className="w-5 h-5 mr-3 text-primary" />,
  3: <Handshake className="w-5 h-5 mr-3 text-primary" />,
  4: <Briefcase className="w-5 h-5 mr-3 text-primary" />,
};

type Topic = Section['topics'][0];

export default function NosotrosPage() {
  const [currentTopic, setCurrentTopic] = useState<Topic>(nosotrosCourseData.sections[0].topics[0]);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  
  const handleTopicClick = (topic: Topic) => {
    setCurrentTopic(topic);
  };

  return (
    <div className="flex flex-col">
        <header className="bg-card shadow-md sticky top-0 z-10 mb-8">
            <div className="container mx-auto px-4 md:px-0 py-4">
                <h1 className="text-xl md:text-2xl font-bold font-headline">{nosotrosCourseData.title}</h1>
            </div>
        </header>

        <div className="container mx-auto px-4 md:px-0">
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-1/3 lg:w-1/4">
                    <div className="sticky top-28">
                         <Accordion type="single" collapsible defaultValue={`section-${currentTopic.section_id}`} className="w-full">
                            {nosotrosCourseData.sections.map((section) => (
                                <AccordionItem value={`section-${section.section_id}`} key={section.section_id}>
                                    <AccordionTrigger className="font-headline text-lg hover:no-underline">
                                       <div className="flex items-center">
                                            {sectionIcons[section.section_id as keyof typeof sectionIcons] || <Building className="w-5 h-5 mr-3 text-primary" />}
                                            <span>{section.title}</span>
                                       </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex flex-col gap-1 pl-4 border-l-2 border-primary/20">
                                            {section.topics.map((topic) => {
                                                const isCurrent = currentTopic.topic_id === topic.topic_id;
                                                return (
                                                    <button
                                                        key={topic.topic_id}
                                                        onClick={() => handleTopicClick(topic)}
                                                        className={cn(
                                                            "flex items-center gap-3 text-left p-2 rounded-md transition-colors text-sm",
                                                            isCurrent ? "bg-primary/20 text-primary-foreground font-semibold" : "hover:bg-accent",
                                                            "text-foreground/80"
                                                        )}
                                                    >
                                                        <Circle className="w-4 h-4 flex-shrink-0" />
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
                    <Card>
                      <CardContent className="p-6">
                        <h2 className="font-headline text-2xl sm:text-3xl font-bold mb-4">{currentTopic.title}</h2>
                        <div 
                            className="prose prose-lg max-w-none text-foreground/80 prose-headings:font-headline prose-headings:text-foreground prose-strong:text-foreground"
                            dangerouslySetInnerHTML={{ __html: currentTopic.content }}
                        />
                      </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    </div>
  );
}