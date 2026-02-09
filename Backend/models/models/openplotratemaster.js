import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const openPlotRateMaster = sequelize.define(
  'openplotratemaster', 
  {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ZoneNo: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    Year: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    RateSquareMeter: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: false
    },
    TypeOfUse: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    OnRVOrALV: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    AssesmentID: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    ZoneSectionNo: {
      type: DataTypes.STRING(50),
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
    tableName: 'openplotratemaster',
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
        name: "UC",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ZoneNo" },
          { name: "Year" },
          { name: "RateSquareMeter" },
          { name: "TypeOfUse" },
          { name: "OnRVOrALV" },
          { name: "AssesmentID" },
          { name: "ZoneSectionNo" },
        ]
      },
    ]
  });
  export default openPlotRateMaster;

