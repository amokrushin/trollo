const Boom = require('boom');
const { pick } = require('lodash');

function postrgerError(err) {
    console.log('postrgerError', err);
    if (/invalid input syntax/.test(err.message)) {
        return Boom.badRequest(err.message);
    }
    if (err.code === '23505') {
        return Boom.conflict(err.detail);
    }
    return Boom.badRequest(err.message);
}

module.exports = () => {
    return [
        (req, res, next) => {
            next(Boom.notFound());
        },
        (err, req, res, next) => {
            if (err.severity) {
                err = postrgerError(err);
            }

            if (err.isBoom) {
                res.status(err.output.statusCode || 500);
                res.json({
                    error: {
                        code: err.output.statusCode,
                        message: err.output.payload.message,
                    },
                });
            } else {
                console.error(err);
                res.status(err.statusCode || 500);
                res.json({
                    error: pick(err, ['code', 'message', 'statusCode', 'stack']),
                });
            }
        },
    ];
};
