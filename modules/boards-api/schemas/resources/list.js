const timestampSchema = require('./partials/timestamp');
const { schemaUri, disallowAdditionalProperties, Reference } = require('../../libs/schemaUtils');

const schema = {
    title: 'Card',
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
        board: {
            title: 'Board',
            $ref: schemaUri('board'),
            reference: Reference.belongsTo('Board', 'boardId', 'id'),
        },
        cards: {
            title: 'Cards',
            type: 'array',
            items: {
                $ref: schemaUri('card'),
            },
            reference: Reference.hasMany('Card', 'id', 'listId'),
        },
        ...timestampSchema.properties,
    },
};

disallowAdditionalProperties(schema);

module.exports = schema;
