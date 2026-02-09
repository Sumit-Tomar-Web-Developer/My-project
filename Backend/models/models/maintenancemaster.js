import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';

const MaintenanceMaster = sequelize.define('maintenancemaster', {
  ID: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  year: {
    type: DataTypes.SMALLINT,
    allowNull: true,
    unique: "UQ__Maintena__809A238B25518C17"
  },
  rate: {
    type: DataTypes.DECIMAL(19, 4),
    allowNull: true
  },
  old_rate: {
    type: DataTypes.DECIMAL(19, 4),
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
  tableName: 'maintenancemaster',
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
      name: "UQ__Maintena__809A238B25518C17",
      unique: true,
      using: "BTREE",
      fields: [
        { name: "year" },
      ]
    },
    {
      name: "FK_maintenancemaster_assessmentmaster_idx",
      using: "BTREE",
      fields: [
        { name: "AssessmentId" },
      ]
    },
  ]
});
export default MaintenanceMaster