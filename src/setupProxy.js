const { createProxyMiddleware } = require("http-proxy-middleware");
const { REACT_APP_API_PROXY_URL, REACT_APP_LOAN_API_PROXY_URL } = process.env;
module.exports = (app) => {
  app.use('/api/v1', createProxyMiddleware({
    target: REACT_APP_API_PROXY_URL,
    changeOrigin: true,
    logLevel: "debug"
  }));
  app.use('/api/loan/v1', createProxyMiddleware({
    target: REACT_APP_LOAN_API_PROXY_URL,
    changeOrigin: true,
    logLevel: "debug"
  }));
}