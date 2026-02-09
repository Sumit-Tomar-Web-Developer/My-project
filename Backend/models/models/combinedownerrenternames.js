// const Sequelize = require('sequelize');
import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const CombinedOwnerName = sequelize.define(
  'combinedownerrenternames',
  {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    OwnerID: {
      type: DataTypes.INTEGER,
      //allowNull: false,
      references: {
        model: 'propertymast',
        key: 'OwnerID',
      },
    },
    OwnerName: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    MarathiOwnerName: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    RenterName: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    MarathiRenterName: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    OccupierName: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    MarathiOccupierName: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'combinedownerrenternames',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'ID' }],
      },
    ],
  }
);


export default CombinedOwnerName;
