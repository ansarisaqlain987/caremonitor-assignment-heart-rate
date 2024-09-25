import { Request, Response } from "express";
import { processData } from "../services/heart-rate.service";
import { HeartRateAggregatedOutput, HeartRateDataInput } from "../../types";

export const getProcessedData = (request: Request, response: Response): Response => {
    const body = request.body;
    const inputHeartData: HeartRateDataInput[] | undefined = body?.clinical_data?.HEART_RATE?.data;

    let data: HeartRateAggregatedOutput[] = []
    if (inputHeartData) {
        data = processData(inputHeartData, 15);
    }
    const resp = {
        clinical_data: {
            ...body.clinical_data,
            HEART_RATE: {
                ...(body?.clinical_data?.HEART_RATE ?? {}),
                "aggregatedData": data
            },
        }
    }
    return response.json(resp)
}