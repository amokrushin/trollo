const test = require('tape-async');
const pg = require('../../services/postgres');
const squel = require('../../libs/squel');
const postgresJsonQuery = require('../../libs/postgresJsonQuery');

test('scalar $like', async (t) => {
    const dataset = [
        { id: 1, field_a: { fieldB: 'abc' } },
        { id: 2, field_a: { fieldB: 'abcde' } },
        { id: 3, field_a: { fieldB: 'cba' } },
        { id: 4, field_a: { fieldB: 'xyzabcklm' } },
    ];
    const sql = squel.select({ tableAliasQuoteCharacter: '' })
        .from(`json_to_recordset('${JSON.stringify(dataset)}')`, 'x(id integer, field_a json)');
    const filter = {
        fieldA: {
            fieldB: { $like: '%abc%' },
        },
    };

    sql.where(postgresJsonQuery(filter, ''));

    const res = await pg.squel(sql).then(result => result.rows);

    t.deepEqual(res.map(row => row.id), [1, 2, 4], 'result match');
});

test('scalar $in', async (t) => {
    const dataset = [
        { id: 1, field_a: { fieldB: 1 } },
        { id: 2, field_a: { fieldB: 2 } },
        { id: 3, field_a: { fieldB: 3 } },
        { id: 4, field_a: { fieldB: 4 } },
    ];
    const sql = squel.select({ tableAliasQuoteCharacter: '' })
        .from(`json_to_recordset('${JSON.stringify(dataset)}')`, 'x(id integer, field_a json)');
    const filter = {
        fieldA: {
            fieldB: { $in: [1, 3] },
        },
    };

    sql.where(postgresJsonQuery(filter, ''));

    const res = await pg.squel(sql).then(result => result.rows);

    t.deepEqual(res.map(row => row.id), [1, 3], 'result match');
});

test('empty $in', async (t) => {
    const dataset = [
        { id: 1, field_a: { fieldB: 1 } },
        { id: 2, field_a: { fieldB: 2 } },
        { id: 3, field_a: { fieldB: 3 } },
        { id: 4, field_a: { fieldB: 4 } },
    ];
    const sql = squel.select({ tableAliasQuoteCharacter: '' })
        .from(`json_to_recordset('${JSON.stringify(dataset)}')`, 'x(id integer, field_a json)');
    const filter = {
        fieldA: {
            fieldB: { $in: [] },
        },
    };

    sql.where(postgresJsonQuery(filter, ''));
    const res = await pg.squel(sql).then(result => result.rows);

    t.deepEqual(res.map(row => row.id), [], 'result match');
});

test('scalar $nin', async (t) => {
    const dataset = [
        { id: 1, field_a: { fieldB: 1 } },
        { id: 2, field_a: { fieldB: 2 } },
        { id: 3, field_a: { fieldB: 3 } },
        { id: 4, field_a: { fieldB: 4 } },
    ];
    const sql = squel.select({ tableAliasQuoteCharacter: '' })
        .from(`json_to_recordset('${JSON.stringify(dataset)}')`, 'x(id integer, field_a json)');
    const filter = {
        fieldA: {
            fieldB: { $nin: [1, 3] },
        },
    };

    sql.where(postgresJsonQuery(filter, ''));

    const res = await pg.squel(sql).then(result => result.rows);

    t.deepEqual(res.map(row => row.id), [2, 4], 'result match');
});

test('logical $or top', async (t) => {
    const dataset = [
        { id: 1, field_a: { fieldB: 1 } },
        { id: 2, field_a: { fieldB: 2 } },
        { id: 3, field_a: { fieldB: 3 } },
        { id: 4, field_a: { fieldB: 4 } },
    ];
    const sql = squel.select({ tableAliasQuoteCharacter: '' })
        .from(`json_to_recordset('${JSON.stringify(dataset)}')`, 'x(id integer, field_a json)');
    const filter = {
        $or: [
            { fieldA: { fieldB: { $eq: 1 } } },
            { fieldA: { fieldB: { $eq: 3 } } },
        ],
    };

    sql.where(postgresJsonQuery(filter, ''));

    const res = await pg.squel(sql).then(result => result.rows);

    t.deepEqual(res.map(row => row.id), [1, 3], 'result match');
});

test('logical $or deep', async (t) => {
    const dataset = [
        { id: 1, field_a: { fieldB: 1 } },
        { id: 2, field_a: { fieldB: 2 } },
        { id: 3, field_a: { fieldB: 3 } },
        { id: 4, field_a: { fieldB: 4 } },
    ];
    const sql = squel.select({ tableAliasQuoteCharacter: '' })
        .from(`json_to_recordset('${JSON.stringify(dataset)}')`, 'x(id integer, field_a json)');
    const filter = {
        fieldA: {
            $or: [
                { fieldB: { $eq: 1 } },
                { fieldB: { $eq: 3 } },
            ],
        },
    };

    sql.where(postgresJsonQuery(filter, ''));

    const res = await pg.squel(sql).then(result => result.rows);

    t.deepEqual(res.map(row => row.id), [1, 3], 'result match');
});

test('array $anyOf', async (t) => {
    const dataset = [
        { id: 1, field_a: [{ fieldB: 1 }, { fieldB: 7 }] },
        { id: 2, field_a: [{ fieldB: 3 }, { fieldB: 5 }] },
        { id: 3, field_a: [{ fieldB: 5 }, { fieldB: 3 }] },
        { id: 4, field_a: [{ fieldB: 7 }, { fieldB: 1 }] },
    ];
    const sql = squel.select({ tableAliasQuoteCharacter: '' })
        .from(`json_to_recordset('${JSON.stringify(dataset)}')`, 'x(id integer, field_a jsonb)');
    const filter = {
        fieldA: {
            $anyOf: {
                fieldB: { $lt: '2' },
            },
        },
    };

    sql.where(postgresJsonQuery(filter, ''));

    const res = await pg.squel(sql).then(result => result.rows);

    t.deepEqual(res.map(row => row.id), [1, 4], 'result match');
});

test('array $allOf', async (t) => {
    const dataset = [
        { id: 1, field_a: [{ fieldB: 1 }, { fieldB: 7 }] },
        { id: 2, field_a: [{ fieldB: 3 }, { fieldB: 5 }] },
        { id: 3, field_a: [{ fieldB: 5 }, { fieldB: 3 }] },
        { id: 4, field_a: [{ fieldB: 7 }, { fieldB: 1 }] },
    ];
    const sql = squel.select({ tableAliasQuoteCharacter: '' })
        .from(`json_to_recordset('${JSON.stringify(dataset)}')`, 'x(id integer, field_a jsonb)');
    const filter = {
        fieldA: {
            $allOf: {
                fieldB: { $gte: '3' },
            },
        },
    };

    sql.where(postgresJsonQuery(filter, ''));

    const res = await pg.squel(sql).then(result => result.rows);

    t.deepEqual(res.map(row => row.id), [2, 3], 'result match');
});

test('array $noneOf', async (t) => {
    const dataset = [
        { id: 1, field_a: [{ fieldB: 1 }, { fieldB: 7 }] },
        { id: 2, field_a: [{ fieldB: 3 }, { fieldB: 5 }] },
        { id: 3, field_a: [{ fieldB: 5 }, { fieldB: 3 }] },
        { id: 4, field_a: [{ fieldB: 7 }, { fieldB: 1 }] },
    ];
    const sql = squel.select({ tableAliasQuoteCharacter: '' })
        .from(`json_to_recordset('${JSON.stringify(dataset)}')`, 'x(id integer, field_a jsonb)');
    const filter = {
        fieldA: {
            $noneOf: {
                fieldB: { $eq: '3' },
            },
        },
    };

    sql.where(postgresJsonQuery(filter, ''));

    const res = await pg.squel(sql).then(result => result.rows);

    t.deepEqual(res.map(row => row.id), [1, 4], 'result match');
});

test('nested array $allOf $allOf', async (t) => {
    const dataset = [
        { id: 1, field_a: [{ fieldB: [{ fieldC: 1 }] }] },
        { id: 2, field_a: [{ fieldB: [{ fieldC: 2 }] }] },
        { id: 3, field_a: [{ fieldB: [{ fieldC: 3 }] }] },
        { id: 4, field_a: [{ fieldB: [{ fieldC: 4 }] }] },
        { id: 5, field_a: [{ fieldB: [{ fieldC: 5 }] }] },
        { id: 6, field_a: [] },
        { id: 7, field_a: [{ fieldB: [{ fieldC: '999' }, { fieldC: 4 }] }] },
    ];
    const sql = squel.select({ tableAliasQuoteCharacter: '' })
        .from(`json_to_recordset('${JSON.stringify(dataset)}')`, 'x(id integer, field_a jsonb)');
    const filter = {
        fieldA: {
            $allOf: {
                fieldB: {
                    $allOf: {
                        fieldC: { $gt: '3' },
                    },
                },
            },
        },
    };

    sql.where(postgresJsonQuery(filter, ''));

    const res = await pg.squel(sql).then(result => result.rows);

    t.deepEqual(res.map(row => row.id), [4, 5, 7], 'result match');
});

test('teardown', (t) => {
    pg.quit(t.end);
});
