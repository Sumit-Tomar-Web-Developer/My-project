import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';

const PropertyTypeMaster = sequelize.define(
  'PropertyTypeMaster',
  {
    PropertyTypeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement : true
    },
    DisplayOrder: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    PropertyDescription: {
      type: DataTypes.STRING(200),
      allowNull: true,
      unique: 'UQ__Property__F492D207100C566E',
    },
    Type: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    PropertyTypeGroupID: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    Tax: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true,
    },
    CreatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    CreatedDate: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    UpdatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    UpdatedDate: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'propertytypemaster',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'PropertyTypeID' }],
      },
      {
        name: 'UQ__Property__F492D207100C566E',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'PropertyDescription' }],
      },
    ],
  }
);

export default PropertyTypeMaster;
