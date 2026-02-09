import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const SecurityLayerDetails = sequelize.define(
  'securitylayerdetails',
  {
    LayerID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
    },
    PageID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
    },
    AccessID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
    },
  },
  {
    tableName: 'securitylayerdetails',
    timestamps: false,
  }
);
export default SecurityLayerDetails;
