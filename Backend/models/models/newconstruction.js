const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('newconstruction', {
    ROwnerID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    RTypeOfUse: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    RReason: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    RALV: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    RMaintenance: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    RRV: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    COwnerID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CTypeOfUse: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    CReason: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    CALV: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    CMaintenance: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    CRV: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'newconstruction',
    timestamps: false
  });
};
