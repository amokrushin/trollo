const timestampSchema = require('./partials/timestamp');
const { schemaUri, disallowAdditionalProperties } = require('../../libs/schemaUtils');

const schema = {
    title: 'Organization member',
    $id: schemaUri(__filename),
    type: 'object',
    properties: {
        id: {
            title: 'Identifier',
            type: 'string',
            format: 'uuid',
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
        user: {
            title: 'User',
            type: 'object',
            reference: {
                type: 'belongsTo',
                ownKey: 'userId',
                foreignKey: 'id',
                virtual: true,
            },
        },
        role: {
            title: 'Role',
            type: 'string',
        },
        ...timestampSchema.properties,
    },
};

disallowAdditionalProperties(schema);

module.exports = schema;
