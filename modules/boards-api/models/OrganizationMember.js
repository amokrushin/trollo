const Entity = require('../libs/Entity');
const squel = require('../libs/squel');
const schema = require('../services/schema');
const pg = require('../services/postgres');

class OrganizationMember extends Entity {}

OrganizationMember.init({
    schema: schema.getByName('organization_member'),
    singularName: 'organization_member',
    pluralName: 'organization_members',
    tableName: 'organization_members',
    client: pg,
});

OrganizationMember.on('beforeUpdate', (sql) => {
    sql.set('updated_at', squel.rstr('now()'));
});

module.exports = OrganizationMember;
