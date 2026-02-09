import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
import LoginDetails from './logindetails.js';


const Users = sequelize.define(
  'users',
  {
    UserID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    role: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    active: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    contact_no: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    AllocatedWard: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    isfirstlogin: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
      comment: '1 = true, 0 = false',
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'UserID' }],
      },
    ],
  }
);

// ✅ Associations (must be declared *after* model definition)
Users.hasMany(LoginDetails, { foreignKey: 'UserID' });
LoginDetails.belongsTo(Users, { foreignKey: 'UserID' });

export default Users;
