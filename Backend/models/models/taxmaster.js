import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';

const TaxMaster = sequelize.define('taxmaster', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Taxnametype: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    Type: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    Year: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    MinAmount: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    MaxAmount: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    Rate: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    AssessmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'assessmentmaster',
        key: 'AssessmentID'
      }
    },
    OnRVOrALV: {
      type: DataTypes.STRING(5),
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
    tableName: 'taxmaster',
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
        name: "UQ__Employme__6698CC8630AE302A",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Year" },
          { name: "Type" },
          { name: "MinAmount" },
        ]
      },
      {
        name: "UQ__Employme__10B46C61338A9CD5",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Year" },
          { name: "Type" },
          { name: "MaxAmount" },
        ]
      },
      {
        name: "FK_taxmaster_assessmentmaster_idx",
        using: "BTREE",
        fields: [
          { name: "AssessmentId" },
        ]
      },
    ]
  });
export default TaxMaster