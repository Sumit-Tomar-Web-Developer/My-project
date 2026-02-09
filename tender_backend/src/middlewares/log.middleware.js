const { createLogger, transports, format } = require('winston');
const config = require('../config');
const logger = createLogger({
  level: config.logLevel,
  format: format.combine(format.timestamp(), format.json()),
  transports: [ new transports.Console() ]
});
exports.requestLogger = (req, res, next) => {
  if (!config.enableLogging) return next();
  logger.info({ msg:'REQ', method:req.method, url:req.url, body:req.body });
  const start = Date.now();
  res.on('finish', () => {
    logger.info({ msg:'RES', method:req.method, url:req.url, status:res.statusCode, duration:Date.now()-start });
  });
  next();
};
exports.logger = logger;