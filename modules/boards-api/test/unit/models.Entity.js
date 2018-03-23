const test = require('tape-async');
const Model = require('../../libs/Model');
const Entity = require('../../libs/Entity');

test('constructor', async (t) => {
    t.equal(typeof Entity, 'function', 'Model is function');
    t.ok(Entity.prototype instanceof Model, 'Entity extends Model');
});

test('Entity.init', async (t) => {
    class Foo extends Entity {}

    const schema = {};

    Foo.init({
        schema,
        singularName: 'foo',
        pluralName: 'foos',
        tableName: 'foos',
        client: {},
    });

    t.equal(Foo.tableName, 'foos', 'Foo.tableName match');
});

test('fieldsByType', async (t) => {
    class Foo extends Entity {}

    const schema = {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            fullName: { type: 'string', virtual: true },
            profile: {
                type: 'object',
                properties: {
                    avatarUrl: { type: 'string' },
                },
            },
            roles: {
                type: 'array',
                items: { type: 'string' },
            },
        },
    };

    Foo.init({
        schema,
        singularName: 'foo',
        pluralName: 'foos',
        tableName: 'foos',
        client: {},
    });

    t.deepEqual(Foo.fieldsNamesByType.primitive, ['id', 'name', 'fullName'], 'primitive fields match');
    t.deepEqual(Foo.fieldsNamesByType.json, ['profile', 'roles'], 'json fields match');
    t.deepEqual(Foo.fieldsNamesByType.selectable, ['id', 'name', 'profile', 'roles'], 'selectable fields match');
});
