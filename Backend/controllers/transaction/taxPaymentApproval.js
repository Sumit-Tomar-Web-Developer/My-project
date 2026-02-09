import PaymentApproval from '../../models/models/paymentsforapproval.js';
import CombinedOwnerName from "../../models/models/combinedownerrenternames.js";
import PropertyMast from "../../models/models/propertyMast.js";
import ApprovedPaymentDetails from '../../models/models/approvedPaymentDetails.js';
import DisApprovedPaymentDetails from '../../models/models/disApprovedPaymentDetails.js';
import path from 'path';
import fs from 'fs';

import sequelize from '../../config/connectionDB.js';
import BillTransactionDetails from '../../models/models/billtransactiondetails.js';

PaymentApproval.belongsTo(PropertyMast, { foreignKey: 'OwnerID', targetKey: 'OwnerID' });
PaymentApproval.belongsTo(CombinedOwnerName, { foreignKey: 'OwnerID', targetKey: 'OwnerID' });


export const getPendingPayments = async (req, res) => {
    try {
        const pendingPayments = await PaymentApproval.findAll({
            include: [
                { model: PropertyMast, attributes: ['NewWardNo', 'NewPropertyNo', 'NewPartitionNo', 'MobileNo', 'EmailID'] },
                { model: CombinedOwnerName, attributes: ['RenterName', 'OwnerName'] }
            ], where: { status: 'pending' }
        });

        res.status(200).json(pendingPayments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}





export const getPaymentProof = async (req, res) => {

    const { merchantTxnRefNumber } = req.body;

    if (!merchantTxnRefNumber) {
        return res.status(400).json({ message: 'merchantTxnRefNumber is required' });
    }

    // 1️⃣ Fetch the PaymentProof path from DB
    const payment = await PaymentApproval.findOne({
        attributes: ['PaymentProof'],
        where: { MerchantTxnRefNumber: merchantTxnRefNumber }
    });

    if (!payment?.PaymentProof) {
        return res.status(404).json({ message: 'Payment proof not found in DB' });
    }

    // 2️⃣ Sanitize DB path
    let dbPath = payment.PaymentProof.replace(/^\/+/, ''); // remove leading slashes
    dbPath = dbPath.replace(/\.\./g, ''); // prevent path traversal

    // 3️⃣ Absolute UNC path (like your working image code)
    const BASE_PATH = 'E:\\Proof';
    const filePath = path.join(BASE_PATH, dbPath);

    console.log('📄 Resolved file path:', filePath);


    // 5️⃣ Detect MIME type
    const fileName = path.basename(filePath);
    const ext = path.extname(fileName).toLowerCase();
    const mimeType =
        ext === '.pdf' ? 'application/pdf'
            : ext === '.png' ? 'image/png'
                : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
                    : 'application/octet-stream';

    // 6️⃣ Set headers
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'no-store');

    // 7️⃣ Stream file (safe)
    const stream = fs.createReadStream(filePath);
    stream.on('error', (err) => {
        console.error('❌ File stream error:', err);
        return res.status(500).json({ message: 'Error reading file' });
    });

    return stream.pipe(res);


};


export const approvePayment = async (req, res) => {
    console.log("Approve Payment Called", req.body);
    const { selectedRow } = req.body;




    try {




        await BillTransactionDetails.create({
            ManageID: 0,
            OwnerID: selectedRow.OwnerID || null,
            BillBookNo: selectedRow.BillBookNo || null,
            InvoiceNo: selectedRow.InvoiceNo || null,
            MerchantTxnRefNumber: selectedRow.MerchantTxnRefNumber, // ✅ Unique ID field added
            FinanceYear: selectedRow.FinanceYear || null,
            PendingYear: selectedRow.PendingYear || null,
            BillNo: selectedRow.billNo || null,
            TransactionDate: selectedRow.TransactionDate ? new Date(selectedRow.TransactionDate) : null,
            BillDate: selectedRow.BillDate ? new Date(selectedRow.BillDate) : null,
            PropertyTax: selectedRow.Property || null,
            EducationTax: selectedRow.Education || null,
            EmploymentTax: selectedRow.Emp || null,
            TreeCess: selectedRow.Tree || null,
            SpWaterCess: selectedRow["W.Cess"] || null,
            Sanitation: selectedRow.Sanitation || null,
            DrainCess: selectedRow.Drain || null,
            RoadCess: selectedRow.Road || null,
            FireCess: selectedRow.Fire || null,
            LightCess: selectedRow.Light || null,
            WaterBenefit: selectedRow["W.Benifit"] || null,
            MajorBuilding: selectedRow["M.Build"] || null,
            SewageDisposalCess: selectedRow.Sewage || null,
            SpEducationTax: selectedRow["Sp.Educ"] || null,
            WaterBill: selectedRow["W.Bill"] || null,
            Tax1: selectedRow.Tax1 || null,
            Tax2: selectedRow.Tax2 || null,
            Tax3: selectedRow.Tax3 || null,
            Tax4: selectedRow.Tax4 || null,
            Tax5: selectedRow.Tax5 || null,
            TaxTotal: selectedRow["Total Tax"] || null,
            Interest: selectedRow.Interest || null,
            Discount: selectedRow.Discount || null,
            Noticefee: selectedRow["Notice Fee"] || null,
            WarrentFee: selectedRow["Warrent Fee"] || null,
            MiscellaneousFee: selectedRow["Extra Charges"] || null,
            NetTotal: selectedRow.NetTotal || null,
            Amount: selectedRow.NetTotal || null,
            EmpID: selectedRow.empID || null,
            PaymentMode: selectedRow.paymentMode?.toString() || null,
            DDChequeNo: selectedRow.chequeNo || null,
            PayeeName: selectedRow.name || null,
            BankName: selectedRow.bankName || null,
            BranchName: selectedRow.branchName || null,
            DDChequeDate: selectedRow.date ? new Date(selectedRow.date) : null,
            ExpiryDate: selectedRow.expiryDate ? new Date(selectedRow.expiryDate) : null,
            IFSCNo: selectedRow.ifsc || null,
            Remark: selectedRow.remark || null,
            PaymentType: selectedRow.paymentType || null,
            TransactionId: selectedRow.transactionId || null,
            MobileNumber: selectedRow.mobileNo || null,
            PaymentResource: selectedRow.PaymentResource || null,
            CreatedBy: 1,
            CreatedDate: new Date(),
            UpdatedBy: 1,
            UpdatedDate: new Date(),
        });
        await ApprovedPaymentDetails.create(
            {
                OwnerID: selectedRow.OwnerID,
                BillBookNo: selectedRow.BillBookNo,
                InvoiceNo: selectedRow.InvoiceNo,
                MerchantTxnRefNumber: selectedRow.MerchantTxnRefNumber,
                FinanceYear: selectedRow.FinanceYear,
                Amount: selectedRow.Amount,

                CreatedDate: new Date(),
                UpdatedDate: new Date(),

            }

        );

        // 2️⃣ Then update the payment status
        await PaymentApproval.update(
            {
                Status: 'Approved',
                UpdatedDate: new Date(),

            },
            {
                where: { MerchantTxnRefNumber: selectedRow.MerchantTxnRefNumber }

            }
        );
        return res.status(200).json({ message: 'Payment approved successfully' });
    } catch (error) {
        console.error('APPROVE ERROR:', error);
        return res.status(500).json({ message: error.message });
    }
}



export const disapprovePayment = async (req, res) => {
    const { selectedRow } = req.body;

    if (!selectedRow.RemarkForDisApproved?.trim()) {
        return res.status(400).json({
            message: 'Remark is required for disapproval'
        });
    }

    try {
        await sequelize.transaction(async (t) => {
            await DisApprovedPaymentDetails.create(
                {
                    OwnerID: selectedRow.OwnerID,
                    BillBookNo: selectedRow.BillBookNo,
                    InvoiceNo: selectedRow.InvoiceNo,
                    MerchantTxnRefNumber: selectedRow.MerchantTxnRefNumber,
                    FinanceYear: selectedRow.FinanceYear,
                    Amount: selectedRow.Amount,

                    CreatedDate: new Date(),
                    UpdatedDate: new Date(),

                },
                { transaction: t }
            );

            await PaymentApproval.update(
                {
                    Status: 'Disapproved',
                    UpdatedDate: new Date(),

                },
                {
                    where: { MerchantTxnRefNumber: selectedRow.MerchantTxnRefNumber },
                    transaction: t
                }
            );
        });

        return res.status(200).json({
            message: 'Payment disapproved successfully'
        });

    } catch (error) {
        console.error('DISAPPROVE ERROR:', error);
        return res.status(500).json({
            message: error.message
        });
    }
};


export const getFilterPaymentList = async (req, res) => {
    console.log('Get Filtered Payment List Called', req.body);
    const { status, financeYearForFilter, fromDate, toDate, wardNo, propertyNo } = req.body.filterPaymentDetails;
    console.log('Filter Params:', req.body);

    try {
        const whereClauseForOwnerID = {};
        const whereClause = {};
        if (wardNo && wardNo.trim() !== '') {
            console.log('Ward No Filter Applied:', wardNo);
            whereClauseForOwnerID['$PropertyMast.NewWardNo$'] = wardNo;
        }
        if (propertyNo && propertyNo.trim() !== '') {
            console.log('Property No Filter Applied:', propertyNo);
            const [prop, partitionNo] = propertyNo.includes("-")
                ? propertyNo.split("-")
                : [propertyNo, ''];

            whereClauseForOwnerID['$PropertyMast.NewPropertyNo$'] = prop;
            if (partitionNo) {
                whereClauseForOwnerID['$PropertyMast.NewPartitionNo$'] = partitionNo;
            }
            const ownerIDs = await PropertyMast.findAll({
                attributes: ['OwnerID'],
                where: whereClauseForOwnerID
            }).then(results => results.map(r => r.OwnerID));
            if (ownerIDs.length > 0) {
                whereClause.OwnerID = ownerIDs;
            }
        }





        if (status) {
            console.log('Status Filter Applied:', status);
            whereClause.Status = status;
        }
        if (financeYearForFilter) {
            console.log('Finance Year Filter Applied:', financeYearForFilter);
            whereClause.FinanceYear = financeYearForFilter;
        }
        if ((fromDate || toDate) && fromDate !== '' && toDate !== '' && fromDate != null && toDate != null) {
            console.log('Date Range Filter Applied:', fromDate, toDate);
            const endDate = toDate ? new Date(toDate) : new Date();

            const startDate = fromDate
                ? new Date(fromDate)
                : new Date(endDate.getFullYear(), 0, 1); // Jan 1 of that year

            whereClause.TransactionDate = {
                $between: [startDate, endDate]
            };
        }

        const filteredPayments = await PaymentApproval.findAll({
            include: [
                { model: PropertyMast, attributes: ['NewWardNo', 'NewPropertyNo', 'NewPartitionNo', 'MobileNo', 'EmailID'] },
                { model: CombinedOwnerName, attributes: ['RenterName', 'OwnerName'] }
            ],
            where: whereClause
        });
        return res.status(200).json(filteredPayments);


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};