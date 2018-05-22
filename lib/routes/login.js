/**
 * 导出声明
 */

const jwt = require('jsonwebtoken');
const context = {};

module.exports = (obj) => {
    Object.assign(context, obj);
    return {
        name: 'login',
        method: 'POST',
        path: '/login',
        middleware: loginRoute
    };
};


/**
 * 登录接口
 * @param {object} ctx
 */
async function loginRoute(ctx) {
    const options = context.options;
    try {
        const payload = await options.payloadGetter(ctx);
        if (!payload) {
            throw new Error('payload is not an object literal.')
        } else if (payload.errcode) {
            ctx.body = payload;
            return;
        }
        const token = jwt.sign(payload, options.secretOrPrivateKey, options.signOpts);
        const decoded = jwt.verify(token, options.secretOrPrivateKey, options.signOpts);
        const cookieOpts = {
            maxAge: decoded.exp * 1000 - Date.now(),
            expires: new Date(decoded.exp * 1000)
        };
        if (options.keys) {
            cookieOpts.signed = true;
        }
        ctx.cookies.set(options.tokenKey, encodeURIComponent(token), cookieOpts);
        if (ctx.session) {
            ctx.session[token] = decoded;
        }
        ctx.body = { data: Object.assign({}, payload, { [options.tokenKey]: token }) };
    } catch (error) {
        ctx.body = {
            errcode: 500,
            errmsg: context.getLocaleString('ibird_accounts_error_login'),
            errstack: error.message
        }
    }
}