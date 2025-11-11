

import { pgTable, serial, text, varchar, timestamp, boolean, integer, jsonb, real } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- TABLAS PRINCIPALES ---

// Tabla de Colaboradores (Usuarios del sistema)
export const colaboradores = pgTable('colaboradores', {
  id: varchar('id', { length: 50 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  role: varchar('role', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  color: varchar('color', { length: 50 }),
  birthday: text('birthday'),
  phone: varchar('phone', { length: 50 }),
  avatarUrl: text('avatar_url'),
  accessSections: jsonb('access_sections'),
  permissions: jsonb('permissions'),
  progressConfig: jsonb('progress_config'),
});

// Tabla de Clientes Activos
export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  representativeName: varchar('representative_name', { length: 255 }).notNull(),
  whatsapp: varchar('whatsapp', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }),
  managedAreas: jsonb('managed_areas').$type<string[]>(),
  instagramUrl: text('instagram_url'),
  facebookUrl: text('facebook_url'),
  tiktokUrl: text('tiktok_url'),
  instagramFollowers: integer('instagram_followers'),
  facebookFollowers: integer('facebook_followers'),
  tiktokFollowers: integer('tiktok_followers'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Tabla de Prospectos (Pipeline de Ventas)
export const prospects_maw = pgTable('prospects_maw', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }),
    company: varchar('company', { length: 255 }),
    phone: varchar('phone', { length: 50 }),
    email: varchar('email', { length: 255 }),
    source: varchar('source', { length: 100 }).notNull(),
    status: varchar('status', { length: 50 }),
    responsable: varchar('responsable', { length: 100 }),
    createdAt: timestamp('created_at').defaultNow(),
    data: jsonb('data'),
});


// --- TABLAS RELACIONADAS ---

// Perfil financiero de cada cliente
export const clientFinancialProfiles = pgTable('client_financial_profiles', {
    id: serial('id').primaryKey(),
    clientId: integer('client_id').notNull().unique().references(() => clients.id, { onDelete: 'cascade' }),
    billingDay: integer('billing_day').default(15),
    defaultInvoice: boolean('default_invoice').default(false),
});

// Tareas o "Pendientes" asignados a cada cliente
export const pendientes_maw = pgTable('pendientes_maw', {
    id: serial('id').primaryKey(),
    clientId: integer('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
    clienteName: varchar('cliente_name', { length: 255 }).notNull(),
    encargado: varchar('encargado', { length: 100 }).notNull(),
    ejecutor: varchar('ejecutor', { length: 100 }).notNull(),
    categoria: varchar('categoria', { length: 50 }).notNull(),
    pendientePrincipal: text('pendiente_principal').notNull(),
    status: varchar('status', { length: 50 }).notNull().default('Trabajando'),
    completed: boolean('completed').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    publicacionesAlMes: integer('publicaciones_al_mes'),
    publicacionesALaSemana: integer('publicaciones_a_la_semana'),
});

// Eventos de grabación asociados a un pendiente
export const recordingEvents = pgTable('recording_events', {
    id: serial('id').primaryKey(),
    clientName: varchar('client_name', { length: 255 }).notNull(),
    assignedTo: varchar('assigned_to', { length: 100 }).notNull(),
    assignedToName: varchar('assigned_to_name', { length: 100 }).notNull(),
    fullStart: timestamp('full_start').notNull(),
    fullEnd: timestamp('full_end').notNull(),
    location: varchar('location', { length: 255 }),
    locationType: varchar('location_type', { length: 50 }),
    project: text('project'),
    assignedEquipment: jsonb('assigned_equipment').$type<string[]>(),
    equipmentNames: jsonb('equipment_names').$type<string[]>(),
    pendienteId: integer('pendiente_id').unique().references(() => pendientes_maw.id, { onDelete: 'cascade' }),
});

// Cuentas por cobrar de cada cliente
export const cuentasPorCobrar = pgTable('cuentas_por_cobrar', {
    id: serial('id').primaryKey(),
    clienteId: integer('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
    clienteName: varchar('cliente_name', { length: 255 }).notNull(),
    periodo: varchar('periodo', { length: 100 }).notNull(),
    monto: real('monto').notNull(),
    tipo: varchar('tipo', { length: 50 }).notNull(), // Ej: Iguala, Proyecto, Web
});

// Movimientos financieros diarios (ingresos y gastos)
export const movimientosDiarios = pgTable('movimientos_diarios', {
    id: serial('id').primaryKey(),
    fecha: timestamp('fecha').defaultNow().notNull(),
    tipo: varchar('tipo', { length: 50 }).notNull(), // "Ingreso" o "Gasto"
    descripcion: text('descripcion').notNull(),
    monto: real('monto').notNull(),
    cuenta: varchar('cuenta', { length: 100 }).notNull(), // Banco o cuenta de origen/destino
    detalleCuenta: varchar('detalle_cuenta', { length: 255 }),
    categoria: varchar('categoria', { length: 100 }),
    nombreOtro: varchar('nombre_otro', { length: 255 }),
    cpcId: integer('cpc_id').references(() => cuentasPorCobrar.id, { onDelete: 'set null' }),
});

// Credenciales de acceso para plataformas de clientes
export const accesses = pgTable('accesses', {
    id: serial('id').primaryKey(),
    platform: varchar('platform', { length: 100 }).notNull(),
    client: varchar('client', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
});


// --- RELACIONES ---

export const clientsRelations = relations(clients, ({ one, many }) => ({
	cuentasPorCobrar: many(cuentasPorCobrar),
    pendientes: many(pendientes_maw),
    financialProfile: one(clientFinancialProfiles, {
        fields: [clients.id],
        references: [clientFinancialProfiles.clientId],
    })
}));

export const clientFinancialProfilesRelations = relations(clientFinancialProfiles, ({ one }) => ({
    client: one(clients, {
        fields: [clientFinancialProfiles.clientId],
        references: [clients.id],
    })
}));

export const pendientesMawRelations = relations(pendientes_maw, ({ one }) => ({
    client: one(clients, {
        fields: [pendientes_maw.clientId],
        references: [clients.id],
    }),
    recordingEvent: one(recordingEvents, {
        fields: [pendientes_maw.id],
        references: [recordingEvents.pendienteId],
    })
}));

export const cuentasPorCobrarRelations = relations(cuentasPorCobrar, ({ one, many }) => ({
	client: one(clients, {
		fields: [cuentasPorCobrar.clienteId],
		references: [clients.id],
	}),
    movimientos: many(movimientosDiarios)
}));

export const movimientosDiariosRelations = relations(movimientosDiarios, ({ one }) => ({
    cuentaPorCobrar: one(cuentasPorCobrar, {
        fields: [movimientosDiarios.cpcId],
        references: [cuentasPorCobrar.id]
    })
}));

export const recordingEventsRelations = relations(recordingEvents, ({ one }) => ({
	pendiente: one(pendientes_maw, {
		fields: [recordingEvents.pendienteId],
		references: [pendientes_maw.id],
	}),
}));


// --- TIPOS INFERIDOS ---

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;
export type ClientFinancialProfile = typeof clientFinancialProfiles.$inferSelect;
export type NewClientFinancialProfile = typeof clientFinancialProfiles.$inferInsert;
export type PendienteMaw = typeof pendientes_maw.$inferSelect;
export type NewPendienteMaw = typeof pendientes_maw.$inferInsert;
export type RecordingEvent = typeof recordingEvents.$inferSelect;
export type NewRecordingEvent = typeof recordingEvents.$inferInsert;
export type CuentaPorCobrar = typeof cuentasPorCobrar.$inferSelect;
export type NewCuentaPorCobrar = typeof cuentasPorCobrar.$inferInsert;
export type MovimientoDiario = typeof movimientosDiarios.$inferSelect;
export type NewMovimientoDiario = typeof movimientosDiarios.$inferInsert;
export type Prospect = typeof prospects_maw.$inferSelect;
export type NewProspect = typeof prospects_maw.$inferInsert;
export type Colaborador = typeof colaboradores.$inferSelect;
export type NewColaborador = typeof colaboradores.$inferInsert;
export type Access = typeof accesses.$inferSelect;
export type NewAccess = typeof accesses.$inferInsert;


