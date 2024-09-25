import { pgTable, uuid, varchar, timestamp, boolean, serial, integer, numeric, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const patients = pgTable('patients', {
  patientId: uuid('patient_id').primaryKey(),
  orgId: uuid('org_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  fromHealthkitSync: boolean('from_healthkit_sync').default(false)
});

export const measurementTypes = pgTable('measurement_types', {
  measurementTypeId: serial('measurement_type_id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  uom: varchar('uom', { length: 20 })
}, (table) => {
  return {
    nameUnique: uniqueIndex('measurement_types_name_unique').on(table.name)
  };
});

export const measurements = pgTable('measurements', {
  measurementId: serial('measurement_id').primaryKey(),
  patientId: uuid('patient_id').references(() => patients.patientId),
  measurementTypeId: integer('measurement_type_id').references(() => measurementTypes.measurementTypeId),
  measurementValue: numeric('measurement_value'),
  measuredAt: timestamp('measured_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
}, (table) => {
  return {
    measuredAtIdx: index('idx_measurements_measured_at').on(table.measuredAt)
  };
});

// Define the latest_measurements view
export const latestMeasurements = sql`
CREATE OR REPLACE VIEW latest_measurements AS
SELECT DISTINCT ON (patient_id, measurement_type_id)
    patient_id,
    measurement_type_id,
    measurement_value,
    measured_at
FROM ${measurements}
ORDER BY patient_id, measurement_type_id, measured_at DESC
`.as('latest_measurements');

// Define the insert_measurement function
export const insertMeasurementFunction = sql`
CREATE OR REPLACE FUNCTION insert_measurement(
    p_patient_id UUID,
    p_measurement_type VARCHAR(50),
    p_measurement_value NUMERIC,
    p_measured_at TIMESTAMP WITH TIME ZONE
)
RETURNS VOID AS $$
DECLARE
    v_measurement_type_id INT;
BEGIN
    -- Get the measurement type ID (or insert a new one if it doesn't exist)
    SELECT measurement_type_id INTO v_measurement_type_id
    FROM ${measurementTypes}
    WHERE name = p_measurement_type;
    
    IF v_measurement_type_id IS NULL THEN
        INSERT INTO ${measurementTypes} (name) VALUES (p_measurement_type)
        RETURNING measurement_type_id INTO v_measurement_type_id;
    END IF;
    
    -- Insert the new measurement
    INSERT INTO ${measurements} (patient_id, measurement_type_id, measurement_value, measured_at)
    VALUES (p_patient_id, v_measurement_type_id, p_measurement_value, p_measured_at);
END;
$$ LANGUAGE plpgsql;
`;