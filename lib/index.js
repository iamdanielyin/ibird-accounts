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

/**
 * 加载插件
 * @param app
 * @param options
 */
function onLoad(app, options) {
    ctx.app = app;
    ctx.options = options;

    if (options.payloadGetter) {
        if (typeof options.payloadGetter !== 'function') {
            throw new Error(`'payloadGetter' must be a function.`);
        }
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