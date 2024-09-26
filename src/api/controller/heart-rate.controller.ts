import { Request, Response } from "express";
import { processData } from "../services/heart-rate.service";
import { HeartRateAggregatedOutput } from "../../types";
import { db } from "../../db";
import { measurements, MeasurementsInsertType, measurementTypes, patients } from "../../db/schema";
import { eq, sql } from "drizzle-orm";
import z from 'zod';
import logger from "../../common/logger";

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

const ClinicalData = z.record(z.string(), z.object({
    name: z.string(),
    uom: z.string(),
    data: z.array(z.object({
        on_date: z.string(),
        measurement: z.string(),
    })).optional()
}))

const RequestBody = z.object({
    clinical_data: ClinicalData,
    patient_id: z.string(),
    from_healthkit_sync: z.boolean(),
    orgId: z.string(),
})

type RequestBodyType = z.infer<typeof RequestBody>

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

const insertDataInDB = async (data: RequestBodyType): Promise<void> => {
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

export const getProcessedData = async (request: Request, response: Response): Promise<Response> => {
    const body: RequestBodyType = request.body;
    const inputHeartData = body?.clinical_data?.HEART_RATE?.data;

    
    let data: HeartRateAggregatedOutput[] = []
    if (inputHeartData) {
        data = processData(inputHeartData, 15);
    }
    const resp = {
        ...body,
        clinical_data: {
            ...body.clinical_data,
            HEART_RATE: {
                ...(body?.clinical_data?.HEART_RATE ?? {}),
                "aggregatedData": data
            },
        }
    }
    response.json(resp);
    await insertDataInDB(body);
    return response
}