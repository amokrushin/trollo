const pg = require('../../services/postgres');
const squel = require('../../libs/squel');
const { pick, mapKeys, snakeCase } = require('lodash');
const sampleData = require('./1520821394483-sample-card-members.json');

const TABLE_NAME = 'card_members';

module.exports.up = async () => {
    const values = sampleData
        .map(row => Object.assign(row, {
            cardId: row.card.id,
            userId: row.user.id,
        }))
        .map(row => pick(row, ['id', 'cardId', 'userId']))
        .map(row => mapKeys(row, (v, k) => snakeCase(k)));

    const sql = squel.insert()
        .into(TABLE_NAME)
        .setFieldsRows(values);

    await pg.transaction((client) => client.squel(sql));
};

module.exports.down = async () => {
    const values = sampleData
        .map(row => row.id);

    const sql = squel.delete()
        .from(TABLE_NAME)
        .where('id IN ?', values);

    await pg.transaction((client) => client.squel(sql));
};
