const pg = require('../../services/postgres');
const squel = require('../../libs/squel');
const { pick, mapKeys, snakeCase } = require('lodash');
const sampleData = require('./1520821386615-sample-cards.json');

const TABLE_NAME = 'cards';

module.exports.up = async () => {
    const values = sampleData
        .map(row => Object.assign(row, {
            listId: row.list.id,
        }))
        .map(row => pick(row, ['id', 'name', 'listId']))
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
