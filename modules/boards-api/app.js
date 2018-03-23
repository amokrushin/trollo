const http = require('http');
const express = require('express');
const logger = require('./services/logger')(module);
const controllers = require('./controllers');

const {
    NODE_ENV = 'production',
} = process.env;

const app = express();

logger.info('[APP]', `app running in ${NODE_ENV.toUpperCase()} mode`);

app.server = http.createServer(app);

app.set('trust proxy', 1);
app.set('json spaces', 2);

app.get('/ping', controllers.utils.ping());
app.get('/info', controllers.utils.info());
// app.use('/auth', controllers.auth());
// app.use('/users', controllers.users());
// app.use('/template', controllers.template());
app.use('/users', controllers.users());
app.use('/boards', controllers.boards());
app.use(controllers.error());

module.exports = app;
