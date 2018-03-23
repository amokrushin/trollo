const timestampSchema = require('./partials/timestamp');
const { schemaUri, disallowAdditionalProperties } = require('../../libs/schemaUtils');

const schema = {
    title: 'Card member',
    $id: schemaUri(__filename),
    type: 'object',
    properties: {
        id: {
            title: 'Identifier',
            type: 'string',
            format: 'uuid',
        },
        card: {
            title: 'Card',
            $ref: schemaUri('card'),
            reference: {
                type: 'belongsTo',
                model: 'Card',
                ownKey: 'cardId',
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
        ...timestampSchema.properties,
    },
};

disallowAdditionalProperties(schema);

module.exports = schema;
