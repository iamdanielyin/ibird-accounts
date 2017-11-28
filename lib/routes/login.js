/**
 * 导出声明
 */

module.exports = {
    name: 'login',
    method: 'POST',
    path: '/login',
    middleware
};

/**
 * 接口中间件
 * @param {function} ctx - 上下文对象
 */
function middleware(ctx) {
    ctx.body = { data: null };
}