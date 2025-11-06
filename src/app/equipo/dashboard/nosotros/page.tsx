"use client";

import { teamMembers } from '@/lib/team-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import AnimatedDiv from '@/components/animated-div';
import { Crown, Users, Briefcase } from 'lucide-react';
import type { TeamMember } from '@/lib/db/schema';

const roleIcons: { [key: string]: React.ReactNode } = {
  admin: <Crown className="w-4 h-4 text-amber-500" />,
  julio: <Crown className="w-4 h-4 text-amber-500" />,
  fernando: <Crown className="w-4 h-4 text-amber-500" />,
  ventas: <Briefcase className="w-4 h-4 text-blue-500" />,
  alma: <Briefcase className="w-4 h-4 text-blue-500" />,
  produccion: <Users className="w-4 h-4 text-green-500" />,
  team_member: <Users className="w-4 h-4 text-green-500" />,
};

const TeamCard = ({ member }: { member: TeamMember }) => (
    <AnimatedDiv className="text-center">
        <Card className="bg-card/50 hover:bg-card transition-colors hover:shadow-lg">
            <CardContent className="p-4 flex flex-col items-center">
                <Avatar className="w-20 h-20 mb-4 border-2" style={{ borderColor: member.color || 'hsl(var(--primary))' }}>
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback style={{ backgroundColor: member.color || 'hsl(var(--primary))', color: 'white' }}>
                        {member.name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <Badge variant="secondary" className="mt-1 capitalize">{member.role}</Badge>
            </CardContent>
        </Card>
    </AnimatedDiv>
);

export default function NosotrosPage() {
  const leadership = teamMembers.filter(m => ['admin', 'julio', 'fernando'].includes(m.role));
  const salesTeam = teamMembers.filter(m => ['alma'].includes(m.role));
  const productionTeam = teamMembers.filter(m => !['admin', 'julio', 'fernando', 'alma', 'contabilidad'].includes(m.role));

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-8">Organigrama del Equipo</h1>

      <div className="space-y-12">
        <section>
           <h2 className="text-2xl font-bold font-headline mb-6 flex items-center gap-2">
            <Crown className="w-6 h-6 text-amber-500" />
            Liderazgo
           </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {leadership.map(member => <TeamCard key={member.id} member={member} />)}
            </div>
        </section>

         <section>
           <h2 className="text-2xl font-bold font-headline mb-6 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-500" />
            Equipo de Ventas
           </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {salesTeam.map(member => <TeamCard key={member.id} member={member} />)}
            </div>
        </section>

         <section>
           <h2 className="text-2xl font-bold font-headline mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-green-500" />
            Equipo de Producción
           </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {productionTeam.map(member => <TeamCard key={member.id} member={member} />)}
            </div>
        </section>
      </div>
    </div>
  );
}