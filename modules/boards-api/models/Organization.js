const Entity = require('../libs/Entity');
const squel = require('../libs/squel');
const schema = require('../services/schema');
const pg = require('../services/postgres');

class Organization extends Entity {}

Organization.init({
    schema: schema.getByName('organization'),
    singularName: 'organization',
    pluralName: 'organizations',
    tableName: 'organizations',
    client: pg,
});

Organization.on('beforeUpdate', (sql) => {
    sql.set('updated_at', squel.rstr('now()'));
});

module.exports = Organization;
