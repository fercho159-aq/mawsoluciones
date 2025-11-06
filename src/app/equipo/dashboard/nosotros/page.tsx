
"use client";

import { useState } from 'react';
import { nosotrosCourseData, type Topic } from '@/lib/nosotros-data';
import { CodeXml, PenSquare, Megaphone, Bot, Users, Briefcase, Crown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { teamMembers } from '@/lib/team-data';
import type { TeamMember } from '@/lib/db/schema';
import AnimatedDiv from '@/components/animated-div';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';


const sectionIcons: Record<number, React.ReactNode> = {
  1: <CodeXml className="w-5 h-5 mr-3 text-primary" />,
  2: <PenSquare className="w-5 h-5 mr-3 text-primary" />,
  3: <Megaphone className="w-5 h-5 mr-3 text-primary" />,
};

const CompactTeamCard = ({ member }: { member: TeamMember }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Avatar className="w-16 h-16 border-2 hover:border-primary transition-colors" style={{ borderColor: member.color || 'hsl(var(--border))' }}>
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback style={{ backgroundColor: member.color || 'hsl(var(--primary))', color: 'white' }}>
                        {member.name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
            </TooltipTrigger>
            <TooltipContent>
                <p className="font-bold">{member.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);


export default function NosotrosPage() {
  const [currentTopic, setCurrentTopic] = useState<Topic>(nosotrosCourseData.sections[0].topics[0]);
  
  const handleTopicClick = (topic: Topic) => {
    setCurrentTopic(topic);
  };
  
  const leadership = teamMembers.filter(m => ['admin', 'julio', 'fernando'].includes(m.role));
  const salesTeam = teamMembers.filter(m => ['alma'].includes(m.role));
  const productionTeam = teamMembers.filter(m => !['admin', 'julio', 'fernando', 'alma', 'contabilidad'].includes(m.role));

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
                                            {sectionIcons[section.section_id as keyof typeof sectionIcons] || <CodeXml className="w-5 h-5 mr-3 text-primary" />}
                                            <span>{section.title}</span>
                                       </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pl-4">
                                        <div className="flex flex-col gap-1">
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
                                                        <div className={cn("w-2 h-2 rounded-full", isCurrent ? 'bg-primary' : 'bg-muted-foreground')}></div>
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
                            className="prose prose-lg max-w-none text-foreground/80 prose-headings:font-headline prose-headings:text-foreground prose-strong:text-foreground mb-8"
                            dangerouslySetInnerHTML={{ __html: currentTopic.content }}
                        />
                      </CardContent>
                    </Card>
                </main>
            </div>

            <section className="mt-16 pt-8 border-t">
                <h2 className="text-2xl font-bold font-headline mb-8 text-center">Organigrama del Equipo</h2>
                <div className="space-y-10">
                    <AnimatedDiv>
                        <h3 className="text-xl font-bold font-headline mb-6 flex items-center justify-center gap-2 text-amber-500">
                            <Crown className="w-6 h-6" /> Liderazgo
                        </h3>
                        <div className="flex justify-center flex-wrap gap-4">
                            {leadership.map(member => <CompactTeamCard key={member.id} member={member} />)}
                        </div>
                    </AnimatedDiv>
                    <AnimatedDiv>
                        <h3 className="text-xl font-bold font-headline mb-6 flex items-center justify-center gap-2 text-blue-500">
                            <Briefcase className="w-6 h-6" /> Equipo de Ventas
                        </h3>
                        <div className="flex justify-center flex-wrap gap-4">
                            {salesTeam.map(member => <CompactTeamCard key={member.id} member={member} />)}
                        </div>
                    </AnimatedDiv>
                    <AnimatedDiv>
                        <h3 className="text-xl font-bold font-headline mb-6 flex items-center justify-center gap-2 text-green-500">
                            <Users className="w-6 h-6" /> Equipo de Producción
                        </h3>
                        <div className="flex justify-center flex-wrap gap-4">
                            {productionTeam.map(member => <CompactTeamCard key={member.id} member={member} />)}
                        </div>
                    </AnimatedDiv>
                </div>
            </section>

        </div>
    </div>
  );
}
