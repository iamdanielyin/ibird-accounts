/**
 * 账户模块
 */

const utility = require('ibird-utils');
const namespace = 'ibird-accounts';
const routes = {
    login: require('./routes/login'),
    logout: require('./routes/logout')
}
const middleware = {
    loggedAuth: require('./middleware/loggedAuth')
}

/**
 * 加载插件
 * @param app
 */
function onLoad(app) {
    const config = app.c();
    const { userModelGetter } = config;
    if (typeof userModelGetter !== 'function') {
        throw new Error(`'userModelGetter' must be a function.`);
    }

    const User = userModelGetter(app);
    // 加工路由
    for (const key in routes) {
        const route = routes[key];
        routes[key] = route(User);
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