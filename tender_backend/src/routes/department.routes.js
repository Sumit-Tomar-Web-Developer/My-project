const r = require('express').Router();
const ctrl = require('../controllers/department.controller');
const { authenticate } = require('../middlewares/auth.middleware');
r.get('/', authenticate, ctrl.getalldepartments);
module.exports = r;