/**
 * 导出声明
 */

const utility = require('../utility');
const context = {};

module.exports = (obj) => {
    Object.assign(context, obj);
    return {
        name: 'logout',
        method: 'POST',
        path: '/logout',
        middleware: logoutRoute
    };
};


/**
 * 登出接口
 * @param {object} ctx
 */
async function logoutRoute(ctx) {
    const options = context.options;
    try {
        const token = utility.tokenFromRequest(ctx, options);
        ctx.cookies.set(options.tokenKey, null, { maxAge: -1 });
        if (ctx.session) {
            delete ctx.session[token];
        }
        ctx.body = { data: 'ok' };
    } catch (error) {
        ctx.body = {
            errcode: 500,
            errmsg: context.getLocaleString('ibird_accounts_error_logout'),
            errstack: error.message
        };
    }
}