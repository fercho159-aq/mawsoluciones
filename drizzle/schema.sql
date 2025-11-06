CREATE TABLE IF NOT EXISTS "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"representative_name" varchar(255) NOT NULL,
	"whatsapp" varchar(50) NOT NULL,
	"email" varchar(255),
	"managed_areas" jsonb,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "prospects" (
	"id" serial PRIMARY KEY NOT NULL,
	"cliente" varchar(255) NOT NULL,
	"email" varchar(255),
	"telefono" varchar(50),
	"origen" varchar(50) NOT NULL,
	"status" varchar(50) NOT NULL,
	"responsable" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "pendientes" (
	"id" serial PRIMARY KEY NOT NULL,
	"cliente" varchar(255) NOT NULL,
	"encargado" varchar(100) NOT NULL,
	"ejecutor" varchar(100) NOT NULL,
	"fecha_corte" integer NOT NULL,
	"status" varchar(50) NOT NULL,
	"pendiente_principal" text NOT NULL,
	"categoria" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "sub_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"pendiente_id" integer
);

CREATE TABLE IF NOT EXISTS "accesses" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" varchar(100) NOT NULL,
	"client" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "sub_tasks" ADD CONSTRAINT "sub_tasks_pendiente_id_pendientes_id_fk" FOREIGN KEY ("pendiente_id") REFERENCES "public"."pendientes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
