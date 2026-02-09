import { DataTypes } from "sequelize";
import sequelize from "../../config/connectionDB.js";

const ChangeVersionMaster = sequelize.define(
  "changeversionmaster",
  {
      
      UpdVersionID: {
        type: DataTypes.CHAR(36),
        allowNull: false,
      },
      FerfarDocument:{
         type: DataTypes.STRING(500),
        allowNull: true
      },

      OwnerID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      ApplicationPageSource: {
        type: DataTypes.STRING(300),
        allowNull: true
      },

      UpdatedBy: {
        type: DataTypes.STRING(20),
        allowNull: true
      },

      UpdatedName: {
        type: DataTypes.STRING(300),
        allowNull: true
      },

      UpdatedDate: {
        type: DataTypes.DATE,
        allowNull: true
      },

      UpdatedInitStatus: {
        type: DataTypes.STRING(10),
        allowNull: true
      },

      ApprovalBy: {
        type: DataTypes.STRING(20),
        allowNull: true
      },

      ApprovalDate: {
        type: DataTypes.DATE,
        allowNull: true
      },

      ApprovalStatus: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: 'PENDING'
      },

      ApprovalRemark: {
        type: DataTypes.TEXT('long'),
        allowNull: true
      },

      WadhghatNo: {
        type: DataTypes.STRING(100), 
        allowNull: true,
        defaultValue: '0'
      },
      FerfarNo: {
        type: DataTypes.STRING(225),
        allowNull: true,
    
      },

      RecentApproved: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },

      WadhGhatFerfarRemark: {
        type: DataTypes.TEXT('long'),
        allowNull: true
      },

      WadhGhatFerfarNo: {
        type: DataTypes.TEXT('long'),
        allowNull: true
      },
      WardghatDocument: {
        type: DataTypes.STRING(500), 
        allowNull: true
      },

      PublicIP: {
        type: DataTypes.STRING(50),
        allowNull: true
      },

      LocalIP: {
        type: DataTypes.STRING(50),
        allowNull: true
      },

      LocalMac: {
        type: DataTypes.STRING(50),
        allowNull: true
      },

      ApprovedPublicIP: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },

    {
    sequelize,
    tableName: 'ChangeVersionMaster',
    timestamps: false, 
   indexes: [
  {
    name: "idx_owner_id",
    fields: ["OwnerID"]
  },
  {
    name: "idx_upd_version_id",
    fields: ["UpdVersionID"]
  }
]

  }
  
  );

ChangeVersionMaster.removeAttribute('id');

export default ChangeVersionMaster;
