const pg = require('pg');
const boolean = require('boolean');
const logger = require('./logger')(module);

const {
    NODE_ENV,
    POSTGRES_HOST = 'localhost',
    POSTGRES_PORT = 5432,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    POSTGRES_DEBUG_SQL = false,
} = process.env;

const config = {
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DB,
    // max number of clients in the pool
    max: 10,
    // how long a client is allowed to remain idle before being closed
    idleTimeoutMillis: NODE_ENV === 'production' ? 1000 : 10,

    // abort any statement that takes more than the specified number of milliseconds
    statement_timeout: 1000,
};

const pool = new pg.Pool(config);

pool.on('error', (err) => {
    // if an error is encountered by a client while it sits idle in the pool
    // the pool itself will emit an error event with both the error and
    // the client which emitted the original error
    // this is a rare occurrence but can happen if there is a network partition
    // between your application and the database, the database restarts, etc.
    // and so you might want to handle it and at least log it out
    logger.error('[POSTGRES]', 'idle client error', err.message, err.stack);
    throw err;
});

pool.connect((err, client) => {
    if (err) {
        logger.error('[POSTGRES]', 'error', err.message, err.stack);
        throw err;
    } else {
        logger.info('[POSTGRES]', 'connected');
        client.release();
    }
});

pg.Client.prototype.squel = function squel(sql) {
    const { text, values } = sql.toParam();

    if (boolean(POSTGRES_DEBUG_SQL)) {
        logger.info('[SQUEL]', sql.toString());
    }

    return this.query(text, values)
        .catch((err) => {
            logger.error([
                '[POSTGRES ERROR]',
                `SQL: ${sql.toString()}`,
                `Error: ${err.message}`,
            ].join('\n\t'));
            throw err;
        });
};

pool.squel = (sql) => {
    const { text, values } = sql.toParam();

    if (boolean(POSTGRES_DEBUG_SQL)) {
        logger.info('[SQUEL]', sql.toString());
    }

    return pool.query(text, values)
        .catch((err) => {
            logger.error([
                '[POSTGRES ERROR]',
                `SQL: ${sql.toString()}`,
                `Error: ${err.message}`,
            ].join('\n\t'));
            throw err;
        });
};

pool.quit = (cb) => {
    pool.end(() => {
        logger.info('[POSTGRES]', 'disconnected');
        cb();
    });
};

pool.transaction = async (fn) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const result = await fn(client);
        await client.query('COMMIT');
        return result;
    } catch (err) {
        logger.error('[POSTGRES]', err);
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

module.exports = pool;
