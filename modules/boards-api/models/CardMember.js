const Entity = require('../libs/Entity');
const squel = require('../libs/squel');
const schema = require('../services/schema');
const pg = require('../services/postgres');

class CardMember extends Entity {}

CardMember.init({
    schema: schema.getByName('card_member'),
    singularName: 'card_member',
    pluralName: 'card_members',
    tableName: 'card_members',
    client: pg,
});

CardMember.on('beforeUpdate', (sql) => {
    sql.set('updated_at', squel.rstr('now()'));
});

module.exports = CardMember;
