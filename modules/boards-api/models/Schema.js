const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const { get } = require('lodash');

class Schema {
    constructor(params) {
        this.params = params || {};

        this._schemas = fs.readdirSync(this.params.schemasDir)
            .filter(this.params.filter)
            .map(filename => require(path.join(this.params.schemasDir, filename)));

        this._ajv = new Ajv({ schemas: this._schemas });
    }

    getById(id) {
        return get(this._ajv.getSchema(id), 'schema');
    }

    getByName(name) {
        const schemaId = `${this.params.namespace}/${name}.json`;
        return get(this._ajv.getSchema(schemaId), 'schema');
    }

    get list() {
        return this._schemas;
    }

    get keys() {
        return this._schemas
            .filter(schema => schema.$id.includes(this.params.namespace))
            .map(schema => schema.$id);
    }
}

module.exports = Schema;
