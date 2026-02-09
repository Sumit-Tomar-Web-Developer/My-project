import { DataTypes } from 'sequelize';
import sequelize from '../../config/connectionDB.js';
const AssessmentRulesMaster = sequelize.define(  'assessmentrulesmaster',  {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    AssessmentID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'assessmentmaster',
        key: 'AssessmentID'
      },
    },
    MaintenanceRate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    DataEntryLock: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    AddHistoryLock: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsAsPerOld: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    IsAsPerOldForNewProperty: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    IsMinimumRV: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    IsMinimumRVForOldRVZero: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    IsMixAssessment: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    IsRetaintion: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    IsCalOnRenterRent: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsAppealPolicyRuleWise: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    IsPlotTaxApplicable: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    IsPlotTaxable: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    IsTypeOfUseGroup: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsPolicyApplicable: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    PolicyLock: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    UtilityLockInBuiltUpArea: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsCalOnSingleRenterRent: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    HearingMaxDiscount: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 50,
    },
    AppealMaxDiscount: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 50,
    },
    isDuplicateEntryRestricted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsRetention: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    IsHearing: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    IsAppealCommittee: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    IsRemission: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    IsReasonLock: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    IsSpecificFormatReportSaveByOwnerID: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    isShowPlansAndPhoto: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    AvoidPropertyEditing: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsReportImageFromPath: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    iscv: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsApplyFlatRateDrain: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    AcceptMinusPendingTaxes: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsOPEduEmpTaxZeroForGovEduProp: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsApplyDiscount: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    isPhotoPlanFromDb: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Daviation: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    CurrentBalance: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    PendingBalance: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsDisplayNewPropRemark: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsReceiptPrint: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsWardAllocation: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsApplyDiscountForExtended: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsAddInterestToSelectedYear: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsRentValidity: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsActiveInterest2: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsMaintainanceApply: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    isDBForAMC: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    isAssessmentCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    AddTaxesRemark: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    IsAllPropertyChangedForAddTaxes: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    isBillTransactionEntryDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsTaxOnToilet: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsDiscountOnIntNMbuild: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsInvoiceAutoGenerated: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsPendingDemandPayFirst: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsAllowSMS: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsOTPForCounterLogin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsApprovalByCouncil: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    IsSubOnDataEntry: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsSubOnMeter: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsApprovalDocument: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsDuplicateAvoid: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    IsPrintDuplicate: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    IsOTPEnable: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    IsQRcode: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsOPEduEmpIsTaxZeroForGovEduProp: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsPenaltyMonthaly: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsWrongFloorSequence: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsBuildUpArea: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    IsCarpetArea: {
      type: DataTypes.BOOLEAN,
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
    tableName: 'assessmentrulesmaster',
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
      {
        name: "FK_ApplyTaxesMaster_AssessmentMaster",
        using: "BTREE",
        fields: [
          { name: "AssessmentID" },
        ]
      }
    ],
  });
export default AssessmentRulesMaster;
