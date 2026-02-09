// models/roomTypeMaster.js
import sequelize from '../../config/connectionDB.js';
import { DataTypes } from 'sequelize';
    const RoomTypeMaster = sequelize.define('RoomTypeMaster', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      roomType: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false
      },
      updatedDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updatedBy: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      tableName: 'roomtypemaster',  
      timestamps: false              
    });
  
    export default RoomTypeMaster
