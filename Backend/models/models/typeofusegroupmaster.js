import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const TypeOfUseGroupMaster = sequelize.define('typeofusegroupmaster', {
    GroupID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    GroupDescription: {
      type: DataTypes.STRING(250),
      allowNull: true
    },

  }, {
    sequelize,
    tableName: 'typeofusegroupmaster',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "GroupID" },
        ]
      },
     
    ]
    
  });

  TypeOfUseGroupMaster.hasMany(TypeOfUseGroupMaster, {
    foreignKey: 'GroupID',
    sourceKey: 'GroupID',
  });
    export default TypeOfUseGroupMaster

