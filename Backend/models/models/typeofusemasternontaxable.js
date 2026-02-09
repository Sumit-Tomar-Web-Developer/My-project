import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';

    const TypeOfUseMasterNonTaxable = sequelize.define("typeofusemasternontaxable", {
      ID: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      TypeOfUseID: {
        type: DataTypes.STRING(5),
        allowNull: false,
        unique: true,
      },
      Type: {
        type: DataTypes.STRING(10),
      allowNull: false,
      },
      Description: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      CreatedBy: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      CreatedDate: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
      UpdatedBy: {
        type: DataTypes.SMALLINT,
        allowNull: true,
      },
      UpdatedDate: {
        type: DataTypes.DATE(6),
        allowNull: true,
      }
    }, {
      tableName: "typeofusemasternontaxable",
      timestamps: false
    });
  
    export default  TypeOfUseMasterNonTaxable;
 
  