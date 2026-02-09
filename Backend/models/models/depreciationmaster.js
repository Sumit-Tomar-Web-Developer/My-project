import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';

const DepreciationMaster = sequelize.define(
  'depreciationmaster',
  {
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    ConstructionID: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    MinYear: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    MaxYear: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    Rate: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true,
    },
    AssessmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'assessmentmaster',
        key: 'AssessmentID',
      },
    },
    Year: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    Weightage: {
      type: DataTypes.FLOAT,
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
    },
  },
  {
    sequelize,
    tableName: 'depreciationmaster',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'ID' }],
      },
      {
        name: 'UQ__Deprecia__7A2BDEC74D6B35C0',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'ConstructionID' },
          { name: 'MinYear' },
          { name: 'MaxYear' },
          { name: 'AssessmentId' },
          { name: 'Year' },
        ],
      },
      {
        name: 'FK_depreciationmaster_assessmentmaster_idx',
        using: 'BTREE',
        fields: [{ name: 'AssessmentId' }],
      },
    ],
  }
);

export default DepreciationMaster;
