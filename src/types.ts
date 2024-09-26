import z from 'zod';
export type HeartRateDataInput = {
    on_date: string, 
    measurement: string
}

export type HeartRateAggregatedOutput = { min: string, max: string, from_date: string, to_date: string }

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

export type RequestBodyType = z.infer<typeof RequestBody>