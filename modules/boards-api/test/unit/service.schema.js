const test = require('tape-async');
const Schema = require('../../models/Schema');
const schema = require('../../services/schema');

test('constructor', async (t) => {
    t.ok(schema instanceof Schema, 'schema id instanceof Schema');
    t.ok(Array.isArray(schema.list), 'schema.list is array');
    t.ok(Array.isArray(schema.keys), 'schema.keys is array');
});
