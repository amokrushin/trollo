const Winston = require('winston');
const path = require('path');

module.exports = (module) => {
    const dir = module.filename.split(path.sep).slice(-2).join(path.sep);
    const transports = [];

    transports.push(new Winston.transports.Console({
        colorize: true,
        level: 'debug',
        label: dir,
    }));

    return new Winston.Logger({ transports });
};
