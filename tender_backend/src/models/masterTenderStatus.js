// src/models/masterTenderStatus.js
module.exports = (sequelize, DataTypes) => {
  const MasterTenderStatus = sequelize.define('MasterTenderStatus', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'MasterTenderStatus',
    timestamps: false
  });

  MasterTenderStatus.associate = models => {
    // A status can have many tenders
    MasterTenderStatus.hasMany(models.Tender, {
      foreignKey: 'currentStatus',
      as: 'tenders'
    });
  };

  return MasterTenderStatus;
};
