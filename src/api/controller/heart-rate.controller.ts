import { Request, Response } from "express";
import { insertDataInDB, processData } from "../services/heart-rate.service";
import { HeartRateAggregatedOutput, RequestBodyType } from "../../types";
import logger from "../../common/logger";

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
    try {
        await insertDataInDB(body);
        logger.info('Inserted')
    } catch (err) {
        logger.error('Error while insertion');
    }
    return response
}