const EventEmitter = require('events');
const { bindAll } = require('lodash');
const path = require('path');
const validate = require('./validate');
const ModelsRegistry = require('./ModelsRegistry');

const paramsSchema = {
    type: 'object',
    properties: {
        schema: {
            type: 'object',
        },
        singularName: {
            type: 'string',
        },
        pluralName: {
            type: 'string',
        },
    },
    required: ['schema', 'singularName', 'pluralName'],
};

class Model {
    static init(params) {
        validate(paramsSchema, params);

        this._schema = params.schema;
        this._singularName = params.singularName;
        this._pluralName = params.pluralName;

        this._eventEmitter = new EventEmitter();
        const eventEmitterMethods = ['on', 'once', 'removeAllListeners', 'removeListener', 'emit'];
        bindAll(this._eventEmitter, eventEmitterMethods);
        eventEmitterMethods.forEach((method) => {
            Object.defineProperty(this, method, {
                value: this._eventEmitter[method],
            });
        });

        this.registry.set(this.name, this);
    }

    static get schema() {
        return this._schema;
    }

    static get singularName() {
        return this._singularName;
    }

    static get pluralName() {
        return this._pluralName;
    }

    static get registry() {
        if (!Model._registry) {
            Model._registry = new ModelsRegistry({ autoloadDir: path.resolve(__dirname, '../models') });
        }
        return Model._registry;
    }
}

module.exports = Model;
