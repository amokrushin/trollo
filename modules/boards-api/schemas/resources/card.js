const timestampSchema = require('./partials/timestamp');
const { schemaUri, disallowAdditionalProperties, Reference } = require('../../libs/schemaUtils');

const schema = {
    title: 'List',
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
        list: {
            title: 'List',
            $ref: schemaUri('list'),
            reference: {
                type: 'belongsTo',
                model: 'List',
                ownKey: 'listId',
                foreignKey: 'id',
            },
        },
        members: {
            title: 'Members',
            type: 'array',
            items: {
                $ref: schemaUri('card_member'),
            },
            reference: Reference.hasMany('CardMember', 'id', 'cardId'),
        },
        ...timestampSchema.properties,
    },
};

disallowAdditionalProperties(schema);

module.exports = schema;
