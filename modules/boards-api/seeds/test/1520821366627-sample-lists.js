const pg = require('../../services/postgres');
const squel = require('../../libs/squel');
const { pick, mapKeys, snakeCase } = require('lodash');
const sampleData = require('./1520821366627-sample-lists.json');

const TABLE_NAME = 'lists';

module.exports.up = async () => {
    const values = sampleData
        .map(row => Object.assign(row, {
            boardId: row.board.id,
        }))
        .map(row => pick(row, ['id', 'name', 'boardId']))
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
