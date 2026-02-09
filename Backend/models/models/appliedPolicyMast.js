import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';

const AppliedPolicyMast = sequelize.define('AppliedPolicyMast', {
  OwnerID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  Appeal: {
    type: DataTypes.INTEGER,  
    allowNull: true,
    defaultValue: 0
  },
  Hearing: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  Retaintion: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  CourtResult: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  CreatedBy: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  CreatedDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  UpdatedBy: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  UpdatedDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  OriginalOwnerID: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'appliedpolicymast',
  timestamps: false   // disable Sequelize auto timestamps
});

export default AppliedPolicyMast;
