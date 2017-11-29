/**
 * 账户模块
 */

const utility = require('ibird-utils');
const namespace = 'ibird-accounts';
const routes = {
    login: require('./routes/login'),
    logout: require('./routes/logout'),
    verify: require('./routes/verify')
}
const middleware = {
    loggedAuth: require('./middleware/loggedAuth')
}
const ctx = {};
const enable = {};

/**
 * 加载插件
 * @param app
 * @param options
 */
function onLoad(app, options) {
    ctx.app = app;
    ctx.options = options;

    if (typeof options.payloadGetter !== 'function') {
        throw new Error(`'payloadGetter' must be a function.`);
    }
    options.tokenKey = options.tokenKey || 'ibird_token';
    options.secretOrPrivateKey = options.secretOrPrivateKey || `${Math.random()}`.substring(2);
    if (options.signOpts) {
        const signOpts = options.signOpts;
        signOpts.expiresIn = signOpts.expiresIn || '1d';
        signOpts.issuer = signOpts.issuer || namespace;
        options.signOpts = signOpts;
    }
    if (options.keys) {
        app.keys = keys;
    }
    ctx.getLocaleString = app.getLocaleString;
    if (typeof ctx.getLocaleString !== 'function') {
        ctx.getLocaleString = (key) => {
            const object = {
                ibird_accounts_error_verify: '验证登录信息失败，请稍后重试',
                ibird_accounts_error_decode: '查询登录信息失败，请稍后重试',
                ibird_accounts_error_login: '登录失败，请稍后重试',
                ibird_accounts_error_logout: '退出登录失败，请稍后重试',
                ibird_accounts_error_loggedAuth: '未登录或登录会话已过期',
                ibird_accounts_error_missError: '服务器异常，请稍后重试'
            };
            return object[key];
        };
    }

    // 加工中间件
    for (const key in middleware) {
        const item = middleware[key];
        middleware[key] = item(ctx);
    }
    // 加工路由
    for (const key in routes) {
        const item = routes[key];
        routes[key] = item(ctx);
    }
}

/**
 * 导出模块
 */
module.exports = {
    namespace,
    onLoad,
    middleware,
    routes
};