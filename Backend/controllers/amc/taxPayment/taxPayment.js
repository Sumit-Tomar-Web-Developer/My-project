import sequelize from "../../../config/connectionDB.js";
import PropertyMast from "../../../models/models/propertymast.js";
import { TaxPendingDetails } from "../../../models/models/taxpendingdetails.js";
import { OldPropertyMast } from "../../../models/models/oldpropertymast.js";
import CombinedOwnerName from "../../../models/models/combinedownerrenternames.js";
import InvoiceNoMaster from "../../../models/models/invoicemaster.js";
import BillTransactionDetails from "../../../models/models/billtransactiondetails.js";
import Billtransactionadvanceresultsummary from "../../../models/models/billtransactionadvanceresultsummary.js";
import BankMaster from "../../../models/models/bankmaster.js";
import BillBookEntry from "../../../models/models/billbookentry.js";
import { Op, fn, col, Sequelize } from "sequelize";
import dayjs from "dayjs";

import PaymentForApproval from "../../../models/models/paymentsforapproval.js";
import path from "path";
import fs from "fs";
PropertyMast.hasOne(OldPropertyMast, { foreignKey: "OwnerID" });
OldPropertyMast.belongsTo(PropertyMast, { foreignKey: "OwnerID" });

PropertyMast.hasOne(CombinedOwnerName, { foreignKey: "OwnerID" });
CombinedOwnerName.belongsTo(PropertyMast, { foreignKey: "OwnerID" });


// Function to get all bill book entries
export const fetchBillBookEntries = async (req, res) => {
  try {
    const entries = await BillBookEntry.findAll({
      where: {
        BillBookType: "Posting",
      },
    });

    if (!entries || entries.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Bill Book found for Tax Payment",
      });
    }
    console.log("all bill book entries", entries);
    return res.status(200).json({
      success: true,
      entries,
    });

  } catch (error) {
    console.error("Error fetching bill book entries:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching bill book entries",
    });
  }
};

//Function to fetch Comined ownerdetails
export const fetchCombinedOwnerDetails = async (req, res) => {
  try {
    let { ownerID } = req.body;
    if (!ownerID) {
      return res.status(400).json({ message: "ownerID is required" });
    }
    const OwnerDetails = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
        "AssessmentNo",
      ],
      where: {
        OwnerID: ownerID,
      },
      include: [
        {
          model: OldPropertyMast,
          attributes: ["OldWardNo", "OldPropertyNo", "OldPartitionNo"],
          required: false, // LEFT JOIN
        },
        {
          model: CombinedOwnerName,
          attributes: ["OwnerName", "OccupierName", "RenterName"],
          required: false, // LEFT JOIN
        },
      ],
      raw: true,
    });
    const detail = OwnerDetails[0];
    const combinedOwnerDetails = {
      OwnerID: detail.OwnerID,
      NewWardNo: detail.NewWardNo,
      NewPropertyNo: detail.NewPropertyNo,
      NewPartitionNo: detail.NewPartitionNo,
      OldWardNo: detail["oldpropertymast.OldWardNo"] || "",
      OldPropertyNo: detail["oldpropertymast.OldPropertyNo"] || "",
      OldPartitionNo: detail["oldpropertymast.OldPartitionNo"] || "",
      OwnerName: detail["combinedownerrenternames.OwnerName"] || "",
      OccupierName: detail["combinedownerrenternames.OccupierName"] || "",
      RenterName: detail["combinedownerrenternames.RenterName"] || "",
      AssessmentNo: detail.AssessmentNo || "",
    };

    return res.json(combinedOwnerDetails);
  } catch (error) {
    console.error("Error in combinedOwnerDetails", error.message);
    return res.status(500).json({ error: error.message });
  }
};

//Function to fetch TaxPending details
export const getPendingTaxes = async (req, res) => {
  try {
    const { ownerID, year } = req.body;
    console.log("Owner ID and year:", ownerID, "and", year);
    if (!ownerID || !year) {
      return res.status(400).json({ message: "ownerID and year are required" });
    }
    const pendingTaxes = await TaxPendingDetails.findAll({
      where: {
        OwnerID: ownerID,
        PendingYear: Number(year) - 1,
      },
      limit: 1,
    });
    console.log(pendingTaxes, "pendingTaxes");
    return res.json(pendingTaxes);
  } catch (error) {
    console.log(error);
  }
};

//Function to fetch advance payment details
export const getInterestAmounts = async (req, res) => {
  try {
    const { ownerId, year, transactionDate } = req.body;

    if (!ownerId || !year || !transactionDate) {
      return res.status(400).json({ error: "ownerID and year are required" });
    }

    let TransactionDate = transactionDate
      ? new Date(transactionDate)
      : new Date();

    console.log("Transaction date", TransactionDate);
    // Query 1: Pending interest
    await sequelize.query("SET @p_Penalty = 0;");
    await sequelize.query(
      "CALL funAMCcalculatePendingPenalty(:ownerId, :year, :param1, :param2, :TransactionDate);",
      {
        replacements: {
          ownerId,
          year,
          param1: null,
          param2: null,
          TransactionDate,
        },
      }
    );
    const [pendInterest] = await sequelize.query(
      "SELECT Penalty from tbl_penalty;"
    );

    // Query 2: Current interest
    const currInterest = await sequelize.query(
      "CALL funAMCcalculateCurrentPenalty(:param1, :param2, :param3, :param4, :param5, :param6, :param7)",
      {
        replacements: {
          param1: ownerId,
          param2: year,
          param3: null,
          param4: null,
          param5: null,
          param6: null,
          param7: TransactionDate,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const extractPenalty = (arr) => {
      if (!Array.isArray(arr)) return 0;
      for (const item of arr) {
        if (item?.fieldCount !== undefined) continue;
        const inner = item?.["0"];
        if (inner && "Penalty" in inner) return inner.Penalty ?? 0;
      }
      return 0;
    };
    const currentPenalty = extractPenalty(currInterest);

    // Query 3: Advance Paid
    const advancePaid = await Billtransactionadvanceresultsummary.findOne({
      attributes: [[fn("SUM", col("PaidAmount")), "totalPaidAmount"]],
      where: {
        ResultID: {
          [Op.in]: sequelize.literal(`(
            SELECT ID FROM billtransactionadvanceresult
            WHERE OwnerID = ${ownerId} AND FinanceYear = ${year}
          )`),
        },
      },
      raw: true,
    });

    // Query 4: Current Paid Taxes
    const taxes = await BillTransactionDetails.findAll({
      attributes: [
        "PaymentType", // group column
        [fn("SUM", col("PropertyTax")), "Property"],
        [fn("SUM", col("EducationTax")), "Education"],
        [fn("SUM", col("SpEducationTax")), "Sp.Educ"],
        [fn("SUM", col("EmploymentTax")), "Emp"],
        [fn("SUM", col("TreeCess")), "Tree"],
        [fn("SUM", col("FireCess")), "Fire"],
        [fn("SUM", col("LightCess")), "Light"],
        [fn("SUM", col("DrainCess")), "Drain"],
        [fn("SUM", col("RoadCess")), "Road"],
        [fn("SUM", col("Sanitation")), "Sanitation"],
        [fn("SUM", col("SpWaterCess")), "W.Cess"],
        [fn("SUM", col("WaterBenefit")), "W.Benifit"],
        [fn("SUM", col("WaterBill")), "W.Bill"],
        [fn("SUM", col("MajorBuilding")), "M.Build"],
        [fn("SUM", col("SewageDisposalCess")), "Sewage"],
        [fn("SUM", col("Tax1")), "Tax1"],
        [fn("SUM", col("Tax2")), "Tax2"],
        [fn("SUM", col("Interest")), "Interest"],
        [fn("SUM", col("TaxTotal")), "Total Tax"],
        [fn("SUM", col("MiscellaneousFee")), "Extra Charges"],
        [fn("SUM", col("Noticefee")), "Notice Fee"],
        [fn("SUM", col("Discount")), "Discount"],
        [fn("SUM", col("NetTotal")), "NetTotal"],
        [fn("SUM", col("Amount")), "Amount"],
      ],
      where: {
        OwnerID: ownerId,
        FinanceYear: year,
        PaymentType: ["Current", "Pending"], // ✅ fetch both in one go
      },
      group: ["PaymentType"], // ✅ group results by PaymentType
      raw: true,
    });

    // Split into separate objects for clarity
    const currentPaidTaxes =
      taxes.find((t) => t.PaymentType === "Current") || {};
    const pendingPaidTaxes =
      taxes.find((t) => t.PaymentType === "Pending") || {};

    console.log("Current Paid Taxes:", currentPaidTaxes);
    console.log("Pending Paid Taxes:", pendingPaidTaxes);

    // ✅ Clean null values once before sending response
    const safeData = (obj = {}) =>
      Object.fromEntries(
        Object.entries(obj).map(([key, val]) => [key, Number(val) || 0])
      );
    console.log("curr data", safeData(currentPaidTaxes))
    console.log("pend data", safeData(pendingPaidTaxes))


    return res.json({
      success: true,
      data: {
        pendInterest: pendInterest?.Penalty ?? 0,
        currInterest: currentPenalty ?? 0,
        advancePaid: Number(advancePaid?.totalPaidAmount) || 0,
        currentPaidTaxes: safeData(currentPaidTaxes),
        pendingPaidTaxes: safeData(pendingPaidTaxes),
      },
    });
  } catch (error) {
    console.error("Error fetching interest amounts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//getBalancesheetData
export const getBalancesheetData = async (req, res) => {
  try {
    const { ownerId, year } = req.body;
    if (!ownerId || !year) {
      return res.status(400).json({ message: "ownerID and year are required" });
    }
    const data = await sequelize.query(
      "call GetDataFromViews(:Param1,:Param2)",
      {
        replacements: {
          Param1: ownerId,
          Param2: year,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    console.log("Get Balancesheet data", data);
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//To cancel invoice no
export const cancelInvoiceNo = async (req, res) => {
  try {
    const { year, billBookNo, invoiceNo, cancelReason } = req.body;

    if (!year || !billBookNo || !invoiceNo || !cancelReason) {
      return res.status(400).json({
        success: false,
        message:
          "Year, Bill Book Number,Reason and Invoice Number are required",
      });
    }

    // Check if the invoice is already cancelled
    const existingInvoice = await InvoiceNoMaster.findOne({
      where: {
        Year: year,
        BillBookNo: billBookNo,
        InvoiceNo: invoiceNo,
        Status: 0,
      },
    });

    if (existingInvoice) {
      return res.status(409).json({
        success: false,
        message: "This invoice has already been cancelled",
      });
    }
    const response = await InvoiceNoMaster.create({
      Year: year,
      BillBookNo: billBookNo,
      InvoiceNo: invoiceNo,
      Reason: cancelReason,
      Status: 1,
    });

    console.log("Invoice cancelled successfully", response.ID);
    return res.status(200).json({
      success: true,
      message: "Invoice cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling invoice:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while cancelling the invoice",
    });
  }
};

//Fetch bank table
export const fetchAllBanks = async (req, res) => {
  try {
    const banks = await BankMaster.findAll({
      attributes: ["BankName"],
      order: [["BankName", "ASC"]],
    });
    res.status(200).json(banks);
  } catch (error) {
    console.error("Error to fetch banks", error);
    res.status(500).json({ error: "Failed to fetch banks" });
  }
};

//Fetch paid payment details of owner till year
export const fetchPaymentDetails = async (req, res) => {
  try {
    const { ownerID } = req.body;

    if (!ownerID) {
      return res.status(400).json({ error: "ownerID is missing" });
    }

    // ✅ Fetch all records for this OwnerID
    const allDetails = await BillTransactionDetails.findAll({
      where: { OwnerID: ownerID },
      raw: true,
    });

    if (!allDetails.length) {
      return res
        .status(404)
        .json({ success: false, message: "No records found" });
    }

    // ✅ Map required fields for output
    const paymentData = allDetails.map((item) => ({
      "Bill Book No": item.BillBookNo ?? "",
      "Invoice No": item.InvoiceNo ?? "",
      "Finance Year": item.FinanceYear ?? "",
      "Pending Year": item.PendingYear ?? "",
      "Bill No": item.BillNo ?? "",
      "Transaction Date": item.TransactionDate ?? "",
      "Bill Date": item.BillDate ?? "",
      "Property Tax": item.PropertyTax ?? 0,
      "Education Tax": item.EducationTax ?? 0,
      "Employment Tax": item.EmploymentTax ?? 0,
      "Tree Cess": item.TreeCess ?? 0,
      "Sp. Water Cess": item.SpWaterCess ?? 0,
      Sanitation: item.Sanitation ?? 0,
      "Drain Cess": item.DrainCess ?? 0,
      "Road Cess": item.RoadCess ?? 0,
      "Fire Cess": item.FireCess ?? 0,
      "Light Cess": item.LightCess ?? 0,
      "Water Benefit": item.WaterBenefit ?? 0,
      "Major Building": item.MajorBuilding ?? 0,
      "Sewage Disposal Cess": item.SewageDisposalCess ?? 0,
      "Sp. Education Tax": item.SpEducationTax ?? 0,
      "Water Bill": item.WaterBill ?? 0,
      Tax1: item.Tax1 ?? 0,
      Tax2: item.Tax2 ?? 0,
      Tax3: item.Tax3 ?? 0,
      Tax4: item.Tax4 ?? 0,
      Tax5: item.Tax5 ?? 0,
      "Tax Total": item.TaxTotal ?? 0,
      Interest: item.Interest ?? 0,
      Discount: item.Discount ?? 0,
      "Notice Fee": item.Noticefee ?? 0,
      "Extra Charges": item.MiscellaneousFee ?? 0,
      NetTotal: item.NetTotal ?? 0,
      Amount: item.Amount ?? 0,
      EmpID: item.EmpID ?? "",
      "Payment Mode": item.PaymentMode ?? "",
      "DD/Cheque No": item.DDChequeNo ?? "",
      "Payee Name": item.PayeeName ?? "",
      "Bank Name": item.BankName ?? "",
      "Branch Name": item.BranchName ?? "",
      "Cheque Status": item.ChequeStatus ?? "",
      "DD/Cheque Date": item.DDChequeDate ?? "",
      "Expiry Date": item.ExpiryDate ?? "",
      "IFSC No": item.IFSCNo ?? "",
      "Payment Type": item.PaymentType ?? "",
      "Transaction ID": item.TransactionId ?? "",
      CreatedDate: item.CreatedDate ?? "",
      UpdatedDate: item.UpdatedDate ?? "",
    }));

    // ✅ Send final response
    return res.status(200).json({
      paymentData,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//Check status of invoice
export const checkInvoiceStatus = async (req, res) => {
  try {
    const { year, billBookNo, invoiceNo } = req.body;

    const invoice = await InvoiceNoMaster.findOne({
      attributes: [[Sequelize.literal("CAST(Status AS UNSIGNED)"), "Status"]],
      where: {
        Year: year,
        BillBookNo: billBookNo,
        InvoiceNo: invoiceNo,
      },
      raw: true,
    });

    console.log("checkInvoiceStatus:", invoice);

    // Case 1: Not found
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: `Invoice No ${invoiceNo} not found for BillBook No ${billBookNo}.`,
      });
    }

    // Case 2: Not active
    if (invoice.Status === 0) {
      return res.status(409).json({
        success: false,
        message: `Invoice No ${invoiceNo} is NOT active for BillBook No ${billBookNo}.`,
      });
    }

    // Case 3: Active
    return res.status(200).json({
      success: true,
      message: `Invoice No ${invoiceNo} is active for BillBook No ${billBookNo}.`,
    });
  } catch (error) {
    console.error("Error checking invoice status:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while checking invoice status.",
      error: error.message,
    });
  }
};

//Check for dublicate Invoice No used for another owner
export const checkDuplicateInvoice = async (req, res) => {
  try {
    console.log("checkDuplicateInvoice", req.body);

    // ✅ handle both cases: body is object or array
    const body = Array.isArray(req.body) ? req.body[0] : req.body;
    const { combinedData } = body || {};

    if (!combinedData || !combinedData.length) {
      return res.status(400).json({
        success: false,
        message: "No payment data provided.",
      });
    }

    // ✅ extract payment details safely
    const {
      ownerID,
      invoiceNo,
      BillBookNo: billBookNo,
      year,
      pendingYear,
      paymentType,
    } = combinedData[0];

    console.log("Duplicate check data =>", {
      ownerID,
      invoiceNo,
      billBookNo,
      year,
      pendingYear,
      paymentType,
    });

    const duplicateInvoice = await BillTransactionDetails.findAll({
      where: {
        BillBookNo: billBookNo,
        InvoiceNo: invoiceNo,
        PendingYear: pendingYear,
        FinanceYear: year,
        PaymentType: paymentType,
        OwnerID: { [Op.ne]: ownerID },
      },
      raw: true,
    });

    console.log("duplicate entry", duplicateInvoice);

    if (duplicateInvoice && duplicateInvoice.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Duplicate Invoice No ${invoiceNo} found for another owner.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "No duplicate invoice found.",
    });
  } catch (error) {
    console.error("Error to check duplicate invoice:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while checking duplicate invoice.",
      error: error.message,
    });
  }
};

//Save tax Payment
export const saveTaxPayment = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const payments = Array.isArray(req.body) ? req.body : [req.body];

    if (!payments.length) {
      return res.status(400).json({
        success: false,
        message: "No payment data provided.",
      });
    }
    const { ownerID } = payments[0];
    const property = await PropertyMast.findOne({
      attributes: ["NewWardNo", "NewPropertyNo", "NewPartitionNo"],
      where: {
        OwnerID: ownerID,
      },
    });
    const wardNo = property.NewWardNo;
    const propertyNo = property.NewPropertyNo;
    const partitionNo = property.NewPartitionNo;

    // ✅ Generate a unique 6–10 digit number using timestamp
    const timestampSuffix = (Date.now() % 1000000).toString().padStart(6, "0");
    let MerchantTxnRefNumber;
    if (partitionNo != "") {
      MerchantTxnRefNumber = `N${timestampSuffix}W${wardNo}P${propertyNo}D${partitionNo}`;
    } else {
      MerchantTxnRefNumber = `N${timestampSuffix}W${wardNo}P${propertyNo}`;
    }
    console.log("payments", timestampSuffix, payments);

    const commonTransactionDate = payments?.[0]?.transactionDate
      ? new Date(payments[0].transactionDate)
      : new Date();

    const commonBillDate = payments?.[0]?.billDate
      ? new Date(payments[0].billDate)
      : null;
    console.log("dates", commonTransactionDate, commonBillDate);

    const recordsToInsert = payments.map((data) => {
      return {
        ManageID: 0,
        OwnerID: data.ownerID || null,
        BillBookNo: data.BillBookNo || null,
        InvoiceNo: data.invoiceNo || null,
        MerchantTxnRefNumber, // ✅ Unique ID field added
        FinanceYear: data.year || null,
        PendingYear: data.pendingYear || null,
        BillNo: data.billNo || null,
        TransactionDate: commonTransactionDate,
        BillDate: commonBillDate,
        PropertyTax: data.Property || null,
        EducationTax: data.Education || null,
        EmploymentTax: data.Emp || null,
        TreeCess: data.Tree || null,
        SpWaterCess: data["W.Cess"] || null,
        Sanitation: data.Sanitation || null,
        DrainCess: data.Drain || null,
        RoadCess: data.Road || null,
        FireCess: data.Fire || null,
        LightCess: data.Light || null,
        WaterBenefit: data["W.Benifit"] || null,
        MajorBuilding: data["M.Build"] || null,
        SewageDisposalCess: data.Sewage || null,
        SpEducationTax: data["Sp.Educ"] || null,
        WaterBill: data["W.Bill"] || null,
        Tax1: data.Tax1 || null,
        Tax2: data.Tax2 || null,
        Tax3: data.Tax3 || null,
        Tax4: data.Tax4 || null,
        Tax5: data.Tax5 || null,
        TaxTotal: data["Total Tax"] || null,
        Interest: data.Interest || null,
        Discount: data.Discount || null,
        Noticefee: data["Notice Fee"] || null,
        WarrentFee: data["Warrent Fee"] || null,
        MiscellaneousFee: data["Extra Charges"] || null,
        NetTotal: data.NetTotal || null,
        Amount: data.NetTotal || null,
        EmpID: data.empID || null,
        PaymentMode: data.paymentMode?.toString() || null,
        DDChequeNo: data.chequeNo || null,
        PayeeName: data.name || null,
        BankName: data.bankName || null,
        BranchName: data.branchName || null,
        DDChequeDate: data.date ? new Date(data.date) : null,
        ExpiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        IFSCNo: data.ifsc || null,
        Remark: data.remark || null,
        PaymentType: data.paymentType || null,
        TransactionId: data.transactionId || null,
        MobileNumber: data.mobileNo || null,
        PaymentResource: data.PaymentResource || null,
        CreatedBy: 1,
        CreatedDate: new Date(),
        UpdatedBy: 1,
        UpdatedDate: new Date(),
      };
    });

    await BillTransactionDetails.bulkCreate(recordsToInsert, {
      transaction: t,
    });
    await t.commit();

    const paymentTypes = [
      ...new Set(recordsToInsert.map((r) => r.PaymentType)),
    ];
    let message = "";

    if (paymentTypes.length === 1) {
      message = `Tax payment for ${paymentTypes[0]} year saved successfully.`;
    } else if (
      paymentTypes.includes("Current") &&
      paymentTypes.includes("Pending")
    ) {
      message = `Tax payments for both Current and Pending years saved successfully.`;
    } else {
      message = `Tax payment saved successfully.`;
    }

    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error saving tax payments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//save upadtes of tax payment transaction
export const updateTaxPayment = async (req, res) => {
  console.log("update tax payment");
  const t = await sequelize.transaction();

  try {
    const payments = Array.isArray(req.body) ? req.body : [req.body];
    console.log("update tax payment", req.body);
    if (!payments.length) {
      return res.status(400).json({
        success: false,
        message: "No payment data provided.",
      });
    }

    const { ownerID, invoiceNo, BillBookNo: billBookNo, year } = payments[0];

    console.log("Checking duplicates for:", {
      ownerID,
      invoiceNo,
      billBookNo,
      year,
    });

    // ✅ Sequential updates using for...of
    for (const data of payments) {
      const [affectedRows] = await BillTransactionDetails.update(
        {
          PaymentMode: data.PaymentMode,
          BillBookNo: data.BillBookNo,
          InvoiceNo: data.invoiceNo,
          DDChequeNo: data.chequeNo || null,
          PayeeName: data.name || null,
          BankName: data.bankName || null,
          BranchName: data.branchName || null,
          DDChequeDate: data.date ? new Date(data.date) : null,
          ExpiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
          IFSCNo: data.ifsc || null,
          TransactionId: data.transactionId || null,
          UpdatedBy: 1,
          UpdatedDate: new Date(),
        },
        {
          where: {
            OwnerID: data.ownerID,
            FinanceYear: data.year,
            PendingYear: data.pendingYear,
            PaymentType: data.paymentType,
          },
          transaction: t,
        }
      );
      console.log("afftected rows", affectedRows);
      // ✅ Verify that update affected a record
      if (affectedRows === 0) {
        console.warn(`⚠️ No record updated for OwnerID=${data.OwnerID}`);
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: `Tax payment not updated for OwnerID ${data.OwnerID}. Please verify input data.`,
        });
      }
    }

    // ✅ Commit transaction only if all updates succeed
    await t.commit();

    // ✅ Dynamic success message
    const types = [...new Set(payments.map((p) => p.paymentType))];
    const message =
      types.length === 2
        ? "Tax payments for both Current and Pending years updated successfully."
        : `Tax payment for ${types[0]} year updated successfully.`;

    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Error updating tax payment:", error);
    await t.rollback();
    return res.status(500).json({
      success: false,
      message: "Unexpected error occurred while updating tax payment.",
      error: error.message,
    });
  }
};

//Delete tax payment
export const deleteTaxPayment = async (req, res) => {
  try {
    const { OwnerID, BillBookNo, InvoiceNo, FinanceYear, PaymentType } =
      req.body;

    console.log("delete req body", req.body);

    // Validate required fields
    if (!OwnerID || !BillBookNo || !InvoiceNo || !FinanceYear || !PaymentType) {
      return res
        .status(400)
        .json({ success: false, message: "Required data is missing" });
    }

    // Determine types to delete
    const typesToDelete =
      PaymentType === "Current-Pending"
        ? ["Current", "Pending"]
        : [PaymentType];

    let totalDeleted = 0;

    // Delete each type separately for safety
    for (const type of typesToDelete) {
      const deletedCount = await BillTransactionDetails.destroy({
        where: {
          OwnerID,
          BillBookNo,
          InvoiceNo,
          FinanceYear,
          PaymentType: type,
        },
      });
      totalDeleted += deletedCount;
    }

    if (totalDeleted === 0) {
      return res.status(404).json({
        success: false,
        message: "No matching tax payment entry found",
      });
    }

    const message =
      typesToDelete.length === 2
        ? "Tax payments for both Current and Pending years deleted successfully."
        : `Tax payment for ${typesToDelete[0]} year deleted successfully.`;

    return res.status(200).json({ success: true, message });
  } catch (error) {
    console.error("Error deleting tax payment:", error);
    return res.status(500).json({
      success: false,
      message: "Unexpected error occurred, Failed to Delete Tax Payment Entry",
      error: error.message,
    });
  }
};



export const sendForApproval = async (req, res) => {

  // Ensure payments array
  const payments = Array.isArray(req.body) ? req.body : req.body?.data ? [req.body.data] : [];
  const user = req.body?.user || null;
  console.log("send for approval user:", user);

  console.log("send for approval payments payment[0]:", payments[0]);

  if (!payments.length) {
    return res.status(400).json({
      success: false,
      message: "No payment data provided.",
    });
  }

  // Extract first payment info
  const { ownerID } = payments[0]?.[0] || null;
  if (!ownerID) {
    return res.status(400).json({
      success: false,
      message: "Payment must have a valid ownerID.",
    });
  }

  // Fetch property info
  const property = await PropertyMast.findOne({
    attributes: ["NewWardNo", "NewPropertyNo", "NewPartitionNo"],
    where: { OwnerID: ownerID },
  });

  if (!property) {
    return res.status(404).json({
      success: false,
      message: `No property found for OwnerID ${ownerID}.`,
    });
  }

  const wardNo = property.NewWardNo || "";
  const propertyNo = property.NewPropertyNo || "";
  const partitionNo = property.NewPartitionNo || "";

  // File handling
  const proofDetails = payments[0]?.[0]?.proofDetails;
  if (!proofDetails) {
    return res.status(400).json({
      success: false,
      message: "No proof file provided.",
    });
  }

  const matches = proofDetails.match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    return res.status(400).json({
      success: false,
      message: "Invalid file format. Must be base64 data URI.",
    });
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const fileBuffer = Buffer.from(base64Data, "base64");

  // Determine extension
  const extMap = {
    "application/pdf": "pdf",
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/gif": "gif",
  };
  const ext = extMap[mimeType] || "bin";

  // File path
const Base = "\\\\192.168.5.103\\E$\\Proof"; // Fixed extra colon
const folderName = "NTIS_INVOICE_PROOF"; // Removed trailing space
const BASE_Path = path.join(Base, folderName);

// Ensure folder exists
try {
  fs.mkdirSync(BASE_Path, { recursive: true });
  console.log("✅ Folder ready:", BASE_Path);
} catch (err) {
  console.error("❌ Folder creation failed:", err);
}
  const fileName = `${ownerID}_${Date.now()}.${ext}`;
  const filePath = path.join(BASE_Path, fileName);
  fs.writeFileSync(filePath, fileBuffer);

  console.log("File saved at:", filePath);

  // Unique MerchantTxnRefNumber
  const timestampSuffix = (Date.now() % 1000000).toString().padStart(6, "0");
  const MerchantTxnRefNumber = partitionNo
    ? `N${timestampSuffix}W${wardNo}P${propertyNo}D${partitionNo}`
    : `N${timestampSuffix}W${wardNo}P${propertyNo}`;

  // Dates
  const commonTransactionDate = payments[0]?.[0]?.transactionDate
    ? new Date(payments[0][0].transactionDate)
    : new Date();

  const commonBillDate = payments[0]?.[0]?.billDate ? new Date(payments[0][0].billDate) : null;
  // Prepare records
  const recordsToInsert = payments[0].map((data) => ({
    OwnerID: data.ownerID || null,
    BillBookNo: data.BillBookNo || null,
    InvoiceNo: data.invoiceNo || null,
    MerchantTxnRefNumber,
    FinanceYear: data.year || null,
    PendingYear: data.pendingYear || null,
    BillNo: data.billNo || null,
    TransactionDate: commonTransactionDate,
    BillDate: commonBillDate,
    PropertyTax: data.Property || null,
    EducationTax: data.Education || null,
    EmploymentTax: data.Emp || null,
    TreeCess: data.Tree || null,
    SpWaterCess: data["W.Cess"] || null,
    Sanitation: data.Sanitation || null,
    DrainCess: data.Drain || null,
    RoadCess: data.Road || null,
    FireCess: data.Fire || null,
    LightCess: data.Light || null,
    WaterBenefit: data["W.Benifit"] || null,
    MajorBuilding: data["M.Build"] || null,
    SewageDisposalCess: data.Sewage || null,
    SpEducationTax: data["Sp.Educ"] || null,
    WaterBill: data["W.Bill"] || null,
    Tax1: data.Tax1 || null,
    Tax2: data.Tax2 || null,
    Tax3: data.Tax3 || null,
    Tax4: data.Tax4 || null,
    Tax5: data.Tax5 || null,
    TaxTotal: data["Total Tax"] || null,
    Interest: data.Interest || null,
    Discount: data.Discount || null,
    Noticefee: data["Notice Fee"] || null,
    WarrentFee: data["Warrent Fee"] || null,
    MiscellaneousFee: data["Extra Charges"] || null,
    NetTotal: data.NetTotal || null,
    Amount: data.NetTotal || null,
    EmpID: data.empID || null,
    PaymentMode: data.paymentMode?.toString() || null,
    DDChequeNo: data.chequeNo || null,
    PayeeName: data.name || null,
    BankName: data.bankName || null,
    BranchName: data.branchName || null,
    DDChequeDate: data.date ? new Date(data.date) : null,
    ExpiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
    IFSCNo: data.ifsc || null,
    Remark: data.remark || null,
    PaymentType: data.paymentType || null,
    TransactionId: data.transactionId || null,
    MobileNumber: data.mobileNo || null,
    PaymentResource: data.PaymentResource || null,
    CreatedDate: new Date(),
    CreatedBy: user ? user.UserID : null,
    UpdatedBy: user ? user.UserID : null,
    UpdatedDate: new Date(),
    Status: "Pending",
    PaymentProof: `/NTIS_INVOICE_PROOF/${fileName}`,
  }));


  console.log("Records to insert for approval:", recordsToInsert);
  await PaymentForApproval.bulkCreate(recordsToInsert, { validate: true });

  return res.status(200).json({
    success: true,
    message: "Tax payment sent successfully for approval.",
  });

};
