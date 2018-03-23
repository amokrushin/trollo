const fs = require('fs');
const path = require('path');
const pg = require('../services/postgres');

module.exports.up = async () => {
    const scriptName = path.parse(module.id).name;
    const sql = fs.readFileSync(`migrations/${scriptName}-up.sql`, 'utf8');
    await pg.transaction((client) => client.query(sql));
};

module.exports.down = async () => {
    const scriptName = path.parse(module.id).name;
    const sql = fs.readFileSync(`migrations/${scriptName}-down.sql`, 'utf8');
    await pg.transaction((client) => client.query(sql));
};
