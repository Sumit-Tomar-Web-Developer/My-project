import sequelize from "../../config/connectionDB.js";
import BillTransactionDetails from "../../models/models/billtransactiondetails.js";
import CollectionCancelation from "../../models/models/collectioncancelation.js";
import CombinedOwnerName from "../../models/models/combinedownerrenternames.js";
import PropertyMast from "../../models/models/propertymast.js";
import { Op, Sequelize } from "sequelize";

export const getYearlyBillBookList = async (req, res) => {
  try {
    const { year } = req.body;
    if (!year) {
      return res.status(400).json({ message: "Please provide Finance Year" });
    }

    const billBookList = await BillTransactionDetails.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("BillBookNo")), "BillBookNo"],
      ],
      where: { FinanceYear: year },
      order: [["BillBookNo", "ASC"]], // optional, for sorted list
      raw: true,
    });

    if (billBookList.length === 0) {
      return res
        .status(404)
        .json({ message: "No Bill Book found for the selected year" });
    }

    // Return only array of bill book numbers
    const billBooks = billBookList.map((b) => b.BillBookNo);

    return res.status(200).json({ billBooks });
  } catch (error) {
    console.error("Error fetching bill book list:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getInvoiceList = async (req, res) => {
  try {
    const { billBookNo } = req.body;
    if (!billBookNo) {
      return res.status(400).json({ message: "Please provide Bill Book No." });
    }

    const invoiceList = await BillTransactionDetails.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("InvoiceNo")), "InvoiceNo"],
      ],
      where: { BillBookNo: billBookNo },
      order: [["InvoiceNo", "ASC"]],
      raw: true,
    });

    if (invoiceList.length === 0) {
      return res
        .status(404)
        .json({ message: "No invoice numbers found for this Bill Book" });
    }

    const invoices = invoiceList.map((i) => i.InvoiceNo);

    return res.status(200).json({ invoices });
  } catch (error) {
    console.error("Error fetching invoice list:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTransactionReceipt = async (req, res) => {
  try {
    const {
      wardNo,
      property,
      partition,
      year,
      billBookNo,
      invoiceNo,
      paymentMode,
      selectedResource,
    } = req.body;

    let OwnerID;

    // 1️⃣ Fetch OwnerID only if ward & property provided
    if (wardNo && property) {
      const owner = await PropertyMast.findOne({
        attributes: ["OwnerID"],
        where: {
          NewWardNo: wardNo,
          NewPropertyNo: property,
          ...(partition && { NewPartitionNo: partition }),
        },
        raw: true,
      });

      if (!owner) {
        return res.status(404).json({
          message: "No property owner found for the given details",
        });
      }

      OwnerID = owner.OwnerID;
    }

    // 2️⃣ Fetch receipt data
    const receiptData = await BillTransactionDetails.findAll({
      attributes: [
        "OwnerID",
        "BillBookNo",
        "InvoiceNo",
        "Amount",
        "TransactionDate",
        "PaymentResource",
        "ChequeStatus",
        "FinanceYear",
      ],
      where: {
        ...(OwnerID && { OwnerID }),
        ...(year && { FinanceYear: year }),
        ...(billBookNo && { BillBookNo: billBookNo }),
        ...(invoiceNo && { InvoiceNo: invoiceNo }),
        ...(paymentMode && { PaymentMode: paymentMode }),
        ...(Array.isArray(selectedResource) &&
          selectedResource.length > 0 && {
            PaymentResource: { [Op.in]: selectedResource },
          }),
      },
      raw: true,
    });

    if (!receiptData.length) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // 3️⃣ Fetch ALL owner names in ONE query
    const ownerIDs = [...new Set(receiptData.map(r => r.OwnerID))];

    const ownerNameRows = await CombinedOwnerName.findAll({
      attributes: ["OwnerID", "OwnerName"],
      where: { OwnerID: ownerIDs },
      raw: true,
    });

    // 4️⃣ Create OwnerID → OwnerNames map
    const ownerNameMap = {};
    for (const row of ownerNameRows) {
      if (!ownerNameMap[row.OwnerID]) {
        ownerNameMap[row.OwnerID] = [];
      }
      ownerNameMap[row.OwnerID].push(row.OwnerName);
    }

    // 5️⃣ Final formatted response
    const data = receiptData.map(item => ({
      ...item,
      OwnerName: ownerNameMap[item.OwnerID]?.join(", ") || "-",
      ReceiptID: `${item.FinanceYear}-${item.FinanceYear + 1}-${item.InvoiceNo}`,
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error generating receipt:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


//  result = result.map((item) =>
//           mapResult(item, {
//             MarathiOwnerName: item?.combinedownerrenternames
//               ? item.combinedownerrenternames
//                   .flatMap((c) => c.dataValues?.MarathiOwnerName || [])
//                   .join(", ")
//               : "",
