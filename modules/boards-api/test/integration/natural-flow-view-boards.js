// process.env.POSTGRES_DEBUG_SQL = true;

const test = require('tape-async');
const Organization = require('../../models/Organization');
const Board = require('../../models/Board');
const Ajv = require('ajv');

/* На главной странице отображаются списки досок относящихся к пользователю, сгруппированные по команде
 * Поэтому первым шагом получаем список команд к которым относится пользователь
 * На входе
 *  user = { id: ${userId} }
 * На выходе
 *  organizations = [ { id, boards: [ {id, name} ] } ]
 */
test('First step: organizations[name]->boards[name] filter by organizations->members->user[id=?]', async (t) => {
    const userId = 'a6fbbb00-b0b5-4658-a1c2-e0e5830b7804';

    const organizations = await Organization.find({
        fields: {
            name: '*',
            boards: '*',
        },
        join: {
            $inner: {
                members: {
                    filter: {
                        userId: { $eq: userId },
                    },
                },
                boards: {
                    fields: {
                        name: '*',
                    },
                },
            },
        },
    });

    // console.dir(organizations, { depth: 6, colors: true });

    const expectedOrganizationIds = [
        '23c792ef-1177-4b2c-957e-f78b924e0fb6',
        '6186cfca-2e82-4a60-b9ad-227102c652f0',
    ];
    const expectedBoardIds = [
        '5ecd2db3-6251-4690-89d2-766800210cc1',
        '4bc417e6-8037-4b41-a548-8fd66d7a1b69',
    ];

    const schemas = [
        {
            type: 'array',
            items: {
                $ref: 'organization',
            },
            minItems: 2,
            maxItems: 2,
        },
        {
            $id: 'organization',
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    enum: expectedOrganizationIds,
                },
                name: { type: 'string' },
                boards: {
                    type: 'array',
                    items: { $ref: 'board' },
                },
            },
            required: ['id', 'name', 'boards'],
        },
        {
            $id: 'board',
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    enum: expectedBoardIds,
                },
                name: { type: 'string' },
            },
            required: ['id', 'name'],
        },
    ];
    const ajv = new Ajv({ schemas });
    const valid = ajv.validate(schemas[0], organizations);

    t.ok(valid, 'organizations are valid');
    if (!valid) {
        t.fail(`${ajv.errors[0].dataPath} ${ajv.errors[0].message}`);
    }
});

test('Second step: boards[id,name]->cards[id,name]->lists[id,name]->members[id,name]->users[id]', async (t) => {
    const boardId = '4bc417e6-8037-4b41-a548-8fd66d7a1b69';

    const boards = await Board.find({
        filter: {
            id: { $eq: boardId },
        },
        fields: {
            name: '*',
            lists: '*',
            organization: '*',
        },
        join: {
            $left: {
                lists: {
                    fields: {
                        name: '*',
                        cards: '*',
                    },
                    join: {
                        $left: {
                            cards: {
                                fields: {
                                    name: '*',
                                    members: '*',
                                },
                                join: {
                                    $left: {
                                        members: {
                                            fields: {
                                                user: { id: '*' },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            $inner: {
                organization: {
                    fields: {
                        id: '*',
                        name: '*',
                        members: '*',
                    },
                    join: {
                        $left: {
                            members: {
                                fields: {
                                    user: { id: '*' },
                                    role: '*',
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    // console.dir(boards, { depth: 10, colors: true });

    const expectedOrganizationId = '6186cfca-2e82-4a60-b9ad-227102c652f0';
    const expectedOrganizationMemberIds = [
        '249de12c-5c13-4d18-936b-7b8824ebc3a4',
        'b665c11d-25b4-4d52-937a-e8501381a531',
    ];
    const expectedListIds = [
        '79fbad3a-6ba5-474c-9301-d48e874f9953',
        'f6e01190-c020-4403-84bc-99110c133645',
    ];
    const expectedCardIds = [
        '566bb3f0-0305-4318-8e27-7e2080eac585',
        '6c5e76eb-2bb8-4146-8068-fb29e1a89bde',
        'd31efe27-be0f-4c3b-92eb-ab833c5c8d5e',
        'fdedfe73-4448-4fef-9e32-c2a15c9faa33',
    ];
    const expectedCardMemberIds = [
        '89e15ce8-b354-43ee-ab1c-887668e26d5f',
        '03137fea-2d9d-4d16-8bdc-9fce470ca23a',
        '0d5572c2-4c8f-478b-aae5-0f2af7e05c8b',
        '7f3acc15-b84b-4d87-93f8-bda3da26f54c',
    ];
    const expectedUserIds = [
        'a6fbbb00-b0b5-4658-a1c2-e0e5830b7804',
        '55d247b7-2872-446d-afd8-7f9143bbcc43',
    ];

    const schemas = [
        {
            type: 'array',
            items: {
                $ref: 'board',
            },
            minItems: 1,
            maxItems: 1,
        },
        {
            $id: 'board',
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    enum: [boardId],
                },
                name: { type: 'string' },
                lists: {
                    type: 'array',
                    items: { $ref: 'list' },
                },
                organization: {
                    $ref: 'organization',
                },
            },
            required: ['id', 'name', 'lists', 'organization'],
        },
        {
            $id: 'organization',
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    enum: [expectedOrganizationId],
                },
                name: { type: 'string' },
                members: {
                    type: 'array',
                    items: { $ref: 'organization_member' },
                },
            },
            required: ['id', 'name', 'members'],
        },
        {
            $id: 'organization_member',
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    enum: expectedOrganizationMemberIds,
                },
                user: {
                    $ref: 'user',
                },
            },
            required: ['id', 'user'],
        },
        {
            $id: 'list',
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    enum: expectedListIds,
                },
                name: { type: 'string' },
                cards: {
                    type: 'array',
                    items: { $ref: 'card' },
                },
            },
            required: ['id', 'name', 'cards'],
        },
        {
            $id: 'card',
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    enum: expectedCardIds,
                },
                name: { type: 'string' },
                members: {
                    type: 'array',
                    items: { $ref: 'member' },
                },
            },
            required: ['id', 'name', 'members'],
        },
        {
            $id: 'member',
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    enum: expectedCardMemberIds,
                },
                user: {
                    $ref: 'user',
                },
            },
            required: ['id', 'user'],
        },
        {
            $id: 'user',
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    enum: expectedUserIds,
                },
            },
            required: ['id'],
        },
    ];
    const ajv = new Ajv({ schemas });
    const valid = ajv.validate(schemas[0], boards);

    t.ok(valid, 'boards are valid');
    if (!valid) {
        t.fail(`${ajv.errors[0].dataPath} ${ajv.errors[0].message}`);
    }
});
