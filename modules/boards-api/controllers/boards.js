const express = require('express');
const asyncWrapper = require('../libs/asyncWrapper');
const Board = require('../models/Board');

module.exports = () => {
    const router = express.Router();

    router.param('boardId', (req, res, next, boardId) => {
        req.board = {
            id: boardId,
        };
        next();
    });

    router.get('/:boardId', [
        asyncWrapper(async (req, res, next) => {
            const boards = await Board.find({
                filter: {
                    id: { $eq: req.board.id },
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

            res.status(200).json(boards);
        }),
    ]);

    return router;
};
