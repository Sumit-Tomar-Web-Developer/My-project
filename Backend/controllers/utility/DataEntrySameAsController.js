import sequelize from '../../config/connectionDB.js';
import PropertyDetailsNew from '../../models/models/propertydetailsnew.js';
import PropertyMast from '../../models/models/propertymast.js';
import FloorSubmissionDetailsMinusData from '../../models/models/floorsubmissiondetailsminusdata.js';
import FloorSubmissionDetails from '../../models/models/floorsubmissiondetails.js';
import { Op } from 'sequelize';
import CombinedOwnerName from '../../models/models/combinedownerrenternames.js';

// export const postPropertyDetails = async (req, res) => {
//   const transaction = await sequelize.transaction();
//   try {
//     const { propertyMastData, ownerIds } = req.body.data || {};

//     if (!ownerIds || ownerIds.length === 0) {
//       return res.status(400).json({ message: 'ownerIds are required' });
//     }

//     // 1️⃣ Fetch source owner
//     const ownerResult = await PropertyMast.findOne({
//       attributes: [[sequelize.col('OwnerID'), 'OwnerId']],
//       where: {
//         NewWardNo: propertyMastData.WardNoCopyFrom,
//         NewPropertyNo: propertyMastData.PropertyNo,
//       },
//       raw: true,
//     });

//     if (!ownerResult || !ownerResult.OwnerId) {
//       return res.status(404).json({ message: 'Source owner not found' });
//     }

//     const sourceOwnerId = ownerResult.OwnerId;

//     // @ CombinedOwnerName second Table Data
//     const existingCombinedOwnerNames = await CombinedOwnerName.findOne({
//       where: {
//         OwnerID: sourceOwnerId,
//       },
//     });

//     if (existingCombinedOwnerNames) {
//       const { RenterName, OccupierName } = existingCombinedOwnerNames;
//       await CombinedOwnerName.destroy({
//         where: {
//           OwnerID: {
//             [Op.in]: ownerIds,
//           },
//         },
//         transaction,
//       });

//       // Check conditions before creating new records
//       const newRecordsforComineOwnerName = ownerIds.map((id) => {
//         const newRecord = {
//           OwnerID: id,
//           RenterName,
//           OccupierName,
//         };

//         if (propertyMastData.RenterName) {
//           newRecord.RenterName = RenterName;
//         }

//         if (propertyMastData.OccupierName) {
//           newRecord.OccupierName = OccupierName;
//         }

//         return newRecord;
//       });

//       await CombinedOwnerName.bulkCreate(newRecordsforComineOwnerName, {
//         transaction,
//       });
//     } else {
//       console.error('No existing record found for the provided ownerId.');
//     }

//     // @ PropertyMast First Table
//     const property = await PropertyMast.findOne({
//       where: {
//         OwnerID: sourceOwnerId,
//       },
//     });

//     // Extract necessary fields from property
//     const { PlotTaxableAreaSqFt, PropertyTypeID, CreatedBy, UpdatedBy } =
//       property;

//     console.log('property data', property);

//     // Update properties for all ownerIds
//     const updatePromises = ownerIds.map(async (id) => {
//       const newRecordsPropertyMast = {
//         OwnerID: id,
//         PlotTaxableAreaSqFt: PlotTaxableAreaSqFt,
//         PropertyTypeID,
//         UpdatedBy: UpdatedBy,
//       };

//       console.log(newRecordsPropertyMast, 'data to be');

//       // Perform the update within the loop
//       await PropertyMast.update(newRecordsPropertyMast, {
//         where: {
//           OwnerID: id,
//         },
//       });
//     });

//     // 2️⃣ Fetch source PropertyDetailsNew
//     const sourceProperties = await PropertyDetailsNew.findAll({
//       where: { OwnerID: sourceOwnerId },
//       raw: true,
//     });

//     if (!sourceProperties.length) {
//       return res
//         .status(404)
//         .json({ message: 'No properties found for source owner' });
//     }

//     // 3️⃣ Fetch floor data
//     const sourcePDNIds = sourceProperties.map((p) => p.PDNId);

//     const sourceFloors = await FloorSubmissionDetails.findAll({
//       where: { PDNId: sourcePDNIds },
//       raw: true,
//     });

//     const sourceFSDIds = sourceFloors.map((f) => f.FSDId);

//     const sourceFloorMinus = await FloorSubmissionDetailsMinusData.findAll({
//       where: { FSDId: sourceFSDIds },
//       raw: true,
//     });

//     const responseData = [];

//     for (const newOwnerId of ownerIds) {
//       // ---- DELETE existing data for this target owner ----
//       const targetPDNIds = await PropertyDetailsNew.findAll({
//         attributes: ['PDNId'],
//         where: { OwnerID: newOwnerId },
//         raw: true,
//         transaction,
//       }).then((rows) => rows.map((r) => r.PDNId));

//       if (targetPDNIds.length) {
//         const targetFSDIds = await FloorSubmissionDetails.findAll({
//           attributes: ['FSDId'],
//           where: { PDNId: { [Op.in]: targetPDNIds } },
//           raw: true,
//           transaction,
//         }).then((rows) => rows.map((r) => r.FSDId));

//         if (targetFSDIds.length) {
//           await FloorSubmissionDetailsMinusData.destroy({
//             where: { FSDId: { [Op.in]: targetFSDIds } },
//             transaction,
//           });
//         }

//         await FloorSubmissionDetails.destroy({
//           where: { PDNId: { [Op.in]: targetPDNIds } },
//           transaction,
//         });

//         await PropertyDetailsNew.destroy({
//           where: { PDNId: { [Op.in]: targetPDNIds } },
//           transaction,
//         });
//       }

//       // ---- INSERT PropertyDetailsNew for target owner ----
//       const pdnIdMap = {}; // old PDNId -> new PDNId
//       const newProperties = sourceProperties.map(
//         ({ PDNId, OwnerID, ...rest }) => ({
//           ...rest,
//           OwnerID: newOwnerId,
//           RenterName: propertyMastData.RenterName ? rest.RenterName : null,
//           OccupierName: propertyMastData.OccupierName
//             ? rest.OccupierName
//             : null,
//         })
//       );

//       const createdProperties = await PropertyDetailsNew.bulkCreate(
//         newProperties,
//         {
//           returning: true,
//           transaction,
//         }
//       );

//       createdProperties.forEach((p, idx) => {
//         pdnIdMap[sourceProperties[idx].PDNId] = p.PDNId;
//       });

//       // ---- INSERT FloorSubmissionDetails for target owner ----
//       const fsdIdMap = {}; // old FSDId -> new FSDId
//       const newFloors = sourceFloors.map(
//         ({ FSDId, OwnerID, PDNId, ...rest }) => ({
//           ...rest,
//           OwnerID: newOwnerId,
//           PDNId: pdnIdMap[PDNId],
//         })
//       );

//       const createdFloors = await FloorSubmissionDetails.bulkCreate(newFloors, {
//         returning: true,
//         transaction,
//       });

//       createdFloors.forEach((f, idx) => {
//         fsdIdMap[sourceFloors[idx].FSDId] = f.FSDId;
//       });

//       // ---- INSERT FloorSubmissionDetailsMinusData for target owner ----
//       const newFloorMinus = sourceFloorMinus.map(
//         ({ FSDMDId, OwnerID, FSDId, ...rest }) => ({
//           ...rest,
//           OwnerID: newOwnerId,
//           FSDId: fsdIdMap[FSDId],
//         })
//       );

//       let createdMinus = [];
//       if (newFloorMinus.length) {
//         createdMinus = await FloorSubmissionDetailsMinusData.bulkCreate(
//           newFloorMinus,
//           { transaction, returning: true }
//         );
//       }

//       // ---- Collect response data per owner ----
//       responseData.push({
//         OwnerID: newOwnerId,
//         PropertyDetailsNew: createdProperties,
//         FloorSubmissionDetails: createdFloors,
//         FloorSubmissionDetailsMinusData: createdMinus,
//       });
//     }

//     await transaction.commit();

//     return res.status(200).json({
//       message:
//         'Property, floor, and minus data copied successfully for target owners',
//       data: responseData,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error('Error copying property details:', error);
//     return res
//       .status(500)
//       .json({ message: 'Server error', error: error.message });
//   }
// };
export const postPropertyDetails = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { propertyMastData, ownerIds } = req.body.data || {};

    if (!ownerIds?.length) {
      return res.status(400).json({ message: "ownerIds are required" });
    }

    // 1️⃣ Get Source Owner
    const ownerResult = await PropertyMast.findOne({
      attributes: [[sequelize.col("OwnerID"), "OwnerId"]],
      where: {
        NewWardNo: propertyMastData.WardNoCopyFrom,
        NewPropertyNo: propertyMastData.PropertyNo,
      },
      raw: true,
      transaction,
    });

    if (!ownerResult?.OwnerId) {
      return res.status(404).json({ message: "Source owner not found" });
    }

    const sourceOwnerId = ownerResult.OwnerId;

    // 2️⃣ Copy CombinedOwnerName when exists
    const existingCombinedOwnerNames = await CombinedOwnerName.findOne({
      where: { OwnerID: sourceOwnerId },
      raw: true,
      transaction,
    });

    if (existingCombinedOwnerNames) {
      const { RenterName, OccupierName } = existingCombinedOwnerNames;

      await CombinedOwnerName.destroy({
        where: { OwnerID: { [Op.in]: ownerIds } },
        transaction,
      });

      const newRecords = ownerIds.map((id) => ({
        OwnerID: id,
        RenterName: propertyMastData.RenterName ? RenterName : null,
        OccupierName: propertyMastData.OccupierName ? OccupierName : null,
      }));

      await CombinedOwnerName.bulkCreate(newRecords, { transaction });
    }

    // 3️⃣ Copy PropertyMast fields
    const property = await PropertyMast.findOne({
      where: { OwnerID: sourceOwnerId },
      transaction,
    });

    if (!property) {
      throw new Error("Source PropertyMast not found");
    }

    const { PlotTaxableAreaSqFt, PropertyTypeID, UpdatedBy } = property;

    await Promise.all(
      ownerIds.map((id) =>
        PropertyMast.update(
          {
            PlotTaxableAreaSqFt,
            PropertyTypeID,
            UpdatedBy,
          },
          {
            where: { OwnerID: id },
            transaction,
          }
        )
      )
    );

    // 4️⃣ Fetch source PropertyDetails
    const sourceProperties = await PropertyDetailsNew.findAll({
      where: { OwnerID: sourceOwnerId },
      raw: true,
      transaction,
    });

    if (!sourceProperties.length) {
      return res
        .status(404)
        .json({ message: "No properties found for source owner" });
    }

    // Floors
    const sourcePDNIds = sourceProperties.map((p) => p.PDNId);

    const sourceFloors = await FloorSubmissionDetails.findAll({
      where: { PDNId: sourcePDNIds },
      raw: true,
      transaction,
    });

    const sourceFSDIds = sourceFloors.map((f) => f.FSDId);

    const sourceFloorMinus =
      await FloorSubmissionDetailsMinusData.findAll({
        where: { FSDId: sourceFSDIds },
        raw: true,
        transaction,
      });

    const responseData = [];

    // 5️⃣ Loop target owners
    for (const newOwnerId of ownerIds) {
      // Delete existing target records
      const targetPDNIds = (
        await PropertyDetailsNew.findAll({
          attributes: ["PDNId"],
          where: { OwnerID: newOwnerId },
          raw: true,
          transaction,
        })
      ).map((r) => r.PDNId);

      if (targetPDNIds.length) {
        const targetFSDIds = (
          await FloorSubmissionDetails.findAll({
            attributes: ["FSDId"],
            where: { PDNId: { [Op.in]: targetPDNIds } },
            raw: true,
            transaction,
          })
        ).map((r) => r.FSDId);

        if (targetFSDIds.length) {
          await FloorSubmissionDetailsMinusData.destroy({
            where: { FSDId: { [Op.in]: targetFSDIds } },
            transaction,
          });
        }

        await FloorSubmissionDetails.destroy({
          where: { PDNId: { [Op.in]: targetPDNIds } },
          transaction,
        });

        await PropertyDetailsNew.destroy({
          where: { PDNId: { [Op.in]: targetPDNIds } },
          transaction,
        });
      }

      // Insert PropertyDetailsNew
      const pdnMap = {};

      const newProperties = sourceProperties.map(
        ({ PDNId, OwnerID, ...rest }) => ({
          ...rest,
          OwnerID: newOwnerId,
          RenterName: propertyMastData.RenterName ? rest.RenterName : null,
          OccupierName: propertyMastData.OccupierName ? rest.OccupierName : null,
        })
      );

      const createdProperties = await PropertyDetailsNew.bulkCreate(
        newProperties,
        { returning: true, transaction }
      );

      createdProperties.forEach((p, i) => {
        pdnMap[sourceProperties[i].PDNId] = p.PDNId;
      });

      // Insert Floors
      const fsdMap = {};
      const newFloors = sourceFloors.map(
        ({ FSDId, OwnerID, PDNId, ...rest }) => ({
          ...rest,
          OwnerID: newOwnerId,
          PDNId: pdnMap[PDNId],
        })
      );

      const createdFloors = await FloorSubmissionDetails.bulkCreate(
        newFloors,
        { returning: true, transaction }
      );

      createdFloors.forEach((f, i) => {
        fsdMap[sourceFloors[i].FSDId] = f.FSDId;
      });

      // Insert Minus Data
      let createdMinus = [];
      if (sourceFloorMinus.length) {
        const minusRows = sourceFloorMinus.map(
          ({ FSDMDId, OwnerID, FSDId, ...rest }) => ({
            ...rest,
            OwnerID: newOwnerId,
            FSDId: fsdMap[FSDId],
          })
        );

        createdMinus =
          await FloorSubmissionDetailsMinusData.bulkCreate(minusRows, {
            returning: true,
            transaction,
          });
      }

      responseData.push({
        OwnerID: newOwnerId,
        PropertyDetailsNew: createdProperties,
        FloorSubmissionDetails: createdFloors,
        FloorSubmissionDetailsMinusData: createdMinus,
      });
    }

    await transaction.commit();

    return res.status(200).json({
      message:
        "Property, floor, and minus data copied successfully for target owners",
      data: responseData,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error copying property details:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
