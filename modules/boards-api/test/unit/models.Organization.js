const test = require('tape-async');
const Entity = require('../../libs/Entity');
const Organization = require('../../models/Organization');

test('constructor', async (t) => {
    t.equal(typeof Organization, 'function', 'Organization is function');
    t.ok(Organization.prototype instanceof Entity, 'Entity extends Model');
});
