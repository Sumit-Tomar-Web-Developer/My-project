// src/models/MasterDepartment.js
module.exports = (sequelize, DataTypes) => {
  const MasterDepartment = sequelize.define('MasterDepartment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false
    },
    departmentname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      field: 'isactive',
      defaultValue: true
    },
  }, {
    tableName: 'MasterDepartment',
    timestamps: false
  });

  MasterDepartment.associate = models => {
    // A status can have many tenders
    MasterDepartment.hasMany(models.User, {
      foreignKey: 'department',
      as: 'Users'
    });
  };

  return MasterDepartment;
};
