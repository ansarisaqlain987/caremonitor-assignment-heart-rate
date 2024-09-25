import express, { Application } from 'express';
import path from 'path';
import http from 'http';
import os from 'os';
import l from './logger';
import errorHandler from '../api/middlewares/error.handler';

const app = express();

export default class ExpressServer {
    private routes!: ((app: Application) => void);
    constructor() {
        const root = path.normalize(__dirname + '/../..');
        app.use(express.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
        app.use(
            express.urlencoded({
                extended: true,
                limit: process.env.REQUEST_LIMIT || '100kb',
            })
        );
        app.use(express.text({ limit: process.env.REQUEST_LIMIT || '100kb' }));
        app.use(express.static(`${root}/public`));
    }

    router(routes: (app: Application) => void): ExpressServer {
        this.routes = routes;
        return this;
    }

    listen(port: number): Application {
        const welcome = (p: number) => (): void =>
            l.info(
                `up and running in ${process.env.NODE_ENV || 'development'
                } @: ${os.hostname()} on port: ${p}}`
            );

        this.routes(app);
        app.use(errorHandler)
        http.createServer(app).listen(port, welcome(port));
        return app;
    }
}
