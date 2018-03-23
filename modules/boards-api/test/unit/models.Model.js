const test = require('tape-async');
const Model = require('../../libs/Model');

test('constructor', async (t) => {
    t.equal(typeof Model, 'function', 'Model is function');
    t.equal(typeof Model.init, 'function', 'Model.init is function');
});

test('Model.init', async (t) => {
    class Foo extends Model {}

    const schema = {};

    Foo.init({
        schema,
        singularName: 'foo',
        pluralName: 'foos',
    });

    t.equal(Foo.schema, schema, 'Foo.schema match');
    t.equal(Foo.singularName, 'foo', 'Foo.singularName match');
    t.equal(Foo.pluralName, 'foos', 'Foo.pluralName match');
});
