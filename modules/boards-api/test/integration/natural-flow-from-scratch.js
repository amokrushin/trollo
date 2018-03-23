// process.env.POSTGRES_DEBUG_SQL = true;

const test = require('tape-async');
const Organization = require('../../models/Organization');
const OrganizationMember = require('../../models/OrganizationMember');
const Board = require('../../models/Board');
const List = require('../../models/List');
const Card = require('../../models/Card');
const CardMember = require('../../models/CardMember');
const Ajv = require('ajv');

const state = {
    organizations: [],
    organizationMembers: [],
    boards: [],
    lists: [],
    cards: [],
    cardMembers: [],
};

test('Step one: create organization', async (t) => {
    const organization = await Organization.create({
        name: 'foo',
    });

    console.dir(organization, { depth: 6, colors: true });

    state.organizations.push(organization);
});

test('Step two: create organization member', async (t) => {
    const organizationMember = await OrganizationMember.create({
        organization: {
            id: state.organizations[0].id,
        },
        user: {
            id: '00000000-0000-0000-0000-000000000000',
        },
        role: 'normal',
    });

    console.dir(organizationMember, { depth: 6, colors: true });

    state.organizationMembers.push(organizationMember);
});

test('Step three: create board', async (t) => {
    const board = await Board.create({
        name: 'foo',
        organization: {
            id: state.organizations[0].id,
        },
    });

    console.dir(board, { depth: 6, colors: true });

    state.boards.push(board);
});

test('Step four: create list', async (t) => {
    const list = await List.create({
        name: 'foo',
        board: {
            id: state.boards[0].id,
        },
    });

    console.dir(list, { depth: 6, colors: true });

    state.lists.push(list);
});

test('Step five: create card', async (t) => {
    const card = await Card.create({
        name: 'foo',
        list: {
            id: state.lists[0].id,
        },
    });

    console.dir(card, { depth: 6, colors: true });

    state.cards.push(card);
});

test('Step six: create card member', async (t) => {
    const cardMember = await CardMember.create({
        card: {
            id: state.cards[0].id,
        },
        user: {
            id: '00000000-0000-0000-0000-000000000000',
        },
    });

    console.dir(cardMember, { depth: 6, colors: true });

    state.cardMembers.push(cardMember);
});
