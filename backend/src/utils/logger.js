const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // Write all errors to error.log
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        // Write all logs to combined.log
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// If we're in development, also log to the console with nice formatting
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

module.exports = logger;
