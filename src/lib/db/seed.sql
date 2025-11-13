-- Este script puebla la tabla como_voy_en_mis_finanzas con los datos históricos de 2024.
-- Puedes ejecutar este archivo en tu cliente de base de datos (ej. pgAdmin, DBeaver, Neon Console)
-- para insertar todos los registros.

-- Limpiar datos existentes para evitar duplicados si se ejecuta varias veces.
DELETE FROM como_voy_en_mis_finanzas WHERE EXTRACT(YEAR FROM fecha) = 2024;

-- Insertar datos de Enero 2024
INSERT INTO como_voy_en_mis_finanzas (fecha, tipo, descripcion, monto, cuenta, categoria) VALUES
('2024-01-15', 'INGRESO', 'AGENCIA - Enero 2024', 95360.00, 'Efectivo', 'AGENCIA'),
('2024-01-15', 'INGRESO', 'OSCAR - Enero 2024', 11880.00, 'Efectivo', 'OSCAR'),
('2024-01-15', 'INGRESO', 'TRANSPORTE - Enero 2024', 29000.00, 'Efectivo', 'TRANSPORTE'),
('2024-01-15', 'INGRESO', 'Ganancia - Enero 2024', 123434.68, 'Efectivo', 'Ganancia');

-- Insertar datos de Febrero 2024
INSERT INTO como_voy_en_mis_finanzas (fecha, tipo, descripcion, monto, cuenta, categoria) VALUES
('2024-02-15', 'INGRESO', 'AGENCIA - Febrero 2024', 186937.00, 'Efectivo', 'AGENCIA'),
('2024-02-15', 'INGRESO', 'OSCAR - Febrero 2024', 5148.00, 'Efectivo', 'OSCAR'),
('2024-02-15', 'INGRESO', 'TRANSPORTE - Febrero 2024', 10381.00, 'Efectivo', 'TRANSPORTE'),
('2024-02-15', 'INGRESO', 'RENTAS - Febrero 2024', 10390.00, 'Efectivo', 'RENTAS'),
('2024-02-15', 'INGRESO', 'Ganancia - Febrero 2024', 212856.00, 'Efectivo', 'Ganancia');

-- Insertar datos de Marzo 2024
INSERT INTO como_voy_en_mis_finanzas (fecha, tipo, descripcion, monto, cuenta, categoria) VALUES
('2024-03-15', 'INGRESO', 'AGENCIA - Marzo 2024', 111299.00, 'Efectivo', 'AGENCIA'),
('2024-03-15', 'INGRESO', 'OSCAR - Marzo 2024', 2024.00, 'Efectivo', 'OSCAR'),
('2024-03-15', 'INGRESO', 'TRANSPORTE - Marzo 2024', 8907.00, 'Efectivo', 'TRANSPORTE'),
('2024-03-15', 'INGRESO', 'RENTAS - Marzo 2024', 1713.00, 'Efectivo', 'RENTAS'),
('2024-03-15', 'INGRESO', 'Ganancia - Marzo 2024', 123943.00, 'Efectivo', 'Ganancia');

-- Insertar datos de Abril 2024
INSERT INTO como_voy_en_mis_finanzas (fecha, tipo, descripcion, monto, cuenta, categoria) VALUES
('2024-04-15', 'INGRESO', 'AGENCIA - Abril 2024', 142469.00, 'Efectivo', 'AGENCIA'),
('2024-04-15', 'INGRESO', 'OSCAR - Abril 2024', 6100.00, 'Efectivo', 'OSCAR'),
('2024-04-15', 'INGRESO', 'TRANSPORTE - Abril 2024', 3645.00, 'Efectivo', 'TRANSPORTE'),
('2024-04-15', 'INGRESO', 'RENTAS - Abril 2024', 3989.00, 'Efectivo', 'RENTAS'),
('2024-04-15', 'INGRESO', 'Ganancia - Abril 2024', 156203.00, 'Efectivo', 'Ganancia');

-- Insertar datos de Mayo 2024
INSERT INTO como_voy_en_mis_finanzas (fecha, tipo, descripcion, monto, cuenta, categoria) VALUES
('2024-05-15', 'INGRESO', 'AGENCIA - Mayo 2024', 109715.00, 'Efectivo', 'AGENCIA'),
('2024-05-15', 'INGRESO', 'OSCAR - Mayo 2024', 3960.00, 'Efectivo', 'OSCAR'),
('2024-05-15', 'INGRESO', 'TRANSPORTE - Mayo 2024', 11520.00, 'Efectivo', 'TRANSPORTE'),
('2024-05-15', 'INGRESO', 'RENTAS - Mayo 2024', 5159.00, 'Efectivo', 'RENTAS'),
('2024-05-15', 'INGRESO', 'Ganancia - Mayo 2024', 130354.00, 'Efectivo', 'Ganancia');

-- Insertar datos de Junio 2024
INSERT INTO como_voy_en_mis_finanzas (fecha, tipo, descripcion, monto, cuenta, categoria) VALUES
('2024-06-15', 'INGRESO', 'AGENCIA - Junio 2024', 213108.00, 'Efectivo', 'AGENCIA'),
('2024-06-15', 'INGRESO', 'OSCAR - Junio 2024', 6500.00, 'Efectivo', 'OSCAR'),
('2024-06-15', 'INGRESO', 'TRANSPORTE - Junio 2024', 11498.00, 'Efectivo', 'TRANSPORTE'),
('2024-06-15', 'INGRESO', 'RENTAS - Junio 2024', 3884.00, 'Efectivo', 'RENTAS'),
('2024-06-15', 'INGRESO', 'INTERESES - Junio 2024', 53382.00, 'Efectivo', 'INTERESES'),
('2024-06-15', 'INGRESO', 'Ganancia - Junio 2024', 288372.00, 'Efectivo', 'Ganancia');

-- Insertar datos de Julio 2024
INSERT INTO como_voy_en_mis_finanzas (fecha, tipo, descripcion, monto, cuenta, categoria) VALUES
('2024-07-15', 'INGRESO', 'AGENCIA - Julio 2024', 212869.00, 'Efectivo', 'AGENCIA'),
('2024-07-15', 'GASTO', 'TRANSPORTE - Julio 2024', 4731.00, 'Efectivo', 'TRANSPORTE'),
('2024-07-15', 'INGRESO', 'RENTAS - Julio 2024', 5571.00, 'Efectivo', 'RENTAS'),
('2024-07-15', 'INGRESO', 'INTERESES - Julio 2024', 5806.00, 'Efectivo', 'INTERESES'),
('2024-07-15', 'INGRESO', 'Ganancia - Julio 2024', 219515.00, 'Efectivo', 'Ganancia');

-- Insertar datos de Agosto 2024
INSERT INTO como_voy_en_mis_finanzas (fecha, tipo, descripcion, monto, cuenta, categoria) VALUES
('2024-08-15', 'INGRESO', 'AGENCIA - Agosto 2024', 82242.00, 'Efectivo', 'AGENCIA'),
('2024-08-15', 'INGRESO', 'OSCAR - Agosto 2024', 2311.67, 'Efectivo', 'OSCAR'),
('2024-08-15', 'GASTO', 'TRANSPORTE - Agosto 2024', 164166.00, 'Efectivo', 'TRANSPORTE'),
('2024-08-15', 'INGRESO', 'RENTAS - Agosto 2024', 1610.00, 'Efectivo', 'RENTAS'),
('2024-08-15', 'GASTO', 'BIENES RAICES - Agosto 2024', 1154053.00, 'Efectivo', 'BIENES RAICES'),
('2024-08-15', 'INGRESO', 'INTERESES - Agosto 2024', 1800.00, 'Efectivo', 'INTERESES'),
('2024-08-15', 'INGRESO', 'Ganancia - Agosto 2024', 86462.67, 'Efectivo', 'Ganancia');

-- Insertar datos de Septiembre 2024
INSERT INTO como_voy_en_mis_finanzas (fecha, tipo, descripcion, monto, cuenta, categoria) VALUES
('2024-09-15', 'INGRESO', 'AGENCIA - Septiembre 2024', 178814.00, 'Efectivo', 'AGENCIA'),
('2024-09-15', 'INGRESO', 'TRANSPORTE - Septiembre 2024', 3755.00, 'Efectivo', 'TRANSPORTE'),
('2024-09-15', 'INGRESO', 'RENTAS - Septiembre 2024', 5267.00, 'Efectivo', 'RENTAS'),
('2024-09-15', 'GASTO', 'BIENES RAICES - Septiembre 2024', 843093.00, 'Efectivo', 'BIENES RAICES'),
('2024-09-15', 'GASTO', 'INTERESES - Septiembre 2024', 22092.00, 'Efectivo', 'INTERESES'),
('2024-09-15', 'INGRESO', 'Ganancia - Septiembre 2024', 149865.00, 'Efectivo', 'Ganancia');

-- Insertar datos de Octubre 2024
INSERT INTO como_voy_en_mis_finanzas (fecha, tipo, descripcion, monto, cuenta, categoria) VALUES
('2024-10-15', 'INGRESO', 'AGENCIA - Octubre 2024', 91700.00, 'Efectivo', 'AGENCIA'),
('2024-10-15', 'INGRESO', 'OSCAR - Octubre 2024', 5720.00, 'Efectivo', 'OSCAR'),
('2024-10-15', 'INGRESO', 'TRANSPORTE - Octubre 2024', 22208.00, 'Efectivo', 'TRANSPORTE'),
('2024-10-15', 'INGRESO', 'RENTAS - Octubre 2024', 5100.00, 'Efectivo', 'RENTAS'),
('2024-10-15', 'GASTO', 'BIENES RAICES - Octubre 2024', 6000.00, 'Efectivo', 'BIENES RAICES'),
('2024-10-15', 'INGRESO', 'INTERESES - Octubre 2024', 5740.00, 'Efectivo', 'INTERESES'),
('2024-10-15', 'INGRESO', 'Ganancia - Octubre 2024', 124468.00, 'Efectivo', 'Ganancia');

-- Insertar datos de Noviembre 2024
INSERT INTO como_voy_en_mis_finanzas (fecha, tipo, descripcion, monto, cuenta, categoria) VALUES
('2024-11-15', 'INGRESO', 'AGENCIA - Noviembre 2024', 18623.00, 'Efectivo', 'AGENCIA'),
('2024-11-15', 'INGRESO', 'TRANSPORTE - Noviembre 2024', 14129.00, 'Efectivo', 'TRANSPORTE'),
('2024-11-15', 'INGRESO', 'RENTAS - Noviembre 2024', 4729.00, 'Efectivo', 'RENTAS'),
('2024-11-15', 'INGRESO', 'BIENES RAICES - Noviembre 2024', 8726.00, 'Efectivo', 'BIENES RAICES'),
('2024-11-15', 'INGRESO', 'INTERESES - Noviembre 2024', 3573.00, 'Efectivo', 'INTERESES'),
('2024-11-15', 'INGRESO', 'Ganancia - Noviembre 2024', 49780.00, 'Efectivo', 'Ganancia');
