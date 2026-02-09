const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('applaypenaltycustomizations', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    OwnerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'propertymast',
        key: 'OwnerID'
      }
    },
    FinanceYear: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    PrePenalty: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    PenPenalty: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    CurrPenalty: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    Remark1: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Remark2: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    UpdatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UpdatedDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'applaypenaltycustomizations',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "idx_OwnerId_FinanceYear",
        using: "BTREE",
        fields: [
          { name: "OwnerId" },
          { name: "FinanceYear" },
        ]
      },
      {
        name: "idx_CreatedDate",
        using: "BTREE",
        fields: [
          { name: "CreatedDate" },
        ]
      },
      {
        name: "idx_UpdatedDate",
        using: "BTREE",
        fields: [
          { name: "UpdatedDate" },
        ]
      },
    ]
  });
};
