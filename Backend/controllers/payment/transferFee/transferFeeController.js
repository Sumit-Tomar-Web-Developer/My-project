import sequelize from '../../../config/connectionDB.js';
import BillTransactionDetails from "../../../models/models/billtransactiondetails.js";
import { Op } from 'sequelize';
import PropertyMast from '../../../models/models/propertymast.js';
import CombinedOwnerName from '../../../models/models/combinedownerrenternames.js';
import { OldPropertyMast } from '../../../models/models/oldpropertymast.js';
import { SENDMAIL } from '../../../utils/emailOtp.js';

export const getBillBooks = async (req, res) => {
  try {
    const billBooks = await BillTransactionDetails.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('BillBookNo')), 'BillBookNo']],
      order: [['BillBookNo', 'ASC']],
      where: {
        BillBookNo: { [Op.ne]: null } 
      }
    });

    res.json(billBooks.map(bb => bb.get('BillBookNo'))); 
  } catch (error) {
    console.error('Error in getBillBooks:', error); 
    res.status(500).json({ message: 'Error fetching bill books' });
  }
};
// GET /api/invoices/:billBookNo
export const getInvoicesByBillBook = async (req, res) => {
    const { billBookNo } = req.body;
  
    try {
      const invoices = await BillTransactionDetails.findAll({
        attributes: ['InvoiceNo'],
        where: {
          BillBookNo: billBookNo
        },
        order: [['InvoiceNo', 'ASC']]
      });
  
      res.json(invoices.map(inv => ({
        InvoiceNo: inv.InvoiceNo,
       
      })));
          } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching invoices' });
    }
  };
  
  export const getMobileEmail = async (req, res) => {
    const { ownerId } = req.body;

    try {
        const owner = await PropertyMast.findOne({
            where: { OwnerID: ownerId },
            attributes: ['OwnerName', 'MobileNo', 'EmailID','BuildingOrShopNameMarathi','OwnerPatta']
        });

        if (!owner) {
            return res.status(404).json({ message: 'Owner not found' });
        }

        res.json({
            OwnerName: owner.OwnerName,
            MobileNo: owner.MobileNo,
            EmailID: owner.EmailID,
            BuildingOrShopNameMarathi:owner.BuildingOrShopNameMarathi,
            OwnerPatta:owner.OwnerPatta
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching owner details' });
    }
};





// export const getTransferPropertyInfo = async (req, res) => {
//   try {
//     const {
//       wardNo,
//       propertyNo,
//       computerNo,
//       mobileNo,
//       occupierEng,
//       occupierMar,
//       renterEng,
//       renterMar,
//       primaryOwnerEng,
//       primaryOwnerMar,
//     } = req.body;
//     console.log(req.body,"data rewq body")
//     // Check if at least one criterion is provided
//     if (
//       !wardNo &&
//       !propertyNo &&
//       !computerNo &&
//       !mobileNo &&
//       !occupierEng &&
//       !occupierMar &&
//       !renterMar &&
//       !renterEng &&
//       !primaryOwnerEng &&
//       !primaryOwnerMar
//     ) {
//       return res
//         .status(400)
//         .json({ message: "Please provide at least one search criterion." });
//     }
//     // :one: Ward + Property search
//     if (wardNo && propertyNo) {
//       const property = await PropertyMast.findOne({
//         where: { NewWardNo: wardNo, NewPropertyNo: propertyNo },
//       });
//       if (!property)
//         return res.status(404).json({ message: "Property not found." });
//       return res.status(200).json({ data: property.dataValues });
//     }
//     // :two: Old Computer No search
//     if (computerNo) {
//       const oldRecord = await OldPropertyMast.findOne({
//         where: { OldComputerNo: computerNo },
//       });
//       if (!oldRecord)
//         return res.status(404).json({ message: "Computer No not found." });
//       const property = await PropertyMast.findOne({
//         where: { OwnerID: oldRecord.OwnerID },
//       });
//       if (!property)
//         return res.status(404).json({ message: "Property not found." });
//       return res.status(200).json({ data: property.dataValues });
//     }
//     // :three: Mobile No search
//     if (mobileNo) {
//       const list = await PropertyMast.findAll({
//         where: { MobileNo: mobileNo },
//       });
//       if (!list.length)
//         return res.status(404).json({ message: "No properties found." });
//       const result = list.map((p) => p.dataValues);
//       return res.status(200).json({ data: result });
//     }
//     // :four: Renter Name search (English / Marathi)
//     if (renterEng || renterMar) {
//       const renterList = await CombinedOwnerName.findAll({
//         where: {
//           [Op.or]: [
//             renterEng && { RenterName: { [Op.like]: `%${renterEng}%` } },
//             renterMar && { MarathiRenterName: { [Op.like]: `%${renterMar}%` } },
//           ].filter(Boolean),
//         },
//         attributes: ["OwnerID", "RenterName", "MarathiRenterName"],
//       });
//       if (!renterList.length)
//         return res.status(404).json({ message: "No renter found." });
//       const ownerIds = renterList.map((r) => r.OwnerID);
//       const propertyList = await PropertyMast.findAll({
//         where: { OwnerID: ownerIds },
//         attributes: [
//           "OwnerID",
//           "OwnerName",
//           "OwnerNameMarathi",
//           "NewWardNo",
//           "NewPropertyNo",
//           "NewPartitionNo",
//         ],
//       });
//       const propertyMap = new Map(
//         propertyList.map((p) => [p.OwnerID, p])
//       );
//       const result = renterList.map((r) => {
//         const property = propertyMap.get(r.OwnerID);
//         return {
//           OwnerID: r.OwnerID,
//           renterName: r.RenterName,
//           renterNameMarathi: r.MarathiRenterName,
//           ownerName: property?.OwnerName || null,
//           ownerNameMarathi: property?.OwnerNameMarathi || null,
//           wardNo: property?.NewWardNo || null,
//           propertyNo: property?.NewPropertyNo || null,
//           partitionNo: property?.NewPartitionNo || null,
//         };
//       });
//       return res.status(200).json({ data: result });
//     }
//     // :five: Owner Name search (English / Marathi)
//     if (primaryOwnerEng || primaryOwnerMar||occupierEng||occupierMar) {
//       const list = await PropertyMast.findAll({
//         where: {
//           [Op.or]: [
//             primaryOwnerEng && { OwnerName: { [Op.like]: `%${primaryOwnerEng}%` } },
//             primaryOwnerMar && { OwnerNameMarathi: { [Op.like]: `%${primaryOwnerMar}%` } },
//               occupierEng && { OccupierName: { [Op.like]: `%${occupierEng}%` } },
//             occupierMar && { OccupierNameMarathi: { [Op.like]: `%${occupierMar}%` } },
//           ].filter(Boolean),
//         },
//         limit: 50,
//       });
//       if (!list.length)
//         return res.status(404).json({ message: "No owner found." });
//       const result = list.map((p) => p.dataValues);
//       return res.status(200).json({ data: result });
//     }
//     // :x: Fallback
//     return res
//       .status(404)
//       .json({ message: "No results found for the given criteria." });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: err.message });
//   }
// };



export const getTransferPropertyInfo = async (req, res) => {
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

    console.log(req.body, "REQ BODY");

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

    // 1️⃣ Ward + Property search
    if (wardNo && propertyNo) {
      const property = await PropertyMast.findOne({
        where: { NewWardNo: wardNo, NewPropertyNo: propertyNo },
      });

      if (!property)
        return res.status(404).json({ message: "Property not found." });

      const renter = await CombinedOwnerName.findOne({
        where: { OwnerID: property.OwnerID },
        attributes: ["OwnerID", "RenterName", "MarathiRenterName"],
      });

      return res.status(200).json({
        data: {
          ...property.dataValues,
          renterName: renter?.RenterName || null,
          renterNameMarathi: renter?.MarathiRenterName || null,
        },
      });
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

      if (!property)
        return res.status(404).json({ message: "Property not found." });

      const renter = await CombinedOwnerName.findOne({
        where: { OwnerID: property.OwnerID },
        attributes: ["OwnerID", "RenterName", "RenterNameMarathi"],
      });

      return res.status(200).json({
        data: {
          ...property.dataValues,
          renterName: renter?.RenterName || null,
          MarathiRenterName: renter?.MarathiRenterName || null,
        },
      });
    }

    // 3️⃣ Mobile No search
    if (mobileNo) {
      const list = await PropertyMast.findAll({
        where: { MobileNo: mobileNo },
      });

      if (!list.length) {
        return res.status(404).json({ message: "No properties found." });
      }

      const ownerIds = list.map((p) => p.OwnerID);
      const renters = await CombinedOwnerName.findAll({
        where: { OwnerID: ownerIds },
        attributes: ["OwnerID", "RenterName", "RenterNameMarathi"],
      });

      const renterMap = new Map(renters.map((r) => [r.OwnerID, r]));

      const result = list.map((p) => ({
        ...p.dataValues,
        renterName: renterMap.get(p.OwnerID)?.RenterName || null,
        renterNameMarathi: renterMap.get(p.OwnerID)?.RenterNameMarathi || null,
      }));

      return res.status(200).json({ data: result });
    }

    // 4️⃣ Owner / Occupier Name search (English / Marathi)
    if (primaryOwnerEng || primaryOwnerMar || occupierEng || occupierMar) {
      const list = await PropertyMast.findAll({
        where: {
          [Op.or]: [
            primaryOwnerEng && { OwnerName: { [Op.like]: `%${primaryOwnerEng}%` } },
            primaryOwnerMar && { OwnerNameMarathi: { [Op.like]: `%${primaryOwnerMar}%` } },
            occupierEng && { OccupierName: { [Op.like]: `%${occupierEng}%` } },
            occupierMar && { OccupierNameMarathi: { [Op.like]: `%${occupierMar}%` } },
          ].filter(Boolean),
        },
        limit: 50,
      });

      if (!list.length) {
        return res.status(404).json({ message: "No owner found." });
      }

      const ownerIds = list.map((p) => p.OwnerID);
      const renters = await CombinedOwnerName.findAll({
        where: { OwnerID: ownerIds },
        attributes: ["OwnerID", "RenterName", "MarathiRenterName"],
      });

      const renterMap = new Map(renters.map((r) => [r.OwnerID, r]));

      const result = list.map((p) => ({
        ...p.dataValues,
        renterName: renterMap.get(p.OwnerID)?.RenterName || null,
        MarathiRenterName: renterMap.get(p.OwnerID)?.MarathiRenterName || null,
      }));

      return res.status(200).json({ data: result });
    }

    // 5️⃣ Fallback
    return res
      .status(404)
      .json({ message: "No results found for the given criteria." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

// export const getTransferPropertyInfo = async (req, res) => {
//   try {
//     const {
//       wardNo,
//       propertyNo,
//       computerNo,
//       mobileNo,
//       occupierEng,
//       occupierMar,
//       primaryOwnerEng,
//       primaryOwnerMar,
//     } = req.body;
//     console.log(req.body,"data rewq body")
//     // Check if at least one criterion is provided
//     if (
//       !wardNo &&
//       !propertyNo &&
//       !computerNo &&
//       !mobileNo &&
//       !occupierEng &&
//       !occupierMar &&
//       !primaryOwnerEng &&
//       !primaryOwnerMar
//     ) {
//       return res
//         .status(400)
//         .json({ message: "Please provide at least one search criterion." });
//     }
//     // :one: Ward + Property search
//     if (wardNo && propertyNo) {
//       const property = await PropertyMast.findOne({
//         where: { NewWardNo: wardNo, NewPropertyNo: propertyNo },
//       });
//       console.log(property.OwnerID,"propertttii")
//       const renter = await CombinedOwnerName.findOne({ where: { OwnerID :property.OwnerID} });
//       if (!property)
//         return res.status(404).json({ message: "Property not found." });
//         return res.status(200).json({
//         data: { ...property.dataValues, renterName: renter?.RenterName || null },
//       });
//     }
//     // :two: Old Computer No search
//     if (computerNo) {
//       const oldRecord = await OldPropertyMast.findOne({
//         where: { OldComputerNo: computerNo },
//       });
//       if (!oldRecord)
//         return res.status(404).json({ message: "Computer No not found." });
//       const property = await PropertyMast.findOne({
//         where: { OwnerID: oldRecord.OwnerID },
//       });
//             const renter = await CombinedOwnerName.findOne({ where: { OwnerID :property.OwnerID} });
//       if (!property)
//         return res.status(404).json({ message: "Property not found." });
//       return res.status(200).json({  data: { ...property.dataValues, renterName: renter?.RenterName || null }, });
//     }
//    // :three: Mobile No search
// if (mobileNo) {
//   const list = await PropertyMast.findAll({
//     where: { MobileNo: mobileNo },
//   });
//   if (!list.length) {
//     return res.status(404).json({ message: "No properties found." });
//   }
//   const result = await Promise.all(
//     list.map(async (property) => {
//       const renter = await CombinedOwnerName.findOne({
//         where: { OwnerID: property.OwnerID },
//         attributes: ["RenterName"],
//       });
//       return {
//         ...property.dataValues,
//         renterName: renter?.RenterName || null,
//       };
//     })
//   );
//   return res.status(200).json({ data: result });
// }
//     // // :four: Renter Name search (English / Marathi)
//     // if (renterEng || renterMar) {
//     //   const renterList = await CombinedOwnerName.findAll({
//     //     where: {
//     //       [Op.or]: [
//     //         renterEng && { RenterName: { [Op.like]: `%${renterEng}%` } },
//     //         renterMar && { MarathiRenterName: { [Op.like]: `%${renterMar}%` } },
//     //       ].filter(Boolean),
//     //     },
//     //     attributes: ["OwnerID", "RenterName", "MarathiRenterName"],
//     //   });
//     //   if (!renterList.length)
//     //     return res.status(404).json({ message: "No renter found." });
//     //   const ownerIds = renterList.map((r) => r.OwnerID);
//     //   const propertyList = await PropertyMast.findAll({
//     //     where: { OwnerID: ownerIds },
//     //     attributes: [
//     //       "OwnerID",
//     //       "OwnerName",
//     //       "OwnerNameMarathi",
//     //       "NewWardNo",
//     //       "NewPropertyNo",
//     //       "NewPartitionNo",
//     //     ],
//     //   });
//     //   const propertyMap = new Map(
//     //     propertyList.map((p) => [p.OwnerID, p])
//     //   );
//     //   const result = renterList.map((r) => {
//     //     const property = propertyMap.get(r.OwnerID);
//     //     return {
//     //       OwnerID: r.OwnerID,
//     //       renterName: r.RenterName,
//     //       renterNameMarathi: r.MarathiRenterName,
//     //       ownerName: property?.OwnerName || null,
//     //       ownerNameMarathi: property?.OwnerNameMarathi || null,
//     //       wardNo: property?.NewWardNo || null,
//     //       propertyNo: property?.NewPropertyNo || null,
//     //       partitionNo: property?.NewPartitionNo || null,
//     //     };
//     //   });
//     //   return res.status(200).json({ data: result });
//     // }
//     // :five: Owner Name search (English / Marathi)
//    // :five: Owner / Occupier Name search (English / Marathi)
// if (primaryOwnerEng || primaryOwnerMar || occupierEng || occupierMar) {
//   const list = await PropertyMast.findAll({
//     where: {
//       [Op.or]: [
//         primaryOwnerEng && {
//           OwnerName: { [Op.like]: `%${primaryOwnerEng}%` },
//         },
//         primaryOwnerMar && {
//           OwnerNameMarathi: { [Op.like]: `%${primaryOwnerMar}%` },
//         },
//         occupierEng && {
//           OccupierName: { [Op.like]: `%${occupierEng}%` },
//         },
//         occupierMar && {
//           OccupierNameMarathi: { [Op.like]: `%${occupierMar}%` },
//         },
//       ].filter(Boolean),
//     },
//     limit: 50,
//   });
//   if (!list.length) {
//     return res.status(404).json({ message: "No owner found." });
//   }
//   // :small_blue_diamond: Collect OwnerIDs
//   const ownerIds = list.map(p => p.OwnerID);
//   // :small_blue_diamond: Fetch renters in one query
//   const renters = await CombinedOwnerName.findAll({
//     where: { OwnerID: ownerIds },
//     attributes: ["RenterName"],
//   });
//   // :small_blue_diamond: Map renters by OwnerID
//   const renterMap = new Map(
//     renters.map(r => [r.OwnerID, r])
//   );
//   // :small_blue_diamond: Merge property + renter
//   const result = list.map(p => ({
//     ...p.dataValues,
//     renterName: renterMap.get(p.OwnerID)?.RenterName || null,
//     renterNameMarathi:
//       renterMap.get(p.OwnerID)?.RenterNameMarathi || null,
//   }));
//   return res.status(200).json({ data: result });
// }
//     // :x: Fallback
//     return res
//       .status(404)
//       .json({ message: "No results found for the given criteria." });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: err.message });
//   }
// };


















// export const getTransferPropertyInfo = async (req, res) => {
//   try {
//     const {
//       wardNo,
//       propertyNo,
//       mobileNo,
//       primaryOwnerEng,
//       primaryOwnerMar,
//       occupierEng,
//       occupierMar,
//     } = req.body;

//     /* ==============================
//        BASIC VALIDATION
//     ============================== */
//     if (
//       !wardNo &&
//       !propertyNo &&
//       !mobileNo &&
//       !primaryOwnerEng &&
//       !primaryOwnerMar &&
//       !occupierEng &&
//       !occupierMar
//     ) {
//       return res.status(400).json({
//         message: "Please provide at least one search criteria",
//       });
//     }

//     /* ==============================
//        CASE 1: WARD + PROPERTY SEARCH
//     ============================== */
//     if (wardNo && propertyNo) {
//       const property = await PropertyMast.findOne({
//         where: {
//           NewWardNo: wardNo,
//           NewPropertyNo: propertyNo,
//         },
//         include: [
//           {
//             model: CombinedOwnerName,
//             required: false, // LEFT JOIN
//             attributes: [
//               "OwnerName",
//               "MarathiOwnerName",
//               "OccupierName",
//               "MarathiOccupierName",
//               "RenterName",
//               "MarathiRenterName",
//             ],
//           },
//         ],
//       });

//       if (!property) {
//         return res.status(404).json({ message: "Property not found" });
//       }

//       // hasMany → ARRAY
//       const combined =
//         property.combinedownerrenternames &&
//         property.combinedownerrenternames.length > 0
//           ? property.combinedownerrenternames[0]
//           : null;

//       return res.json({
//         data: {
//           ...property.dataValues,
//           primaryOwnerName: combined?.OwnerName || null,
//           primaryOwnerNameMarathi: combined?.MarathiOwnerName || null,
//           occupierName: combined?.OccupierName || null,
//           occupierNameMarathi: combined?.MarathiOccupierName || null,
//           renterName: combined?.RenterName || null,
//           renterNameMarathi: combined?.MarathiRenterName || null,
//         },
//       });
//     }

//     /* ==============================
//        CASE 2: MOBILE NO SEARCH
//     ============================== */
//     if (mobileNo) {
//       const list = await PropertyMast.findAll({
//         where: { MobileNo: mobileNo },
//         include: [
//           {
//             model: CombinedOwnerName,
//             required: false,
//             attributes: [
//               "OwnerName",
//               "MarathiOwnerName",
//               "OccupierName",
//               "MarathiOccupierName",
//               "RenterName",
//               "MarathiRenterName",
//             ],
//           },
//         ],
//       });

//       if (!list.length) {
//         return res.status(404).json({ message: "No records found" });
//       }

//       const result = list.map((p) => {
//         const combined =
//           p.combinedownerrenternames &&
//           p.combinedownerrenternames.length > 0
//             ? p.combinedownerrenternames[0]
//             : null;

//         return {
//           ...p.dataValues,
//           primaryOwnerName: combined?.OwnerName || null,
//           primaryOwnerNameMarathi: combined?.MarathiOwnerName || null,
//           occupierName: combined?.OccupierName || null,
//           occupierNameMarathi: combined?.MarathiOccupierName || null,
//           renterName: combined?.RenterName || null,
//           renterNameMarathi: combined?.MarathiRenterName || null,
//         };
//       });

//       return res.json({ data: result });
//     }

//     /* ==============================
//        CASE 3: OWNER / OCCUPIER NAME SEARCH
//        (Search Combined table, return Property)
//     ============================== */
//     const list = await PropertyMast.findAll({
//       include: [
//         {
//           model: CombinedOwnerName,
//           required: true,
//           where: {
//             [Op.or]: [
//               primaryOwnerEng && {
//                 OwnerName: { [Op.like]: `%${primaryOwnerEng}%` },
//               },
//               primaryOwnerMar && {
//                 MarathiOwnerName: { [Op.like]: `%${primaryOwnerMar}%` },
//               },
//               occupierEng && {
//                 OccupierName: { [Op.like]: `%${occupierEng}%` },
//               },
//               occupierMar && {
//                 MarathiOccupierName: {
//                   [Op.like]: `%${occupierMar}%`,
//                 },
//               },
//             ].filter(Boolean),
//           },
//           attributes: [
//             "OwnerName",
//             "MarathiOwnerName",
//             "OccupierName",
//             "MarathiOccupierName",
//             "RenterName",
//             "MarathiRenterName",
//           ],
//         },
//       ],
//       limit: 50,
//     });

//     if (!list.length) {
//       return res.status(404).json({ message: "No records found" });
//     }

//     const result = list.map((p) => {
//       const combined =
//         p.combinedownerrenternames &&
//         p.combinedownerrenternames.length > 0
//           ? p.combinedownerrenternames[0]
//           : null;

//       return {
//         ...p.dataValues,
//         primaryOwnerName: combined?.OwnerName || null,
//         primaryOwnerNameMarathi: combined?.MarathiOwnerName || null,
//         occupierName: combined?.OccupierName || null,
//         occupierNameMarathi: combined?.MarathiOccupierName || null,
//         renterName: combined?.RenterName || null,
//         renterNameMarathi: combined?.MarathiRenterName || null,
//       };
//     });

//     return res.json({ data: result });
//   } catch (err) {
//     console.error("API ERROR ❌", err);
//     return res.status(500).json({ message: err.message });
//   }
// };










// export const saveOrUpdateBillTransaction = async (req, res) => {
//   try {
//     const {
//       OwnerID,               
//       BillBookNo,
//       InvoiceNo,
//       PaymentMode,
//       Amount,
//       MobileNumber,
//       EmailId,
//       Remark,

//       // 🔹 NEW FEES
//       TransferFee,
//       RTIFee,
//       OtherFee,
//       WarrentFee,   
//       Tax2,
//       CreatedBy
//     } = req.body;
//     const successPageUrl =
//     `${process.env.FRONTEND_URL}/payment/transfer-fee` +
//     `?invoiceNo=${InvoiceNo}&ownerId=${OwnerID}`;
//     // 🔴 Validation
//     if (!OwnerID) {
//       return res.status(400).json({
//         message: "OwnerID is required"
//       });
//     }

//     // 🔢 Auto NetTotal calculation
//     const NetTotal =
//       Number(Amount || 0) +
//       Number(TransferFee || 0) +
//       Number(RTIFee || 0) +
//       Number(OtherFee || 0)+
//       Number(WarrentFee || 0) +   
//       Number(Tax2 || 0);     

//     // 🔍 Check existing record by OwnerID
//     const existingTxn = await BillTransactionDetails.findOne({
//       where: { OwnerID }
//     });

//     // ================= UPDATE =================
//     if (existingTxn) {
//       await BillTransactionDetails.update(
//         {
//           BillBookNo,
//           InvoiceNo,
//           PaymentMode,
//           Amount,
//           TransferFee,
//           RTIFee,
//           OtherFee,
//           WarrentFee,   
//           Tax2,
//           NetTotal,
//           MobileNumber,
//           EmailId,
//           Remark,
//           UpdatedBy: CreatedBy,
//           UpdatedDate: new Date()
//         },
//         {
//           where: { OwnerID }
//         }
//       );
// // 🔔 EMAIL SEND (AFTER UPDATE)
// if (EmailId) {
//   await SENDMAIL({
//     to: EmailId,
//     subject: 'Transfer Fee Payment Successful',
//     html: `
//       <h2>Payment Completed Successfully</h2>

//       <p><b>Invoice No:</b> ${InvoiceNo}</p>
//       <p><b>Bill Book No:</b> ${BillBookNo}</p>
//       <p><b>Payment Mode:</b> ${PaymentMode}</p>
//       <p><b>Total Amount:</b> ₹${NetTotal}</p>

//       <br/>

//       <a href="${successPageUrl}"
//          style="
//            display:inline-block;
//            padding:12px 20px;
//            background:#1976d2;
//            color:#ffffff;
//            text-decoration:none;
//            border-radius:6px;
//            font-weight:bold;
//          ">
//         View Payment Receipt
//       </a>
//     `
//   });
// }


//       return res.status(200).json({
//         message: "Bill transaction updated successfully",
//         BTId: existingTxn.BTId,
//         OwnerID
//       });
//     }

//     // ================= INSERT =================
//     const newTxn = await BillTransactionDetails.create({
//       OwnerID,
//       BillBookNo,
//       InvoiceNo,
//       PaymentMode,
//       Amount,
//       TransferFee,
//       RTIFee,
//       OtherFee,
//       NetTotal,
//       MobileNumber,
//       EmailId,
//       Remark,
//       CreatedBy,
//       CreatedDate: new Date()
//     });
//  // 🔔 EMAIL SEND (AFTER INSERT)
// // ✅ EMAIL SEND (YAHI LAGANA HAI)
// if (EmailId) {
//   await SENDMAIL({
//     to: EmailId,
//     subject: 'Transfer Fee Payment Successful',
//     html: `
//       <h2>Payment Completed Successfully</h2>

//       <p><b>Invoice No:</b> ${InvoiceNo}</p>
//       <p><b>Bill Book No:</b> ${BillBookNo}</p>
//       <p><b>Payment Mode:</b> ${PaymentMode}</p>
//       <p><b>Total Amount:</b> ₹${NetTotal}</p>

//       <br/>

//       <a href="${successPageUrl}"
//          style="
//            display:inline-block;
//            padding:12px 20px;
//            background:#1976d2;
//            color:#ffffff;
//            text-decoration:none;
//            border-radius:6px;
//            font-weight:bold;
//          ">
//         View Payment Receipt
//       </a>
//     `
//   });
// }


//     return res.status(201).json({
//       message: "Bill transaction created successfully",
//       data: newTxn
//     });

//   } catch (error) {
//     console.error("BillTransaction error:", error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//       error: error.message
//     });
//   }
// };

import PDFDocument from 'pdfkit';

// 🔹 Helper to generate PDF as buffer
const generatePaymentPDF = async (txnData) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });

    // PDF Content
    doc.fontSize(18).text('Payment Receipt', { align: 'center' });
    doc.moveDown();
// // 🔹 Owner & Property Info
// doc.fontSize(12).text(`वार्ड क्र.: ${txnData.WardNo || '-'}`);
// doc.text(`मालमत्ता क्र.: ${txnData.PropertyNo || '-'}`);
// doc.text(`प्राथमिक कर धारकाचे नाव: ${txnData.OwnerName || '-'}`);
// doc.text(`भोगवटदार / भाडेकरी नाव: ${txnData.Occupier || '-'}`);
// doc.text(`दुकानाचे नाव / अपार्टमेंटचे नाव: ${txnData.ShopName || '-'}`);
// doc.text(`संपर्क क्र.: ${txnData.MobileNo || '-'}`);
// doc.text(`पत्ता: ${txnData.Address || '-'}`);
doc.moveDown();
    doc.fontSize(12).text(`Invoice No: ${txnData.InvoiceNo}`);
    doc.text(`Bill Book No: ${txnData.BillBookNo}`);
    // doc.text(`Owner ID: ${txnData.OwnerID}`);
    doc.text(`Payment Mode: ${txnData.PaymentMode}`);
    doc.text(`Amount: ₹${txnData.Amount}`);
    doc.text(`Transfer Fee: ₹${txnData.TransferFee || 0}`);
    doc.text(`RTI Fee: ₹${txnData.RTIFee || 0}`);
    doc.text(`Other Fee: ₹${txnData.OtherFee || 0}`);
    doc.text(`Warrent Fee: ₹${txnData.WarrentFee || 0}`);
    doc.text(`Tax: ₹${txnData.Tax2 || 0}`);
    doc.text(`Net Total: ₹${txnData.NetTotal}`);
    doc.moveDown();
    doc.text(`Date: ${new Date().toLocaleString()}`);

    doc.end();
  });
};

const generateMerchantTaxRefNumber = ({ WardNo, PropertyNo, PartitionNo }) => {
  const random6 = Math.floor(100000 + Math.random() * 900000);

  let ref = `${random6}W${WardNo}`;

  if (PropertyNo) ref += `P${PropertyNo}`;
  if (PartitionNo) ref += `D${PartitionNo}`;

  return ref;
};

// export const saveOrUpdateBillTransaction = async (req, res) => {
//   try {
//     const {
//       OwnerID,
//       BillBookNo,
//       InvoiceNo,
//       PaymentMode,
//       Amount,
//       MobileNumber,
//       EmailId,
//       Remark,
//       TransferFee,
//       RTIFee,
//       OtherFee,
//       WarrentFee,
//       Tax2,
//       CreatedBy,
//       WardNo,       
//   PropertyNo,    
//   PartitionNo,
//   bank,
//   chequeNo,
//   chequeDate,
//   TransactionId,
//   RelID
//     } = req.body;

//     const successPageUrl = `${process.env.FRONTEND_URL}/payment/transfer-fee?invoiceNo=${InvoiceNo}&ownerId=${OwnerID}`;

//     if (!OwnerID) {
//       return res.status(400).json({ message: "OwnerID is required" });
//     }

//     const NetTotal =
//       Number(Amount || 0) +
//       Number(TransferFee || 0) +
//       Number(RTIFee || 0) +
//       Number(OtherFee || 0) +
//       Number(WarrentFee || 0) +
//       Number(Tax2 || 0);
//  // 🔹 CONDITIONAL VALUES (VERY IMPORTANT)
//  const BankName =
//  (PaymentMode === 'DD' || PaymentMode === 'CHEQUE')
//    ? bank || null
//    : null;

// const DDChequeNo =
//  (PaymentMode === 'DD' || PaymentMode === 'CHEQUE')
//    ? chequeNo || null
//    : null;

// const DDChequeDate =
//  (PaymentMode === 'DD' || PaymentMode === 'CHEQUE')
//    ? chequeDate || null
//    : null;

// const TxnId =
//  (PaymentMode === 'ONLINE' || PaymentMode === 'UPI')
//    ? TransactionId || null
//    : null;

// const PaidRefID =
//  (PaymentMode === 'ONLINE' || PaymentMode === 'UPI')
//    ? RelID || null
//    : null;

//     const existingTxn = await BillTransactionDetails.findOne({ where: { OwnerID } });

//     // ================= UPDATE =================
//     if (existingTxn) {
//       let merchantRef = existingTxn.MerchantTxnRefNumber;

//       // 🔹 Generate ONLY if NULL
//       if (!merchantRef) {
//         merchantRef = generateMerchantTaxRefNumber({
//           WardNo,
//           PropertyNo,
//           PartitionNo
//         });
//       }
//       await BillTransactionDetails.update(
//         {
//           BillBookNo,
//           InvoiceNo,
//           PaymentMode,
//           Amount,
//           TransferFee,
//           RTIFee,
//           OtherFee,
//           WarrentFee,
//           Tax2,
//           NetTotal,
//           MobileNumber,
//           EmailId,
//           Remark,
//           BankName,
//           DDChequeNo,
//           DDChequeDate,
//           TransactionId: TxnId,
//           RelID: PaidRefID,
//           MerchantTxnRefNumber: merchantRef,
//           UpdatedBy: CreatedBy,
//           UpdatedDate: new Date()
//         },
//         { where: { OwnerID } }
//       );

//       // 🔔 Generate PDF & send email
//       if (EmailId) {
//         const pdfBuffer = await generatePaymentPDF({
//           InvoiceNo,
//           BillBookNo,
//           OwnerID,
//           PaymentMode,
//           Amount,
//           TransferFee,
//           RTIFee,
//           OtherFee,
//           WarrentFee,
//           Tax2,
//           NetTotal
//         });

//         await SENDMAIL({
//           to: EmailId,
//           subject: 'Transfer Fee Payment Successful',
//           html: `
//             <h2>Payment Completed Successfully</h2>
//             <p><b>Invoice No:</b> ${InvoiceNo}</p>
//             <p><b>Bill Book No:</b> ${BillBookNo}</p>
//             <p><b>Payment Mode:</b> ${PaymentMode}</p>
//             <p><b>Total Amount:</b> ₹${NetTotal}</p>
//             <br/>
//             <a href="${successPageUrl}" style="
//               display:inline-block;
//               padding:12px 20px;
//               background:#1976d2;
//               color:#ffffff;
//               text-decoration:none;
//               border-radius:6px;
//               font-weight:bold;
//             ">View Payment Receipt</a>
//           `,
//           attachments: [
//             {
//               filename: `PaymentReceipt_${InvoiceNo}.pdf`,
//               content: pdfBuffer
//             }
//           ]
//         });
//       }

//       return res.status(200).json({
//         message: "Bill transaction updated successfully",
//         BTId: existingTxn.BTId,
//         OwnerID
//       });
//     }
//  // 🔹 Generate MerchantTaxRefNumber ONLY for INSERT
//  const MerchantTxnRefNumber = generateMerchantTaxRefNumber({
//   WardNo,
//   PropertyNo,
//   PartitionNo
// });

// console.log("🧾 MerchantTxnRefNumber:", MerchantTxnRefNumber);
//     // ================= INSERT =================
//     const newTxn = await BillTransactionDetails.create({
//       OwnerID,
//       BillBookNo,
//       InvoiceNo,
//       PaymentMode,
//       MerchantTxnRefNumber,
//       Amount,
//       TransferFee,
//       RTIFee,
//       OtherFee,
//       WarrentFee,
//       Tax2,
//       NetTotal,
//       MobileNumber,
//       EmailId,
//       Remark,
//       BankName,
//       DDChequeNo,
//       DDChequeDate,
//       TransactionId: TxnId,
//       RelID: PaidRefID,
//       WardNo,       
//       PropertyNo,    
//       PartitionNo,
//       CreatedBy,
//       CreatedDate: new Date()
//     });

//     // 🔔 Generate PDF & send email
//     if (EmailId) {
//       const pdfBuffer = await generatePaymentPDF({
//         InvoiceNo,
//         BillBookNo,
//         OwnerID,
//         PaymentMode,
//         Amount,
//         TransferFee,
//         RTIFee,
//         OtherFee,
//         WarrentFee,
//         Tax2,
//         NetTotal
//       });

//       await SENDMAIL({
//         to: EmailId,
//         subject: 'Transfer Fee Payment Successful',
//         html: `
//           <h2>Payment Completed Successfully</h2>
//           <p><b>Invoice No:</b> ${InvoiceNo}</p>
//           <p><b>Bill Book No:</b> ${BillBookNo}</p>
//           <p><b>Payment Mode:</b> ${PaymentMode}</p>
//           <p><b>Total Amount:</b> ₹${NetTotal}</p>
//           <br/>
//           <a href="${successPageUrl}" style="
//             display:inline-block;
//             padding:12px 20px;
//             background:#1976d2;
//             color:#ffffff;
//             text-decoration:none;
//             border-radius:6px;
//             font-weight:bold;
//           ">View Payment Receipt</a>
//         `,
//         attachments: [
//           {
//             filename: `PaymentReceipt_${InvoiceNo}.pdf`,
//             content: pdfBuffer
//           }
//         ]
//       });
//     }

//     return res.status(201).json({
//       message: "Bill transaction created successfully",
//       data: newTxn
//     });

//   } catch (error) {
//     console.error("BillTransaction error:", error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//       error: error.message
//     });
//   }
// };

//////////////data entry aprroval

export const saveOrUpdateBillTransaction = async (req, res) => {
  try {
    const {
      OwnerID,
      BillBookNo,
      InvoiceNo,
      PaymentMode,
      Amount,
      MobileNumber,
      EmailId,
      Remark,
      TransferFee,
      RTIFee,
      OtherFee,
      WarrentFee,
      Tax2,
      CreatedBy,
      WardNo,
      PropertyNo,
      PartitionNo,
      bank,
      chequeNo,
      chequeDate,
      RelID // we won't use incoming TransactionId
    } = req.body;

    if (!OwnerID) {
      return res.status(400).json({ message: "OwnerID is required" });
    }

    // Calculate total amount
    const NetTotal =
      Number(Amount || 0) +
      Number(TransferFee || 0) +
      Number(RTIFee || 0) +
      Number(OtherFee || 0) +
      Number(WarrentFee || 0) +
      Number(Tax2 || 0);

    // Conditional bank/DD/Cheque values
    const BankName = (PaymentMode === 'DD' || PaymentMode === 'CHEQUE') ? bank || null : null;
    const DDChequeNo = (PaymentMode === 'DD' || PaymentMode === 'CHEQUE') ? chequeNo || null : null;
    const DDChequeDate = (PaymentMode === 'DD' || PaymentMode === 'CHEQUE') ? chequeDate || null : null;

    // Generate MerchantTxnRefNumber
    const MerchantTxnRefNumber = generateMerchantTaxRefNumber({
      WardNo,
      PropertyNo,
      PartitionNo
    });

    console.log("🧾 MerchantTxnRefNumber:", MerchantTxnRefNumber);

    // Set TransactionId = MerchantTxnRefNumber
    const TxnId = MerchantTxnRefNumber;
    const PaidRefID = RelID || null;

    // Insert new transaction
    const newTxn = await BillTransactionDetails.create({
      OwnerID,
      BillBookNo,
      InvoiceNo,
      PaymentMode,
      MerchantTxnRefNumber,
      Amount,
      TransferFee,
      RTIFee,
      OtherFee,
      WarrentFee,
      Tax2,
      NetTotal,
      MobileNumber,
      EmailId,
      Remark,
      BankName,
      DDChequeNo,
      DDChequeDate,
      // TransactionId: TxnId,  // <-- now shows MerchantTxnRefNumber
      RelID: PaidRefID,
      WardNo,
      PropertyNo,
      PartitionNo,
      CreatedBy,
      CreatedDate: new Date()
    });

    // Generate PDF & send email (without button)
    if (EmailId) {
      const pdfBuffer = await generatePaymentPDF({
        InvoiceNo,
        BillBookNo,
        OwnerID,
        PaymentMode,
        Amount,
        TransferFee,
        RTIFee,
        OtherFee,
        WarrentFee,
        Tax2,
        NetTotal
      });

      await SENDMAIL({
        to: EmailId,
        subject: 'Transfer Fee Payment Successful',
        html: `
          <h2>Payment Completed Successfully</h2>
          <p><b>Invoice No:</b> ${InvoiceNo}</p>
          <p><b>Bill Book No:</b> ${BillBookNo}</p>
          <p><b>Payment Mode:</b> ${PaymentMode}</p>
          <p><b>Total Amount:</b> ₹${NetTotal}</p>
          <p><b>Transaction ID:</b> ${TxnId}</p> <!-- now shows MerchantTxnRefNumber -->
        `,
        attachments: [
          {
            filename: `PaymentReceipt_${InvoiceNo}.pdf`,
            content: pdfBuffer
          }
        ]
      });
    }

    return res.status(201).json({
      message: "Bill transaction created successfully",
      data: newTxn
    });

  } catch (error) {
    console.error("BillTransaction error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};


export const getZoneByWardAndProperty = async (req, res) => {
  try {
    const { NewWardNo, NewPropertyNo } = req.body;

    if (!NewWardNo || !NewPropertyNo) {
      return res.status(400).json({
        message: "Ward No and Property No are required",
      });
    }

    const zones = await PropertyMast.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("NewZoneNo")), "NewZoneNo"],
      ],
      where: {
        NewWardNo,
        NewPropertyNo,
      },
    });

    res.status(200).json({
      success: true,
      data: zones,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch zone",
    });
  }
};




export const searchProperty = async (req, res) => {
  try {
    const {
      NewWardNo,
      NewPropertyNo,
      NewZoneNo,
      OwnerName,
      OwnerNameMarathi,
      OccupierName,
      Status,
      fromDate,
      toDate
    } = req.body;

    let whereClause = {};

    // 🔹 Ward
    if (NewWardNo) {
      whereClause.NewWardNo = NewWardNo;
    }

    // 🔹 Property
    if (NewPropertyNo) {
      whereClause.NewPropertyNo = NewPropertyNo;
    }

    // 🔹 Zone
    if (NewZoneNo) {
      whereClause.NewZoneNo = NewZoneNo;
    }

    // 🔹 Status
    if (Status) {
      whereClause.Status = Status;
    }

    // 🔹 Owner Name (English)
    if (OwnerName) {
      whereClause.OwnerName = {
        [Op.like]: `%${OwnerName}%`
      };
    }

    // 🔹 Owner Name (Marathi)
    if (OwnerNameMarathi) {
      whereClause.OwnerNameMarathi = {
        [Op.like]: `%${OwnerNameMarathi}%`
      };
    }

    // 🔹 Occupier
    if (OccupierName) {
      whereClause.OccupierName = {
        [Op.like]: `%${OccupierName}%`
      };
    }

    // 🔹 Date Range
    if (fromDate && toDate) {
      whereClause.CreatedDate = {
        [Op.between]: [fromDate, toDate]
      };
    }

    const result = await PropertyMast.findAll({
      where: whereClause,
      order: [["OwnerID", "DESC"]]
    });

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });

  } catch (error) {
    console.error("Property Search Error:", error);
    res.status(500).json({
      success: false,
      message: "Search failed"
    });
  }
};

export const getBillTransactionsByOwner = async (req, res) => {
  try {
    const ownerId = req.body.OwnerID || req.body.ownerId;

    if (!ownerId) {
      return res.status(400).json({ message: "OwnerID is required" });
    }

    const transactions = await BillTransactionDetails.findAll({
      where: { OwnerID: ownerId },   // DB column
      order: [['CreatedDate', 'DESC']],
    });

    return res.status(200).json({
      message: "Bill transactions fetched successfully",
      data: transactions || [],
    });

  } catch (error) {
    console.error("Error fetching bill transactions:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
















