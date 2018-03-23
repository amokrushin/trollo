const Entity = require('../libs/Entity');
const squel = require('../libs/squel');
const schema = require('../services/schema');
const pg = require('../services/postgres');

class List extends Entity {}

List.init({
    schema: schema.getByName('list'),
    singularName: 'list',
    pluralName: 'lists',
    tableName: 'lists',
    client: pg,
});

List.on('beforeUpdate', (sql) => {
    sql.set('updated_at', squel.rstr('now()'));
});

module.exports = List;
