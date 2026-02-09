import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const RateMasterCV = sequelize.define('ratemastercv',  {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Year: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    ZoneNo: {
      type: DataTypes.STRING(3),
      allowNull: true
    },
    ConstructionID: {
      type: DataTypes.STRING(30),
      allowNull: true,
      references: {
        model: 'constructiontypemaster',
        key: 'ConstructionId'
      }
    },
    TypeOfUseID: {
      type: DataTypes.STRING(3),
      allowNull: true,
      references: {
        model: 'typeofuseprimemaster',
        key: 'Type'
      }
    },
    RateSquareMeter: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    RateSquareFeet: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    FloorID: {
      type: DataTypes.STRING(30),
      allowNull: true,
      references: {
        model: 'floormaster',
        key: 'FloorID'
      }
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CreatedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    UpdatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UpdatedDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Remark: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    MinYear: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MaxYear: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ZoneSectionNo: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ratemastercv',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id" },
        ]
      },
      {
        name: "FK_RateMasterCV_ConstructionTypeMaster",
        using: "BTREE",
        fields: [
          { name: "ConstructionID" },
        ]
      },
      {
        name: "FK_RateMasterCV_FloorMaster",
        using: "BTREE",
        fields: [
          { name: "FloorID" },
        ]
      },
      {
        name: "FK_RateMasterCV_TypeOfUsePrimeMaster",
        using: "BTREE",
        fields: [
          { name: "TypeOfUseID" },
        ]
      },
    ]
  });
export default RateMasterCV;
