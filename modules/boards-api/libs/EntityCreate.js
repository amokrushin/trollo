const squel = require('../libs/squel');
const validate = require('../libs/validate');
const postgresJsonQuery = require('../libs/postgresJsonQuery');
const pgSnippets = require('../libs/pgSnippets');
const { get, set, snakeCase, camelCase } = require('lodash');
const { keys, castArray, toPath, intersection, without, chain, isUndefined, isObjectLike } = require('lodash');

class EntityCreate {
    constructor(Model, data, params = {}) {
        // validate(paramsSchema, Model);
        // validate(querySchema, params);
        // validate(Model.schema, data);

        this._Model = Model;
        this._data = data;

        this._sql = squel.insert().into(this._Model.tableName);
    }

    async sql() {
        this._returningPrimaryKey();
        this._setFields();

        return this._sql;
    }

    _returningPrimaryKey() {
        const { tableName, schema } = this._Model;

        const prefix = tableName ? `${tableName}.` : '';

        castArray(schema.primaryKey || 'id').map(pk => toPath(pk)).forEach(f => {
            this._sql.returning(`${prefix}${snakeCase(f)}`, camelCase(f));
        });
    }

    _setFields() {
        const { fieldsNamesByType, fieldSchemaByPath } = this._Model;

        const dataKeys = without(keys(this._data), ...fieldsNamesByType.virtual);
        const primitiveKeys = intersection(dataKeys, fieldsNamesByType.primitive, fieldsNamesByType.writable);
        const jsonKeys = without(intersection(dataKeys, fieldsNamesByType.json), ...fieldsNamesByType.reference);
        const referenceKeys = intersection(dataKeys, fieldsNamesByType.reference);

        chain(this._data)
            .pick(primitiveKeys)
            .pickBy(v => !isUndefined(v))
            .forEach((v, k) => {
                this._sql.set(snakeCase(k), v);
            })
            .value();

        chain(this._data)
            .pick(jsonKeys)
            .pickBy(v => isObjectLike(v))
            .forEach((v, k) => {
                this._sql.set(snakeCase(k), JSON.stringify(v));
            })
            .value();

        chain(this._data)
            .pick(referenceKeys)
            .forEach((v, k) => {
                const fieldSchema = fieldSchemaByPath.get(k);
                if (fieldSchema.reference.type === 'belongsTo') {
                    const { ownKey, foreignKey } = fieldSchema.reference;
                    this._sql.set(snakeCase(ownKey), v[camelCase(foreignKey)]);
                }
            })
            .value();
    }
}

module.exports = EntityCreate;
