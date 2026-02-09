const { User, UserRole, MasterDepartment } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { API_STATUS } = require('../utilities/utils');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user and return a JWT token.
 *     tags:
 *       - Authentication
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: Test@123
 *     responses:
 *       200:
 *         description: Successful login.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials.
 */
exports.login = async (req, res) => {


  const { userId, password } = req.body;

  const user = await User.findOne({ where: { userId }, include: MasterDepartment });

  if (!user || !await bcrypt.compare(password, user.passwordHash)) return res.status(401).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ id: user.userId }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  res.json({
    type: API_STATUS.SUCCESS,
    message: "Logged In!!",
    data: {
      id: user.userId, name: user.name,
      department: user.department,
      departmentName: user.MasterDepartment.departmentname,
      role: user.userRoleId, token: token
    }
  });
};