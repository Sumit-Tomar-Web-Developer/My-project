import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const RateMaster = sequelize.define('ratemaster', {
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
    type: DataTypes.STRING(5),
    allowNull: true
  },
  ConstructionID: {
    type: DataTypes.STRING(10),
    allowNull: true,
    references: {
      model: 'constructiontypemaster',
      key: 'ConstructionId'
    }
  },
  TypeOfUseID: {
    type: DataTypes.STRING(10),
    allowNull: true,
    references: {
      model: 'typeofuseprimemaster',
      key: 'Type'
    }
  },
  RateSquareMeter: {
    type: DataTypes.DECIMAL(19, 4),
    allowNull: true
  },
  RateSquareFeet: {
    type: DataTypes.DECIMAL(19, 4),
    allowNull: true
  },
  FloorID: {
    type: DataTypes.STRING(10),
    allowNull: true,
    references: {
      model: 'floormaster',
      key: 'FloorID'
    }
  },
  Remark: {
    type: DataTypes.STRING(15),
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
    type: DataTypes.STRING(20),
    allowNull: true
  },
  CreatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  CreatedDate: {
    type: DataTypes.DATE(6),
    allowNull: true
  },
  UpdatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  UpdatedDate: {
    type: DataTypes.DATE(6),
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'ratemaster',
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
      name: "UQ__RateMast__105C9F5118A19C6F",
      unique: true,
      using: "BTREE",
      fields: [
        { name: "Year" },
        { name: "ZoneNo" },
        { name: "ConstructionID" },
        { name: "TypeOfUseID" },
        { name: "FloorID" },
        { name: "MinYear" },
        { name: "MaxYear" },
        { name: "ZoneSectionNo" },
      ]
    },
    {
      name: "IX_RateMaster_Year",
      using: "BTREE",
      fields: [
        { name: "ZoneNo" },
        { name: "ConstructionID" },
        { name: "FloorID" },
        { name: "ZoneSectionNo" },
        { name: "MinYear" },
        { name: "MaxYear" },
        { name: "TypeOfUseID" },
        { name: "RateSquareMeter" },
      ]
    },
    {
      name: "FK_RateMaster_floormaster_idx",
      using: "BTREE",
      fields: [
        { name: "FloorID" },
      ]
    },
    {
      name: "FK_RateMaster_ConstrID_ConstructionTypeMaster",
      using: "BTREE",
      fields: [
        { name: "ConstructionID" },
      ]
    },
    {
      name: "FK_ratemaster_typeofusemaster_idx",
      using: "BTREE",
      fields: [
        { name: "TypeOfUseID" },
      ]
    },
  ]
});
export default RateMaster