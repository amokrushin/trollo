const packageJson = require('../package.json');

module.exports = {
    ping() {
        return (req, res) => {
            res.status(200).end('pong');
        };
    },
    info() {
        return [
            (req, res) => {
                res.status(200).json({
                    name: packageJson.name,
                    version: packageJson.version,
                });
            },
        ];
    },
};
