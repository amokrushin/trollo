const timestampSchema = require('./partials/timestamp');
const { schemaUri, disallowAdditionalProperties } = require('../../libs/schemaUtils');

const schema = {
    title: 'Board',
    $id: schemaUri(__filename),
    type: 'object',
    properties: {
        id: {
            title: 'Identifier',
            type: 'string',
            format: 'uuid',
        },
        name: {
            title: 'Name',
            type: 'string',
        },
        organization: {
            title: 'Organization',
            $ref: schemaUri('organization'),
            reference: {
                type: 'belongsTo',
                model: 'Organization',
                ownKey: 'organizationId',
                foreignKey: 'id',
            },
        },
        lists: {
            title: 'Lists',
            type: 'array',
            items: {
                $ref: schemaUri('list'),
            },
            reference: {
                type: 'hasMany',
                model: 'List',
                ownKey: 'id',
                foreignKey: 'boardId',
            },
        },
        ...timestampSchema.properties,
    },
};

disallowAdditionalProperties(schema);

module.exports = schema;
