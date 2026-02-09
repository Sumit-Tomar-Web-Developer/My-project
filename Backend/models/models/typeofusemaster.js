import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
import TypeOfUseGroupMaster from './typeofusegroupmaster.js';
const TypeofUseMaster = sequelize.define('typeofusemaster', {
    ID: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement : true
    },
    TypeOfUseID: {
      type: DataTypes.STRING(5),
      allowNull: false,
      unique: "UQ__TypeOfUs__8FDD50607EE1CA6C"
    },
    Description: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Type: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    GroupID: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    GroupDescription: {
      type: DataTypes.STRING(100),
      allowNull: true
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
    tableName: 'typeofusemaster',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID" },
        ]
      },
      {
        name: "UQ__TypeOfUs__8FDD50607EE1CA6C",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "TypeOfUseID" },
        ]
      },
      {
        name: "FK_TypeOfUseMaster_RateMaster",
        using: "BTREE",
        fields: [
          { name: "Type" },
        ]
      },
      
    ]
  });
  TypeofUseMaster.belongsTo(TypeOfUseGroupMaster, {
    foreignKey: 'GroupID',
    targetKey: 'GroupID',
  })
  export default TypeofUseMaster