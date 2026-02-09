import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const ZoneSectionMaster = sequelize.define('zonesectionmaster', {
    ZoneID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ZoneSectionNo: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    ZoneSectionType: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Remark: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Status: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    CreateBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CreationDate: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    UpdatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UpdationDate: {
      type: DataTypes.DATE(6),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'zonesectionmaster',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ZoneID" },
        ]
      },
    ]
  });
export default ZoneSectionMaster