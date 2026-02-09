const r = require('express').Router();
const ctrl = require('../controllers/userRole.controller');
const { authenticate } = require('../middlewares/auth.middleware');
r.post('/', authenticate, ctrl.addRole);
r.put('/:id', authenticate, ctrl.updateRole);
r.delete('/:id', authenticate, ctrl.deleteRole);
r.get('/', authenticate, ctrl.getAllRoles);
module.exports = r;