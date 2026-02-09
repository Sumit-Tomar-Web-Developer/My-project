const { User } = require('../models');
const bcrypt = require('bcryptjs');
const config = require('../config');
const { API_STATUS, generateRandomPassword, USER_ROLES, DEPARTMENTS } = require('../utilities/utils');
const ExcelJS = require('exceljs');

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Add a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              userId:
 *               type: string
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               userRoleId:
 *                 type: integer
 *               contactInfo:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *              - userId  
 *               - name
 *               - password
 *               - userRoleId
 *               - email
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 userRoleId:
 *                   type: integer
 *                 contactInfo:
 *                   type: string
 *                 createdBy:
 *                   type: integer
 *       403:
 *         description: Access Denied
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
exports.addUser = async (req, res, next) => {
  try {
    if (req.user.userRoleId !== USER_ROLES.ADMIN.id) return res.status(403).json({
      type: API_STATUS.ERROR,
      message: 'Access Denied.Only admins can perform this action'
    });

    const { userId, name, userRoleId, contactInfo, email, department } = req.body;
    const createdBy = req.user.userId;

    // Validate required fields
    if (!userId || !name || !userRoleId || !email) return res.status(400).json({
      type: API_STATUS.ERROR,
      message: 'Please provide all required fields'
    });

    // Validate userRoleId
    if (![1, 2, 3, 4, 5, 6].includes(userRoleId)) return res.status(400).json({
      type: API_STATUS.ERROR,
      message: 'Invalid user role ID'
    });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({
      type: API_STATUS.ERROR,
      message: 'Invalid email format'
    });

    // Validate contactInfo format
    const contactInfoRegex = /^[0-9]{10}$/; // Assuming contactInfo is a 10-digit number
    if (!contactInfoRegex.test(contactInfo)) return res.status(400).json({
      type: API_STATUS.ERROR,
      message: 'Invalid contact info format'
    });

    // Validate userId format
    const userIdRegex = /^[a-zA-Z0-9]+$/; // Assuming userId can contain alphanumeric characters only
    if (!userIdRegex.test(userId)) return res.status(400).json({
      type: API_STATUS.ERROR,
      message: 'Invalid user ID format'
    });


    // Check if userId already exists
    const existingUser = await User.findOne({ where: { userId } });
    if (existingUser) return res.status(400).json({
      type: API_STATUS.ERROR,
      message: 'User ID already exists'
    });


    //const password = generateRandomPassword(); // Default password, Need to be changed by the user on first login
    password = "Test@123";

    const passwordHash = await bcrypt.hash(password, config.passwordHashing.saltRounds);
    //Todo send mail to the user with the password on provided email id

    const u = await User.create({ userId, name, passwordHash, userRoleId, department, contactInfo, email, createdBy });
    res.status(201).json({
      type: API_STATUS.SUCCESS,
      message: "User Created Successfully",
      data: {
        userId: u.userId,
        name: u.name,
        email: u.email,
        userRoleId: u.userRoleId,
        contactInfo: u.contactInfo,
        createdBy: u.createdBy
      }
    });
  } catch (e) { next(e); }
};




/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 userRoleId:
 *                   type: integer
 *                 contactInfo:
 *                   type: string
 *                 createdBy:
 *                   type: integer
 *       403:
 *         description: Access Denied
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
exports.getUserById = async (req, res, next) => {
  try {
    if (req.user.userId != req.params.id && req.user.userRoleId !== USER_ROLES.ADMIN.id) return res.status(403).json({ msg: 'Access Denied. Only admins can perform this action' });


    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
};

/**
 * @swagger
 * /users/template:
 *   get:
 *     summary: Download Excel template for bulk user upload
 *     description: Returns a sample Excel file with the required headers for bulk user creation.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Excel template generated successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Access Denied. Only admins can perform this action
 *       500:
 *         description: Internal Server Error
 */
exports.downloadUserTemplate = async (req, res, next) => {
  try {
    if (req.user.userRoleId !== USER_ROLES.ADMIN.id) {
      return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'Access Denied.Only admins can perform this action'
      });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    const departmentsworksheet = workbook.addWorksheet('Departments Metadata');

        const userroleworksheet = workbook.addWorksheet('User Role Metadata');


    worksheet.columns = [
      { header: 'userId', key: 'userId', width: 20 },
      { header: 'name', key: 'name', width: 25 },
      { header: 'userRoleId', key: 'userRoleId', width: 15 },
      { header: 'email', key: 'email', width: 30 },
      { header: 'contactInfo', key: 'contactInfo', width: 20 },
      { header: 'departmentid', key: 'departmentid', width: 20 },
      { header: 'password', key: 'password', width: 20 }
    ];

    
    departmentsworksheet.columns=[
       { header: 'DepartmentName', key: 'DepartmentName', width: 20 },
       { header: 'DepartmentId', key: 'DepartmentId', width: 15 }

    ];

        userroleworksheet.columns=[
       { header: 'UserRole', key: 'UserRole', width: 20 },
       { header: 'UserRoleId', key: 'UserRoleId', width: 15 }
    ];
    Object.entries(USER_ROLES).forEach(([key, value]) => {
      userroleworksheet.addRow({UserRole: key, UserRoleId: value.id});
    });

   
    Object.entries(DEPARTMENTS).forEach(([key, value]) => {
      departmentsworksheet.addRow({DepartmentName: key, DepartmentId: value.id});
    });


     departmentsworksheet.addRow({});
    departmentsworksheet.addRow({DepartmentName: 'This data is for viewing and reference only. Any change made here will not impact the database.'}).font = { bold: true, color: { argb: 'FFFF00' } };

    userroleworksheet.addRow({});
    userroleworksheet.addRow({DepartmentName: 'This data is for viewing and reference only. Any change made here will not impact the database.'}).font = { bold: true, color: { argb: 'FFFF00' } };



    worksheet.addRow({
      userId: 'user123',
      name: 'John Doe',
      userRoleId: USER_ROLES.MANAGER ? USER_ROLES.MANAGER.id : 2,
      email: 'john.doe@example.com',
      contactInfo: '9999999999',
      departmentid: DEPARTMENTS.IT,
      password: 'Test@123'
    });

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="user_template.xlsx"');
    res.send(Buffer.from(buffer));
  } catch (e) {
    next(e);
  }
};

/**
 * @swagger
 * /users/bulk:
 *   post:
 *     summary: Bulk upload users via Excel. Only new users will be added.Skips Existing users/duplicate entries.
 *     description: Accepts an Excel file following the template to create multiple users at once. Missing passwords default to `Test@123`.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel file matching the user template headers
 *     responses:
 *       200:
 *         description: Bulk upload processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     inserted:
 *                       type: integer
 *                     skipped:
 *                       type: integer
 *       400:
 *         description: Invalid file or no valid rows found
 *       403:
 *         description: Access Denied. Only admins can perform this action
 *       500:
 *         description: Internal Server Error
 */
exports.bulkUploadUsers = async (req, res, next) => {
  try {
    if (req.user.userRoleId !== USER_ROLES.ADMIN.id) {
      return res.status(403).json({
        type: API_STATUS.ERROR,
        message: 'Access Denied.Only admins can perform this action'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'No file uploaded'
      });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);
    const worksheet = workbook.getWorksheet(1);

    if (!worksheet) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Invalid Excel file'
      });
    }

    const expectedHeaders = ['userId', 'name', 'userRoleId', 'email', 'contactInfo', 'departmentid', 'password'];
    const headerRow = worksheet.getRow(1).values.filter(Boolean);

    const hasAllHeaders = expectedHeaders.every(h => headerRow.includes(h));
    if (!hasAllHeaders) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Excel template headers do not match the expected format'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const contactInfoRegex = /^[0-9]{10}$/;
    const userIdRegex = /^[a-zA-Z0-9]+$/;

    const rowsToCreate = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const [, userId, name, userRoleId, email, contactInfo, department, password] = row.values;
      if (!userId || !name || !userRoleId || !email) return;

      if (![1, 2, 3, 4, 5, 6].includes(Number(userRoleId))) return;
      if (!emailRegex.test(email)) return;
      if (contactInfo && !contactInfoRegex.test(String(contactInfo))) return;
      if (!userIdRegex.test(userId)) return;

      rowsToCreate.push({
        userId: String(userId),
        name: String(name),
        userRoleId: Number(userRoleId),
        email: String(email),
        contactInfo: contactInfo ? String(contactInfo) : null,
        department: department ? String(department) : null,
        password: password ? String(password) : 'Test@123'
      });
    });

    if (!rowsToCreate.length) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'No valid user rows found in the file'
      });
    }

    const existingUsers = await User.findAll({
      where: { userId: rowsToCreate.map(r => r.userId) },
      attributes: ['userId']
    });

    const existingUserIds = new Set(existingUsers.map(u => u.userId));

    // Remove any userIds that occur more than once in the uploaded rows,
    // and skip those that already exist in DB.
    const userIdCounts = rowsToCreate.reduce((acc, r) => {
      acc[r.userId] = (acc[r.userId] || 0) + 1;
      return acc;
    }, {});

    const uniqueRows = rowsToCreate.filter(r => userIdCounts[r.userId] === 1 && !existingUserIds.has(r.userId));

    const newUsers = await Promise.all(uniqueRows.map(async (row) => {
      const passwordHash = await bcrypt.hash(row.password, config.passwordHashing.saltRounds);
      return {
      userId: row.userId,
      name: row.name,
      userRoleId: row.userRoleId,
      contactInfo: row.contactInfo,
      email: row.email,
      department: row.department,
      passwordHash,
      createdBy: req.user.userId
      };
    }));

    if (!newUsers.length) {
      return res.status(200).json({
        type: API_STATUS.SUCCESS,
        message: 'No new users to insert',
        data: { inserted: 0, skipped: rowsToCreate.length }
      });
    }

    await User.bulkCreate(newUsers);

    res.status(201).json({
      type: API_STATUS.SUCCESS,
      message: 'Users inserted successfully',
      data: { inserted: newUsers.length, skipped: rowsToCreate.length - newUsers.length }
    });
  } catch (e) {
    next(e);
  }
};


/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               userRoleId:
 *                 type: integer
 *               contactInfo:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *     responses:
 *       204:
 *         description: User updated successfully
 *       403:
 *         description: Access Denied
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
exports.updateUser = async (req, res, next) => {
  try {
    if (req.user.userRoleId !== USER_ROLES.ADMIN.id) return res.status(403).json({
      type: API_STATUS.ERROR,
      message: 'Access Denied.Only admins can perform this action'
    });

    // Extract userId from request parameters and other data from request body
    const { id } = req.query;
    const { userRoleId, password } = req.body;

    if (!id) {
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'User ID is required'
      });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({
      type: API_STATUS.ERROR,
      message: 'User not found'
    });

    // Validate userRoleId
    if (userRoleId && ![1, 2, 3, 4, 5, 6].includes(userRoleId))
      return res.status(400).json({
        type: API_STATUS.ERROR,
        message: 'Invalid user role ID'
      });

    const upd = { userRoleId: userRoleId, updatedBy: req.user.userId };
    if (password) upd.passwordHash = await bcrypt.hash(upd.password, config.passwordHashing.saltRounds);
    await User.update(upd, { where: { userId: id } });

    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: "User Updated Successfully"
    });

  } catch (e) { next(e); }
};



exports.deleteUser = async (req, res, next) => {
  try {
    if (req.user.userRoleId !== USER_ROLES.ADMIN.id) return res.status(403).json({
      type: API_STATUS.ERROR,
      message: 'Access Denied.Only admins can perform this action'
    });

    const { id } = req.query;
    await User.update({ isActive: false }, { where: { userId: id } });

    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: "User Deleted Successfully"
    });
  } catch (e) {
    next(e);
  }
};





/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   username:
 *                     type: string
 *                     example: johndoe
 *       401:
 *         description: Unauthorized
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    if (req.user.userRoleId !== USER_ROLES.ADMIN.id) {
      return res.status(403).json({ msg: 'Access Denied. Only admins can perform this action' });
    }

    // Extract filterData, page, and rowsPerPage from query parameters
    let { userId = '', page = 0, rowsPerPage = 5 } = req.query;

    page = parseInt(page, 10);
    rowsPerPage = parseInt(rowsPerPage, 10);
    if (isNaN(page) || page < 0) page = 0;
    if (isNaN(rowsPerPage) || rowsPerPage < 1) rowsPerPage = 5;

    const offset = (page) * rowsPerPage;

    // Build the query filter dynamically

    const whereClause = { isActive: true };

    if (userId) {
      whereClause.userId = userId;
    }

    console.log(whereClause);
    // Fetch paginated data
    const { rows: users, count } = await User.findAndCountAll({
      where: whereClause,
      attributes: ['userId', 'name', 'department', 'userRoleId', 'contactInfo', 'email'], // Select specific fields
      limit: parseInt(rowsPerPage),
      offset: parseInt(offset),
    });

    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: "",
      data: {
        userList: users,
        totalUsers: count,
        currentPage: parseInt(page),
      },
    });
  } catch (e) {
    next(e);
  }
};


exports.getAllUserIds = async (req, res, next) => {
  try {

    let whereClause = {};
    if (req.user.userRoleId !== USER_ROLES.MD.id) {
      whereClause.department = req.user.department;
    }

    const rows = await User.findAll({
      attributes: ['userId', 'department', 'isActive'], // Select specific fields
      where: whereClause
    });

    res.status(200).json({
      type: API_STATUS.SUCCESS,
      message: "",
      data: {
        userList: rows
      },
    });
  } catch (e) {
    next(e);
  }
};
