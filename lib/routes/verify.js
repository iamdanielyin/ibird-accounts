/**
 * 导出声明
 */

const context = {};

module.exports = (obj) => {
    Object.assign(context, obj);

    return {
        name: 'verify',
        method: 'POST',
        path: '/verify',
        middleware: verifyRoute
    };
};


/**
 * 验证接口
 * @param {object} ctx
 */
async function verifyRoute(ctx) {
    ctx.body = { data: null };
}