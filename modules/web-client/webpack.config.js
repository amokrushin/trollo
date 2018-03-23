const {
    APP_ORIGIN,
    APP_VHOST = '',
    PUBLIC_PATH,
} = Object.assign(process.env, {
    APP_ORIGIN: process.env.FRONT_ORIGIN,
    APP_VHOST: '',
    PUBLIC_PATH: '',
    BUILD_PATH: `${process.env.FRONT_ORIGIN}/static/`,
    WP_INDEX: false,
    WPK_EXTRACT_RUNTIME: true,
    WPK_DEVTOOL: process.env.NODE_ENV === 'production' ? 'source-map' : 'inline-cheap-source-map',

    WDS_HOST: '0.0.0.0',
    WDS_PORT: 80,
    WDS_HMR: true,
    WDS_SOCK_PATH: '/__wds__/web-client',

    CSS_MODULES: true,
    CSS_SOURCE_MAP: false,
});

const wpkfg = require('wpkfg');

const config = wpkfg(({ webpack }) => [{
    plugins: [
        new webpack.EnvironmentPlugin({
            APP_ORIGIN,
            APP_VHOST,
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    devServer: {
        overlay: true,
    },
}]);

module.exports = config;
