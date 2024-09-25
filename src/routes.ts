import { Application, Router } from 'express';
import { getProcessedData } from './api/controller/heart-rate.controller';

const heartRateRouter = Router().post('/', getProcessedData)

export default function routes(app: Application): void {
  app.use('/api/v1/heart-rate', heartRateRouter);
}
