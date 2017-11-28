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
}


/**
 * 导出模块
 */
module.exports = {
    namespace,
    onLoad,
    middleware,
    routes,
    enable: {

    }
};