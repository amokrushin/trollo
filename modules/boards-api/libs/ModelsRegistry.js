class ModelsRegistry extends Map {
    constructor(params = {}) {
        super();
        this.autoloadDir = params.autoloadDir || '.';
    }

    autoload(name) {
        if (!this.has(name)) {
            // eslint-disable-next-line import/no-dynamic-require, global-require
            const Model = require(`${this.autoloadDir}/${name}`);
            this.set(Model.name, Model);
        }
        return this.get(name);
    }
}

module.exports = ModelsRegistry;
