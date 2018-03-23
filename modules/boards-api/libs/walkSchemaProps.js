const { forEach } = require('lodash');

function walkSchemaProps(schema, handler, acc = {}, path = '', level = 0) {
    handler(acc, schema, path, level);
    if (schema.type === 'object' || schema.properties) {
        forEach(schema.properties, (s, k) => {
            walkSchemaProps(s, handler, acc, path ? `${path}.${k}` : k, level + 1);
        });
    }
    if (schema.type === 'array' || schema.items) {
        walkSchemaProps(schema.items, handler, acc, `${path}.`, level + 1);
    }
    return acc;
}

module.exports = walkSchemaProps;
