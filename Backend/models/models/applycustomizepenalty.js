const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('applycustomizepenalty', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    OwnerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    FinanceYear: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    PrePenalty: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    PenPenalty: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    CurrPenalty: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    Remark1: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Remark2: {
      type: DataTypes.STRING(500),
      allowNull: true
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
    tableName: 'applycustomizepenalty',
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
    ]
  });
};
