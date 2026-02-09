import CombinedOwnerName from "../../models/models/combinedownerrenternames.js";
import PaymentGatewayTransactionDetails from "../../models/models/paymentGatewayTransactionDetails.js";
import PropertyMast from "../../models/models/propertyMast.js";
import BillTransactionDetails from "../../models/models/billtransactiondetails.js";


PaymentGatewayTransactionDetails.belongsTo(PropertyMast, { foreignKey: 'OwnerID', targetKey: 'OwnerID' });
PaymentGatewayTransactionDetails.belongsTo(CombinedOwnerName, { foreignKey: 'OwnerID', targetKey: 'OwnerID' });
export const getPaymentGatewayTransactionDetails = async (req, res) => {
    try {
        const { financeYear } = req.body;
        const results = await PaymentGatewayTransactionDetails.findAll({
            include: [
                { model: PropertyMast, attributes: ['NewWardNo', 'NewPropertyNo', 'NewPartitionNo'] },
                { model: CombinedOwnerName, attributes: ['RenterName', 'OwnerName'] }
            ],

            where: { FinanceYear: financeYear, TxnStatus: 'Initiated' }
        });

        res.status(200).json({ results });
    } catch (error) {
        console.error("Error fetching payment gateway transaction details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getPaymentGatewayAllTransactionDetails = async (req, res) => {
    try {
        const { financeYear } = req.body;
        const results = await PaymentGatewayTransactionDetails.findAll({
            include: [
                { model: PropertyMast, attributes: ['NewWardNo', 'NewPropertyNo', 'NewPartitionNo'] },

            ],
            where: { FinanceYear: financeYear }
        });

        res.status(200).json({ results });
    } catch (error) {
        console.error("Error fetching payment gateway all transaction details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const approveTransaction = async (req, res) => {
    const { selectedRow } = req.body;

    try {
        // 1️⃣ Remove non-table objects
        const { propertymast, ...row } = selectedRow;

        // 2️⃣ Get next InvoiceNo
        const lastInvoice = await BillTransactionDetails.findOne({
            attributes: ['InvoiceNo'],
            order: [['InvoiceNo', 'DESC']]
        });

        const nextInvoiceNo = lastInvoice ? lastInvoice.InvoiceNo + 1 : 1;

        row.InvoiceNo = nextInvoiceNo
        row.TxnStatus = "Success";
        await PaymentGatewayTransactionDetails.update(row, {
            where: { ID: row.ID }
        })
        // 3️⃣ Map ONLY columns that exist in billtransactiondetails
        const insertData = {
            ManageID: row.ManageID ?? null,
            OwnerID: row.OwnerID,
            BillBookNo: row.BillBookNo,
            InvoiceNo: nextInvoiceNo,
            MerchantTxnRefNumber: row.MerchantTxnRefNumber,
            FinanceYear: row.FinanceYear,
            PendingYear: row.PendingYear,
            BillNo: row.BillNo,
            TransactionDate: row.TransactionDate,
            BillDate: row.BillDate,

            PropertyTax: row.PropertyTax,
            EducationTax: row.EducationTax,
            EmploymentTax: row.EmploymentTax,
            TreeCess: row.TreeCess,
            SpWaterCess: row.SpWaterCess,
            Sanitation: row.Sanitation,
            DrainCess: row.DrainCess,
            RoadCess: row.RoadCess,
            FireCess: row.FireCess,
            LightCess: row.LightCess,
            WaterBenefit: row.WaterBenefit,
            MajorBuilding: row.MajorBuilding,
            SewageDisposalCess: row.SewageDisposalCess,
            SpEducationTax: row.SpEducationTax,
            WaterBill: row.WaterBill,

            Tax1: row.Tax1,
            Tax2: row.Tax2,
            Tax3: row.Tax3,
            Tax4: row.Tax4,
            Tax5: row.Tax5,
            TaxTotal: row.TaxTotal,
            Interest: row.Interest,
            Discount: row.Discount,
            Noticefee: row.Noticefee,
            WarrentFee: row.WarrentFee,
            MiscellaneousFee: row.MiscellaneousFee,
            NetTotal: row.NetTotal,
            Amount: row.Amount,

            EmpID: row.EmpID,
            PaymentMode: row.PaymentMode,
            DDChequeNo: row.DDChequeNo,
            PayeeName: row.PayeeName,
            BankName: row.BankName,
            BranchName: row.BranchName,
            ChequeStatus: row.ChequeStatus,
            DDChequeDate: row.DDChequeDate,
            ExpiryDate: row.ExpiryDate,
            IFSCNo: row.IFSCNo,
            Remark: row.Remark,
            PaymentType: row.PaymentType,
            TransactionId: row.TxnID,
            PaymentResource: row.PaymentResource,
            UNQTRANSID: row.UNQTRANSID,
            RelID: row.RelID,
            EmailId: row.EmailId,
            MobileNumber: row.MobileNumber,

            TaxType: row.TaxType,
            LastDate: row.LastDate,

            DiscountPercentage: row.DiscountPercentage,
            GrpOneInterestDiscount: row.GrpOneInterestDiscount,
            GrpOneInterestDiscountPercentage: row.GrpOneInterestDiscountPercentage,
            GrpTwoInterestDiscount: row.GrpTwoInterestDiscount,
            GrpTwoInterestDiscountPercentage: row.GrpTwoInterestDiscountPercentage,
            CalFixedPendingInterestDiscountPercentage: row.CalFixedPendingInterestDiscountPercentage,

            RainWaterHarvestingDiscountAmount: row.RainWaterHarvestingDiscountAmount,
            RainWaterHarvestingDiscountPercentage: row.RainWaterHarvestingDiscountPercentage,
            GarbageSegregationDiscountAmount: row.GarbageSegregationDiscountAmount,
            GarbageDisposalDiscountAmount: row.GarbageDisposalDiscountAmount,
            GarbageDisposalDiscountPercentage: row.GarbageDisposalDiscountPercentage,
            SolarEnergyDiscountAmount: row.SolarEnergyDiscountAmount,
            SolarEnergyDiscountPercentage: row.SolarEnergyDiscountPercentage,
            SpWaterCessDiscount: row.SpWaterCessDiscount,
            SpWaterCessDiscountPercentage: row.SpWaterCessDiscountPercentage,

            CreatedBy: row.CreatedBy,
            CreatedDate: new Date(),
            UpdatedBy: row.UpdatedBy ?? row.CreatedBy,
            UpdatedDate: new Date()
        };

        // 4️⃣ Insert into billtransactiondetails
        const result = await BillTransactionDetails.create(insertData);


        return res.status(201).json({
            message: 'Transaction approved successfully',
            InvoiceNo: nextInvoiceNo,
            BTId: result.BTId
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};


export const disApproveTransaction = async (req, res) => {

    const { selectedRow } = req.body;
    const { propertymast, ...rest } = selectedRow
    try {
        const result = await PaymentGatewayTransactionDetails.update({ ...rest, TxnStatus: 'failed' }, { where: { ID: rest.ID } })

        return res.status(200).json({message:'Disapproved Successfully'})

    } catch (error) {
        console.log(error.message)
        return error
    }
}
