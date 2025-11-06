import { pgTable, serial, text, varchar, timestamp, boolean, integer, jsonb, real, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  representativeName: varchar('representative_name', { length: 255 }).notNull(),
  whatsapp: varchar('whatsapp', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }),
  managedAreas: jsonb('managed_areas').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const clientsRelations = relations(clients, ({ many }) => ({
	cuentasPorCobrar: many(cuentasPorCobrar),
}));

export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

export const pendientes = pgTable('pendientes', {
    id: serial('id').primaryKey(),
    cliente: varchar('cliente', { length: 255 }).notNull(),
    encargado: varchar('encargado', { length: 100 }).notNull(),
    ejecutor: varchar('ejecutor', { length: 100 }).notNull(),
    fechaCorte: integer('fecha_corte').notNull(),
    status: varchar('status', { length: 50 }).notNull(),
    pendientePrincipal: text('pendiente_principal').notNull(),
    categoria: varchar('categoria', { length: 50 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const pendientesRelations = relations(pendientes, ({ many, one }) => ({
	subTasks: many(subTasks),
    recordingEvent: one(recordingEvents, {
        fields: [pendientes.id],
        references: [recordingEvents.pendienteId],
    })
}));


export const subTasks = pgTable('sub_tasks', {
    id: serial('id').primaryKey(),
    text: text('text').notNull(),
    completed: boolean('completed').default(false).notNull(),
    pendienteId: integer('pendiente_id').references(() => pendientes.id),
});

export const subTasksRelations = relations(subTasks, ({ one }) => ({
	pendiente: one(pendientes, {
		fields: [subTasks.pendienteId],
		references: [pendientes.id],
	}),
}));

export const accesses = pgTable('accesses', {
    id: serial('id').primaryKey(),
    platform: varchar('platform', { length: 100 }).notNull(),
    client: varchar('client', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
});

export const cuentasPorCobrar = pgTable('cuentas_por_cobrar', {
    id: serial('id').primaryKey(),
    clienteId: integer('cliente_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
    clienteName: varchar('cliente_name', { length: 255 }).notNull(),
    periodo: varchar('periodo', { length: 100 }).notNull(),
    monto: real('monto').notNull(),
    tipo: varchar('tipo', { length: 50 }).notNull(),
});

export const cuentasPorCobrarRelations = relations(cuentasPorCobrar, ({ one }) => ({
	client: one(clients, {
		fields: [cuentasPorCobrar.clienteId],
		references: [clients.id],
	}),
}));


export type CuentaPorCobrar = typeof cuentasPorCobrar.$inferSelect;
export type NewCuentaPorCobrar = typeof cuentasPorCobrar.$inferInsert;

export const movimientosDiarios = pgTable('movimientos_diarios', {
    id: serial('id').primaryKey(),
    fecha: timestamp('fecha').defaultNow().notNull(),
    tipo: varchar('tipo', { length: 50 }).notNull(), // 'Ingreso' o 'Gasto'
    descripcion: text('descripcion').notNull(),
    monto: real('monto').notNull(),
    cuenta: varchar('cuenta', { length: 100 }).notNull(),
    detalleCuenta: varchar('detalle_cuenta', { length: 255 }),
    categoria: varchar('categoria', { length: 100 }),
    nombreOtro: varchar('nombre_otro', { length: 255 }),
});

export type MovimientoDiario = typeof movimientosDiarios.$inferSelect;
export type NewMovimientoDiario = typeof movimientosDiarios.$inferInsert;

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
    pendienteId: integer('pendiente_id').notNull().references(() => pendientes.id, { onDelete: 'cascade' }),
});

export const recordingEventsRelations = relations(recordingEvents, ({ one }) => ({
	pendiente: one(pendientes, {
		fields: [recordingEvents.pendienteId],
		references: [pendientes.id],
	}),
}));

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
  company: varchar('company', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  source: varchar('source', { length: 100 }).notNull(),
  data: jsonb('data'),
  createdAt: timestamp('created_at').defaultNow(),
});

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
});

export type Prospect = typeof prospects_maw.$inferSelect;
export type NewProspect = typeof prospects_maw.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

export type Pendiente = typeof pendientes.$inferSelect;
export type SubTask = typeof subTasks.$inferSelect;
export type RecordingEvent = typeof recordingEvents.$inferSelect;
export type NewRecordingEvent = typeof recordingEvents.$inferInsert;
