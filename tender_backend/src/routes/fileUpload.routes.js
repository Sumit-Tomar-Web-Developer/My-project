const r = require('express').Router();
require('../controllers/fileUpload.controller').router(r);
module.exports = r;