const jwt = require('jsonwebtoken');
const User = require('../models/user');

const unknownEndpoint = (require, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'invalid token' });
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({ error: 'token expired' });
    }
    next(error);
};

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization');
    if (
        authorization &&
        authorization.toLowerCase().startsWith('bearer ')
    ) {
        request.token = authorization.substring(7);
    }
    next();
};

const userExtractor = async (request, response, next) => {
    console.log(request.token);
    if (request.token !== undefined) {
        const decodedToken = jwt.verify(request.token, process.env.SECRET);

        if (!request.token || !decodedToken.id) {
            return response
                .status(401)
                .json({ error: 'token missing or invalid' });
        }
        request.user = await User.findById(decodedToken.id);
    }
    next();
};

module.exports = {
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor,
};
