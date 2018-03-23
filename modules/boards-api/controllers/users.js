const express = require('express');
const Boom = require('boom');
const asyncWrapper = require('../libs/asyncWrapper');
const Organization = require('../models/Organization');
const Board = require('../models/Board');

module.exports = () => {
    const router = express.Router();

    router.param('userId', (req, res, next, userId) => {
        if (userId === 'me') {
            req.user = {
                id: 'a6fbbb00-b0b5-4658-a1c2-e0e5830b7804',
            };
        } else {
            throw Boom.forbidden('User not logged in');
        }

        next();
    });

    router.param('organizationId', (req, res, next, organizationId) => {
        req.organization = {
            id: organizationId,
        };
        next();
    });

    router.param('boardId', (req, res, next, boardId) => {
        req.board = {
            id: boardId,
        };
        next();
    });

    router.get('/:userId', [
        (req, res, next) => {
            if (req.user) {
                res.status(200).json(req.user);
            } else {
                next(Boom.forbidden());
            }
        },
    ]);

    router.get('/:userId/organizations', [
        asyncWrapper(async (req, res, next) => {
            const organizations = await Organization.find({
                fields: {
                    name: '*',
                    boards: '*',
                },
                join: {
                    $inner: {
                        members: {
                            filter: {
                                userId: { $eq: req.user.id },
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

            res.status(200).json(organizations);
        }),
    ]);

    router.get('/:userId/organizations/:organizationId/boards/:boardId', [
        asyncWrapper(async (req, res, next) => {
            const boards = await Board.find({
                filter: {
                    id: { $eq: req.board.id },
                },
                fields: {
                    name: '*',
                    lists: '*',
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
                },
            });

            res.status(200).json(boards);
        }),
    ]);


    return router;
};
