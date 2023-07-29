import winston from 'winston'

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console({ level: 'debug' }),
    new winston.transports.File({ filename: 'info.log', dirname: 'logs', level: 'info' }),
    new winston.transports.File({ filename: 'error.log', dirname: 'logs', level: 'error' }),
  ],
})
