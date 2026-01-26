const logger = require('../utils/logger');

// Custom Error Class
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Global Error Handler
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        logger.error(`${err.statusCode} - ${err.message}`, { stack: err.stack });

        res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err
        });
    } else {
        // Production: Don't leak stack traces
        if (err.isOperational) {
            res.status(err.statusCode).json({
                success: false,
                status: err.status,
                message: err.message
            });
        } else {
            // Programming or other unknown error: don't leak details
            logger.error('CRITICAL ERROR 💥', err);
            res.status(500).json({
                success: false,
                status: 'error',
                message: 'Something went incredibly wrong!'
            });
        }
    }
};

module.exports = {
    AppError,
    errorHandler
};
