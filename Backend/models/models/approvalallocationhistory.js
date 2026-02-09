import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';

const ApprovalWardAlHistory = sequelize.define(
  'approvalwardalhistory',
  {
    allocation_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    user_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    zone: {
      type: DataTypes.STRING(10), // VARCHAR to store Z1, Z2 etc.
      allowNull: true,
    },
    ward: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    allocation_status: {
      type: DataTypes.ENUM('Allocate', 'DeAllocate'),
      defaultValue: 'Allocate',
    },
    allocated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  
  },
  {
    sequelize,
    tableName: 'approvalwardalhistory',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'allocation_id' }],
      },
    ],
  }
);

export default ApprovalWardAlHistory;
