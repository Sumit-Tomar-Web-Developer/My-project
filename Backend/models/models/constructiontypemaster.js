import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const ConstructionTypeMaster = sequelize.define('constructiontypemaster',
 {
    CTMId: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement:true,
    },
    ConstructionId: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: "ConstructionId_UNIQUE"
    },
    Description: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    Weightage: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    CreatedBy: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    UpdatedBy: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    UpdatedDate: {
      type: DataTypes.DATE(6),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'constructiontypemaster',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "CTMId" },
        ]
      },
      {
        name: "ConstructionId_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ConstructionId" },
        ]
      },
    ]
  });
  export default ConstructionTypeMaster;
