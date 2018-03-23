import { normalize } from 'normalizr';
import request from './request';
import { organization, board } from './schema';
import loremIpsum from 'lorem-ipsum';
import uuidv4 from 'uuid/v4';

export function fetchUserOrganizations() {
    const params = {
        t: Date.now(),
    };

    return request.get('/api/users/me/organizations', { params })
        .then(res => res.data)
        .then(data => normalize(data, [organization]));
}

const stub = (boardId) => {
    const genName = () => loremIpsum({
        count: 2,
        units: 'words',
    });

    const genCardName = () => loremIpsum({
        count: 1,
        units: 'sentences',
    });

    return {
        __type__: 'Board',
        id: boardId,
        name: genName(),
        organization: {
            __type__: 'Organization',
            id: uuidv4(),
            name: genName(),
            members: [],
        },
        lists: Array.from({ length: 4 }).map(() => ({
            __type__: 'List',
            id: uuidv4(),
            name: genName(),
            cards: Array.from({ length: 8 }).map(() => ({
                __type__: 'Card',
                id: uuidv4(),
                name: genCardName(),
                members: [],
            })),
        })),
    };
};

export async function fetchBoardById(boardId) {
    const params = {
        t: Date.now(),
    };

    return request.get(`/api/boards/${boardId}`, { params })
        .then(res => res.data[0])
        .then(data => normalize(data, board));


    // return normalize(stub(boardId), board);
}

export default {};
