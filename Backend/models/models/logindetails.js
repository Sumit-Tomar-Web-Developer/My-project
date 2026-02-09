import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const LoginDetails = sequelize.define('logindetails', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LoginDateTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    LogOutTime: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'logindetails',
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
    ]
  });
  export default LoginDetails;

