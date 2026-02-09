import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const oldConstructionTypeMaster = sequelize.define(
  'oldconstructiontypemaster',
  {
    OldConstructionId: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
    },
    OldDescription: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    OldID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "OldID_UNIQUE"
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    CreatedDate: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    UpdatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    UpdatedDate: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'oldconstructiontypemaster',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'OldConstructionId' }],
      },
      {
        name: "OldID_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "OldID" },
        ]
      },
    ]
  });
  export default oldConstructionTypeMaster
