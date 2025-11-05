
export type Role = 'admin' | 'contabilidad' | 'ventas' | 'team_member' | 'julio' | 'alma' | 'fernando' | 'luis';

export type TeamMember = {
    id: string;
    name: string;
    username: string;
    password?: string;
    role: Role;
    email: string;
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
        accessSections: { nosotros: true, introduccion: true, pendientes: true, finanzas: true, ventas: true, accesos: true, calendario: true, miProgreso: true },
        permissions: {
            finanzas: { agregarPagos: true, agregarGastos: true, agregarCuentasPorCobrar: true },
            ventas: { agregarProspectosDirecto: true, cambiarStatusProspectos: true, cambiarStatusSoloAsignados: false, verTodosProspectos: true },
            accesos: { ajustarAccesos: true, agregarNuevosAccesos: true },
            calendario: { cambiarFechas: true, cambiarFechasSoloAsignados: false, verCalendarioTodos: true, modificarCalendarioTodos: true, asignarEquipos: true },
            pendientes: { moverPendientes: true, reasignarResponsables: true }
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
        accessSections: { nosotros: true, introduccion: true, pendientes: false, finanzas: true, ventas: false, accesos: false, calendario: false, miProgreso: false },
        permissions: {
            finanzas: { agregarPagos: true, agregarGastos: true, agregarCuentasPorCobrar: true }
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
        accessSections: { nosotros: false, introduccion: false, pendientes: false, finanzas: false, ventas: true, accesos: false, calendario: false, miProgreso: false },
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
        accessSections: { nosotros: true, introduccion: true, pendientes: true, finanzas: false, ventas: true, accesos: true, calendario: true, miProgreso: true },
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
        accessSections: { nosotros: true, introduccion: true, pendientes: false, finanzas: false, ventas: true, accesos: true, calendario: true, miProgreso: true },
        permissions: {
            ventas: { cambiarStatusProspectos: true, cambiarStatusSoloAsignados: true },
            accesos: { ajustarAccesos: true, agregarNuevosAccesos: true },
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
        accessSections: { nosotros: true, introduccion: true, pendientes: true, finanzas: false, ventas: true, accesos: true, calendario: true, miProgreso: true },
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
        accessSections: { nosotros: true, introduccion: true, pendientes: true, accesos: true, calendario: true, miProgreso: true },
        permissions: {
            calendario: { cambiarFechas: true, cambiarFechasSoloAsignados: true, verCalendarioTodos: true },
             pendientes: { moverPendientes: true, reasignarResponsables: false }
        },
        progressConfig: {}
    },
];
