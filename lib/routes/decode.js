/**
 * 导出声明
 */

const jwt = require('jsonwebtoken');
const utility = require('../utility');
const context = {};

module.exports = (obj) => {
    Object.assign(context, obj);
    return {
        name: 'decode',
        method: 'GET',
        path: '/decode',
        middleware: decodeRoute
    };
};


/**
 * 解码接口
 * @param {object} ctx
 */
async function decodeRoute(ctx) {
    const options = context.options;
    try {
        const token = utility.tokenFromRequest(ctx, options);
        const decoded = jwt.decode(token);
        ctx.body = { data: decoded };
    } catch (error) {
        ctx.body = {
            errcode: 500,
            errmsg: context.getLocaleString('ibird_accounts_error_decode'),
            errstack: error.message
        };
    }
}