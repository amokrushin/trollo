const timestampSchema = require('./partials/timestamp');
const { schemaUri, disallowAdditionalProperties } = require('../../libs/schemaUtils');

const schema = {
    title: 'Organization',
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
        members: {
            title: 'Members',
            type: 'array',
            items: {
                $ref: schemaUri('organization_member'),
            },
            reference: {
                type: 'hasMany',
                model: 'OrganizationMember',
                ownKey: 'id',
                foreignKey: 'organizationId',
            },
        },
        boards: {
            title: 'Boards',
            type: 'array',
            items: {
                $ref: schemaUri('board'),
            },
            reference: {
                type: 'hasMany',
                model: 'Board',
                ownKey: 'id',
                foreignKey: 'organizationId',
            },
        },
        ...timestampSchema.properties,
    },
};

disallowAdditionalProperties(schema);

module.exports = schema;
