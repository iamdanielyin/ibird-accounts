/**
 * 导出声明
 */

module.exports.tokenFromRequest = tokenFromRequest;

/**
 * 从请求中获取token
 * @param {Object} ctx
 * @param {string} options
 */
function tokenFromRequest(ctx, options) {
    const { tokenKey, keys } = options;
    const cookieOpts = {};
    if (keys) {
        cookieOpts.signed = true;
    }
    const token = ctx.query[tokenKey] || (ctx.request && ctx.request.body ? ctx.request.body[tokenKey] : null) || ctx.get(tokenKey) || ctx.cookies.get(tokenKey, cookieOpts);
    if (token) {
        return decodeURIComponent(token);
    }
    throw new Error(`No valid token found, please set your token to querystring, cookie, or request header with '${tokenKey}' key.`);
}