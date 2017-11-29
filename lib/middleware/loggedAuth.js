/**
 * 导出声明
 */

const jwt = require('jsonwebtoken');
const utility = require('../utility');
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
    const options = context.options;
    const loggedAuthFilter = (typeof options.loggedAuthFilter === 'function') ? options.loggedAuthFilter : null;

    // 获取token
    let token;
    try {
        token = utility.tokenFromRequest(ctx, options);
    } catch (error) {
        // 无token
        if (!loggedAuthFilter) {
            // 无自定义规则
            ctx.body = {
                errcode: 500,
                errmsg: context.getLocaleString('ibird_accounts_error_loggedAuth'),
                errstack: error.message
            };
            return;
        }
    }

    // 验证并解码token
    let decoded, expiredError;
    try {
        decoded = jwt.verify(token, options.secretOrPrivateKey, options.signOpts);
    } catch (error) {
        expiredError = error;
    }

    // 处理验证逻辑
    if (loggedAuthFilter) {
        // 自定义过滤规则，开发者需自行处理中间件的下游逻辑
        try {
            await loggedAuthFilter(token, ctx, next);
        } catch (error) {
            ctx.body = {
                errcode: 500,
                errmsg: context.getLocaleString('ibird_accounts_error_loggedAuth'),
                errstack: error.message
            };
        }
        return;
    } else {
        // 插件处理下游逻辑
        if (!decoded || expiredError) {
            // token已过期
            ctx.body = {
                errcode: 500,
                errmsg: context.getLocaleString('ibird_accounts_error_loggedAuth'),
                errstack: expiredError || 'jwt expired'
            };
            return;
        }
    }

    try {
        await next();
    } catch (error) {
        ctx.body = {
            errcode: 500,
            errmsg: context.getLocaleString('ibird_accounts_error_missError'),
            errstack: error.message
        };
    }
}