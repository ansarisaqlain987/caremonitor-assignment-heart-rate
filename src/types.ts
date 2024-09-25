export type HeartRateDataInput = {
    on_date: string, 
    measurement: string
}

export type HeartRateAggregatedOutput = { min: string, max: string, from_date: string, to_date: string }