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
    const whitelists = (typeof options.whitelists === 'function') ? options.whitelists :
        (Array.isArray(options.whitelists) ? defaultWhitelists(options.whitelists) : null);

    // 获取token
    let token, tokenError;
    try {
        token = utility.tokenFromRequest(ctx, options);
    } catch (error) {
        tokenError = error;
    }

    // 判断是否存在白名单过滤器
    if (whitelists) {
        try {
            const ok = await whitelists(ctx);
            if (ok) {
                await throughRequest(ctx, next);
                return;
            }
        } catch (error) {
            ctx.body = {
                errcode: 555,
                errmsg: context.getLocaleString('ibird_accounts_error_loggedAuth'),
                errstack: error.message
            };
            return;
        }
    }

    // 验证是否提供token
    if (!token || tokenError) {
        ctx.body = {
            errcode: 555,
            errmsg: context.getLocaleString('ibird_accounts_error_loggedAuth'),
            errstack: tokenError.message
        };
        return;
    }

    // 验证token是否有效
    let decoded;
    try {
        decoded = jwt.verify(token, options.secretOrPrivateKey, options.signOpts);
    } catch (error) {
        ctx.body = {
            errcode: 555,
            errmsg: context.getLocaleString('ibird_accounts_error_loggedAuth'),
            errstack: error.message
        };
        return;
    }

    // 验证解码是否成功
    if (!decoded) {
        ctx.body = {
            errcode: 555,
            errmsg: context.getLocaleString('ibird_accounts_error_loggedAuth'),
            errstack: error.message
        };
        return;
    }

    await throughRequest(ctx, next);
}

/**
 * 下游处理
 * @param {Object} ctx 
 * @param {function} next 
 */
async function throughRequest(ctx, next) {
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

/**
 * 获取默认白名单过滤器
 * @param {Array} array - 过滤列表
 */
function defaultWhitelists(array) {
    return function whitelistsFilter(ctx) {
        const request = `${ctx.method} ${ctx.request.path}`;
        if (array.indexOf(request) >= 0) return true;

        for (const item of array) {
            const regex = (item instanceof RegExp) ? item : new RegExp(item, 'gi');
            if (regex.test(request)) return true;
        }
        return false;
    };
}