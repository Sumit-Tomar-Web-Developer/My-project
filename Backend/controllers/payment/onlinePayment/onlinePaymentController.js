import BillBookEntry from "../../../models/models/billbookentry.js";
import CombinedOwnerName from "../../../models/models/combinedownerrenternames.js";
import { OldPropertyMast } from "../../../models/models/oldpropertymast.js";
import PaymentGatewayTransactionDetails from "../../../models/models/paymentGatewayTransactionDetails.js";
import PropertyMast from "../../../models/models/propertymast.js";
import sequelize from '../../../config/connectionDB.js'
import { Op } from "sequelize";
import razorpay from "../../../config/razorpay.js";
import BillTransactionDetails from "../../../models/models/billtransactiondetails.js";
import crypto from "crypto";
import { SENDMAIL } from "../../../utils/emailOtp.js";


export const getSearchedPropertyInfo = async (req, res) => {
  try {
    const {
      wardNo,
      propertyNo,
      computerNo,
      mobileNo,
      occupierEng,
      occupierMar,
      primaryOwnerEng,
      primaryOwnerMar,
    } = req.body;

    console.log(req.body, "data rewq body")

    // Check if at least one criterion is provided
    if (
      !wardNo &&
      !propertyNo &&
      !computerNo &&
      !mobileNo &&
      !occupierEng &&
      !occupierMar &&
      !primaryOwnerEng &&
      !primaryOwnerMar
    ) {
      return res
        .status(400)
        .json({ message: "Please provide at least one search criterion." });
    }


    // // 1️⃣ Ward + Property search
    // if (wardNo && propertyNo) {
    //   const property = await PropertyMast.findOne({
    //     where: { NewWardNo: wardNo, NewPropertyNo: propertyNo },
    //   });

    //   console.log(property.OwnerID,"propertttii")

    //   const renter = await CombinedOwnerName.findOne({ where: { OwnerID :property.OwnerID} });
    //   if (!property)
    //     return res.status(404).json({ message: "Property not found." });

    //     return res.status(200).json({
    //     data: { ...property.dataValues, renterName: renter?.RenterName || null },
    //   });
    // }
    // 1️⃣ Ward + Property search (partition-aware)
    if (wardNo && propertyNo) {

      let mainPropertyNo = propertyNo;
      let partitionNo = null;

      // ✅ Detect partition (eg: 1_1)
      if (propertyNo.includes("_")) {
        [mainPropertyNo, partitionNo] = propertyNo.split("_");
      }

      const whereCondition = {
        NewWardNo: wardNo,
        NewPropertyNo: mainPropertyNo,
      };

      // 🔹 CASE A: Partition provided → ONE owner
      if (partitionNo) {
        whereCondition.NewPartitionNo = partitionNo;

        const property = await PropertyMast.findOne({
          where: whereCondition,
        });

        if (!property) {
          return res.status(404).json({
            message: "Property partition not found",
          });
        }

        const renter = await CombinedOwnerName.findOne({
          where: { OwnerID: property.OwnerID },
        });

        return res.status(200).json({
          data: {
            ...property.dataValues,
            renterName: renter?.RenterName || null,
          },
        });
      }

      // 🔹 CASE B: No partition → ALL owners
      const properties = await PropertyMast.findAll({
        where: whereCondition,
        order: [["NewPartitionNo", "ASC"]],
      });

      if (!properties.length) {
        return res.status(404).json({
          message: "No properties found",
        });
      }

      const ownerIds = properties.map(p => p.OwnerID);

      const renters = await CombinedOwnerName.findAll({
        where: { OwnerID: ownerIds },
        attributes: ["OwnerID", "RenterName"],
      });

      const renterMap = new Map(
        renters.map(r => [r.OwnerID, r.RenterName])
      );

      const result = properties.map(p => ({
        ...p.dataValues,
        renterName: renterMap.get(p.OwnerID) || null,
      }));

      return res.status(200).json({ data: result });
    }

    // 2️⃣ Old Computer No search
    if (computerNo) {
      const oldRecord = await OldPropertyMast.findOne({
        where: { OldComputerNo: computerNo },
      });

      if (!oldRecord)
        return res.status(404).json({ message: "Computer No not found." });

      const property = await PropertyMast.findOne({
        where: { OwnerID: oldRecord.OwnerID },
      });

      const renter = await CombinedOwnerName.findOne({ where: { OwnerID: property.OwnerID } });


      if (!property)
        return res.status(404).json({ message: "Property not found." });

      return res.status(200).json({ data: { ...property.dataValues, renterName: renter?.RenterName || null }, });
    }


    // 3️⃣ Mobile No search
    if (mobileNo) {
      const list = await PropertyMast.findAll({
        where: { MobileNo: mobileNo },
      });

      if (!list.length) {
        return res.status(404).json({ message: "No properties found." });
      }

      const result = await Promise.all(
        list.map(async (property) => {
          const renter = await CombinedOwnerName.findOne({
            where: { OwnerID: property.OwnerID },
            attributes: ["RenterName"],
          });

          return {
            ...property.dataValues,
            renterName: renter?.RenterName || null,
          };
        })
      );

      return res.status(200).json({ data: result });
    }


    // // 4️⃣ Renter Name search (English / Marathi)
    // if (renterEng || renterMar) {
    //   const renterList = await CombinedOwnerName.findAll({
    //     where: {
    //       [Op.or]: [
    //         renterEng && { RenterName: { [Op.like]: `%${renterEng}%` } },
    //         renterMar && { MarathiRenterName: { [Op.like]: `%${renterMar}%` } },
    //       ].filter(Boolean),
    //     },
    //     attributes: ["OwnerID", "RenterName", "MarathiRenterName"],
    //   });

    //   if (!renterList.length)
    //     return res.status(404).json({ message: "No renter found." });

    //   const ownerIds = renterList.map((r) => r.OwnerID);

    //   const propertyList = await PropertyMast.findAll({
    //     where: { OwnerID: ownerIds },
    //     attributes: [
    //       "OwnerID",
    //       "OwnerName",
    //       "OwnerNameMarathi",
    //       "NewWardNo",
    //       "NewPropertyNo",
    //       "NewPartitionNo",
    //     ],
    //   });

    //   const propertyMap = new Map(
    //     propertyList.map((p) => [p.OwnerID, p])
    //   );

    //   const result = renterList.map((r) => {
    //     const property = propertyMap.get(r.OwnerID);
    //     return {
    //       OwnerID: r.OwnerID,
    //       renterName: r.RenterName,
    //       renterNameMarathi: r.MarathiRenterName,
    //       ownerName: property?.OwnerName || null,
    //       ownerNameMarathi: property?.OwnerNameMarathi || null,
    //       wardNo: property?.NewWardNo || null,
    //       propertyNo: property?.NewPropertyNo || null,
    //       partitionNo: property?.NewPartitionNo || null, 
    //     };
    //   });

    //   return res.status(200).json({ data: result });
    // }

    // 5️⃣ Owner Name search (English / Marathi)
    // 5️⃣ Owner / Occupier Name search (English / Marathi)
    if (primaryOwnerEng || primaryOwnerMar || occupierEng || occupierMar) {
      const list = await PropertyMast.findAll({
        where: {
          [Op.or]: [
            primaryOwnerEng && {
              OwnerName: { [Op.like]: `%${primaryOwnerEng}%` },
            },
            primaryOwnerMar && {
              OwnerNameMarathi: { [Op.like]: `%${primaryOwnerMar}%` },
            },
            occupierEng && {
              OccupierName: { [Op.like]: `%${occupierEng}%` },
            },
            occupierMar && {
              OccupierNameMarathi: { [Op.like]: `%${occupierMar}%` },
            },
          ].filter(Boolean),
        },
        limit: 50,
      });

      if (!list.length) {
        return res.status(404).json({ message: "No owner found." });
      }

      // 🔹 Collect OwnerIDs
      const ownerIds = list.map(p => p.OwnerID);


      console.log(ownerIds, "list of ownerid")

      // 🔹 Fetch renters in one query
      const renters = await CombinedOwnerName.findAll({
        where: { OwnerID: ownerIds },
        attributes: ["RenterName"],
      });

      // 🔹 Map renters by OwnerID
      const renterMap = new Map(
        renters.map(r => [r.OwnerID, r])
      );

      // 🔹 Merge property + renter
      const result = list.map(p => ({
        ...p.dataValues,
        renterName: renterMap.get(p.OwnerID)?.RenterName || null,
        renterNameMarathi:
          renterMap.get(p.OwnerID)?.RenterNameMarathi || null,
      }));

      return res.status(200).json({ data: result });
    }


    // ❌ Fallback
    return res
      .status(404)
      .json({ message: "No results found for the given criteria." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const TAX_KEYS = [
  "PropertyTax",
  "EducationTax",
  "EmploymentTax",
  "TreeCess",
  "FireCess",
  "RoadCess",
  "LightCess",
  "Sanitation",
  "DrainCess",
  "SpWaterCess",
  "WaterBenefit",
  "MajorBuilding",
  "SewageDisposalCess",
  "SpEducationTax",
  "WaterBill",
  "Tax1",
  "Tax2",
  "Tax3",
  "Tax4",
  "Tax5",
  "Interest",
  "Discount",
  "NoticeFee",
  "WarrentFee",
  "MiscellaneousFee"
];
;
const ONLINE_BILLBOOK_NO = process.env.ONLINEBILLBOOKNO;

export const processOnlinePayment = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      OwnerID,
      WardNo,
      PropertyNo,
      PartitionNo,
      FinanceYear,
      PendingYear,
      totalPaid,
      mobile,
      email,
      pendingBalanceObj,
      currentBalanceObj,
      paymentType
    } = req.body;

    if (!ONLINE_BILLBOOK_NO) {
      return res.status(400).json({ message: "ONLINE BillBook not configured" });
    }

    /* 🔐 SAFE INVOICE GENERATION */
    const last = await PaymentGatewayTransactionDetails.findOne({
      where: { BillBookNo: ONLINE_BILLBOOK_NO },
      order: [['InvoiceNo', 'DESC']],
      attributes: ['InvoiceNo'],
      lock: t.LOCK.UPDATE,
      transaction: t
    });

    const invoiceNo = last ? last.InvoiceNo + 1 : 1;

    /* 🧾 Merchant Ref No */
    const random6 = Math.floor(100000 + Math.random() * 900000);
    let MerchantTxnRefNumber = `${random6}W${WardNo}`;
    if (PropertyNo) MerchantTxnRefNumber += `P${PropertyNo}`;
    if (PartitionNo) MerchantTxnRefNumber += `D${PartitionNo}`;

    /* 💳 Razorpay Order */
    const order = await razorpay.orders.create({
      amount: totalPaid * 100,
      currency: "INR",
      receipt: invoiceNo.toString()
    });

    /* 🧮 TAX SNAPSHOT */
    const n = (v) => Number(v ?? 0);
    const taxData = {};
    TAX_KEYS.forEach(k => {
      if (paymentType === "CURRENT") taxData[k] = n(currentBalanceObj[k]);
      else if (paymentType === "PENDING") taxData[k] = n(pendingBalanceObj[k]);
      else taxData[k] = n(currentBalanceObj[k]) + n(pendingBalanceObj[k]);
    });

    /* 🟡 INITIATED ENTRY */
    await PaymentGatewayTransactionDetails.create({
      ...taxData,
      BillBookNo: ONLINE_BILLBOOK_NO,
      OwnerID,
      InvoiceNo: invoiceNo,
      BillNo: invoiceNo,
      BillDate: new Date(),
      // DDChequeNo:invoiceNo,
      // PayeeName:"abc",
      // BankName:"bank",
      // BranchName:"BB",
      // DDChequeDate:new Date(),
      // IFSCNo:invoiceNo,
      Remark: "REmark online",
      FinanceYear,
      PendingYear,
      PaymentType: paymentType,
      Email: email || "deepika.hande@gmail.com",
      MobileNumber: mobile,
      NetTotal: totalPaid,
      TaxTotal: totalPaid,
      Amount: totalPaid,
      PaymentMode: "ONLINE",
      PaymentResource: "RAZORPAY",
      TxnStatus: "INITIATED",
      ClintTxnRefNo: OwnerID,
      TxnDateTime: new Date(),
      // ActiveYearID:OwnerID,
      CreatedBy: OwnerID,
      CreatedDate: new Date(),
      TransactionDate: new Date(),
      // ExpiryDate:new Date(),
      // RequestType:"ON",
      // MerchantTxnRefNumber:OwnerID,
      // UniqueCustomerId:OwnerID,
      UpdatedBy: OwnerID,
      CreatedBy: OwnerID,
      CreatedDate: new Date(),
      UpdatedDate: new Date(),
      // ShoppingCartDetails:"shopp"
    }, { transaction: t });

    await t.commit();

    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      invoiceNo
    });

  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: "Order creation failed" });
  }
};

export const verifyOnlinePayment = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      invoiceNo,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      WardNo,
      PropertyNo,
      PartitionNo,
      email
    } = req.body;

    console.log(req.body,"req body online pay")

    /* 🔍 FETCH INITIATED ROW ONLY */
    const txn = await PaymentGatewayTransactionDetails.findOne({
      where: {
        InvoiceNo: invoiceNo,
        TxnStatus: "INITIATED",
        PaymentMode: "ONLINE"
      },
      lock: t.LOCK.UPDATE,
      transaction: t
    });

    if (!txn) {
      await t.rollback();
      return res.status(404).json({ message: "Transaction not found" });
    }

    /* 🔐 SIGNATURE VERIFY */
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      await PaymentGatewayTransactionDetails.update(
        { TxnStatus: "FAILED" },
        { where: { InvoiceNo: invoiceNo }, transaction: t }
      );
      await t.commit();
      return res.status(400).json({ message: "Invalid signature" });
    }

    /* 🧾 MERCHANT REF */
    const random6 = Math.floor(100000 + Math.random() * 900000);
    let MerchantTxnRefNumber = `${random6}W${WardNo}`;
    if (PropertyNo) MerchantTxnRefNumber += `P${PropertyNo}`;
    if (PartitionNo) MerchantTxnRefNumber += `D${PartitionNo}`;

    /* ✅ UPDATE GATEWAY */
    await PaymentGatewayTransactionDetails.update({
      TxnStatus: "SUCCESS",
      TransactionId: razorpay_payment_id,
      MerchantTxnRefNumber,
      UpdatedDate: new Date()
    }, { where: { InvoiceNo: invoiceNo }, transaction: t });

    /* 🧮 COPY TAXES */
    const taxData = {};
    TAX_KEYS.forEach(k => taxData[k] = Number(txn[k] ?? 0));

    const message = `This is a system generated mail. Please do not reply to this email ID.
    payment is successful for${PropertyNo}.Thanking You.`;

    const options = {
      from: process.env.EMAIL_ID,
      to: email,
      subject: 'Payment Receipt',
      text: message
    }

    await SENDMAIL(options);


    /* 🧾 FINAL BILL */
    await BillTransactionDetails.create({
      ...taxData,
      OwnerID: txn.OwnerID,
      BillBookNo: txn.BillBookNo,
      InvoiceNo: invoiceNo,
      FinanceYear: txn.FinanceYear,
      PendingYear: txn.PendingYear,
      MerchantTxnRefNumber,
      TaxTotal: txn.TaxTotal,
      NetTotal: txn.NetTotal,
      Amount: txn.Amount,
      PaymentMode: "ONLINE",
      PaymentResource: "RAZORPAY",
      PaymentType: txn.PaymentType,
      TransactionId: razorpay_payment_id,
      BillDate: new Date(),
      TransactionDate: new Date()
    }, { transaction: t });

    await t.commit();
    return res.json({ message: "Payment successful" });

  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: "Payment failed" });
  }
};
export const markOnlinePaymentFailed = async (req, res) => {
  const { invoiceNo, failureReason } = req.body;

  await PaymentGatewayTransactionDetails.update(
    {
      TxnStatus: "FAILED",
      Remark: failureReason || "USER_CANCELLED",
      UpdatedDate: new Date()
    },
    {
      where: {
        InvoiceNo: invoiceNo,
        TxnStatus: "INITIATED"
      }
    }
  );

  res.json({ success: true });
};
