import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
import AssessmentRulesMaster from './assessmentrulesmaster.js';
const AssessmentMaster = sequelize.define(
  'assessmentmaster',
  {
    AssessmentID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    FromYear: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    ToYear: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    MaxYear: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    MinRV: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    NPTitle: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    NPTitleMarathi: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    NPAddress: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    NPAddressInMarathi: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    NPRemark: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    NPImage: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    NPcon: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    NPIcon: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    NPContactNo: {
      type: DataTypes.STRING(12),
      allowNull: true,
    },
    NPEmail: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    NPWebsite: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ThirdPartyName: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    ThirdPartyAddress: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    ThirdPartyContact: {
      type: DataTypes.STRING(12),
      allowNull: true,
    },
    ThirdPartyWebSite: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ThirdPartyEmail: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ThirdPartyRemark: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    ActiveStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    ThirdPartyIcon: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    ThirdPartyImage: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    ThirdPartyCopyRight: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    PartyNameInMarathi: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    PartyAddressInMarathi: {
      type: DataTypes.STRING(300),
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
    NPPrefix: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'assessmentmaster',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [{ name: 'AssessmentID' }],
      },
    ],
  }
);

export default AssessmentMaster;
