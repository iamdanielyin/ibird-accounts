/**
 * 导出声明
 */

module.exports = (User) => {
    return {
        name: 'logout',
        method: 'POST',
        path: '/logout',
        middleware: async function (ctx) {
            ctx.body = { data: null };
        }
    };
};