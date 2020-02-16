const { error } = require('../helpers/response');

module.exports = (err, req, res, next) => {
    if (typeof (err) === 'object' || typeof (err.message) === 'string') {
        const statusCode = err.statusCode || 500;
        const message = err.message || err;

        return error(res, message, statusCode);
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return error(res, err.message, 400);
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return error(res, 'Invalid Token', 401);
    }

    // default to 500 server error
    return error(res, err.message, 500);
};
