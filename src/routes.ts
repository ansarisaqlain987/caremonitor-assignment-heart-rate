import { Application, Router } from 'express';
import { getProcessedData, home } from './api/controller/heart-rate.controller';

const heartRateRouter = Router().post('/', getProcessedData).get('/', home)

export default function routes(app: Application): void {
  app.use('/api/v1/heart-rate', heartRateRouter);
}
