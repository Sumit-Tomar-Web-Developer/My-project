import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const ZoneSectionDetails = sequelize.define('zonesectiondetails', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ZoneSectionNo: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Ward: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'zonesectiondetails',
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
export default ZoneSectionDetails
