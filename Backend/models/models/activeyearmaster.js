import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';
const ActiveYearMaster = sequelize.define('activeyearmaster', {
    ActiveYearID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ActiveYear: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Description: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    TaxTable: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Status: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CreatedBy: { type: DataTypes.INTEGER, allowNull: true },
    CreatedDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    UpdatedBy: { type: DataTypes.INTEGER, allowNull: true },
    UpdatedDate: { type: DataTypes.DATE, allowNull: true }
  }, {
    sequelize,
    tableName: 'activeyearmaster',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ActiveYearID" },
        ]
      },
    ]
  });
export default ActiveYearMaster