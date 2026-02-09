const { User } = require('../models');

/**
 * Fetch email addresses for users filtered by department, role, and active status.
 * Any filter with a null or undefined value is ignored.
 *
 * @param {Object} filters
 * @param {number|null} [filters.departmentId] - Department identifier to filter by.
 * @param {number|null} [filters.roleId] - Role identifier to filter by.
 * @param {boolean|null} [filters.isActive] - Active status to filter by.
 * @returns {Promise<string[]>} Array of user email addresses.
 */
async function fetchEmailUtility({ departmentId = null, roleId = null, isActive = null } = {}) {
  const whereClause = {};

  if (departmentId !== null && departmentId !== undefined) {
    whereClause.department = departmentId;
  }

  if (roleId !== null && roleId !== undefined) {
    whereClause.userRoleId = roleId;
  }

  if (isActive !== null && isActive !== undefined) {
    whereClause.isActive = isActive;
  }

  const users = await User.findAll({
    where: whereClause,
    attributes: ['email'],
    raw: true,
  });

  return users
    .map(user => user.email)
    .filter(email => Boolean(email));
}

module.exports = { fetchEmailUtility };
