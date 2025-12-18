import config from './config';
import express, { NextFunction, Request, Response } from 'express';
import logger from './util/logger';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import requestLogger from './middleware/requestLogger';
import routes from './routes';
import { HttpException } from './util/exceptions/http/HException';

const app = express();

//config helmet
app.use(helmet());

//config body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//config cors
app.use(cors());

//add middlewares
app.use(requestLogger);

//add routes
app.use('/', routes);

//config 404 handler
app.use((req, res )=>{
  res.status(404).json({error: 'Not Found'});
})

// config Error Handler
app.use((err:Error, req: Request, res: Response, next: NextFunction) => {
  if(err instanceof HttpException){
    const HttpException = err as HttpException;
    logger.error(" %s [%d] \"%s\" %o ",HttpException.name, HttpException.status, HttpException.message, HttpException.details || {});
    res.status(HttpException.status).json({
      message: HttpException.message,
      details: HttpException.details || {}
    });
  }
  else{
    logger.error("Unhandled Exception: %s", err.message);
    res.status(500).json({message: 'Internal Server Error'});
  }
})

app.listen(config.port, config.host, () => {
  logger.info('Server is running on http://' + config.host + ':' + config.port);
});