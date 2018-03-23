const squel = require('../libs/squel');

module.exports = {
    jsonAgg(expression, options = {}) {
        const { distinct } = options;
        return [
            'CASE',
            `WHEN count(${expression}) = 0`,
            "THEN '[]'",
            `ELSE jsonb_agg(${distinct ? 'DISTINCT' : ''} ${expression})`,
            'END',
        ].join(' ');
    },
    lateral(expression) {
        return squel.rstr('LATERAL (?)', expression);
    },
    toJson(expression) {
        return `to_jsonb(${expression})`;
    },
};
