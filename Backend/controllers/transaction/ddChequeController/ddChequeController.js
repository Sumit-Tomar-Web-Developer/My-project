import { Op, Sequelize, col } from "sequelize";
import ZoneSectionDetails from "../../../models/models/zonesectiondetails.js";
import PropertyMast from "../../../models/models/propertymast.js";
import BillTransactionDetails from "../../../models/models/billtransactiondetails.js";
import DDChequeTransactionHistory from "../../../models/models/ddChequeTransactionHistory.js";

export const getZoneSectionList = async (req, res) => {
    try {
      const zones = await ZoneSectionDetails.findAll({
        attributes: [
          [Sequelize.fn("DISTINCT", Sequelize.col("ZoneSectionNo")), "ZoneSectionNo"]
        ],
        where: {
          ZoneSectionNo: { [Sequelize.Op.ne]: null }
        },
        order: [["ZoneSectionNo", "ASC"]]
      });
  
      res.json({ success: true, data: zones });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  export const getWardByZone = async (req, res) => {
    try {
      const { zoneNo } = req.body;
  
      if (!zoneNo) {
        return res.status(400).json({ success: false, message: "Zone is required" });
      }
  
      const wards = await ZoneSectionDetails.findAll({
        attributes: ["Ward"],
        where: { ZoneSectionNo: zoneNo },
        group: ["Ward"],
        order: [["Ward", "ASC"]]
      });
  
      res.json({ success: true, data: wards });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  export const getOwnerByZoneWard = async (req, res) => {
    try {
      const { wardNo } = req.body;
  
      if (!wardNo) {
        return res.status(400).json({
          success: false,
          message: "Ward is required"
        });
      }
  
      // Step 1: Get OwnerIDs in this Ward
      const ownersInWard = await PropertyMast.findAll({
        attributes: ["OwnerID"],
        where: { NewWardNo: wardNo },
        raw: true
      });
  
      const ownerIds = ownersInWard.map(o => o.OwnerID);
  
      if (ownerIds.length === 0) {
        return res.json({ success: true, data: [] });
      }
  
      // Step 2: Filter OwnerIDs who have transaction
      const ownersWithTransaction = await BillTransactionDetails.findAll({
        attributes: ["OwnerID"],
        where: { OwnerID: { [Op.in]: ownerIds } },
        group: ["OwnerID"],
        raw: true
      });
  
      const filteredOwnerIds = ownersWithTransaction.map(o => o.OwnerID);
  
      if (filteredOwnerIds.length === 0) {
        return res.json({ success: true, data: [] });
      }
  
      // Step 3: Get Property + Partition for filtered OwnerIDs
      const propertyDetails = await PropertyMast.findAll({
        attributes: ["OwnerID", "NewPropertyNo", "NewPartitionNo"],
        where: { OwnerID: { [Op.in]: filteredOwnerIds } },
        order: [["OwnerID", "ASC"]],
        raw: true
      });
  
      res.json({ success: true, data: propertyDetails });
  
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
//update 

//sucss
  export const updateChequeStatus = async (req, res) => {
    try {
      const { chequeNos, fromDate, toDate, chequeStatus } = req.body;

      // 1️⃣ Validation
      if ((!chequeNos || chequeNos.length === 0) && !(fromDate && toDate)) {
        return res.status(400).json({
          success: false,
          message: "Please provide cheque numbers OR a From & To date"
        });
      }

      if (!chequeStatus) {
        return res.status(400).json({
          success: false,
          message: "Cheque status is required"
        });
      }

      // 2️⃣ Build where condition dynamically
      let whereCondition = {};
      if (chequeNos && chequeNos.length > 0) {
        whereCondition.DDChequeNo = { [Op.in]: chequeNos };
      } else if (fromDate && toDate) {
        whereCondition.ChequeDate = { [Op.between]: [fromDate, toDate] };
      }

      // 3️⃣ Fetch matching BillTransactionDetails rows
      const chequesToUpdate = await BillTransactionDetails.findAll({ where: whereCondition });

      if (chequesToUpdate.length === 0) {
        return res.json({
          success: true,
          message: "No cheque(s) found for update",
          data: []
        });
      }

      // 4️⃣ Loop through each cheque to sync DD history
      for (let chq of chequesToUpdate) {
        const prevStatus = chq.ChequeStatus; // store old status

        // Find or create DD row
        const [ddRow, created] = await DDChequeTransactionHistory.findOrCreate({
          where: {
            DDChequeNo: chq.DDChequeNo,
            TransactionDate: chq.TransactionDate
          },
          defaults: {
            OwnerID: chq.OwnerID || '-',
            BillBookNo: chq.BillBookNo || '-',
            InvoiceNo: chq.InvoiceNo || '-',
            DDChequeNo: chq.DDChequeNo || '-',
            PreviousStatus: prevStatus,
            ChequeStatus: chequeStatus,
            TransactionDate: chq.TransactionDate || new Date(),
            DDChequeDate: chq.ChequeDate || new Date(),
            Amount: chq.Amount || 0,
            MerchantTxnRefNumber: chq.MerchantTxnRefNumber || '-',
            BankName: chq.BankName || '-',
            PaymentResource: chq.PaymentResource || '-',
            FinanceYear: chq.FinanceYear || '-',
            Latitude: chq.Latitude || 0,
            Longitude: chq.Longitude || 0,
            CreatedBy: chq.CreatedBy || 'System',
            UpdatedAt: new Date()
          }
        });

        // If DD row exists, just update the status
        if (!created) {
          ddRow.PreviousStatus = ddRow.ChequeStatus;
          ddRow.ChequeStatus = chequeStatus;
          ddRow.UpdatedAt = new Date();
          await ddRow.save();
        }
      }

      // 5️⃣ Update BillTransactionDetails status
      await BillTransactionDetails.update(
        { ChequeStatus: chequeStatus },
        { where: whereCondition }
      );

      // 6️⃣ Fetch updated rows to return
      const updatedCheques = await BillTransactionDetails.findAll({ where: whereCondition });

      res.json({
        success: true,
        message: `${updatedCheques.length} cheque(s) updated successfully`,
        data: updatedCheques
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  
  //serach

export const getChequeTransactionData = async (req, res) => {
  try {
    const { chequeNos, fromDate, toDate, zoneNo, ward } = req.body;

    let whereCondition = {};

    // 1️⃣ Cheque number search (HIGHEST PRIORITY)
    if (chequeNos && Array.isArray(chequeNos) && chequeNos.length > 0) {
      whereCondition.DDChequeNo = {
        [Op.in]: chequeNos.map(ch => ch.trim())
      };
    }

    // 2️⃣ Zone + Ward (+ optional date range)
    else if (zoneNo && ward) {

      // 🔹 Validate ward belongs to zone
      const wardExists = await ZoneSectionDetails.findOne({
        where: {
          ZoneSectionNo: zoneNo,
          Ward: ward
        }
      });

      if (!wardExists) {
        return res.json({
          success: true,
          message: "No data found for selected Zone & Ward",
          data: []
        });
      }

      whereCondition["$PropertyMast.NewZoneNo$"] = zoneNo;
      whereCondition["$PropertyMast.NewWardNo$"] = ward;

      if (fromDate && toDate) {
        whereCondition.TransactionDate = {
          [Op.between]: [
            new Date(fromDate + " 00:00:00"),
            new Date(toDate + " 23:59:59")
          ]
        };
      }
    }

    // 3️⃣ Only date range
    else if (fromDate && toDate) {
      whereCondition.TransactionDate = {
        [Op.between]: [
          new Date(fromDate + " 00:00:00"),
          new Date(toDate + " 23:59:59")
        ]
      };
    }

    // 4️⃣ Invalid input
    else {
      return res.status(400).json({
        success: false,
        message:
          "Please provide Cheque No OR From & To Date OR Zone + Ward (+ optional date)"
      });
    }

    // 5️⃣ Fetch data
    const data = await BillTransactionDetails.findAll({
      where: whereCondition,
      attributes: [
        "BTId",
        "OwnerID",
        "DDChequeNo",
        "TransactionDate",
        "Amount",
        "ChequeStatus",
        "BillBookNo",
        "InvoiceNo",
        "BankName",
        "FinanceYear",
        "PaymentResource",
        [col("PropertyMast.NewWardNo"), "wardNo"],
        [col("PropertyMast.NewPropertyNo"), "propertyNo"],
        [col("PropertyMast.NewPartitionNo"), "partitionNo"]
      ],
      include: [
        {
          model: PropertyMast,
          attributes: [],
          required: true
        }
      ],
      order: [["TransactionDate", "DESC"]],
      raw: true
    });

    res.json({ success: true, data });

  } catch (error) {
    console.error("❌ getChequeTransactionData error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


  // insert new table
 
 
 
  export const createDDChequeTransaction = async (req, res) => {
    try {
      const payload = req.body; 
  
      if (!Array.isArray(payload) || payload.length === 0) {
        return res.status(400).json({ success: false, message: "Payload is required" });
      }
  
      const results = [];
  
      for (const row of payload) {
        const {
          OwnerID,
          BillBookNo,
          InvoiceNo,
          DDChequeNo,
          TransactionDate,
          DDChequeDate,
          Amount,
          MerchantTxnRefNumber,
          ChequeStatus,
          CreatedBy,
          BankName,
          PaymentResource,
          FinanceYear,
          Latitude,
          Longitude
        } = row;
  
        // ✅ Validate required fields
        if (!OwnerID || !BillBookNo || !InvoiceNo || !DDChequeNo) {
          return res.status(400).json({
            success: false,
            message: "OwnerID, BillBookNo, InvoiceNo, and DDChequeNo are required."
          });
        }
  
        // 1️⃣ Update status in BillTransactionDetails
        await BillTransactionDetails.update(
          { ChequeStatus: ChequeStatus },
          { where: { DDChequeNo } }
        );
  
        // 2️⃣ Insert or update history in DDChequeTransactionHistory
        const existing = await DDChequeTransactionHistory.findOne({
          where: { OwnerID, BillBookNo, InvoiceNo, DDChequeNo }
        });
  
        let transaction;
        if (existing) {
          transaction = await existing.update({
            ChequeStatus,
            TransactionDate,
            DDChequeDate,
            Amount,
            MerchantTxnRefNumber,
            BankName,
            PaymentResource,
            FinanceYear,
            Latitude,
            Longitude,
            UpdatedBy: CreatedBy,
            UpdatedDate: new Date()
          });
        } else {
          transaction = await DDChequeTransactionHistory.create({
            OwnerID,
            BillBookNo,
            InvoiceNo,
            DDChequeNo,
            ChequeStatus,
            TransactionDate,
            DDChequeDate,
            Amount,
            MerchantTxnRefNumber,
            CreatedBy,
            BankName,
            PaymentResource,
            FinanceYear,
            Latitude,
            Longitude,
            CreatedDate: new Date()
          });
        }
  
        results.push(transaction);
      }
  
      res.status(200).json({
        success: true,
        message: "Cheque status updated and history saved successfully",
        data: results
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  
  //history tr
  

  export const getChequeHistoryData = async (req, res) => {
    try {
      const { chequeNo, fromDate, toDate, zoneNo, ward } = req.body;
  
      let whereCondition = {};
  
      // 1️⃣ Cheque number search (HIGHEST PRIORITY)
      if (chequeNo) {
        if (Array.isArray(chequeNo) && chequeNo.length > 0) {
          whereCondition.DDChequeNo = {
            [Op.in]: chequeNo.map(ch => ch.trim())
          };
        } else if (typeof chequeNo === "string" && chequeNo.trim() !== "") {
          whereCondition.DDChequeNo = chequeNo.trim();
        }
      }
      // 2️⃣ Zone + Ward (+ optional date range)
      else if (zoneNo && ward) {
        // 🔹 Validate ward belongs to zone
        const wardExists = await ZoneSectionDetails.findOne({
          where: {
            ZoneSectionNo: zoneNo,
            Ward: ward
          }
        });
  
        if (!wardExists) {
          return res.json({
            success: true,
            message: "No data found for selected Zone & Ward",
            data: []
          });
        }
  
        whereCondition["$PropertyMast.NewZoneNo$"] = zoneNo;
        whereCondition["$PropertyMast.NewWardNo$"] = ward;
  
        if (fromDate && toDate) {
          whereCondition.TransactionDate = {
            [Op.between]: [
              new Date(fromDate + " 00:00:00"),
              new Date(toDate + " 23:59:59")
            ]
          };
        }
      }
      // 3️⃣ Only date range
      else if (fromDate && toDate) {
        whereCondition.TransactionDate = {
          [Op.between]: [
            new Date(fromDate + " 00:00:00"),
            new Date(toDate + " 23:59:59")
          ]
        };
      }
      // 4️⃣ Invalid input
      else {
        return res.status(400).json({
          success: false,
          message:
            "Please provide Cheque No OR From & To Date OR Zone + Ward (+ optional date)"
        });
      }
  
      // 5️⃣ Fetch data
      const data = await DDChequeTransactionHistory.findAll({
        where: whereCondition,
        attributes: [
          "DDChequeHistoryID",
          "OwnerID",
          "DDChequeNo",
          "TransactionDate",
          "DDChequeDate",
          "Amount",
          "MerchantTxnRefNumber",
          "ChequeStatus",
          "BillBookNo",
          "InvoiceNo",
          "BankName",
          "FinanceYear",
          "PaymentResource",
          [col("PropertyMast.NewWardNo"), "wardNo"],
          [col("PropertyMast.NewPropertyNo"), "propertyNo"],
          [col("PropertyMast.NewPartitionNo"), "partitionNo"]
        ],
        include: [
          {
            model: PropertyMast,
            attributes: [],
            required: true
          }
        ],
        order: [["TransactionDate", "DESC"]],
        raw: true
      });
  
      // 6️⃣ Return success response
      res.json({
        success: true,
        message: data.length > 0 ? "Data fetched successfully" : "No records found",
        data
      });
  
    } catch (error) {
      console.error("❌ getChequeHistoryData error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  