-- 0004_leads_consolidate_assignment.sql
--
-- `leads` tenía DOS columnas de asignación: `assigned_to` (con índice, escrita
-- por PATCH /api/leads/[id]) y `owner_email` (sin índice, jamás escrita).
-- Las 4 islas del admin leían `owner_email` y escribían `assigned_to`, así que
-- la función "asignar lead" era invisible: el admin confirmaba el toast y
-- ningún lead mostraba responsable. Los CSV exportaban el header
-- `assigned_to` con el valor de `owner_email`, o sea columna vacía.
--
-- `assigned_to` es la canónica: es la que se escribe, la que tiene índice, y
-- es el mismo nombre que usa la tabla `denuncias`.
--
-- Primero se conserva cualquier valor histórico de `owner_email`, después se
-- elimina la columna para que la próxima lectura no pueda volver a dudar.

UPDATE leads
   SET assigned_to = owner_email
 WHERE assigned_to IS NULL
   AND owner_email IS NOT NULL
   AND TRIM(owner_email) <> '';

-- La columna ya no tiene lectores ni escritores en el código.
ALTER TABLE leads DROP COLUMN owner_email;
