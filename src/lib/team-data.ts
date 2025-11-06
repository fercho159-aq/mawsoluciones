

export type Role = 'admin' | 'contabilidad' | 'ventas' | 'team_member' | 'julio' | 'alma' | 'fernando' | 'luis' | 'fany' | 'carlos' | 'paola' | 'cristian' | 'daniel' | 'alexis' | 'bere' | 'kari' | 'aldair' | 'pedro';

export type TeamMember = {
    id: string;
    name: string;
    username: string;
    password?: string;
    role: Role;
    email: string;
    color: string;
    birthday?: string;
    phone?: string;
    avatarUrl?: string;
    accessSections?: Record<string, boolean>;
    permissions?: Record<string, any>;
    progressConfig?: Record<string, boolean>;
}

export const teamMembers: TeamMember[] = [
    { 
        id: 'admin-01', 
        name: 'Admin', 
        username: 'admin', 
        password: 'admin2025', 
        role: 'admin', 
        email: 'admin@agencia.com',
        color: '#7C3AED', // purple-600
        accessSections: { nosotros: true, introduccion: true, pendientes: true, finanzas: true, ventas: true, accesos: true, calendario: true, miProgreso: true, clientes: true, configuracion: true },
        permissions: {
            finanzas: { agregarPagos: true, agregarGastos: true, agregarCuentasPorCobrar: true },
            ventas: { agregarProspectosDirecto: true, cambiarStatusProspectos: true, cambiarStatusSoloAsignados: false, verTodosProspectos: true },
            accesos: { ajustarAccesos: true, agregarNuevosAccesos: true },
            calendario: { cambiarFechas: true, cambiarFechasSoloAsignados: false, verCalendarioTodos: true, modificarCalendarioTodos: true, asignarEquipos: true },
            pendientes: { moverPendientes: true, reasignarResponsables: true },
            clientes: { agregarClientes: true, editarClientes: true, verSaldo: true },
        },
        progressConfig: { resumenVentasMes: true, gananciasPerdidas: true, desempenioOtrosUsuarios: true, proximasGrabaciones: true, llegadasTarde: true }
    },
    { 
        id: 'conta-01', 
        name: 'Contabilidad', 
        username: 'contabilidad', 
        password: 'conta2025', 
        role: 'contabilidad', 
        email: 'conta@agencia.com',
        color: '#6B7280', // gray-500
        accessSections: { nosotros: true, introduccion: true, pendientes: false, finanzas: true, ventas: false, accesos: false, calendario: false, miProgreso: false, clientes: true, configuracion: true },
        permissions: {
            finanzas: { agregarPagos: true, agregarGastos: true, agregarCuentasPorCobrar: true },
            clientes: { agregarClientes: true, editarClientes: true, verSaldo: true },
        },
        progressConfig: {}
    },
    { 
        id: 'ventas-01', 
        name: 'Ventas Genérico', 
        username: 'ventas', 
        password: 'ventas2025', 
        role: 'ventas', 
        email: 'ventas@agencia.com',
        color: '#2563EB', // blue-600
        accessSections: { nosotros: false, introduccion: false, pendientes: false, finanzas: false, ventas: true, accesos: false, calendario: false, miProgreso: false, clientes: false, configuracion: true },
        permissions: {
            ventas: { agregarProspectosDirecto: true, cambiarStatusProspectos: true, cambiarStatusSoloAsignados: false, verTodosProspectos: true }
        },
        progressConfig: {}
    },
    { 
        id: 'julio-01', 
        name: 'Julio', 
        username: 'julio', 
        password: 'julio2025', 
        role: 'julio', 
        email: 'julio@agencia.com',
        color: '#D97706', // amber-600
        accessSections: { nosotros: true, introduccion: true, pendientes: true, finanzas: false, ventas: true, accesos: true, calendario: true, miProgreso: true, clientes: false, configuracion: true },
        permissions: {
            ventas: { cambiarStatusProspectos: true, cambiarStatusSoloAsignados: true },
            accesos: { ajustarAccesos: true, agregarNuevosAccesos: true },
            calendario: { cambiarFechas: true, cambiarFechasSoloAsignados: true, verCalendarioTodos: true },
            pendientes: { moverPendientes: true, reasignarResponsables: false }
        },
        progressConfig: { registroLlegadasTemprano: true, diasCompletadosPendientes: true, salidasGrabacion: true, ventasCerradas: true, statusVentas: true }
    },
    { 
        id: 'alma-01', 
        name: 'Alma', 
        username: 'alma', 
        password: 'alma2025', 
        role: 'alma', 
        email: 'alma@agencia.com',
        color: '#DB2777', // pink-600
        accessSections: { nosotros: true, introduccion: true, ventas: true, calendario: true, configuracion: true },
        permissions: {
            ventas: { cambiarStatusProspectos: true, cambiarStatusSoloAsignados: true },
            calendario: { cambiarFechas: true, cambiarFechasSoloAsignados: true, verCalendarioTodos: true }
        },
        progressConfig: { ventasCerradas: true, statusVentas: true }
    },
    { 
        id: 'fernando-01', 
        name: 'Fernando', 
        username: 'fernando', 
        password: 'fer2025', 
        role: 'fernando', 
        email: 'fer@agencia.com',
        color: '#059669', // emerald-600
        accessSections: { nosotros: true, introduccion: true, pendientes: true, finanzas: false, ventas: true, accesos: true, calendario: true, miProgreso: true, clientes: false, configuracion: true },
        permissions: {
            ventas: { cambiarStatusProspectos: true, cambiarStatusSoloAsignados: true },
            accesos: { ajustarAccesos: true, agregarNuevosAccesos: true },
            calendario: { cambiarFechas: true, cambiarFechasSoloAsignados: true, verCalendarioTodos: true },
            pendientes: { moverPendientes: true, reasignarResponsables: false }
        },
        progressConfig: { registroLlegadasTemprano: true, diasCompletadosPendientes: true, salidasGrabacion: true, ventasCerradas: true, statusVentas: true }
    },
    { 
        id: 'luis-01', 
        name: 'Luis', 
        username: 'luis', 
        password: 'luis2025', 
        role: 'luis', 
        email: 'luis@agencia.com',
        color: '#2563EB', // blue-600
        accessSections: { nosotros: true, introduccion: true, pendientes: true, accesos: true, calendario: true, miProgreso: true, clientes: false, configuracion: true },
        permissions: {
            calendario: { cambiarFechas: true, cambiarFechasSoloAsignados: true, verCalendarioTodos: true },
             pendientes: { moverPendientes: true, reasignarResponsables: false }
        },
        progressConfig: {}
    },
    { 
        id: 'fany-01', 
        name: 'Fany', 
        username: 'fany', 
        password: 'fany2025', 
        role: 'fany', 
        email: 'fany@agencia.com',
        color: '#9333EA', // purple-500
        accessSections: { nosotros: true, introduccion: true, pendientes: true, accesos: true, calendario: true, miProgreso: true, clientes: false, configuracion: true },
        permissions: {
            calendario: { cambiarFechas: true, cambiarFechasSoloAsignados: true, verCalendarioTodos: true },
            pendientes: { moverPendientes: true, reasignarResponsables: false }
        },
        progressConfig: {}
    },
    { 
        id: 'carlos-01', 
        name: 'Carlos', 
        username: 'carlos', 
        password: 'carlos2025', 
        role: 'carlos', 
        email: 'carlos@agencia.com',
        color: '#F59E0B', // amber-500
        accessSections: { nosotros: true, introduccion: true, pendientes: true, accesos: true, calendario: true, miProgreso: true, clientes: false, configuracion: true },
        permissions: {
            calendario: { cambiarFechas: true, cambiarFechasSoloAsignados: true, verCalendarioTodos: true },
            pendientes: { moverPendientes: true, reasignarResponsables: false }
        },
        progressConfig: {}
    },
    { 
        id: 'paola-01', 
        name: 'Paola', 
        username: 'paola', 
        password: 'paola2025', 
        role: 'paola', 
        email: 'paola@agencia.com',
        color: '#EC4899', // pink-500
        accessSections: { nosotros: true, introduccion: true, pendientes: true, accesos: true, calendario: true, miProgreso: true, clientes: false, configuracion: true },
        permissions: {
            calendario: { cambiarFechas: true, cambiarFechasSoloAsignados: true, verCalendarioTodos: true },
            pendientes: { moverPendientes: true, reasignarResponsables: false }
        },
        progressConfig: {}
    },
    { 
        id: 'cristian-01', 
        name: 'Cristian', 
        username: 'cristian', 
        password: 'cristian2025', 
        role: 'cristian', 
        email: 'cristian@agencia.com',
        color: '#10B981', // emerald-500
        accessSections: { nosotros: true, introduccion: true, pendientes: true, accesos: true, calendario: true, miProgreso: true, clientes: false, configuracion: true },
        permissions: {
            calendario: { cambiarFechas: true, cambiarFechasSoloAsignados: true, verCalendarioTodos: true },
            pendientes: { moverPendientes: true, reasignarResponsables: false }
        },
        progressConfig: {}
    },
    { 
        id: 'daniel-01', 
        name: 'Daniel', 
        username: 'daniel', 
        password: 'daniel2025', 
        role: 'daniel', 
        email: 'daniel@agencia.com',
        color: '#3B82F6', // blue-500
        accessSections: { nosotros: true, introduccion: true, pendientes: true, accesos: true, calendario: true, miProgreso: true, clientes: false, configuracion: true },
        permissions: {
            calendario: { cambiarFechas: true, cambiarFechasSoloAsignados: true, verCalendarioTodos: true },
            pendientes: { moverPendientes: true, reasignarResponsables: false }
        },
        progressConfig: {}
    },
    { 
        id: 'alexis-01', 
        name: 'Alexis', 
        username: 'alexis', 
        password: 'alexis2025', 
        role: 'alexis', 
        email: 'alexis@agencia.com',
        color: '#EF4444', // red-500
        accessSections: { nosotros: true, introduccion: true, pendientes: true, accesos: true, calendario: true, miProgreso: true, clientes: false, configuracion: true },
        permissions: {
            calendario: { cambiarFechas: true, cambiarFechasSoloAsignados: true, verCalendarioTodos: true },
            pendientes: { moverPendientes: true, reasignarResponsables: false }
        },
        progressConfig: {}
    },
     { 
        id: 'bere-01', 
        name: 'Bere', 
        username: 'bere', 
        password: 'bere2025', 
        role: 'bere', 
        email: 'bere@agencia.com',
        color: '#8B5CF6', // violet-500
        accessSections: { nosotros: true, introduccion: true, pendientes: true, accesos: true, calendario: true, miProgreso: true, clientes: false, configuracion: true },
        permissions: {
            calendario: { cambiarFechas: true, cambiarFechasSoloAsignados: true, verCalendarioTodos: true },
            pendientes: { moverPendientes: true, reasignarResponsables: false }
        },
        progressConfig: {}
    },
    { 
        id: 'kari-01', 
        name: 'Kari', 
        username: 'kari', 
        password: 'kari2025', 
        role: 'team_member', 
        email: 'kari@agencia.com',
        color: '#F97316', // orange-500
        accessSections: { pendientes: true, calendario: true, configuracion: true },
        permissions: {},
        progressConfig: {}
    },
    { 
        id: 'aldair-01', 
        name: 'Aldair', 
        username: 'aldair', 
        password: 'aldair2025', 
        role: 'team_member', 
        email: 'aldair@agencia.com',
        color: '#14B8A6', // teal-500
        accessSections: { pendientes: true, calendario: true, configuracion: true },
        permissions: {},
        progressConfig: {}
    },
    { 
        id: 'pedro-01', 
        name: 'Pedro', 
        username: 'pedro', 
        password: 'pedro2025', 
        role: 'team_member', 
        email: 'pedro@agencia.com',
        color: '#65A30D', // lime-600
        accessSections: { pendientes: true, calendario: true, configuracion: true },
        permissions: {},
        progressConfig: {}
    }
];
