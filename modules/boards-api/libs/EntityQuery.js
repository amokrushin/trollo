const squel = require('../libs/squel');
const validate = require('../libs/validate');
const postgresJsonQuery = require('../libs/postgresJsonQuery');
const pgSnippets = require('../libs/pgSnippets');
const { get, set, snakeCase, camelCase } = require('lodash');
const { forEach, map, keys, intersection, uniqueId, uniq } = require('lodash');

const paramsSchema = {
    type: 'object',
    properties: {
        tableName: {
            type: 'string',
        },
    },
};
const querySchema = {
    type: 'object',
    properties: {
        filter: {
            type: 'object',
            // TODO: filter schema
        },
        fields: {
            type: ['object', 'array'],
        },
        limit: {
            type: 'number',
            default: 1000,
            minimum: 1,
            maximum: 1000,
        },
        offset: {
            type: 'number',
            minimum: 0,
        },
        order: {
            type: 'string',
        },
        join: {
            type: 'object',
            // TODO: join schema
        },
    },
};

function fieldsToObject(selectableFields, fields) {
    if (Array.isArray(fields)) {
        return fields.reduce((a, k) => {
            if (k === '*') {
                selectableFields.forEach((f) => {
                    a[f] = '*';
                });
            } else {
                set(a, k, '*');
            }
            return a;
        }, {});
    }
    return fields;
}

class EntityQuery {
    constructor(Model, query = {}) {
        validate(paramsSchema, Model);
        validate(querySchema, query);

        this._Model = Model;

        const { fieldsNamesByType, fieldsByTypeKeyByPath } = this._Model;
        const selectableFields = fieldsNamesByType.selectable;
        const foreignFields = fieldsNamesByType.references;

        this._query = {
            ...query,
            fields: fieldsToObject(selectableFields.concat(foreignFields), query.fields),
        };

        this._sql = squel.select().from(this._Model.tableName);
    }

    async sql() {
        if (this._query.filter) {
            this._applyFilter();
        }

        this._selectType();
        this._selectFields();
        await this._selectJoins();

        return this._sql;
    }

    get Model() {
        return this._Model;
    }

    get query() {
        return this._query;
    }

    toString() {
        return this._sql.toString();
    }

    toParam() {
        return this._sql.toParam();
    }

    _applyFilter() {
        const { filter } = this._query;
        const { tableName } = this._Model;
        // const { references } = this;
        // const referenceFields = keys(references);

        // const f = references
        //     ? omit(filter, referenceFields)
        //     : filter;
        this._sql.where(postgresJsonQuery(filter, tableName));
    }

    _selectType() {
        this._sql.field(`'${this._Model.name}'`, '__type__');
    }

    _selectFields() {
        const { tableName, fieldsNamesByType, fieldsByTypeKeyByPath } = this._Model;
        const selectableFields = fieldsNamesByType.selectable;
        const belongsToFields = fieldsNamesByType.belongsToReferences;
        const queryFields = uniq(keys(this._query.fields).concat('id'));

        const prefix = tableName ? `${tableName}.` : '';

        forEach(
            intersection(selectableFields, queryFields),
            f => {
                this._sql.field(`${prefix}${snakeCase(f)}`, camelCase(f));
            },
        );
        forEach(
            intersection(belongsToFields, queryFields),
            f => {
                const fieldSchema = fieldsByTypeKeyByPath.belongsToReferences[f].schema;
                const { reference } = fieldSchema;
                const foreignKey = camelCase(reference.foreignKey);
                const ownKey = snakeCase(reference.ownKey);
                this._sql.field(`jsonb_build_object('${foreignKey}',${ownKey})`, camelCase(f));
            },
        );
    }

    async _selectJoins() {
        const { fieldSchemaByPath, registry } = this._Model;
        const $inner = get(this._query, 'join.$inner', []);
        const $left = get(this._query, 'join.$left', []);

        const innerJoins = map($inner, (query, field) => ({
            method: 'join',
            query,
            field,
        }));
        const leftJoins = map($left, (query, field) => ({
            method: 'left_join',
            query,
            field,
        }));
        const joins = [].concat(innerJoins).concat(leftJoins);

        await Promise.all(map(joins, ({ method, query, field }) => {
            const fieldSchema = fieldSchemaByPath.get(field);
            const ForeignModel = registry.autoload(fieldSchema.reference.model);
            switch (fieldSchema.reference.type) {
                case 'hasMany':
                    return this._joinMany(ForeignModel, field, fieldSchema, query, method);
                case 'belongsTo':
                    return this._joinBelongsTo(ForeignModel, field, fieldSchema, query, method);
                case 'hasManyThrough':
                case 'hasOne':
                default:
                    throw new Error(`Not implemented join method ${fieldSchema.reference.type}`);
            }
        }));
    }

    async _joinMany(ForeignModel, field, fieldSchema, query, method = 'join') {
        const { tableName } = this._Model;
        const { ownKey, foreignKey } = fieldSchema.reference;

        const foreignSql = await ForeignModel.find(query, { format: 'sql' });

        const t = uniqueId('t');
        const fLeft = `${tableName}.${snakeCase(ownKey)}`;
        const fRight = `${ForeignModel.tableName}.${snakeCase(foreignKey)}`;

        foreignSql.where(`${fLeft} = ${fRight}`);

        this._sql[method](pgSnippets.lateral(foreignSql), t, 'true');

        if (this._query.fields[field]) {
            this._sql.field(pgSnippets.jsonAgg(t), camelCase(field));
            this._sql.group(`${tableName}.id`);
        }
    }

    async _joinBelongsTo(ForeignModel, field, fieldSchema, query, method = 'join') {
        const { tableName } = this._Model;
        const { ownKey, foreignKey } = fieldSchema.reference;

        const foreignSql = await ForeignModel.find(query, { format: 'sql' });

        const t = uniqueId('t');
        const fLeft = `${tableName}.${snakeCase(ownKey)}`;
        const fRight = `${ForeignModel.tableName}.${snakeCase(foreignKey)}`;

        foreignSql.where(`${fLeft} = ${fRight}`);

        this._sql[method](pgSnippets.lateral(foreignSql), t, 'true');

        if (this._query.fields[field]) {
            this._sql.field(pgSnippets.toJson(t), camelCase(field));
            this._sql.group(`${tableName}.id`);
            this._sql.group(`${t}.*`);
        }
    }
}

module.exports = EntityQuery;