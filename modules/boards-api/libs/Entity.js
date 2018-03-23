const Model = require('./Model');
const EntityQuery = require('./EntityQuery');
const EntityCreate = require('./EntityCreate');
const EntityUpdate = require('./EntityUpdate');
const validate = require('./validate');
const walkSchemaProps = require('./walkSchemaProps');
const { reduce, keyBy } = require('lodash');

const paramsSchema = {
    type: 'object',
    properties: {
        tableName: {
            type: 'string',
        },
        client: {
            type: 'object',
        },
    },
    required: ['tableName', 'client'],
};

class Entity extends Model {
    static init(params) {
        super.init(params);

        validate(paramsSchema, params);

        this._tableName = params.tableName;

        this._client = params.client;

        const fieldsTypes = {
            primitive: [],
            writable: [],
            json: [],
            reference: [],
            virtual: [],

            selectable: [],
            references: [],
            belongsToReferences: [],
        };

        this._fieldSchemaByPath = new Map();

        this._fieldsByType = walkSchemaProps(this._schema, (acc, schema, path, level) => {
            if (level === 1) {
                switch (schema.type || 'object') {
                    case 'object':
                    case 'array':
                        acc.json.push({ schema, path, level });
                        break;
                    case 'string':
                    case 'number':
                    case 'boolean':
                        acc.primitive.push({ schema, path, level });
                        break;
                    default:
                }
                if (!schema.readOnly && !schema.virtual) {
                    acc.writable.push({ schema, path, level });
                }
                if (!schema.reference && !schema.writeOnly && !schema.virtual) {
                    acc.selectable.push({ schema, path, level });
                }
                if (schema.reference && !schema.virtual) {
                    acc.references.push({ schema, path, level });
                }
                if (schema.reference) {
                    acc.reference.push({ schema, path, level });
                }
                if (schema.virtual) {
                    acc.virtual.push({ schema, path, level });
                }
                if (schema.reference && !schema.virtual && schema.reference.type === 'belongsTo') {
                    acc.belongsToReferences.push({ schema, path, level });
                }
            }
            this._fieldSchemaByPath.set(path, schema);
        }, fieldsTypes);

        this._fieldsNamesByType = reduce(this._fieldsByType, (acc, fields, type) => {
            acc[type] = fields.map(v => v.path);
            return acc;
        }, {});

        this._fieldsByTypeKeyByPath = reduce(this._fieldsByType, (acc, fields, type) => {
            acc[type] = keyBy(fields, 'path');
            return acc;
        }, {});
    }

    static get tableName() {
        return this._tableName;
    }

    static get fieldsByType() {
        return this._fieldsByType;
    }

    static get fieldsByTypeKeyByPath() {
        return this._fieldsByTypeKeyByPath;
    }

    static get fieldsNamesByType() {
        return this._fieldsNamesByType;
    }

    static get fieldSchemaByPath() {
        return this._fieldSchemaByPath;
    }

    static async find(query, params = {}) {
        const eq = new EntityQuery(this, query);
        const sql = await eq.sql();

        if (params.format === 'sql') {
            return sql;
        } else {
            return this._client.squel(sql).then(result => result.rows);
        }
    }

    static async create(data, params = {}) {
        const eq = new EntityCreate(this, data, params);
        const sql = await eq.sql();

        this.emit('beforeCreate', sql);

        if (params.format === 'sql') {
            return sql;
        } else {
            return this._client.squel(sql).then(result => result.rows[0]);
        }
    }

    static async update(data, params = {}) {
        const eq = new EntityUpdate(this, data, params);
        const sql = await eq.sql();

        this.emit('beforeUpdate', sql);

        if (params.format === 'sql') {
            return sql;
        } else {
            return this._client.squel(sql).then(result => result.rows[0]);
        }
    }
}

module.exports = Entity;
