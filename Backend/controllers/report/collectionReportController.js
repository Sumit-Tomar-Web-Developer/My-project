import BillBookEntry from "../../models/models/billbookentry.js";
import sequelize from "../../config/connectionDB.js";
import Users from "../../models/models/users.js";
import { Op } from "sequelize";
import BillTransactionDetails from "../../models/models/billtransactiondetails.js";


export const getBillBookUserDetails = async (req, res) => {
  try {
    const { billBookNo } = req.body;

    console.log(billBookNo,"requested bill book no")

    if (!billBookNo) {
      return res.status(400).json({
        success: false,
        message: "BillBookNo is required"
      });
    }

    // 1️⃣ Get UserIDs from BillBookEntry
    const billBookEntries = await BillBookEntry.findAll({
      where: {
        BillBookNo: billBookNo
      },
      attributes: ["UserID"]
    });

    if (!billBookEntries || billBookEntries.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found for this BillBookNo"
      });
    }

    // Extract unique UserIDs (remove nulls)
    const userIds = [
      ...new Set(
        billBookEntries
          .map(b => b.UserID)
          .filter(id => id !== null)
      )
    ];

    if (userIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    // 2️⃣ Get user names from Users table
    const users = await Users.findAll({
      where: {
        UserID: userIds
      },
      attributes: ["UserID", "name"]
    });

    return res.status(200).json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error("Get BillBook User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


export const getAllBillBookNumbers = async (req, res) => {
  try {
    const billBooks = await BillBookEntry.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('BillBookNo')), 'BillBookNo']
      ],
      where: {
        BillBookNo: { [Op.ne]: null }
      },
      order: [['BillBookNo', 'ASC']]
    });

    if (!billBooks.length) {
      return res.status(404).json({
        success: false,
        message: "No BillBook numbers found"
      });
    }

    return res.status(200).json({
      success: true,
      data: billBooks
    });

  } catch (error) {
    console.error("Get BillBook Numbers Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};


// export const getDailyCollectionReport = async (req, res) => {
//   try {
//     const {
//       billBookNo,
//       DailyCollectionReportTimeSpan,
//       DailyCollectionReportDaySpan,
//       DailyCollectionReportDaySpanForH
//     } = req.body;

//     if (
//       !billBookNo ||
//       !DailyCollectionReportTimeSpan ||
//       DailyCollectionReportDaySpan === undefined ||
//       DailyCollectionReportDaySpanForH === undefined
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required parameters"
//       });
//     }

//     const totalDays =
//       Number(DailyCollectionReportDaySpan) +
//       Number(DailyCollectionReportDaySpanForH);

//     const now = new Date();

//     // ⏰ extract 18:30:00
//     const [hh, mm, ss] = DailyCollectionReportTimeSpan.split(":");

//     const toDate = new Date(now);
//     toDate.setHours(Number(hh), Number(mm), Number(ss || 0), 0);

//     const fromDate = new Date(toDate);
//     fromDate.setDate(fromDate.getDate() - Math.abs(totalDays));

//     const transactions = await BillTransactionDetails.findAll({
//       where: {
//         BillBookNo: billBookNo,
//         TransactionDate: {
//           [Op.between]: [fromDate, toDate]
//         }
//       },
//       order: [["TransactionDate", "ASC"]]
//     });

//     return res.status(200).json({
//       success: true,
//       billBookNo,
//       fromDate,
//       toDate,
//       totalDays: Math.abs(totalDays),
//       count: transactions.length,
//       data: transactions
//     });

//   } catch (error) {
//     console.error("Daily Collection Report Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };





//All parameters
export const getAllReport = async (req, res) => {
  try {
    const {
      reportType,
      zoneId,
      wardId,
      financialYear,
      billBook,
      payResource,
      payMode,
      counterUserIds,
      payType,
      invoiceFrom,
      invoiceTo,
      payOption,
      fromDate,
      toDate
    } = req.body;

       console.log(req.body,"reqbody getAllReport ")


    // ✅ Build dynamic where condition
    const whereClause = {};

    if (zoneId) whereClause.ZoneID = zoneId;
    if (wardId) whereClause.WardID = wardId;
    if (financialYear !== 'ALL') whereClause.FinanceYear = financialYear;
    if (billBook) whereClause.BillBook = billBook;
    if (payResource) whereClause.PayResource = payResource;
    if (payType) whereClause.PayType = payType;
    if (payOption !== 'ALL') whereClause.PayOption = payOption;

    if (invoiceFrom && invoiceTo) {
      whereClause.InvoiceNo = {
        [Op.between]: [invoiceFrom, invoiceTo]
      };
    }

    if (fromDate && toDate) {
      whereClause.PaymentDate = {
        [Op.between]: [fromDate, toDate]
      };
    }

    if (payMode?.length) {
      whereClause.PayMode = {
        [Op.in]: payMode
      };
    }

    if (counterUserIds?.length) {
      whereClause.CounterUserID = {
        [Op.in]: counterUserIds
      };
    }

    // ✅ Fetch report data
    const reportData = await PaymentTransaction.findAll({
      where: whereClause,
      order: [['PaymentDate', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      count: reportData.length,
      data: reportData
    });

  } catch (error) {
    console.error('Collection Report Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate collection report'
    });
  }
};


export const getAMCReport = async (req, res) => {
  try {
    const {
      DailyCollectionReportTimeSpan,
      DailyCollectionReportDaySpan,
      DailyCollectionReportDaySpanForH,
      reportType,
      subReportType,
      zoneId,
      wardId,
      financialYear,
      billBook,
      payResource,
      payMode,
      counterUserIds,
      payType,
      invoiceFrom,
      invoiceTo,
      fromDate,
      toDate
    } = req.body;

        console.log(req.body,"reqbody getAMCReport ")


    if (!billBookNo || !DailyCollectionReportTimeSpan) {
      return res.status(400).json({
        success: false,
        message: "billBookNo and DailyCollectionReportTimeSpan are required"
      });
    }

    const totalDays =
      Number(DailyCollectionReportDaySpan || 0) +
      Number(DailyCollectionReportDaySpanForH || 0);

    // ✅ HARD-CODED TEST DATE → Wednesday 2022-10-20
    const baseDate = new Date("2022-10-20");

    // extract 18:30:00
    const [hh, mm, ss] = DailyCollectionReportTimeSpan.split(":");

    // toDate → Wed 18:30
    const toDateValue = new Date(baseDate);
    toDate.setHours(hh, mm, ss || 0, 0);

    // fromDate → Sun 18:30 (3 days back)
    const fromDateValue = new Date(toDate);
    fromDate.setDate(fromDate.getDate() - totalDays);

    const transactions = await BillTransactionDetails.findAll({
      where: {
        BillBookNo: billBookNo,
        TransactionDate: {
          [Op.between]: [fromDateValue, toDateValue]
        }
      },
      order: [["TransactionDate", "ASC"]]
    });

    return res.status(200).json({
      success: true,
      billBookNo,
      fromDate,
      toDate,
      totalDays,
      count: transactions.length,
      data: transactions
    });

  } catch (error) {
    console.error("Daily Collection Report Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

//gross details + Demand Details +Demanad Gross+ outsatanding details+ outstanding gross (no from /to)
//clerckwise //tax collection wise-paymentwise collection (total collection field) +
export const getCommonReport = async (req, res) => {
  try {
    const {
      reportType,
      billBookNo,
      financeYear,
      zoneId,
      wardId,
      payType,
      payResource,
      payMode,          
      counterUserIds , 
       invoiceFrom,
  invoiceTo,
  fromDate,
  toDate,
  inVoiceNo
  
    } = req.body;

        console.log(req.body,"reqbody getCommonReport ")

    // 🔴 Mandatory fields
    if (!billBookNo || !DailyCollectionReportTimeSpan) {
      return res.status(400).json({
        success: false,
        message: "billBookNo and DailyCollectionReportTimeSpan are required"
      });
    }

    /* ---------------- DATE CALCULATION ---------------- */

    const totalDays =
      Number(DailyCollectionReportDaySpan || 0) +
      Number(DailyCollectionReportDaySpanForH || 0);

    // ⚠️ Replace with CURRENT DATE later
    const baseDate = new Date("2022-10-20");

    const [hh, mm, ss] = DailyCollectionReportTimeSpan.split(":");

    const toDateValue = new Date(baseDate);
    toDate.setHours(hh, mm, ss || 0, 0);

    const fromDateValue = new Date(toDate);
    fromDate.setDate(fromDate.getDate() - totalDays);

    /* ---------------- WHERE CLAUSE ---------------- */

    const whereClause = {
      BillBookNo: billBookNo,
      TransactionDate: {
        [Op.between]: [fromDateValue, toDateValue]
      }
    };

    // OPTIONAL FILTERS (applied only if sent)

    if (financeYear && financeYear !== "ALL") {
      whereClause.FinanceYear = financeYear;
    }

    if (zoneId) {
      whereClause.ZoneID = zoneId;
    }

    if (wardId) {
      whereClause.WardID = wardId;
    }

    if (payType && payType !== "ALL") {
      whereClause.PayType = payType;
    }

    if (payOption && payOption !== "ALL") {
      whereClause.PayOption = payOption;
    }

    if (payResource) {
      whereClause.PayResource = payResource;
    }

    if (Array.isArray(payMode) && payMode.length > 0) {
      whereClause.PayMode = {
        [Op.in]: payMode
      };
    }

    if (Array.isArray(counterUserIds) && counterUserIds.length > 0) {
      whereClause.CounterUserID = {
        [Op.in]: counterUserIds
      };
    }

    /* ---------------- QUERY ---------------- */

    const transactions = await BillTransactionDetails.findAll({
      where: whereClause,
      order: [["TransactionDate", "ASC"]]
    });

    return res.status(200).json({
      success: true,
      filtersApplied: {
        billBookNo,
        financeYear,
        zoneId,
        wardId,
        payType,
        payOption,
        payResource,
        payMode,
        counterUserIds
      },
      fromDate,
      toDate,
      totalDays,
      count: transactions.length,
      data: transactions
    });

  } catch (error) {
    console.error("Daily Collection Report Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

//3 report
export const getTransactionChallanTransferfeeReport = async (req, res) => {
  try {
    const {
      reportType,
      subReportType,
      zoneId,
      wardId,
      financialYear,
      billBook,
      payResource,
      payMode,
      counterUserIds,
      payType,
      invoiceFrom,
      invoiceTo,
      payOption,
      fromDate,
      toDate
    } = req.body;

        console.log(req.body,"reqbody getTransactionChallanTransferfeeReport ")


    // ✅ Build dynamic where condition
    const whereClause = {};

    if (zoneId) whereClause.ZoneID = zoneId;
    if (wardId) whereClause.WardID = wardId;
    if (financialYear !== 'ALL') whereClause.FinanceYear = financialYear;
    if (billBook) whereClause.BillBook = billBook;
    if (payResource) whereClause.PayResource = payResource;
    if (payType) whereClause.PayType = payType;
    if (payOption !== 'ALL') whereClause.PayOption = payOption;

    if (invoiceFrom && invoiceTo) {
      whereClause.InvoiceNo = {
        [Op.between]: [invoiceFrom, invoiceTo]
      };
    }

    if (fromDate && toDate) {
      whereClause.PaymentDate = {
        [Op.between]: [fromDate, toDate]
      };
    }

    if (payMode?.length) {
      whereClause.PayMode = {
        [Op.in]: payMode
      };
    }

    if (counterUserIds?.length) {
      whereClause.CounterUserID = {
        [Op.in]: counterUserIds
      };
    }

    // ✅ Fetch report data
    const reportData = await PaymentTransaction.findAll({
      where: whereClause,
      order: [['PaymentDate', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      count: reportData.length,
      data: reportData
    });

  } catch (error) {
    console.error('Collection Report Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate collection report'
    });
  }
}

//Wardwise UserwiseInvoiceReport
export const getWardwiseUserwiseInvoiceReport = async (req, res) => {
  try {
    const {
      reportType,
      zoneId,
      financeYear,
      billBook,
      counterReceipt,
      payResource,
      wardId,
      payMode,
      payType,
      invoiceFrom,
      invoiceTo,
      fromDate,
      toDate
    } = req.body;
        console.log(req.body,"reqbody getWardwiseUserwiseInvoiceReport ")


    const whereClause = {};

    if (zoneSection) whereClause.ZoneSection = zoneSection;
    if (financeYear && financeYear !== 'ALL') whereClause.FinanceYear = financeYear;
    if (billBook) whereClause.BillBook = billBook;
    if (counterReceipt) whereClause.CounterReceipt = counterReceipt;
    if (totalCollection) whereClause.TotalCollection = totalCollection;
    if (ward) whereClause.Ward = ward;
    if (payType) whereClause.PayType = payType;

    // Invoice range filter
    if (invoiceFrom && invoiceTo) {
      whereClause.InvoiceNo = { [Op.between]: [invoiceFrom, invoiceTo] };
    }

    // Payment date range filter
    if (fromDate && toDate) {
      whereClause.PaymentDate = { [Op.between]: [fromDate, toDate] };
    }

    const data = await PaymentTransaction.findAll({
      where: whereClause,
      order: [['PaymentDate', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      count: data.length,
      data
    });

  } catch (error) {
    console.error('Wardwise/Userwise Invoice Report Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch Wardwise/Userwise Invoice Report',
      error: error.message
    });
  }
};

//daywise
export const getDayWiseCollectionReport = async (req, res) => {
  try {
    const { fromDate, toDate, withInterest, withoutInterest } = req.body;
    console.log(req.body,"reqbody getDayWiseCollectionReport ")

    const whereClause = {};

    // Filter by date range
    if (fromDate && toDate) {
      whereClause.PaymentDate = {
        [Op.between]: [fromDate, toDate]
      };
    }

    // Filter by interest
    if (withInterest && !withoutInterest) {
      // Only include records where InterestAmount > 0
      whereClause.InterestAmount = { [Op.gt]: 0 };
    } else if (!withInterest && withoutInterest) {
      // Only include records where InterestAmount = 0
      whereClause.InterestAmount = 0;
    }
    // If both withInterest and withoutInterest are true (or both false), include all records

    // Fetch report data
    const reportData = await PaymentTransaction.findAll({
      where: whereClause,
      order: [['PaymentDate', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      count: reportData.length,
      data: reportData
    });

  } catch (error) {
    console.error('Collection Report Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate collection report',
      error: error.message
    });
  }
};

// 1️⃣ Gateway Payment Report
export const getGatewayPaymentReport = async (req, res) => {
  try {
    const {
      financeYear,
      billBook,
      merchantReferenceNo,
      payType,
      invoiceNo,
      fromDate,
      toDate,
      status
    } = req.body;

        console.log(req.body,"reqbody getGatewayPaymentReport ")

    const whereClause = {};
    if (financeYear && financeYear !== 'ALL') whereClause.FinanceYear = financeYear;
    if (billBook) whereClause.BillBook = billBook;
    if (merchantRefNo) whereClause.MerchantRefNo = merchantRefNo;
    if (payType) whereClause.PayType = payType;
    if (invoiceNo) whereClause.InvoiceNo = invoiceNo;
    if (status && status !== 'ALL') whereClause.Status = status;
    if (fromDate && toDate) whereClause.PaymentDate = { [Op.between]: [fromDate, toDate] };

    const data = await PaymentTransaction.findAll({ where: whereClause, order: [['PaymentDate', 'DESC']] });

    res.json({ success: true, count: data.length, data });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch Gateway Payment Report' });
  }
};
// getTaxCollectionWisePaymentWiseReport
export const getTaxCollectionWisePaymentWiseReport = async (req, res) => {
  try {
    const {
      reportType,
      financeYear,
      billBook,
      payType,
      payResource,
      payMode,
      invoiceNo,
      counterUserIds,
      invoiceFrom,
      invoiceTo,
      TotalCollection,
      fromDate,
      toDate,
      status
    } = req.body;

        console.log(req.body,"reqbody getTaxCollectionWisePaymentWiseReport ")


    const whereClause = {};
    if (financeYear && financeYear !== 'ALL') whereClause.FinanceYear = financeYear;
    if (billBook) whereClause.BillBook = billBook;
    if (merchantRefNo) whereClause.MerchantRefNo = merchantRefNo;
    if (payType) whereClause.PayType = payType;
    if (invoiceNo) whereClause.InvoiceNo = invoiceNo;
    if (status && status !== 'ALL') whereClause.Status = status;
    if (fromDate && toDate) whereClause.PaymentDate = { [Op.between]: [fromDate, toDate] };

    const data = await PaymentTransaction.findAll({ where: whereClause, order: [['PaymentDate', 'DESC']] });

    res.json({ success: true, count: data.length, data });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch Gateway Payment Report' });
  }
};


// 2️⃣ Wardwise Daily Report+// 4️⃣ Tax Collector Performance Report(bill book no)
export const getWardwiseDailyReport = async (req, res) => {
  try {
    const { zoneId, financeYear, wardId, fromDate, toDate } = req.body;
        console.log(req.body,"reqbody getWardwiseDailyReport ")


    const whereClause = {};
    if (zoneId) whereClause.zoneId = zoneSection;
    if (financeYear && financeYear !== 'ALL') whereClause.FinanceYear = financeYear;
    if (wardId) whereClause.wardId = wardId;
    if (fromDate && toDate) whereClause.PaymentDate = { [Op.between]: [fromDate, toDate] };

    const data = await PaymentTransaction.findAll({ where: whereClause, order: [['PaymentDate', 'DESC']] });

    res.json({ success: true, count: data.length, data });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch Wardwise Daily Report' });
  }
};

// 3️⃣ Collection Percentage Chart Report +Counter foil
export const getCollectionPercentageChartReport = async (req, res) => {
  try {
    const { financeYear, fromDate, toDate } = req.body;
        console.log(req.body,"reqbody getCollectionPercentageChartReport ")

    const whereClause = {};
    if (financeYear && financeYear !== 'ALL') whereClause.FinanceYear = financeYear;
    if (fromDate && toDate) whereClause.PaymentDate = { [Op.between]: [fromDate, toDate] };

    const data = await PaymentTransaction.findAll({ where: whereClause });

    res.json({ success: true, count: data.length, data });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch Collection Percentage Chart Report' });
  }
};


// 3️⃣ Collection Percentage Chart Report +Counter foil
export const getTaxPerformanceReport = async (req, res) => {
  try {
    const {zoneId, wardId,financeYear, fromDate, toDate } = req.body;
    console.log(req.body,"reqbody getTaxPerformanceReport ")

    const whereClause = {};
    if (financeYear && financeYear !== 'ALL') whereClause.FinanceYear = financeYear;
    if (fromDate && toDate) whereClause.PaymentDate = { [Op.between]: [fromDate, toDate] };

    const data = await PaymentTransaction.findAll({ where: whereClause });

    res.json({ success: true, count: data.length, data });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch Collection Percentage Chart Report' });
  }
};

// 3️⃣ Collection Percentage Chart Report +Counter foil
export const getCounterFoilReport = async (req, res) => {
  try {
    const { wardId,financeYear, fromDate, toDate } = req.body;

    console.log(req.body,"reqbody getCounterFoilReport ")

    const whereClause = {};
    if (financeYear && financeYear !== 'ALL') whereClause.FinanceYear = financeYear;
    if (fromDate && toDate) whereClause.PaymentDate = { [Op.between]: [fromDate, toDate] };

    const data = await PaymentTransaction.findAll({ where: whereClause });

    res.json({ success: true, count: data.length, data });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch Collection Percentage Chart Report' });
  }
};









