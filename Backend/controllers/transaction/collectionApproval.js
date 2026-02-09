import sequelize from "../../config/connectionDB.js";
import BillTransactionDetails from "../../models/models/billtransactiondetails.js";
import CollectionCancelation from "../../models/models/collectioncancelation.js";
import PropertyMast from "../../models/models/propertymast.js";
import { Op } from "sequelize";

export const getCollectionApprovalData = async (req, res) => {
  try {
    const { year, billBookNo, invoiceNo, fromDate, toDate, tabValue } =
      req.body;
    console.log("collection data request body:", req.body);

    if (!year || !billBookNo || tabValue === undefined || tabValue === null) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    if (
      (invoiceNo === undefined || invoiceNo === null || invoiceNo === "") &&
      (!fromDate || !toDate)
    ) {
      return res
        .status(400)
        .json({ message: "Please provide invoice no or fromDate and toDate" });
    }

    let collectionData = [];
    const fDate = fromDate ? new Date(fromDate) : null;
    const tDate = toDate ? new Date(toDate) : null;
    console.log("Date incoming", fDate, tDate);

    if (tabValue == 1) {
      collectionData = await CollectionCancelation.findAll({
        attributes: [
          "ID",
          "OwnerID",
          "BillBookNo",
          "InvoiceNo",
          "FinanceYear",
          "TransactionDate",
          "Amount",
          "PaymentType",
          "CreatedDate",
          "UpdatedDate",
        ],
        where: {
          FinanceYear: year,
          BillBookNo: billBookNo,

          // Only add invoice number if provided
          ...(invoiceNo && { InvoiceNo: invoiceNo }),

          ...(fDate &&
            tDate && {
              TransactionDate: {
                [Op.between]: [fDate, tDate],
              },
            }),
        },
        raw: true,
      });
    } else if (tabValue == 0) {
      collectionData = await BillTransactionDetails.findAll({
        attributes: [
          "BTId",
          "OwnerID",
          "BillBookNo",
          "InvoiceNo",
          "FinanceYear",
          "TransactionDate",
          "Amount",
          "PaymentType",
          "CreatedDate",
          "UpdatedDate",
        ],
        where: {
          FinanceYear: year,
          BillBookNo: billBookNo,

          // Only add invoice number if provided
          ...(invoiceNo && { InvoiceNo: invoiceNo }),

          ...(fDate &&
            tDate && {
              TransactionDate: {
                [Op.between]: [fDate, tDate],
              },
            }),
        },
        raw: true,
      });
    }

    const OwnerIDList = collectionData.map((o) => o.OwnerID);

    const propertyData = await PropertyMast.findAll({
      attributes: ["OwnerID", "NewWardNo", "NewPropertyNo", "NewPartitionNo"],
      where: {
        OwnerID: { [Op.in]: OwnerIDList },
      },
      raw: true,
    });

    const mergedData = collectionData.map((collection) => {
      const property = propertyData.find(
        (prop) => prop.OwnerID === collection.OwnerID
      );

      return {
        ...collection,
        ...property,
      };
    });

    console.log("Collection Approval Data:", mergedData);
    return res.status(200).json(mergedData);
  } catch (error) {
    console.error("Error to fetch Collection data:", error);
    return res.status(500).json({ error: "Error fetch Collection data." });
  }
};

//Delete collection entries

export const deleteCollection = async (req, res) => {
  try {
    const { recordsToDelete, CancelReason } = req.body;

    if (!Array.isArray(recordsToDelete) || recordsToDelete.length === 0) {
      return res.status(400).json({ success: false, message: "No records provided for deletion" });
    }

    if (!CancelReason || CancelReason.trim() === "") {
      return res.status(400).json({ success: false, message: "CancelReason is required" });
    }

    // ---- Prepare bulk data ----
    const whereConditions = recordsToDelete.map(record => ({
      BTId: record.BTId,
      OwnerID: record.OwnerID,
      BillBookNo: record.BillBookNo,
      InvoiceNo: record.InvoiceNo,
      FinanceYear: record.FinanceYear,
      PaymentType: record.PaymentType,
      CreatedDate: new Date(record.CreatedDate),
      UpdatedDate: new Date(record.UpdatedDate),
    }));

    // ---- Fetch all matching BillTransactionDetails at once ----
    const allRowsToDelete = await BillTransactionDetails.findAll({
      where: {
        [Op.or]: whereConditions,
      },
      raw: true,
    });

    if (!allRowsToDelete.length) {
      return res.status(404).json({ success: false, message: "No matching collection entries found to delete" });
    }

    // ---- Fetch existing cancellations to avoid duplicates ----
    const existingCancels = await CollectionCancelation.findAll({
      where: {
        [Op.or]: allRowsToDelete.map(row => ({
          OwnerID: row.OwnerID,
          BillBookNo: row.BillBookNo,
          InvoiceNo: row.InvoiceNo,
          FinanceYear: row.FinanceYear,
          PaymentType: row.PaymentType,
          CreatedDate: new Date(row.CreatedDate),
          UpdatedDate: new Date(row.UpdatedDate),
        })),
      },
      raw: true,
    });

    const existingSet = new Set(existingCancels.map(row =>
      `${row.OwnerID}-${row.BillBookNo}-${row.InvoiceNo}-${row.FinanceYear}-${row.PaymentType}-${new Date(row.CreatedDate).toISOString()}-${new Date(row.UpdatedDate).toISOString()}`
    ));

    // ---- Prepare rows for bulk insert ----
    const rowsForInsert = allRowsToDelete
      .filter(row => {
        const key = `${row.OwnerID}-${row.BillBookNo}-${row.InvoiceNo}-${row.FinanceYear}-${row.PaymentType}-${new Date(row.CreatedDate).toISOString()}-${new Date(row.UpdatedDate).toISOString()}`;
        return !existingSet.has(key);
      })
      .map(row => ({
        ...row,
        CancelReason,
        CreatedDate: new Date(row.CreatedDate),
        UpdatedDate: new Date(row.UpdatedDate),
      }));

    if (rowsForInsert.length) {
      await CollectionCancelation.bulkCreate(rowsForInsert);
    }

    // ---- Delete all rows at once ----
    const deletedCount = await BillTransactionDetails.destroy({
      where: {
        [Op.or]: whereConditions,
      },
    });

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${deletedCount} collection entries.`,
    });
  } catch (error) {
    console.error("Error deleting collection:", error);
    return res.status(500).json({
      success: false,
      message: "Unexpected error occurred while deleting collection",
      error: error.message,
    });
  }
};

