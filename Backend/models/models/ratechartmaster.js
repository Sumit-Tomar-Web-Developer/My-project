import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const RateChartMaster = sequelize.define('ratechartmaster', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Year: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    CommercialMultiplier: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    IndustrialMultiplier: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    CommercialMultiplier2: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    CommMultiplierAppliedToZone: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    CommMultiplier1AppliedToZone: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    MinYear: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    MaxYear: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    ZoneSectionNo: {
      type: DataTypes.STRING(10),
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
    tableName: 'ratechartmaster',
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
        name: "uc_RateChartMaster",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Year" },
          { name: "MinYear" },
          { name: "MaxYear" },
          { name: "ZoneSectionNo" },
        ]
      },
    ]
  });
export default RateChartMaster 