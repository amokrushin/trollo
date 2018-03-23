const Entity = require('../libs/Entity');
const squel = require('../libs/squel');
const schema = require('../services/schema');
const pg = require('../services/postgres');

class Board extends Entity {}

Board.init({
    schema: schema.getByName('board'),
    singularName: 'board',
    pluralName: 'boards',
    tableName: 'boards',
    client: pg,
});

Board.on('beforeUpdate', (sql) => {
    sql.set('updated_at', squel.rstr('now()'));
});

module.exports = Board;
