const serverless = require('serverless-http');
const { createServer } = require('@vue-storefront/middleware');
const middlewareConfig = require('../../middleware.config');

function middlewareHandler() {
  const app = createServer(middlewareConfig);
  const server = serverless(app);
  return (event, ctx, callback) => {
    return server(event, ctx, callback);
  };
}

exports.handler = middlewareHandler();
