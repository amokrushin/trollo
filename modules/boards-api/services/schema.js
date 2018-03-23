const path = require('path');
const Schema = require('../models/Schema');

const { FRONT_ORIGIN, SCHEMAS_BASE_URL } = process.env;

module.exports = new Schema({
    schemasDir: path.join(__dirname, '../schemas/resources'),
    filter: filename => /\.(js|json)$/.test(filename),
    namespace: `${FRONT_ORIGIN}${SCHEMAS_BASE_URL}`,
});
