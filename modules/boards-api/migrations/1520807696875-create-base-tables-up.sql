CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public;

CREATE TABLE organizations (
    id                          UUID            NOT NULL        DEFAULT uuid_generate_v4(),
    name                        TEXT            NOT NULL,

    created_at                  TIMESTAMP       NOT NULL        DEFAULT now(),
    updated_at                  TIMESTAMP       NOT NULL        DEFAULT now(),

    PRIMARY KEY (id)
);

CREATE TYPE organization_member_role AS ENUM ('normal', 'admin');

CREATE TABLE organization_members (
    id                          UUID                        NOT NULL        DEFAULT uuid_generate_v4(),
    organization_id             UUID                        NOT NULL,
    user_id                     UUID                        NOT NULL,
    role                        ORGANIZATION_MEMBER_ROLE    NOT NULL,

    created_at                  TIMESTAMP                   NOT NULL        DEFAULT now(),
    updated_at                  TIMESTAMP                   NOT NULL        DEFAULT now(),

    PRIMARY KEY (id),
    UNIQUE (organization_id,user_id),
    FOREIGN KEY (organization_id) REFERENCES organizations (id)
);

CREATE TABLE boards (
    id                          UUID            NOT NULL        DEFAULT uuid_generate_v4(),
    name                        TEXT            NOT NULL,
    organization_id             UUID            NOT NULL,

    created_at                  TIMESTAMP       NOT NULL        DEFAULT now(),
    updated_at                  TIMESTAMP       NOT NULL        DEFAULT now(),

    PRIMARY KEY (id),
    CONSTRAINT non_empty CHECK (name <> ''),
    FOREIGN KEY (organization_id) REFERENCES organizations (id)
);

CREATE TABLE lists (
    id                          UUID            NOT NULL        DEFAULT uuid_generate_v4(),
    name                        TEXT            NOT NULL,
    board_id                    UUID            NOT NULL,

    created_at                  TIMESTAMP       NOT NULL        DEFAULT now(),
    updated_at                  TIMESTAMP       NOT NULL        DEFAULT now(),

    PRIMARY KEY (id),
    CONSTRAINT non_empty CHECK (name <> ''),
    FOREIGN KEY (board_id) REFERENCES boards (id)
);

CREATE TABLE cards (
    id                          UUID            NOT NULL        DEFAULT uuid_generate_v4(),
    name                        TEXT            NOT NULL,
    list_id                     UUID            NOT NULL,

    created_at                  TIMESTAMP       NOT NULL        DEFAULT now(),
    updated_at                  TIMESTAMP       NOT NULL        DEFAULT now(),

    PRIMARY KEY (id),
    CONSTRAINT non_empty CHECK (name <> ''),
    FOREIGN KEY (list_id) REFERENCES lists (id)
);

CREATE TABLE card_members (
    id                          UUID            NOT NULL        DEFAULT uuid_generate_v4(),
    card_id                     UUID            NOT NULL,
    user_id                     UUID            NOT NULL,

    created_at                  TIMESTAMP       NOT NULL        DEFAULT now(),
    updated_at                  TIMESTAMP       NOT NULL        DEFAULT now(),

    PRIMARY KEY (id),
    UNIQUE (card_id,user_id),
    FOREIGN KEY (card_id) REFERENCES cards (id)
);
