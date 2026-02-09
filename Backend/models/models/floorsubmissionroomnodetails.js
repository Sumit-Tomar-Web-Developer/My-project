import sequelize from '../../config/connectionDB.js';

import { DataTypes } from 'sequelize';

const FloorSubmissionRoomNoDetails= sequelize.define('floorsubmissionroomnodetails', {
    FSDId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    RoomNo: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'floorsubmissionroomnodetails',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "FSDId" },
        ]
      },
    ]
  });
export default FloorSubmissionRoomNoDetails;
