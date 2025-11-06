import { pgTable, serial, text, varchar, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  representativeName: varchar('representative_name', { length: 255 }).notNull(),
  whatsapp: varchar('whatsapp', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }),
  managedAreas: jsonb('managed_areas').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow(),
});

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

export const subTasks = pgTable('sub_tasks', {
    id: serial('id').primaryKey(),
    text: text('text').notNull(),
    completed: boolean('completed').default(false).notNull(),
    pendienteId: integer('pendiente_id').references(() => pendientes.id),
});

export const accesses = pgTable('accesses', {
    id: serial('id').primaryKey(),
    platform: varchar('platform', { length: 100 }).notNull(),
    client: varchar('client', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
});
