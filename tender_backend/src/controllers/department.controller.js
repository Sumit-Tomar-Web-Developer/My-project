
const { Op } = require('sequelize');
const {
    MasterDepartment
} = require('../models');
const { API_STATUS } = require('../utilities/utils');



/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Retrieve all departments
 *     description: Fetches a list of all departments from the database.
 *     tags:
 *       - Departments
 *     responses:
 *       200:
 *         description: A list of departments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The department ID
 *                   name:
 *                     type: string
 *                     description: The department name
 *       500:
 *         description: Internal server error
 */
exports.getalldepartments = (req, res, next) =>
    MasterDepartment.findAll()
        .then(roles => res.status(200).json({
            type: API_STATUS.SUCCESS,
            message: "",
            data: roles
        }))
        .catch(next);