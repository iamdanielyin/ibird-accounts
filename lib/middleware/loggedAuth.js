/**
 * 导出声明
 */

const jwt = require('jsonwebtoken');
const context = {};

module.exports = (obj) => {
    Object.assign(context, obj);
    return loggedAuth;
};


/**
 * 登录验证中间件
 * @param {object} ctx
 * @param {function} next
 */
async function loggedAuth(ctx, next) {

}