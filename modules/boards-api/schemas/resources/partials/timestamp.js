const { schemaUri } = require('../../../libs/schemaUtils');

module.exports = {
    $id: schemaUri(__filename),
    type: 'object',
    properties: {
        createdAt: {
            type: 'string',
            title: 'Дата создания',
            readOnly: true,
            format: 'date-time',
            ui: {
                format: 'date-time',
            },
        },
        updatedAt: {
            type: 'string',
            title: 'Дата обновления',
            readOnly: true,
            format: 'date-time',
            ui: {
                format: 'date-time',
            },
        },
    },
};
