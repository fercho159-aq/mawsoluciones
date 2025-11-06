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

export type Client = typeof clients.$inferSelect;

export const prospects = pgTable('prospects', {
  id: serial('id').primaryKey(),
  cliente: varchar('cliente', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  telefono: varchar('telefono', { length: 50 }),
  origen: varchar('origen', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
  responsable: varchar('responsable', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

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

export const pendientesRelations = relations(pendientes, ({ many }) => ({
	subTasks: many(subTasks),
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
    clienteId: integer('cliente_id').references(() => clients.id).notNull(),
    clienteName: varchar('cliente_name', { length: 255 }).notNull(),
    periodo: varchar('periodo', { length: 100 }).notNull(),
    monto: real('monto').notNull(),
    tipo: varchar('tipo', { length: 50 }).notNull(),
});

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

export type Pendiente = typeof pendientes.$inferSelect;
export type SubTask = typeof subTasks.$inferSelect;