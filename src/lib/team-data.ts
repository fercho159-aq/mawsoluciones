
export type TeamMember = {
    id: string;
    name: string;
    username: string;
    password?: string;
    role: 'admin' | 'user';
    email: string;
}

export const teamMembers: TeamMember[] = [
    // Encargados (Admins)
    { id: '1', name: 'Fany', username: 'fany', password: 'admin2025', role: 'admin', email: 'fany@maw.com' },
    { id: '2', name: 'Luis', username: 'luis', password: 'admin2025', role: 'admin', email: 'luis@maw.com' },
    { id: '3', name: 'Carlos', username: 'carlos', password: 'admin2025', role: 'admin', email: 'carlos@maw.com' },
    { id: '4', name: 'Julio', username: 'julio', password: 'admin2025', role: 'admin', email: 'julio@maw.com' },
    { id: '15', name: 'Alma Fer', username: 'alma', password: 'alma2025', role: 'admin', email: 'alma@maw.com' },


    // Ejecutores (Users)
    { id: '5', name: 'Aldair', username: 'aldair', password: 'aldair2025', role: 'user', email: 'aldair@maw.com' },
    { id: '6', name: 'Alexis', username: 'alexis', password: 'alexis2025', role: 'user', email: 'alexis@maw.com' },
    { id: '7', name: 'Cristian', username: 'cristian', password: 'cristian2025', role: 'user', email: 'cristian@maw.com' },
    { id: '8', name: 'Dani', username: 'dani', password: 'dani2025', role: 'user', email: 'dani@maw.com' },
    { id: '9', name: 'Kari', username: 'kari', password: 'kari2025', role: 'user', email: 'kari@maw.com' },
    { id: '10', name: 'Pao', username: 'pao', password: 'pao2025', role: 'user', email: 'pao@maw.com' },
    { id: '11', name: 'Pedro', username: 'pedro', password: 'pedro2025', role: 'user', email: 'pedro@maw.com' },
    { id: '12', name: 'Bere', username: 'bere', password: 'bere2025', role: 'user', email: 'bere@maw.com' },
    { id: '13', name: 'Nai', username: 'nai', password: 'nai2025', role: 'user', email: 'nai@maw.com' },
    { id: '14', name: 'Enrrique', username: 'enrrique', password: 'enrrique2025', role: 'user', email: 'enrrique@maw.com' },
];
