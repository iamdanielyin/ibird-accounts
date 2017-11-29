/**
 * 导出声明
 */

module.exports = (User) => {
    return {
        name: 'login',
        method: 'POST',
        path: '/login',
        middleware: async function (ctx) {
            ctx.body = { data: null };
        }
    };
};