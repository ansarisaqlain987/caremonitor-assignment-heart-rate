import { HeartRateAggregatedOutput, HeartRateDataInput, RequestBodyType } from "../../types";
import { db } from "../../db";
import { measurements, MeasurementsInsertType, measurementTypes, patients } from "../../db/schema";
import { eq, sql } from "drizzle-orm";

import logger from "../../common/logger";

const getMinOfTwoDate = (date1: string, date2: string) => {
    return new Date(Math.min((new Date(date1)).getTime(), (new Date(date2)).getTime())).toISOString();
}

const getMaxOfTwoDate = (date1: string, date2: string) => {
    return new Date(Math.max((new Date(date1)).getTime(), (new Date(date2)).getTime())).toISOString();
}

export const processData = (data: HeartRateDataInput[], intervalDuration: number) => {
    const groupedData: Record<string, HeartRateAggregatedOutput> = {};
    for (const item of data) {
        const date = new Date(item.on_date);
        const roundedMinutes = Math.floor(date.getMinutes() / intervalDuration) * intervalDuration;
        date.setMinutes(roundedMinutes, 0, 0);
        const key = date.toISOString();

        if (!groupedData[key]) {
            groupedData[key] = {
                from_date: item.on_date,
                to_date: item.on_date,
                min: item.measurement,
                max: item.measurement
            };
        } else {
            groupedData[key] = {
                from_date: getMinOfTwoDate(groupedData[key].from_date, item.on_date),
                to_date: getMaxOfTwoDate(groupedData[key].from_date, item.on_date),
                min: Math.min(Number(groupedData[key].min), Number(item.measurement)).toString(),
                max: Math.max(Number(groupedData[key].max), Number(item.measurement)).toString()
            }
        }
    }
    return Object.values(groupedData);
}


export async function batchUpsertMeasurements(measurementsData: MeasurementsInsertType) {
    try {
        await db
            .insert(measurements)
            .values(measurementsData)
            .onConflictDoUpdate({
                target: [measurements.patientId, measurements.measurementTag, measurements.measuredAt], // Define the unique constraint/keys to check conflict on
                set: {
                    measurementValue: sql`EXCLUDED.measurement_value`,
                },
            });
        logger.info('Batch upsert completed successfully!');
    } catch (error) {
        logger.error('Error performing batch upsert:', error);
    }
}

const selectOrInsertMeasurementTypes = async (tag: string, name: string, uom: string) => {
    const mes = await db.select().from(measurementTypes).where(eq(measurementTypes.tag, tag));
    if (mes.length == 0) {
        await db.insert(measurementTypes).values({
            tag,
            name,
            uom
        })
    } else {
        await db.update(measurementTypes).set({ name, uom }).where(eq(measurementTypes.tag, tag))
    }
}

export const insertDataInDB = async (data: RequestBodyType): Promise<void> => {
    const clinicalData = data?.clinical_data;
    const patientId = data?.patient_id;
    const fromHealthkitSync = data?.from_healthkit_sync;
    const orgId = data?.orgId;

    const patient = await db.select().from(patients).where(eq(patients.patientId, patientId));
    if (patient.length == 0) {
        await db.insert(patients).values({ patientId, orgId, fromHealthkitSync })
    }

    for (const mtype in clinicalData) {
        const t_data = clinicalData[mtype];
        await selectOrInsertMeasurementTypes(mtype, t_data.name, t_data.uom)
        if (t_data.data && t_data.data?.length > 0) {
            const insertData = t_data.data.map((dt) => {
                return {
                    patientId,
                    measurementTag: mtype,
                    measurementValue: dt.measurement,
                    measuredAt: new Date(dt.on_date)
                }
            });
            await batchUpsertMeasurements(insertData as MeasurementsInsertType)
        }
    }

}