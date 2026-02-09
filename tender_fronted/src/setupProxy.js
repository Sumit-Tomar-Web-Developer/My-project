const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/webapi',
        createProxyMiddleware({
           // target: 'http://localhost:8080',
target: 'http://tender.cp',            
            changeOrigin: true,
            pathRewrite: {
                '^/webapi': '', // Removes '/webapi' from the path, effectively redirecting '/webapi/{x}' to '/{x}'
            },
            logLevel: 'debug',
        })
    );
};
