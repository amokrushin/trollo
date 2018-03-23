const app = require('./app');

const {
    APP_PORT = 80,
} = process.env;

// Start server
app.server.listen(APP_PORT, () => {
    console.info('[HTTP SERVER]', `listening on port ${app.server.address().port}`);
});
