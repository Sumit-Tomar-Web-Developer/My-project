

module.exports = (sequelize, DataTypes) => {
    const TenderSubmittedExpense = sequelize.define('TenderSubmittedExpense', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        tenderId: { type: DataTypes.INTEGER },
        expenseamount: { type: DataTypes.FLOAT, allowNull: false },
        expenseTypeId: { type: DataTypes.INTEGER, allowNull: false },
        expenseSubTypeId: { type: DataTypes.INTEGER, allowNull: false },
        expenseDetails: DataTypes.STRING,
        justification: DataTypes.STRING,
        userId: { type: DataTypes.STRING, allowNull: false },
        invoicenumber: { type: DataTypes.STRING, allowNull: false },
        receiptGuid: { type: DataTypes.STRING, allowNull: false },
        receiptFileName: { type: DataTypes.STRING, allowNull: false },
        createdBy: { type: DataTypes.STRING, field: 'createdby', allowNull: false, defaultValue: 'System' },
        updatedBy: { type: DataTypes.STRING, field: 'updatedby', allowNull: false, defaultValue: 'System' },
        TechLeadApproval: { type: DataTypes.ENUM("APPROVED", "REJECTED"), allowNull: true },
        TechLeadComments: DataTypes.STRING,
        TechLeadApprover: DataTypes.STRING,
        TechLeadApprovedAt: DataTypes.STRING,

        DirectorApproval: { type: DataTypes.ENUM("APPROVED", "REJECTED"), allowNull: true },
        DirectorComments: DataTypes.STRING,
        DirectorApprover: DataTypes.STRING,
        DirectorApprovedAt: DataTypes.STRING,

        FinanceApproval: { type: DataTypes.ENUM("APPROVED", "REJECTED"), allowNull: true },
        FinanceComments: DataTypes.STRING,
        FinanceApprover: DataTypes.STRING,
        FinanceApprovedAt: DataTypes.STRING,

        //sum of paid amount and tds amount= amount
        FinancePaidAmount: { type: DataTypes.FLOAT, allowNull: true },
        FinanceTDSAmount: { type: DataTypes.FLOAT, allowNull: true },
        paymentProofFileGuid: { type: DataTypes.STRING, allowNull: true },
        paymentProofFileName: { type: DataTypes.STRING, allowNull: true },
        paymentDate: DataTypes.DATE,

        //current status of bill
        currentStatus: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            references: { model: 'MasterExpenseStatus', key: 'id' }
        },
    });

    TenderSubmittedExpense.associate = models => {
        TenderSubmittedExpense.hasOne(models.TenderBasicDetails, { foreignKey: 'tenderId', sourceKey: 'tenderId' });
        TenderSubmittedExpense.belongsTo(models.MasterExpenseStatus, { foreignKey: 'currentStatus', as: 'status' });
        TenderSubmittedExpense.belongsTo(models.MasterExpenseType, { foreignKey: 'expenseTypeId', as: 'ExpenseType' });
        TenderSubmittedExpense.belongsTo(models.User, { foreignKey: 'userId', as: 'User' });
    }

    return TenderSubmittedExpense;
};