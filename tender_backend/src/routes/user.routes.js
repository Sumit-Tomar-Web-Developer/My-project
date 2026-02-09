const r = require('express').Router();
const ctrl = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

r.post('/', authenticate, ctrl.addUser);
r.put('/', authenticate, ctrl.updateUser);
r.delete('/', authenticate, ctrl.deleteUser);
r.get('/', authenticate, ctrl.getAllUsers);
r.get('/user', authenticate, ctrl.getUserById);
r.get('/userIds', authenticate, ctrl.getAllUserIds);
r.get('/template', authenticate, ctrl.downloadUserTemplate);
r.post('/bulk', authenticate, upload.single('file'), ctrl.bulkUploadUsers);
module.exports = r;
