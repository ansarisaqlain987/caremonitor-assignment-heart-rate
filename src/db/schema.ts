import { pgTable, varchar, timestamp, boolean, numeric, index, uniqueIndex, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import z from 'zod'

export const patients = pgTable('patients', {
    patientId: varchar('patient_id').primaryKey(),
    orgId: varchar('org_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    fromHealthkitSync: boolean('from_healthkit_sync').default(false)
});

export const measurementTypes = pgTable('measurement_types', {
    tag: varchar('tag', { length: 25 }).primaryKey(),
    name: varchar('name', { length: 50 }).notNull(),
    uom: varchar('uom', { length: 20 })
}, (table) => {
    return {
        nameUnique: uniqueIndex('measurement_types_name_unique').on(table.name)
    };
});

export const measurements = pgTable('measurements', {
    patientId: varchar('patient_id').references(() => patients.patientId),
    measurementTag: varchar('measurement_tag').references(() => measurementTypes.tag),
    measurementValue: numeric('measurement_value'),
    measuredAt: timestamp('measured_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.patientId, table.measurementTag, table.measuredAt] }),
        measuredAtIdx: index('idx_measurements_measured_at').on(table.measuredAt)
    };
});

const MeasurementInsert = createInsertSchema(measurements)
export type MeasurementsInsertType = z.infer<typeof MeasurementInsert>
