/**
 * 导出声明
 */

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
 * 退出接口
 * @param {object} ctx
 */
async function logoutRoute(ctx) {
    ctx.body = { data: null };
}