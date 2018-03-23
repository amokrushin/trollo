const path = require('path');
const { transform, forEach } = require('lodash');

const { FRONT_ORIGIN, SCHEMAS_BASE_URL } = process.env;

function filterProperties(schema, root = true) {
    const properties = transform(schema.properties, (acc, v, k) => {
        if (v.type === 'string') {
            acc[k] = {
                $ref: '#/definitions/stringProp',
            };
        }
        if (v.type === 'number') {
            acc[k] = {
                $ref: '#/definitions/numberProp',
            };
        }
        if (v.type === 'object' || v.properties) {
            if (v.reference) {
                acc[k] = {
                    type: 'object',
                };
            } else {
                acc[k] = filterProperties(v, false);
            }
        }
        if (v.type === 'array' || v.items) {
            if (v.reference) {
                acc[k] = {
                    type: 'object',
                };
            } else {
                acc[k] = {
                    oneOf: [
                        {
                            type: 'object',
                            properties: {
                                $anyOf: filterProperties(v.items, false),
                            },
                            additionalProperties: false,
                        },
                        {
                            type: 'object',
                            properties: {
                                $allOf: filterProperties(v.items, false),
                            },
                            additionalProperties: false,
                        },
                        {
                            type: 'object',
                            properties: {
                                $noneOf: filterProperties(v.items, false),
                            },
                            additionalProperties: false,
                        },
                    ],
                };
            }
        }
    }, {});

    if (root) {
        return {
            anyOf: [
                {
                    type: 'object',
                    properties,
                    additionalProperties: false,
                },
                {
                    type: 'object',
                    properties: {
                        $or: {
                            type: 'array',
                            items: {
                                properties,
                            },
                        },
                    },
                    additionalProperties: false,
                },
            ],
            default: {},
        };

    } else {
        return {
            type: 'object',
            properties,
            additionalProperties: false,
        };
    }
}

function sortProperties(schema, acc = [], path = '', root = true) {
    const properties = transform(schema.properties, (a, v, k) => {
        if (v.type === 'string' || v.type === 'number') {
            acc.push(path ? `+${path}.${k}` : `+${k}`);
            acc.push(path ? `-${path}.${k}` : `-${k}`);
        }
        if (v.type === 'object' || v.properties) {
            sortProperties(v, a, path ? `${path}.${k}` : k);
        }
    }, acc);

    if (root) {
        return {
            type: 'array',
            items: {
                type: 'string',
                enum: properties,
            },
            default: [],
        };
    } else {
        return {
            type: 'array',
            items: {
                type: 'string',
                enum: properties,
            },
        };
    }
}

function schemaUri(filename) {
    return `${FRONT_ORIGIN}${SCHEMAS_BASE_URL}/${path.parse(filename).name}.json`;
}

function schemaUriByName(name) {
    return `${FRONT_ORIGIN}${SCHEMAS_BASE_URL}/${name}.json`;
}

function filterDefinitions() {
    return {
        stringProp: {
            type: 'object',
            properties: {
                $eq: {
                    type: 'string',
                },
                $neq: {
                    type: 'string',
                },
                $gt: {
                    type: 'string',
                },
                $gte: {
                    type: 'string',
                },
                $lt: {
                    type: 'string',
                },
                $lte: {
                    type: 'string',
                },
                $like: {
                    type: 'string',
                },
                $in: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                },
                $nin: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                },
            },
            additionalProperties: false,
        },
        numberProp: {
            type: 'object',
            properties: {
                $eq: {
                    type: 'number',
                },
                $neq: {
                    type: 'number',
                },
                $gt: {
                    type: 'number',
                },
                $gte: {
                    type: 'number',
                },
                $lt: {
                    type: 'number',
                },
                $lte: {
                    type: 'number',
                },
                $in: {
                    type: 'array',
                    items: {
                        type: 'number',
                    },
                },
                $nin: {
                    type: 'array',
                    items: {
                        type: 'number',
                    },
                },
            },
            additionalProperties: false,
        },
    };
}

function disallowAdditionalProperties(prop) {
    if ((prop.type === 'object' || prop.properties) && !prop.reference) {
        forEach(prop.properties, disallowAdditionalProperties);
        prop.additionalProperties = false;
    }
}

class Reference {
    static belongsTo(model, ownKey, foreignKey) {
        return {
            type: 'belongsTo',
            model,
            ownKey,
            foreignKey,
        };
    }

    static hasMany(model, ownKey, foreignKey) {
        return {
            type: 'hasMany',
            model,
            ownKey,
            foreignKey,
        };
    }
}

module.exports = {
    filterProperties,
    sortProperties,
    schemaUri,
    schemaUriByName,
    filterDefinitions,
    disallowAdditionalProperties,
    Reference,
};
