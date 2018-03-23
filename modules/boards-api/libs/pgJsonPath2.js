const { snakeCase, camelCase } = require('lodash');

function pgJsonPath2(tableName, p1, ...p2) {
    const p = p1.concat(p2);
    if (!p.length) throw new Error('Invalid path: empty');
    const prefix = tableName ? `${tableName}.` : '';
    const field = snakeCase(p[0].replace(/[^a-zA-Z0-9_]/g, ''));
    if (p.length === 1) return `${prefix}${field}`;
    const pathElems = p.slice(1).map(v => `'${camelCase(v.replace(/[^a-zA-Z0-9_]/g, ''))}'`).join(',');
    return `jsonb_extract_path(${prefix}${field}::jsonb,${pathElems})`;
}

module.exports = pgJsonPath2;
