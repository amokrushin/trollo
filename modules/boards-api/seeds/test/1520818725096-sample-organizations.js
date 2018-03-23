const pg = require('../../services/postgres');
const squel = require('../../libs/squel');
const { pick, mapKeys, snakeCase } = require('lodash');
const sampleOrganizations = require('./1520818725096-sample-organizations.json');

module.exports.up = async () => {
    const organizationsValues = sampleOrganizations
        .map(organization => pick(organization, ['id', 'name']))
        .map(organization => mapKeys(organization, (v, k) => snakeCase(k)));

    const sql = squel.insert().into('organizations').setFieldsRows(organizationsValues);

    await pg.transaction((client) => client.squel(sql));
};

module.exports.down = async () => {
    const values = sampleOrganizations
        .map(organization => organization.id);

    const sql = squel.delete().from('organizations').where('id IN ?', values);

    await pg.transaction((client) => client.squel(sql));
};
