const Entity = require('../libs/Entity');
const squel = require('../libs/squel');
const schema = require('../services/schema');
const pg = require('../services/postgres');

class Card extends Entity {}

Card.init({
    schema: schema.getByName('card'),
    singularName: 'card',
    pluralName: 'cards',
    tableName: 'cards',
    client: pg,
});

Card.on('beforeUpdate', (sql) => {
    sql.set('updated_at', squel.rstr('now()'));
});

module.exports = Card;
