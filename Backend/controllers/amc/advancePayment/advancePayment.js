import TransMast from '../../../models/models/transmast.js';
import BillTransactionDetailsAdvance from "../../../models/models/billtransactiondetailsadvance.js";
import sequelize from '../../../config/connectionDB.js';

export const getCurrentTaxes = async (req, res) => {

    try {

        const { ownerId, year } = req.body;
        console.log('Owner ID:', ownerId);
        console.log(ownerId);
        const currentTaxes = await TransMast.findAll({
            where: {
                OwnerID: ownerId,
                FinanceYear: year
            },
            order: [['FinanceYear', 'DESC']],
            limit: 1
        })
        const currentDemand = await sequelize.query(
            'call funAMCGetCurrentBalance(:param1,:param2 ,:param3 , :param4, :param5, :param6,:param7,:param8,:param9)',
            {
                replacements: {
                    param1: '',
                    param2: null,
                    param3: null,
                    param4: '',
                    param5: '',
                    param6: ownerId,
                    param7: year,
                    param8: null,
                    param9: null
                    
                },
                type: sequelize.QueryTypes.SELECT
            }
        )

        currentTaxes.push(currentDemand[2] || []);
        console.log(currentTaxes, 'currentTaxes');
        return res.json(currentTaxes)
    } catch (error) {
        console.log(error);
    }
}
export const saveAdvancePayment = async (req, res) => {
    try {
        const combinedData = req.body;
        const result = await BillTransactionDetailsAdvance.create({
            OwnerID: combinedData.ownerId || null,
            BillBookNo: combinedData.BillBookNo || null,
            InvoiceNo: combinedData.InvoiceNo || null, // adjust if you have it
            FinanceYear: combinedData.year || null,
            PendingYear: null,
            BillNo: combinedData.billNo || null,
            TransactionDate: new Date(combinedData.value) || null,
            BillDate: new Date(combinedData.billDate) || null,
            PropertyTax: combinedData.Property || null,
            EducationTax: combinedData.Education || null,
            EmploymentTax: combinedData.Emp || null,
            TreeCess: combinedData.Tree || null,
            SpWaterCess: combinedData['W.Cess'] || null,
            Sanitation: combinedData.Sanitation || null,
            DrainCess: combinedData.Drain || null,
            RoadCess: combinedData.Road || null,
            FireCess: combinedData.Fire || null,
            LightCess: combinedData.Light || null,
            WaterBenefit: combinedData['W.Benifit'] || null,
            MajorBuilding: combinedData['M.Build'] || null,
            SewageDisposalCess: combinedData.Sewage || null,
            SpEducationTax: combinedData['Sp.Educ'] || null,
            WaterBill: combinedData['W.Bill'] || null,
            Tax1: combinedData.Tax1 || null,
            Tax2: combinedData.Tax2 || null,
            Tax3: combinedData.Tax3 || null,
            Tax4: combinedData.Tax4 || null,
            Tax5: combinedData.Tax5 || null,
            TaxTotal: combinedData['Total Tax'] || null,
            Interest: combinedData.Interest || null,
            Discount: combinedData.Discount || null,
            Noticefee: combinedData['Notice Fee'] || null,
            WarrentFee: combinedData['Warrent Fee'] || null,
            MiscellaneousFee: combinedData['Extra Charges'] || null,
            NetTotal: combinedData.Total || null,
            Amount: combinedData.Total || null,
            EmpID: combinedData.Emp || null,
            PaymentMode: combinedData.paymentMode.toString() || null,
            DDChequeNo: combinedData.chequeNo || null,
            PayeeName: combinedData.name || null,
            BankName: combinedData.bankName || null,
            BranchName: combinedData.branchName || null,
            DDChequeDate: new Date(combinedData.date) || null,
            PendingYear: combinedData.year || null,
            ExpiryDate: new Date(combinedData.expiryDate) || null,
            IFSCNo: combinedData.ifsc || null,
            Remark: combinedData.remark || null,
            PaymentType: 'Advance',
            CreatedBy: 1, // change as needed
            CreatedDate: new Date(),
            UpdatedBy: 1,
            UpdatedDate: new Date()
        });
        console.log('Record inserted successfully:', result.BTId);
        res.status(200).json(result);

    } catch (error) {
        return res.status(201).json(error.message, 'Error in Saving Advance Payment Details in Database')
    }
}
