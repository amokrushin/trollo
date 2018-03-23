const Ajv = require('ajv');
const { pick } = require('lodash');

const ajvCache = new WeakMap();

const ajv = new Ajv({
    coerceTypes: true,
    useDefaults: true,
    cache: {
        put(key, value) {
            return ajvCache.set(key, value);
        },
        get(key) {
            return ajvCache.get(key);
        },
        del(key) {
            return ajvCache.delete(key);
        },
        clear() {},
    },
    serialize: false,
});

ajv.addFormat('function', () => {
    return true;
});

module.exports = function validate(schema, params) {
    if (typeof params === 'function') {
        // eslint-disable-next-line no-param-reassign
        params = pick(params, Object.keys(schema.properties));
    }
    if (!ajv.validate(schema, params)) {
        throw new Ajv.ValidationError(ajv.errors);
    }
};
