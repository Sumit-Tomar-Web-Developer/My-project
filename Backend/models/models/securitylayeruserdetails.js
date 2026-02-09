import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const SecurityLayerUserDetails = sequelize.define(
  'securitylayeruserdetails',
  {
    LayerID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
    },
  },
  {
    tableName: 'securitylayeruserdetails',
    timestamps: false,
  }
);

export default SecurityLayerUserDetails;
