const { forEach, isPlainObject, isEmpty } = require('lodash');
const squel = require('./squel');
const pgJsonPath = require('./pgJsonPath');

const logicalOps = [
    '$or',
];
const arrayOps = [
    '$anyOf',
    '$allOf',
    '$noneOf',
];
const scalarOps = [
    '$eq',
    '$neq',
    '$gt',
    '$gte',
    '$lt',
    '$lte',
    '$like',
    '$in',
    '$nin',
];

function pathInfo(path) {
    if (!isPlainObject(path)) {
        throw new Error('Path must be an object');
    }
    const keys = Object.keys(path);
    return {
        fields: keys.filter(k => (k[0] !== '$')),
        logicalOps: keys.filter(k => (k[0] === '$' && logicalOps.includes(k))),
        arrayOps: keys.filter(k => (k[0] === '$' && arrayOps.includes(k))),
        scalarOps: keys.filter(k => (k[0] === '$' && scalarOps.includes(k))),
    };
}


const pgOps = {
    $eq: '=',
    $neq: '<>',
    $gt: '>',
    $gte: '>=',
    $lt: '<',
    $lte: '<=',
    $like: 'LIKE',
    $in: 'IN',
    $nin: 'NOT IN',
};

function pgJsonScalarOp(sql, path, op, value) {
    if (['$in', '$nin'].includes(op)) {
        if (isEmpty(value)) {
            sql.and('FALSE');
        } else {
            sql.and(`${path} ${pgOps[op]} ?`, value);
        }
    } else {
        sql.and(`${path} ${pgOps[op]} ?`, value);
    }
}

function postgresJsonQuery(f, tableName, sql = squel.expr(), path = []) {
    if (f.$or) {
        f.$or.forEach((e) => {
            sql.or(postgresJsonQuery(e, tableName, squel.expr()));
        });
    } else {
        forEach(f, (v, k) => {
            const pi = pathInfo(v);

            if (v.$or) {
                v.$or.forEach((e) => {
                    sql.or(postgresJsonQuery(e, tableName, squel.expr(), path.concat(k)));
                });
            } else if (pi.scalarOps.length) {
                pi.scalarOps.forEach((op) => {
                    pgJsonScalarOp(sql, pgJsonPath(tableName, path, k), op, v[op]);
                });
            } else if (pi.arrayOps.length) {
                if (v.$anyOf) {
                    const s = squel.select()
                        .field('COUNT(*)')
                        .from(`jsonb_array_elements(${pgJsonPath(tableName, path, k)}::jsonb) obj`)
                        .where(postgresJsonQuery(v.$anyOf, '', squel.expr(), ['obj']));
                    sql.and('? > 0', s);
                }
                if (v.$allOf) {
                    const s = squel.select()
                        .field('COUNT(*)')
                        .from(`jsonb_array_elements(${pgJsonPath(tableName, path, k)}::jsonb) obj`)
                        .where(postgresJsonQuery(v.$allOf, '', squel.expr(), ['obj']));
                    sql.and('? = ?', s, squel.str(`jsonb_array_length(${pgJsonPath(tableName, path, k)}::jsonb)`));
                    sql.and('? > 0', squel.str(`jsonb_array_length(${pgJsonPath(tableName, path, k)}::jsonb)`));
                }
                if (v.$noneOf) {
                    const s = squel.select()
                        .field('COUNT(*)')
                        .from(`jsonb_array_elements(${pgJsonPath(tableName, path, k)}::jsonb) obj`)
                        .where(postgresJsonQuery(v.$noneOf, '', squel.expr(), ['obj']));
                    sql.and('? = 0', s);
                }
            } else if (pi.fields.length) {
                postgresJsonQuery(v, tableName, sql, path.concat(k));
            }
        });
    }
    return sql;
}

module.exports = postgresJsonQuery;
