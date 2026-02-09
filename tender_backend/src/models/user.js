// src/models/user.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    // map to your existing `userid` column
    userId: {
      type: DataTypes.STRING,
      field: 'userid',
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      field: 'username'
    },
    passwordHash: {
      type: DataTypes.STRING,
      field: 'passwordhash',
      allowNull: false
    },
    department: {
      type: DataTypes.INTEGER,
      field: 'department'
    },
    userRoleId: {
      type: DataTypes.INTEGER,
      field: 'userRoleId'
    },
    contactInfo: {
      type: DataTypes.STRING,
      field: 'contactinfo'
    },
    email: DataTypes.STRING,
    isActive: {
      type: DataTypes.BOOLEAN,
      field: 'isactive',
      defaultValue: true
    },
    createdDate: {
      type: DataTypes.DATE,
      field: 'createddate',
      defaultValue: DataTypes.NOW
    },
    createdBy: { type: DataTypes.STRING, field: 'createdby', allowNull: false, defaultValue: 'System' },
    updatedBy: { type: DataTypes.STRING, field: 'updatedby', allowNull: false, defaultValue: 'System' },
    updatedDate: {
      type: DataTypes.DATE,
      field: 'updateddate',
      defaultValue: DataTypes.NOW
    },

  }, {
    tableName: 'Users',
    timestamps: false
  });

  User.associate = models => {
    User.belongsTo(models.UserRole, { foreignKey: 'userRoleId' });
    User.belongsTo(models.MasterDepartment, { foreignKey: 'department' });
  };

  return User;
};
