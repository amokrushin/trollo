// process.env.POSTGRES_DEBUG_SQL = true;

const test = require('tape-async');
const Organization = require('../../models/Organization');
const Board = require('../../models/Board');
const List = require('../../models/List');
const Card = require('../../models/Card');
const Ajv = require('ajv');

test('[1]: init', async (t) => {
    const organization = await Organization.create({
        name: 'foo',
    });
    const board = await Board.create({
        name: 'foo',
        organization: {
            id: organization.id,
        },
    });
    const listA = await List.create({
        name: 'foo',
        board: {
            id: board.id,
        },
    });
    const listB = await List.create({
        name: 'foo',
        board: {
            id: board.id,
        },
    });
    const cardInListA = await Card.create({
        name: 'foo',
        list: {
            id: listA.id,
        },
    });

    await Card.update({
        id: cardInListA.id,
        list: {
            id: listB.id,
        },
    });

    const cardInListB = await Card.find({
        filter: {
            id: { $eq: cardInListA.id },
        },
        fields: ['name', 'list'],
    });

    console.dir(listB, { depth: 6, colors: true });
    console.dir(cardInListB, { depth: 6, colors: true });
});
