import config from './config';
import express, { NextFunction, Request, request, Response } from 'express';
import logger from './util/logger';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import requestLogger from './middleware/requestLogger';
import routes from './routes';
import { ApiException } from './util/exceptions/ApiException';

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
  if(err instanceof ApiException){
    const apiErr = err as ApiException;
    logger.error("API Exception of status %d: %s",apiErr.status, err.message);
    res.status(apiErr.status).json({message: apiErr.message});
  }
  else{
    logger.error("Unhandled Exception: %s", err.message);
    res.status(500).json({message: 'Internal Server Error'});
  }
})

app.listen(config.port, config.host, () => {
  logger.info('Server is running on http://' + config.host + ':' + config.port);
});