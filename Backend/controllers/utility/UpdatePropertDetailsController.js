import sequelize from '../../config/connectionDB.js';
import CombinedOwnerName from '../../models/models/combinedownerrenternames.js';
import JoinOwnerDetails from '../../models/models/jointownerdetails.js';
import PropertyMast from '../../models/models/propertymast.js';

import { Op, where } from 'sequelize';
import PropertySocialDetails from '../../models/models/propertysocialdetails.js';
import PropertyTypeMaster from '../../models/models/propertytypemaster.js';
import PropertyDetailsChangeHistory from '../../models/models/propertydetailschangehistory.js';

export const getPropertiesRangeFromAndTo = async (req, res) => {
  const { wardNo, fromPropertyNo, toPropertyNo } = req.body; // Extract wardNo, from, and to from request body

  // Check if 'from' and 'to' are provided
  if (fromPropertyNo === undefined || toPropertyNo === undefined) {
    return res.status(400).json({
      message:
        'Invalid property range. Both "from" and "to" values are required.',
    });
  }

  try {
    const properties = await PropertyMast.findAll({
      attributes: [
        [
          sequelize.fn(
            'TRIM',
            sequelize.literal(
              `TRAILING '-' FROM CONCAT_WS('-', NewPropertyNo, NewPartitionNo)`
            )
          ),
          'prop', // Concatenates NewPropertyNo and NewPartitionNo and removes trailing hyphen
        ],
        'NewPartitionNo',
        'NewPropertyNo', // Return NewPartitionNo
        'OwnerID', // Return OwnerID
      ],
      where: {
        NewWardNo: wardNo,
        [Op.and]: [
          sequelize.where(
            sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
            Op.gte,
            fromPropertyNo
          ),
          sequelize.where(
            sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
            Op.lte,
            toPropertyNo
          ),
        ],
      },
      order: sequelize.literal('`NewPropertyNo` + 1'), // Sorting based on NewPropertyNo
    });

    // If no properties are found
    if (properties.length === 0) {
      return res
        .status(404)
        .json({ message: 'No properties found for this ward and range' });
    }

    // Return the properties with concatenated NewPropertyNo and NewPartitionNo along with OwnerID
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getJointOwnerList = async (req, res) => {
  try {
    const { OwnerID } = req.body;

    // Validate OwnerID
    if (!OwnerID) {
      return res.status(400).json({ error: 'OwnerID is required' });
    }

    // Fetch joint owner details
    const JointResults = await JoinOwnerDetails.findOne({
      attributes: [
        'OwnerID',
        'OwnerName',
        'OwnerNameMarathi',
        'isPrime',
        'Address',
        'OwnerPatta',
      ],
      where: { OwnerID, isPrime: true },
    });

    if (!JointResults) {
      return res.status(404).json({ error: 'No joint owner details found' });
    }

    // Fetch PropertyTypeID from another table (e.g., PropertyMast)
    const propertyTypeResult = await PropertyMast.findOne({
      attributes: ['PropertyTypeID'],
      where: { OwnerID },
    });

    if (!propertyTypeResult) {
      return res
        .status(404)
        .json({ error: 'PropertyTypeID not found for the provided OwnerID' });
    }

    const { PropertyTypeID } = propertyTypeResult;

    // Fetch PropertyDescription based on PropertyTypeID
    const descriptionResult = await PropertyTypeMaster.findOne({
      attributes: ['PropertyDescription', 'PropertyTypeID'],
      where: { PropertyTypeID },
    });

    console.log(descriptionResult, 'disss');

    const propertyDescription = descriptionResult
      ? descriptionResult.PropertyDescription
      : 'Unknown';

    // Fetch social details
    const socialResult = await PropertySocialDetails.findOne({
      attributes: ['RoadWidth'],
      where: { OwnerId: OwnerID },
    });

    const roadWidth = socialResult ? socialResult.RoadWidth : null;

    // Combine all results into a single response
    const formattedResult = {
      ...JointResults.toJSON(),
      RoadWidth: roadWidth,
      PropertyDescription: propertyDescription,
      PropertyTypeID: PropertyTypeID,
    };

    return res.status(200).json({
      message: 'Details fetched for selected ward and Property No successfully',
      data: formattedResult,
    });
  } catch (error) {
    console.error('Error fetching joint owner list:', error);
    return res.status(500).json({ error: 'Failed to fetch joint owner list' });
  }
};

// export const getOwnerNamesByPropertyNoRange = async (req, res) => {
//   try {
//     const { wardNo, fromPropertyNo, toPropertyNo } = req.body;
//     const from = parseInt(fromPropertyNo, 10);
//     const to = parseInt(toPropertyNo, 10);

//     console.log(wardNo, from, to, 'ddddd');

//     // Fetch PropertyMast data
//     const ownerNameResults = await PropertyMast.findAll({
//       attributes: [
//         'OwnerName',
//         'OwnerNameMarathi',
//         'NewWardNo',
//         'NewPropertyNo',
//         'NewPartitionNo',
//         'OwnerID',
//         'Address',
//         'OwnerPatta',
//         'PropertyTypeID',
//         'BuildingOrShopName',
//         'BuildingOrShopNameMarathi',
//         'WadhGhatRemarkOne',
//         'WadhGhatRemarkTwo',
//       ],
//       where: {
//         NewWardNo: wardNo,
//         NewPropertyNo: {
//           [Op.between]: [from, to],
//         },
//       },
//     });

//     // Log result count
// console.log(`📢 Found OwnerIDs: ${ownerNameResults.length}`);
// console.log("🆔 Owner List:", ownerNameResults.map(o => o.OwnerID));

//     // Extract OwnerIDs and PropertyTypeIDs
//     const ownerIds = ownerNameResults.map((result) => result.OwnerID);
//     const propertyTypeIds = ownerNameResults.map(
//       (result) => result.PropertyTypeID
//     );

//     // Fetch JoinOwnerDetails data
//     const jointResults = await JoinOwnerDetails.findAll({
//       attributes: ['isPrime', 'OwnerID'],
//       where: {
//         OwnerID: {
//           [Op.in]: ownerIds,
//         },
//         isPrime: { [Op.ne]: null }, // Exclude rows where isPrime is null
//       },
//     });

//     // Fetch RoadWidth data from PropertySocialDetails
//     const roadWidthResults = await PropertySocialDetails.findAll({
//       attributes: ['RoadWidth', 'OwnerId'],
//       where: {
//         OwnerId: {
//           [Op.in]: ownerIds,
//         },
//       },
//     });

//     // Fetch PropertyDescriptions for the PropertyTypeIDs
//     const descriptionResults = await PropertyTypeMaster.findAll({
//       attributes: ['PropertyDescription', 'PropertyTypeID'],
//       where: {
//         PropertyTypeID: {
//           [Op.in]: propertyTypeIds,
//         },
//       },
//     });

//     // Fetch PropertyDescriptions for the PropertyTypeIDs
//     const commonRemarkResults = await PropertySocialDetails.findAll({
//       attributes: [
//         'DirectionNorth',
//         'DirectionSouth',
//         'DirectionEast',
//         'DirectionWest',
//         'OwnerId',
//       ],
//       where: {
//         OwnerId: {
//           [Op.in]: ownerIds,
//         },
//       },
//     });

//     // Create mappings for isPrime, RoadWidth, and PropertyDescription
//     const isPrimeMap = jointResults.reduce((acc, result) => {
//       acc[result.OwnerID] = result.isPrime;
//       return acc;
//     }, {});

//     const roadWidthMap = roadWidthResults.reduce((acc, result) => {
//       acc[result.OwnerId] = result.RoadWidth;
//       return acc;
//     }, {});

//     const descriptionMap = descriptionResults.reduce((acc, result) => {
//       acc[result.PropertyTypeID] = result.PropertyDescription;
//       return acc;
//     }, {});

//     const commonRemarkMap = commonRemarkResults.reduce((acc, result) => {
//       acc[result.OwnerId] = {
//         DirectionNorth: result.DirectionNorth,
//         DirectionSouth: result.DirectionSouth,
//         DirectionEast: result.DirectionEast,
//         DirectionWest: result.DirectionWest,
//       };
//       return acc;
//     }, {});

//     // Merge the results and filter by isPrime
//     const mergedResults = ownerNameResults
//       .map((property) => ({
//         OwnerName: property.OwnerName,
//         OwnerNameMarathi: property.OwnerNameMarathi,
//         NewWardNo: property.NewWardNo,
//         NewPropertyNo: property.NewPropertyNo,
//         NewPartitionNo: property.NewPartitionNo,
//         OwnerID: property.OwnerID,
//         Address: property.Address,
//         OwnerPatta: property.OwnerPatta,
//         isPrime: isPrimeMap[property.OwnerID] || null,
//         RoadWidth: roadWidthMap[property.OwnerID] || null,
//         PropertyDescription: descriptionMap[property.PropertyTypeID] || null,
//         BuildingOrShopNameMarathi: property.BuildingOrShopNameMarathi,
//         BuildingOrShopName: property.BuildingOrShopName,
//         WadhGhatRemarkOne: property.WadhGhatRemarkOne,
//         WadhGhatRemarkTwo: property.WadhGhatRemarkTwo,
//         DirectionNorth:
//           commonRemarkMap[property.OwnerID]?.DirectionNorth || null,
//         DirectionSouth:
//           commonRemarkMap[property.OwnerID]?.DirectionSouth || null,
//         DirectionEast: commonRemarkMap[property.OwnerID]?.DirectionEast || null,
//         DirectionWest: commonRemarkMap[property.OwnerID]?.DirectionWest || null,
//       }))
//       // .filter(
//       //   (result) =>
//       //     result.isPrime === true &&
//       //     result.NewPropertyNo >= from &&
//       //     result.NewPropertyNo <= to
//       // );
//       .filter(
//         (result) => result.NewPropertyNo >= from && result.NewPropertyNo <= to
//       );

//     return res.status(200).json({
//       message:
//         'Property details for selected property range fetched successfully',
//       mergedResults,
//     });
//   } catch (error) {
//     console.error('Error fetching ownerNames:', error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

export const getOwnerNamesByPropertyNoRange = async (req, res) => {
  try {
    const { wardNo, fromPropertyNo, toPropertyNo } = req.body;

    console.log(req.body, 'req body ownername');

    const from = parseInt(fromPropertyNo, 10);
    const to = parseInt(toPropertyNo, 10);

    // Fetch property records with numeric filtering
    const ownerNameResults = await PropertyMast.findAll({
      attributes: [
        'OwnerName',
        'OwnerNameMarathi',
        'NewWardNo',
        'NewPropertyNo',
        'NewPartitionNo',
        'OwnerID',
        'Address',
        'OwnerPatta',
        'PropertyTypeID',
        'BuildingOrShopName',
        'BuildingOrShopNameMarathi',
        'WadhGhatRemarkOne',
        'WadhGhatRemarkTwo',
      ],
      where: {
        NewWardNo: wardNo,
        [Op.and]: [
          sequelize.where(
            sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
            Op.gte,
            from
          ),
          sequelize.where(
            sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
            Op.lte,
            to
          ),
        ],
      },
      order: sequelize.literal('CAST(`NewPropertyNo` AS UNSIGNED) ASC'),
      logging: console.log,
    });

    console.log(`📢 Found property rows: ${ownerNameResults.length}`);
    console.log(
      '🆔 Owner List:',
      ownerNameResults.map((r) => `${r.OwnerID}(${r.NewPropertyNo})`)
    );

    if (ownerNameResults.length === 0) {
      return res.status(404).json({
        message: 'No properties found for this ward and range',
      });
    }

    const ownerIds = ownerNameResults.map((x) => x.OwnerID);
    const propertyTypeIds = ownerNameResults.map((x) => x.PropertyTypeID);

    // Additional lookups
    // const jointResults = await JoinOwnerDetails.findAll({
    //   attributes: ['isPrime', 'OwnerID'],
    //   where: { OwnerID: { [Op.in]: ownerIds } },
    // });
    const jointResults = await JoinOwnerDetails.findAll({
      attributes: ['isPrime', 'OwnerID'],
      where: {
        OwnerID: { [Op.in]: ownerIds },
        isPrime: 1,
      },
    });
    console.log(jointResults, 'jjjjjj');
    const roadWidthResults = await PropertySocialDetails.findAll({
      attributes: ['RoadWidth', 'OwnerID'],
      where: { OwnerID: { [Op.in]: ownerIds } },
    });

    const descriptionResults = await PropertyTypeMaster.findAll({
      attributes: ['PropertyDescription', 'PropertyTypeID'],
      where: { PropertyTypeID: { [Op.in]: propertyTypeIds } },
    });

    const commonRemarkResults = await PropertySocialDetails.findAll({
      attributes: [
        'DirectionNorth',
        'DirectionSouth',
        'DirectionEast',
        'DirectionWest',
        'OwnerID',
      ],
      where: { OwnerID: { [Op.in]: ownerIds } },
    });

    // Maps
    const isPrimeMap = Object.fromEntries(
      jointResults.map((r) => [r.OwnerID, r.isPrime])
    );

    console.log(isPrimeMap, 'ppppp');

    const roadWidthMap = Object.fromEntries(
      roadWidthResults.map((r) => [r.OwnerID, r.RoadWidth])
    );

    const descriptionMap = Object.fromEntries(
      descriptionResults.map((r) => [r.PropertyTypeID, r.PropertyDescription])
    );

    const commonRemarkMap = Object.fromEntries(
      commonRemarkResults.map((r) => [
        r.OwnerID,
        {
          DirectionNorth: r.DirectionNorth,
          DirectionSouth: r.DirectionSouth,
          DirectionEast: r.DirectionEast,
          DirectionWest: r.DirectionWest,
        },
      ])
    );

    // Merge
    const mergedResults = ownerNameResults
      .map((p) => ({
        OwnerName: p.OwnerName,
        OwnerNameMarathi: p.OwnerNameMarathi,
        NewWardNo: p.NewWardNo,
        NewPropertyNo: p.NewPropertyNo,
        NewPartitionNo: p.NewPartitionNo,
        OwnerID: p.OwnerID,
        Address: p.Address,
        OwnerPatta: p.OwnerPatta,
        isPrime: isPrimeMap[p.OwnerID] || null,
        RoadWidth: roadWidthMap[p.OwnerID] || null,
        PropertyDescription: descriptionMap[p.PropertyTypeID] || null,
        BuildingOrShopNameMarathi: p.BuildingOrShopNameMarathi,
        BuildingOrShopName: p.BuildingOrShopName,
        WadhGhatRemarkOne: p.WadhGhatRemarkOne,
        WadhGhatRemarkTwo: p.WadhGhatRemarkTwo,
        DirectionNorth: commonRemarkMap[p.OwnerID]?.DirectionNorth || null,
        DirectionSouth: commonRemarkMap[p.OwnerID]?.DirectionSouth || null,
        DirectionEast: commonRemarkMap[p.OwnerID]?.DirectionEast || null,
        DirectionWest: commonRemarkMap[p.OwnerID]?.DirectionWest || null,
      }))
      .filter(
        (result) =>
          result.isPrime === true &&
          result.NewPropertyNo >= from &&
          result.NewPropertyNo <= to
      );
    return res.status(200).json({
      message:
        'Property details for selected property range fetched successfully',
      mergedResults,
    });
  } catch (error) {
    console.error('Error fetching ownerNames:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateCombinedOwnerNames = async ({ ownerId }) => {
  try {
    if (!ownerId) {
      throw new Error('OwnerID is required');
    }

    const jointOwnerDetails = await JoinOwnerDetails.findAll({
      attributes: ['OwnerName', 'OwnerNameMarathi'],
      where: { OwnerID: ownerId },
    });

    if (jointOwnerDetails.length === 0) {
      return {
        success: false,
        message: `No data found in JoinOwnerDetails for OwnerID ${ownerId}`,
      };
    }

    const concatenatedOwnerName = jointOwnerDetails
      .map((row) => row.OwnerName)
      .filter(Boolean)
      .join(', ');

    const concatenatedOwnerNameMarathi = jointOwnerDetails
      .map((row) => row.OwnerNameMarathi)
      .filter(Boolean)
      .join(', ');

    await CombinedOwnerName.update(
      {
        OwnerName: concatenatedOwnerName,
        MarathiOwnerName: concatenatedOwnerNameMarathi,
      },
      { where: { OwnerID: ownerId } }
    );

    return {
      success: true,
      message: `CombinedOwnerName updated successfully for OwnerID ${ownerId}`,
      data: {
        OwnerID: ownerId,
        concatenatedOwnerName,
        concatenatedOwnerNameMarathi,
      },
    };
  } catch (error) {
    console.error('Error updating CombinedOwnerName:', error);
    return {
      success: false,
      message: 'An error occurred while updating CombinedOwnerName',
      error: error.message,
    };
  }
};

// export const postOwnerNameSameAs = async (req, res) => {
//   try {
//     // Destructure the fields from the request body
//     const {
//       ownerIDs,
//       ownerName,
//       ownerNameMarathi,
//       wardNo,
//       fromPropertyNo,
//       toPropertyNo,
//     } = req.body.requestData;

//     // Check if required fields are provided
//     if (
//       !wardNo ||
//       !fromPropertyNo ||
//       !toPropertyNo ||
//       !ownerIDs ||
//       !ownerName ||
//       !ownerNameMarathi
//     ) {
//       return res.status(400).json({
//         message:
//           'Required fields are missing: wardNo, fromPropertyNo, toPropertyNo, ownerIDs, ownerName, and ownerNameMarathi',
//       });
//     }

//     const from = parseInt(fromPropertyNo, 10);
//     const to = parseInt(toPropertyNo, 10);

//     // Fetch PropertyMast data within the specified range
//     const ownerNameResults = await PropertyMast.findAll({
//       attributes: [
//         'OwnerName',
//         'OwnerNameMarathi',
//         'NewWardNo',
//         'NewPropertyNo',
//         'OwnerID',
//       ],
//       where: {
//         NewWardNo: wardNo,
//         NewPropertyNo: {
//           [Op.between]: [from, to],
//         },
//       },
//     });

//     if (ownerNameResults.length === 0) {
//       return res.status(404).json({
//         message:
//           'No owner names found within the specified property number range',
//       });
//     }

//     const ownerIds = ownerNameResults.map((result) => result.OwnerID);

//     const jointResults = await JoinOwnerDetails.findAll({
//       attributes: ['isPrime', 'OwnerID'],
//       where: {
//         OwnerID: {
//           [Op.in]: ownerIds,
//         },
//         isPrime: { [Op.ne]: null },
//       },
//     });

//     const isPrimeMap = jointResults.reduce((acc, result) => {
//       acc[result.OwnerID] = result.isPrime;
//       return acc;
//     }, {});

//     const combinedOwnerList = [];

//     for (const property of ownerNameResults) {
//       const isPrime = isPrimeMap[property.OwnerID] || false;
//       const index = ownerIDs.indexOf(property.OwnerID);

//       if (index !== -1) {
//         try {
//           await Promise.all([
//             PropertyMast.update(
//               {
//                 OwnerName: ownerName,
//                 OwnerNameMarathi: ownerNameMarathi,
//               },
//               { where: { OwnerID: property.OwnerID } }
//             ),
//             JoinOwnerDetails.update(
//               {
//                 OwnerName: ownerName,
//                 OwnerNameMarathi: ownerNameMarathi,
//               },
//               { where: { OwnerID: property.OwnerID, isPrime: true } }
//             ),
//           ]);

//           // Inline logic to update CombinedOwnerName
//           const jointOwnerDetails = await JoinOwnerDetails.findAll({
//             attributes: ['OwnerName', 'OwnerNameMarathi'],
//             where: { OwnerID: property.OwnerID },
//           });

//           const concatenatedOwnerName = jointOwnerDetails
//             .map((row) => row.OwnerName)
//             .filter(Boolean)
//             .join(', ');

//           const concatenatedOwnerNameMarathi = jointOwnerDetails
//             .map((row) => row.OwnerNameMarathi)
//             .filter(Boolean)
//             .join(', ');

//           await CombinedOwnerName.update(
//             {
//               OwnerName: concatenatedOwnerName,
//               MarathiOwnerName: concatenatedOwnerNameMarathi,
//             },
//             { where: { OwnerID: property.OwnerID } }
//           );

//           combinedOwnerList.push({
//             OwnerID: property.OwnerID,
//             OwnerName: ownerName,
//             OwnerNameMarathi: ownerNameMarathi,
//             NewWardNo: property.NewWardNo,
//             NewPropertyNo: property.NewPropertyNo,
//             isPrime,
//             status: 'updated',
//           });
//         } catch (updateError) {
//           console.error(
//             `Error updating records for OwnerID ${property.OwnerID}:`,
//             updateError
//           );
//           return res.status(500).json({
//             message: `Error updating records for OwnerID ${property.OwnerID}`,
//             error: updateError.message,
//           });
//         }
//       } else {
//         combinedOwnerList.push({
//           OwnerID: property.OwnerID,
//           OwnerName: property.OwnerName,
//           OwnerNameMarathi: property.OwnerNameMarathi,
//           NewWardNo: property.NewWardNo,
//           NewPropertyNo: property.NewPropertyNo,
//           isPrime,
//           status: 'unchanged',
//         });
//       }
//     }

//     return res.status(200).json({
//       message: 'Owner names processed successfully.',
//       combinedOwnerList,
//     });
//   } catch (error) {
//     console.error('Error processing owner names:', error);
//     return res.status(500).json({
//       message: 'An error occurred while processing owner names',
//       error: error.message,
//     });
//   }
// };
export const postOwnerAddress = async (req, res) => {
  try {
    const { ownerIDs, Address, OwnerPatta, user } = req.body.requestData;

    // Validate Required Fields
    if (!ownerIDs || ownerIDs.length === 0 || !Address || !OwnerPatta) {
      return res.status(400).json({
        message: "Required fields are missing: ownerIDs, Address, OwnerPatta",
      });
    }

    // Fetch only selected records
    const selectedProperties = await PropertyMast.findAll({
      attributes: [
        'OwnerID',
        'Address',
        'OwnerPatta',
        'NewWardNo',
        'NewPropertyNo',
        'NewPartitionNo',
      ],
      where: {
        OwnerID: { [Op.in]: ownerIDs }
      }
    });

    const updatedList = [];

    for (const property of selectedProperties) {
      try {
        // Save Change History
        await PropertyDetailsChangeHistory.create({
          OwnerID: property.OwnerID,
          ChangeDate: new Date(),
          UserID: user.UserID,
          BeforeChange: JSON.stringify({
            Address: property.Address,
            OwnerPatta: property.OwnerPatta,
          }),
          AfterChange: JSON.stringify({
            Address,
            OwnerPatta,
          }),
          ScreenName: 'UpdateProperty Details',
          ChangeOn: 'Address',
          ChangeOnControl: 'AddressExisting',
          EntryType: 'Update',
        });

        // Update Address + OwnerPatta in both tables
        await Promise.all([
          PropertyMast.update(
            { Address, OwnerPatta },
            { where: { OwnerID: property.OwnerID } }
          ),
          JoinOwnerDetails.update(
            { Address, OwnerPatta },
            { where: { OwnerID: property.OwnerID, isPrime: true } }
          )
        ]);

        updatedList.push({
          OwnerID: property.OwnerID,
          NewWardNo: property.NewWardNo,
          NewPropertyNo: property.NewPropertyNo,
          NewPartitionNo: property.NewPartitionNo,
          Address,
          OwnerPatta,
          status: "updated"
        });

      } catch (err) {
        console.error("Error updating OwnerID:", property.OwnerID, err);
      }
    }

    return res.status(200).json({
      message: "Owner Address updated successfully!",
      combinedOwnerList: updatedList,
    });

  } catch (error) {
    console.error("Error updating owner address:", error);
    return res.status(500).json({
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

//s
// export const postOwnerAddress = async (req, res) => {
//   try {
//     const {
//       ownerIDs,
//       Address,
//       OwnerPatta,
//       wardNo,
//       fromPropertyNo,
//       toPropertyNo,
//       user,
//     } = req.body.requestData;

//     // Validate required fields
//     if (
//       !wardNo ||
//       !fromPropertyNo ||
//       !toPropertyNo ||
//       !ownerIDs ||
//       !OwnerPatta ||
//       !Address
//     ) {
//       return res.status(400).json({
//         message:
//           'Required fields are missing: wardNo, fromPropertyNo, toPropertyNo, ownerIDs, Address, and OwnerPatta',
//       });
//     }

//     const ownerNameResults = await PropertyMast.findAll({
//       attributes: [
//         [
//           sequelize.fn(
//             'TRIM',
//             sequelize.literal(
//               `TRAILING '-' FROM CONCAT_WS('-', NewPropertyNo, NewPartitionNo)`
//             )
//           ),
//           'prop',
//         ],
//         'Address',
//         'OwnerPatta',
//         'NewWardNo',
//         'NewPartitionNo',
//         'NewPropertyNo',
//         'OwnerID',
//       ],
//       where: {
//         NewWardNo: wardNo,
//         [Op.and]: [
//           sequelize.where(
//             sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
//             Op.gte,
//             fromPropertyNo
//           ),
//           sequelize.where(
//             sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
//             Op.lte,
//             toPropertyNo
//           ),
//         ],
//       },
//       order: sequelize.literal('NewPropertyNo + 1'),
//     });

//     if (ownerNameResults.length === 0) {
//       return res.status(404).json({
//         message: 'No properties found within the specified range.',
//       });
//     }
//     const combinedOwnerList = [];
//     for (const property of ownerNameResults) {
//       const isSelectedOwner = ownerIDs.includes(property.OwnerID);

//       if (isSelectedOwner) {
//         try {
//           // Save history for OwnerPatta
//           await PropertyDetailsChangeHistory.update(
//             {
//               OwnerID: property.OwnerID,
//               ChangeDate: new Date(),
//               UserID: user.UserID,
//               BeforeChange: JSON.stringify({
//                 OwnerPatta: property.OwnerPatta,
//               }),
//               AfterChange: JSON.stringify({ OwnerPatta: OwnerPatta }),
//               ScreenName: 'UpdateProperty Details',
//               ChangeOn: 'OwnerPatta',
//               ChangeOnControl: 'OwnerPattaExisting',
//               EntryType: 'Update',
//             },
//             { where: { OwnerID: property.OwnerID } }
//           );

//           // Save history for BuildingOrSocietyName
//           await PropertyDetailsChangeHistory.update(
//             {
//               OwnerID: property.OwnerID,
//               ChangeDate: new Date(),
//               UserID: user.UserID,
//               BeforeChange: JSON.stringify({
//                 Address: property.Address,
//               }),
//               AfterChange: JSON.stringify({ Address: Address }),
//               ScreenName: 'UpdateProperty Details',
//               ChangeOn: 'Address',
//               ChangeOnControl: 'AddressExisting',
//               EntryType: 'Update',
//             },
//             { where: { OwnerID: property.OwnerID } }
//           );
//           // Update only for selected OwnerIDs
//           await Promise.all([
//             PropertyMast.update(
//               {
//                 Address,
//                 OwnerPatta,
//               },
//               { where: { OwnerID: property.OwnerID } }
//             ),
//             JoinOwnerDetails.update(
//               {
//                 Address,
//                 OwnerPatta,
//               },
//               { where: { OwnerID: property.OwnerID, isPrime: true } }
//             ),
//           ]);
//           combinedOwnerList.push({
//             OwnerID: property.OwnerID,
//             Address,
//             OwnerPatta,
//             NewWardNo: property.NewWardNo,
//             NewPropertyNo: property.NewPropertyNo,
//             NewPartitionNo: property.NewPartitionNo,
//             status: 'updated',
//           });
//         } catch (updateError) {
//           console.error(
//             `Error updating records for OwnerID ${property.OwnerID}:`,
//             updateError
//           );
//           return res.status(500).json({
//             message: `Error updating records for OwnerID ${property.OwnerID}`,
//             error: updateError.message,
//           });
//         }
//       } else {
//         combinedOwnerList.push({
//           OwnerID: property.OwnerID,
//           Address: property.Address, // Keep original address
//           OwnerPatta: property.OwnerPatta, // Keep original OwnerPatta
//           NewWardNo: property.NewWardNo,
//           NewPropertyNo: property.NewPropertyNo,
//           NewPartitionNo: property.NewPartitionNo,
//           status: 'unchanged',
//         });
//       }
//     }
//     return res.status(200).json({
//       message: 'Owner Address processed successfully.',
//       combinedOwnerList,
//     });
//   } catch (error) {
//     console.error('Error processing owner names:', error);
//     return res.status(500).json({
//       message: 'An error occurred while processing owner names',
//       error: error.message,
//     });
//   }
// };
//s
export const postRoadWidth = async (req, res) => {
  try {
    const { ownerIDs, RoadWidth, user } = req.body.requestData;

    // Validate required fields
    if (!ownerIDs || ownerIDs.length === 0 || !RoadWidth) {
      return res.status(400).json({
        message: 'Required fields are missing: ownerIDs, RoadWidth.',
      });
    }

    // Fetch only selected properties by OwnerID
    const selectedProperties = await PropertyMast.findAll({
      attributes: [
        [
          sequelize.fn(
            'TRIM',
            sequelize.literal(
              `TRAILING '-' FROM CONCAT_WS('-', NewPropertyNo, NewPartitionNo)`
            )
          ),
          'prop',
        ],
        'NewWardNo',
        'NewPropertyNo',
        'NewPartitionNo',
        'OwnerID',
      ],
      where: {
        OwnerID: { [Op.in]: ownerIDs },
      },
      order: [['NewPropertyNo', 'ASC']],
    });

    const combinedResults = [];

    for (const property of selectedProperties) {
      try {
        // Save History
        await PropertyDetailsChangeHistory.create({
          OwnerID: property.OwnerID,
          ChangeDate: new Date(),
          UserID: user.UserID,
          BeforeChange: JSON.stringify({}),
          AfterChange: JSON.stringify({ RoadWidth }),
          ScreenName: 'UpdatePropertyDetails',
          ChangeOn: 'RoadWidth',
          ChangeOnControl: 'RoadWidthExisting',
          EntryType: 'Update',
        });

        // Update RoadWidth
        await PropertySocialDetails.update(
          { RoadWidth },
          { where: { OwnerId: property.OwnerID } }
        );

        combinedResults.push({
          NewWardNo: property.NewWardNo,
          NewPropertyNo: property.NewPropertyNo,
          NewPartitionNo: property.NewPartitionNo,
          OwnerID: property.OwnerID,
          RoadWidth,
          status: 'updated',
        });

      } catch (err) {
        console.error(`Error updating OwnerID: ${property.OwnerID}`, err);
      }
    }

    return res.status(200).json({
      message: 'Road Width updated successfully.',
      combinedResults,
    });

  } catch (error) {
    console.error('Error in updating RoadWidth:', error);
    return res.status(500).json({
      message: 'Something went wrong while processing RoadWidth.',
      error: error.message,
    });
  }
};
//s
// export const postRoadWidth = async (req, res) => {
//   try {
//     const { ownerIDs, RoadWidth, wardNo,  user } =
//       req.body.requestData;

//     if (
//       !wardNo ||
//       !fromPropertyNo ||
//       !toPropertyNo ||
//       !ownerIDs ||
//       !RoadWidth
//     ) {
//       return res.status(400).json({
//         message:
//           'Required fields are missing: wardNo, fromPropertyNo, toPropertyNo, ownerIDs, RoadWidth.',
//       });
//     }

//     const ownerNameResults = await PropertyMast.findAll({
//       attributes: [
//         [
//           sequelize.fn(
//             'TRIM',
//             sequelize.literal(
//               `TRAILING '-' FROM CONCAT_WS('-', NewPropertyNo, NewPartitionNo)`
//             )
//           ),
//           'prop',
//         ],
//         'NewWardNo',
//         'NewPropertyNo',
//         'NewPartitionNo',
//         'OwnerID',
//       ],
//       where: {
//         NewWardNo: wardNo,
//         [Op.and]: [
//           sequelize.where(
//             sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
//             Op.gte,
//             fromPropertyNo
//           ),
//           sequelize.where(
//             sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
//             Op.lte,
//             toPropertyNo
//           ),
//         ],
//       },
//       order: sequelize.literal('NewPropertyNo + 1'),
//     });

//     const ownerIds = ownerNameResults.map((result) => result.OwnerID);

//     // Fetch road width details from PropertySocialDetails
//     const socialResults = await PropertySocialDetails.findAll({
//       attributes: ['RoadWidth', 'OwnerID'],
//       where: {
//         OwnerID: {
//           [Op.in]: ownerIds,
//         },
//       },
//     });

//     const isRoadWidthMap = socialResults.reduce((acc, result) => {
//       acc[result.OwnerId] = result.RoadWidth;
//       return acc;
//     }, {});

//     const combinedResults = [];

//     for (const property of ownerNameResults) {
//       const currentRoadWidth = isRoadWidthMap[property.OwnerID] || 0;

//       if (ownerIDs.includes(property.OwnerID)) {
//         // Update RoadWidth for matched OwnerID
//         try {
//           // Save history for RoadWidth
//           await PropertyDetailsChangeHistory.update(
//             {
//               OwnerID: property.OwnerID,
//               ChangeDate: new Date(),
//               UserID: user.UserID,
//               BeforeChange: JSON.stringify({
//                 RoadWidth: property.RoadWidth,
//               }),
//               AfterChange: JSON.stringify({ RoadWidth: RoadWidth }),
//               ScreenName: 'UpdateProperty Details',
//               ChangeOn: 'RoadWidth',
//               ChangeOnControl: 'RoadWidthExisting',
//               EntryType: 'Update',
//             },
//             { where: { OwnerID: property.OwnerID } }
//           );

//           await PropertySocialDetails.update(
//             { RoadWidth },
//             { where: { OwnerId: property.OwnerID } }
//           );

//           combinedResults.push({
//             NewWardNo: property.NewWardNo,
//             NewPropertyNo: property.NewPropertyNo,
//             NewPartitionNo: property.NewPartitionNo,
//             OwnerID: property.OwnerID,
//             RoadWidth,
//             status: 'updated',
//           });
//         } catch (updateError) {
//           console.error(
//             `Error updating records for OwnerID ${property.OwnerID}:`,
//             updateError
//           );
//           return res.status(500).json({
//             message: `Error updating records for OwnerID ${property.OwnerID}`,
//             error: updateError.message,
//           });
//         }
//       } else {
//         combinedResults.push({
//           NewWardNo: property.NewWardNo,
//           NewPropertyNo: property.NewPropertyNo,
//           NewPartitionNo: property.NewPartitionNo,
//           OwnerID: property.OwnerID,
//           RoadWidth: currentRoadWidth,
//           status: 'unchanged',
//         });
//       }
//     }

//     return res.status(200).json({
//       message: 'Road width details processed successfully.',
//       combinedResults,
//     });
//   } catch (error) {
//     console.error('Error processing road width:', error);
//     return res.status(500).json({
//       message: 'An error occurred while processing road width',
//       error: error.message,
//     });
//   }
// };

//s

export const postPropertyDescriptionDetails = async (req, res) => {
  try {
    console.log(req.body, 'Request Data');
    const { requestData } = req.body;

    if (!requestData) {
      return res.status(400).json({ message: 'Request data is missing.' });
    }

    const {
      ownerIDs,
      PropertyTypeId,
      wardNo,
      fromPropertyNo,
      toPropertyNo,
      user,
    } = requestData;

    if (
      !wardNo ||
      !fromPropertyNo ||
      !toPropertyNo ||
      !Array.isArray(ownerIDs) ||
      !PropertyTypeId
    ) {
      return res.status(400).json({
        message:
          'Required fields are missing or invalid: wardNo, fromPropertyNo, toPropertyNo, ownerIDs, PropertyTypeId.',
      });
    }

    const ownerNameResults = await PropertyMast.findAll({
      attributes: [
        [
          sequelize.fn(
            'TRIM',
            sequelize.literal(
              `TRAILING '-' FROM CONCAT_WS('-', NewPropertyNo, NewPartitionNo)`
            )
          ),
          'prop',
        ],
        'NewWardNo',
        'NewPropertyNo',
        'NewPartitionNo',
        'OwnerID',
        'PropertyTypeID',
      ],
      where: {
        NewWardNo: wardNo,
        [Op.and]: [
          sequelize.where(
            sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
            Op.gte,
            fromPropertyNo
          ),
          sequelize.where(
            sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
            Op.lte,
            toPropertyNo
          ),
        ],
      },
      order: sequelize.literal('NewPropertyNo + 1'),
    });

    if (ownerNameResults.length === 0) {
      return res.status(404).json({
        message: 'No properties found for the given criteria.',
      });
    }

    // Fetch the PropertyDescription for the updated PropertyTypeID from PropertyTypeMaster
    const propertyType = await PropertyTypeMaster.findOne({
      attributes: ['PropertyTypeID', 'PropertyDescription'],
      where: {
        PropertyTypeID: PropertyTypeId,
      },
    });

    if (!propertyType) {
      return res.status(404).json({
        message: 'PropertyTypeID not found in PropertyTypeMaster.',
      });
    }

    const updatedDescription = propertyType.PropertyDescription;

    const combinedResults = [];

    // Loop through each property and update the PropertyTypeID only if the OwnerID is in ownerIDs
    for (const property of ownerNameResults) {
      const currentPropertyTypeID = property.PropertyTypeID;

      // For the records that need updating
      if (ownerIDs.includes(property.OwnerID)) {
        if (currentPropertyTypeID !== PropertyTypeId) {
          // Save history for PropertyTypeID change for those in the ownerIDs
          try {
            await PropertyDetailsChangeHistory.update(
              {
                OwnerID: property.OwnerID,
                ChangeDate: new Date(),
                UserID: user.UserID,
                BeforeChange: JSON.stringify({
                  PropertyTypeID: currentPropertyTypeID,
                }),
                AfterChange: JSON.stringify({
                  PropertyTypeID: PropertyTypeId,
                }),
                ScreenName: 'UpdateProperty Details',
                ChangeOn: 'PropertyTypeID',
                ChangeOnControl: 'PropertyTypeIDExisting',
                EntryType: 'Update',
              },
              { where: { OwnerID: property.OwnerID } }
            );

            // Update PropertyTypeID in PropertyMast for the given OwnerID
            await PropertyMast.update(
              {
                PropertyTypeID: PropertyTypeId,
                PropertyDescription: updatedDescription,
              },
              { where: { OwnerID: property.OwnerID } }
            );

            console.log(
              `Updated PropertyTypeID and PropertyDescription for OwnerID ${property.OwnerID}:`,
              updatedDescription
            );

            // Add to combinedResults with updated status
            combinedResults.push({
              NewWardNo: property.NewWardNo,
              NewPropertyNo: property.NewPropertyNo,
              NewPartitionNo: property.NewPartitionNo,
              OwnerID: property.OwnerID,
              PropertyTypeID: PropertyTypeId,
              PropertyDescription: updatedDescription,
              status: 'updated',
            });
          } catch (updateError) {
            console.error(
              `Error updating records for PropertyTypeID ${property.PropertyTypeID}:`,
              updateError
            );
            return res.status(500).json({
              message: `Error updating records for PropertyTypeID ${property.PropertyTypeID}.`,
              error: updateError.message,
            });
          }
        } else {
          // Fetch the current PropertyDescription for unchanged records
          const currentPropertyDescription = await PropertyTypeMaster.findOne({
            attributes: ['PropertyDescription'],
            where: {
              PropertyTypeID: currentPropertyTypeID,
            },
          });

          const description = currentPropertyDescription
            ? currentPropertyDescription.PropertyDescription
            : 'No Description Available';

          // Add to combinedResults with unchanged status
          combinedResults.push({
            NewWardNo: property.NewWardNo,
            NewPropertyNo: property.NewPropertyNo,
            NewPartitionNo: property.NewPartitionNo,
            OwnerID: property.OwnerID,
            PropertyTypeID: currentPropertyTypeID,
            PropertyDescription: description,
            status: 'unchanged',
          });
        }
      } else {
        const propertyTypeDescription = await PropertyTypeMaster.findOne({
          attributes: ['PropertyDescription'],
          where: {
            PropertyTypeID: currentPropertyTypeID,
          },
        });

        const description = propertyTypeDescription
          ? propertyTypeDescription.PropertyDescription
          : 'No Description Available';

        combinedResults.push({
          NewWardNo: property.NewWardNo,
          NewPropertyNo: property.NewPropertyNo,
          NewPartitionNo: property.NewPartitionNo,
          OwnerID: property.OwnerID,
          PropertyTypeID: currentPropertyTypeID,
          PropertyDescription: description,
          status: 'unchanged',
        });
      }
    }

    return res.status(200).json({
      message: 'Property description details processed successfully.',
      combinedResults,
    });
  } catch (error) {
    console.error('Error processing property description:', error);
    return res.status(500).json({
      message: 'An error occurred while processing property description.',
      error: error.message,
    });
  }
};

// export const postShopDetails = async (req, res) => {
//   try {
//     const {
//       ownerIDs,
//       BuildingOrShopNameMarathi,
//       BuildingOrSocietyName,

//       wardNo,
//       fromPropertyNo,
//       toPropertyNo,
//     } = req.body.requestData;

//     if (
//       !wardNo ||
//       !fromPropertyNo ||
//       !toPropertyNo ||
//       !ownerIDs ||
//       !BuildingOrShopNameMarathi ||
//       !BuildingOrSocietyName
//     ) {
//       return res.status(400).json({
//         message:
//           'Required fields are missing: wardNo, fromPropertyNo, toPropertyNo, ownerIDs , BuildingOrShopNameMarathi, BuildingOrSocietyName',
//       });
//     }

//     const ownerNameResults = await PropertyMast.findAll({
//       attributes: [
//         [
//           sequelize.fn(
//             'TRIM',
//             sequelize.literal(
//               `TRAILING '-' FROM CONCAT_WS('-', NewPropertyNo, NewPartitionNo)`
//             )
//           ),
//           'prop',
//         ],
//         'NewWardNo',
//         'NewPropertyNo',
//         'NewPartitionNo',
//         'OwnerID',
//         'BuildingOrShopNameMarathi',
//         'BuildingOrSocietyName',
//       ],
//       where: {
//         NewWardNo: wardNo,
//         [Op.and]: [
//           sequelize.where(
//             sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
//             Op.gte,
//             fromPropertyNo
//           ),
//           sequelize.where(
//             sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
//             Op.lte,
//             toPropertyNo
//           ),
//         ],
//       },
//       order: sequelize.literal('NewPropertyNo + 1'),
//     });
//     const ownerIds = ownerNameResults.map((result) => result.OwnerID);
//     const combinedResults = [];

//     for (const property of ownerNameResults) {
//       if (ownerIDs.includes(property.OwnerID)) {
//         // Update RoadWidth for matched OwnerID
//         try {
//           // Save history for BuildingOrSocietyName
//           await PropertyDetailsChangeHistory.create({
//             OwnerID: property.OwnerID,
//             ChangeDate: new Date(),
//           UserID: user.UserID,
//             BeforeChange: JSON.stringify({
//               BuildingOrSocietyName: property.BuildingOrSocietyName,
//             }),
//             AfterChange: JSON.stringify({
//               BuildingOrSocietyName: BuildingOrSocietyName,
//             }),
//             ScreenName: 'UpdateProperty Details',
//             ChangeOn: 'BuildingOrSocietyName',
//             ChangeOnControl: 'BuildingOrSocietyNameExisting',
//             EntryType: 'Update',
//           });

//           // Save history for BuildingOrShopNameMarathi
//           await PropertyDetailsChangeHistory.create({
//             OwnerID: property.OwnerID,
//             ChangeDate: new Date(),
//           UserID: user.UserID,
//             BeforeChange: JSON.stringify({
//               BuildingOrShopNameMarathi:
//                 property.BuildingOrShopNameMarathi,
//             }),
//             AfterChange: JSON.stringify({
//               BuildingOrShopNameMarathi: BuildingOrShopNameMarathi,
//             }),
//             ScreenName: 'UpdateProperty Details',
//             ChangeOn: 'BuildingOrShopNameMarathi',
//             ChangeOnControl: 'ExistingShopName',
//             EntryType: 'Update',
//           });

//           await PropertyMast.update(
//             { BuildingOrShopNameMarathi, BuildingOrSocietyName },
//             { where: { OwnerID: property.OwnerID } }
//           );

//           combinedResults.push({
//             NewWardNo: property.NewWardNo,
//             NewPropertyNo: property.NewPropertyNo,
//             NewPartitionNo: property.NewPartitionNo,
//             OwnerID: property.OwnerID,
//             BuildingOrShopNameMarathi,
//             BuildingOrSocietyName,
//             status: 'updated',
//           });
//         } catch (updateError) {
//           console.error(
//             `Error updating records for OwnerID ${property.OwnerID}:`,
//             updateError
//           );
//           return res.status(500).json({
//             message: `Error updating records for OwnerID ${property.OwnerID}`,
//             error: updateError.message,
//           });
//         }
//       } else {
//         combinedResults.push({
//           NewWardNo: property.NewWardNo,
//           NewPropertyNo: property.NewPropertyNo,
//           NewPartitionNo: property.NewPartitionNo,
//           OwnerID: property.OwnerID,
//           BuildingOrShopNameMarathi: property.BuildingOrShopNameMarathi,
//           BuildingOrSocietyName: property.BuildingOrSocietyName,
//           status: 'unchanged',
//         });
//       }
//     }

//     return res.status(200).json({
//       message: 'Shop Name and Shop Name Marathi processed successfully.',
//       combinedResults,
//     });
//   } catch (error) {
//     console.error('Error processing shop names:', error);
//     return res.status(500).json({
//       message: 'An error occurred while processing shop names',
//       error: error.message,
//     });
//   }
// };
export const postShopDetails = async (req, res) => {
  try {
    const {
      ownerIDs,
      BuildingOrShopName,
      BuildingOrShopNameMarathi,
      wardNo,
      fromPropertyNo,
      toPropertyNo,
      user,
    } = req.body.requestData;

    // -------------------- VALIDATION --------------------
    if (
      !wardNo ||
      !fromPropertyNo ||
      !toPropertyNo ||
      !ownerIDs ||
      !BuildingOrShopName ||
      !BuildingOrShopNameMarathi
    ) {
      return res.status(400).json({
        message:
          'Required fields are missing: wardNo, fromPropertyNo, toPropertyNo, ownerIDs,  BuildingOrShopName, BuildingOrShopNameMarathi',
      });
    }

    // -------------------- FETCH PROPERTIES --------------------
    const ownerNameResults = await PropertyMast.findAll({
      attributes: [
        [
          sequelize.fn(
            'TRIM',
            sequelize.literal(
              "TRAILING '-' FROM CONCAT_WS('-', NewPropertyNo, NewPartitionNo)"
            )
          ),
          'prop',
        ],
        'NewWardNo',
        'NewPropertyNo',
        'NewPartitionNo',
        'OwnerID',
        'BuildingOrShopName',
        'BuildingOrShopNameMarathi',
      ],
      where: {
        NewWardNo: wardNo,
        [Op.and]: [
          sequelize.where(
            sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
            Op.gte,
            fromPropertyNo
          ),
          sequelize.where(
            sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
            Op.lte,
            toPropertyNo
          ),
        ],
      },
      order: sequelize.literal('NewPropertyNo + 1'),
    });

    const combinedResults = [];

    // -------------------- UPDATE LOGIC --------------------
    for (const property of ownerNameResults) {
      if (ownerIDs.includes(property.OwnerID)) {
        try {
          // SAVE HISTORY - BuildingOrShopName
          await PropertyDetailsChangeHistory.update(
            {
              OwnerID: property.OwnerID,
              ChangeDate: new Date(),
              UserID: user.UserID,
              BeforeChange: JSON.stringify({
                BuildingOrShopName: property.BuildingOrShopName,
              }),
              AfterChange: JSON.stringify({
                BuildingOrShopName,
              }),
              ScreenName: 'UpdateProperty Details',
              ChangeOn: 'BuildingOrShopName',
              ChangeOnControl: 'BuildingOrShopNameExisting',
              EntryType: 'Update',
            },
            { where: { OwnerID: property.OwnerID } }
          );

          // SAVE HISTORY - BuildingOrShopNameMarathi
          await PropertyDetailsChangeHistory.update(
            {
              OwnerID: property.OwnerID,
              ChangeDate: new Date(),
              UserID: user.UserID,
              BeforeChange: JSON.stringify({
                BuildingOrShopNameMarathi: property.BuildingOrShopNameMarathi,
              }),
              AfterChange: JSON.stringify({
                BuildingOrShopNameMarathi,
              }),
              ScreenName: 'UpdateProperty Details',
              ChangeOn: 'BuildingOrShopNameMarathi',
              ChangeOnControl: 'ExistingShopNameMarathi',
              EntryType: 'Update',
            },
            { where: { OwnerID: property.OwnerID } }
          );

          // SAVE HISTORY - BuildingOrShopName
          await PropertyDetailsChangeHistory.update(
            {
              OwnerID: property.OwnerID,
              ChangeDate: new Date(),
              UserID: user.UserID,
              BeforeChange: JSON.stringify({
                BuildingOrShopName: property.BuildingOrShopName,
              }),
              AfterChange: JSON.stringify({
                BuildingOrShopName,
              }),
              ScreenName: 'UpdateProperty Details',
              ChangeOn: 'BuildingOrShopName',
              ChangeOnControl: 'BuildingOrShopNameExisting',
              EntryType: 'Update',
            },
            { where: { OwnerID: property.OwnerID } }
          );

          // SAVE HISTORY - BuildingOrShopNameMarathi
          await PropertyDetailsChangeHistory.update(
            {
              OwnerID: property.OwnerID,
              ChangeDate: new Date(),
              UserID: user.UserID,
              BeforeChange: JSON.stringify({
                BuildingOrShopNameMarathi: property.BuildingOrShopNameMarathi,
              }),
              AfterChange: JSON.stringify({
                BuildingOrShopNameMarathi,
              }),
              ScreenName: 'UpdateProperty Details',
              ChangeOn: 'BuildingOrShopNameMarathi',
              ChangeOnControl: 'ExistingShopNameMarathi',
              EntryType: 'Update',
            },
            { where: { OwnerID: property.OwnerID } }
          );

          // ---- UPDATE PropertyMast ----
          await PropertyMast.update(
            {
              BuildingOrShopName,
              BuildingOrShopNameMarathi,
            },
            { where: { OwnerID: property.OwnerID } }
          );

          // PUSH UPDATED DATA
          combinedResults.push({
            NewWardNo: property.NewWardNo,
            NewPropertyNo: property.NewPropertyNo,
            NewPartitionNo: property.NewPartitionNo,
            OwnerID: property.OwnerID,

            BuildingOrShopName,
            BuildingOrShopNameMarathi,
            status: 'updated',
          });
        } catch (updateError) {
          return res.status(500).json({
            message: `Error updating records for OwnerID ${property.OwnerID}`,
            error: updateError.message,
          });
        }
      } else {
        // -------------------- UNCHANGED LIST --------------------
        combinedResults.push({
          NewWardNo: property.NewWardNo,
          NewPropertyNo: property.NewPropertyNo,
          NewPartitionNo: property.NewPartitionNo,
          OwnerID: property.OwnerID,

          BuildingOrShopName: property.BuildingOrShopName,
          BuildingOrShopNameMarathi: property.BuildingOrShopNameMarathi,
          status: 'unchanged',
        });
      }
    }

    return res.status(200).json({
      message: 'Shop Names updated successfully.',
      combinedResults,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'An error occurred while processing shop names',
      error: error.message,
    });
  }
};

export const postCommonRemark = async (req, res) => {
  try {
    const {
      ownerIDs,
      DirectionNorth,
      DirectionSouth,
      DirectionEast,
      DirectionWest,
      wardNo,
      fromPropertyNo,
      toPropertyNo,
      user,
    } = req.body.requestData;

    if (!wardNo || !fromPropertyNo || !toPropertyNo || !ownerIDs) {
      return res.status(400).json({
        message:
          'Required fields are missing: wardNo, fromPropertyNo, toPropertyNo, ownerIDs',
      });
    }

    // Check if at least one directional field is provided
    if (
      DirectionNorth === undefined &&
      DirectionSouth === undefined &&
      DirectionEast === undefined &&
      DirectionWest === undefined
    ) {
      return res.status(400).json({
        message:
          'At least one directional field (DirectionNorth, DirectionSouth, DirectionEast, DirectionWest) must be provided.',
      });
    }

    const from = parseInt(fromPropertyNo, 10);
    const to = parseInt(toPropertyNo, 10);

    const ownerNameResults = await PropertyMast.findAll({
      attributes: [
        [
          sequelize.fn(
            'TRIM',
            sequelize.literal(
              `TRAILING '-' FROM CONCAT_WS('-', NewPropertyNo, NewPartitionNo)`
            )
          ),
          'prop',
        ],
        'NewWardNo',
        'NewPropertyNo',
        'NewPartitionNo',
        'OwnerID',
      ],
      where: {
        NewWardNo: wardNo,
        [Op.and]: [
          sequelize.where(
            sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
            Op.gte,
            fromPropertyNo
          ),
          sequelize.where(
            sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
            Op.lte,
            toPropertyNo
          ),
        ],
      },
      order: sequelize.literal('NewPropertyNo + 1'),
    });
    const ownerIds = ownerNameResults.map((result) => result.OwnerID);

    // Fetch directional details from PropertySocialDetails
    const socialResults = await PropertySocialDetails.findAll({
      attributes: [
        'DirectionNorth',
        'DirectionSouth',
        'DirectionEast',
        'DirectionWest',
        'OwnerID',
      ],
      where: {
        OwnerID: {
          [Op.in]: ownerIds,
        },
      },
    });

    // Map the directional details by OwnerId
    const isCommonRemarkMap = socialResults.reduce((acc, result) => {
      acc[result.OwnerId] = {
        DirectionNorth: result.DirectionNorth,
        DirectionSouth: result.DirectionSouth,
        DirectionEast: result.DirectionEast,
        DirectionWest: result.DirectionWest,
      };
      return acc;
    }, {});

    const combinedResults = [];

    for (const property of ownerNameResults) {
      if (ownerIDs.includes(property.OwnerID)) {
        // Build the fields to update dynamically
        const updateData = {};
        if (DirectionNorth !== undefined)
          updateData.DirectionNorth = DirectionNorth;
        if (DirectionSouth !== undefined)
          updateData.DirectionSouth = DirectionSouth;
        if (DirectionEast !== undefined)
          updateData.DirectionEast = DirectionEast;
        if (DirectionWest !== undefined)
          updateData.DirectionWest = DirectionWest;

        try {
          // Save history for DirectionNorth
          await PropertyDetailsChangeHistory.update(
            {
              OwnerID: property.OwnerID,
              ChangeDate: new Date(),
              UserID: user.UserID,
              BeforeChange: JSON.stringify({
                DirectionNorth: property.DirectionNorth,
              }),
              AfterChange: JSON.stringify({ DirectionNorth: DirectionNorth }),
              ScreenName: 'UpdateProperty Details',
              ChangeOn: 'DirectionNorth',
              ChangeOnControl: 'DirectionNorthExisting',
              EntryType: 'Update',
            },
            { where: { OwnerID: property.OwnerID } }
          );

          // Save history for DirectionSouth
          await PropertyDetailsChangeHistory.update(
            {
              OwnerID: property.OwnerID,
              ChangeDate: new Date(),
              UserID: user.UserID,
              BeforeChange: JSON.stringify({
                DirectionSouth: property.DirectionSouth,
              }),
              AfterChange: JSON.stringify({ DirectionSouth: DirectionSouth }),
              ScreenName: 'UpdateProperty Details',
              ChangeOn: 'DirectionSouth',
              ChangeOnControl: 'DirectionSouthExisting',
              EntryType: 'Update',
            },
            { where: { OwnerID: property.OwnerID } }
          );

          // Save history for DirectionEast
          await PropertyDetailsChangeHistory.update(
            {
              OwnerID: property.OwnerID,
              ChangeDate: new Date(),
              UserID: user.UserID,
              BeforeChange: JSON.stringify({
                DirectionEast: property.DirectionEast,
              }),
              AfterChange: JSON.stringify({ DirectionEast: DirectionEast }),
              ScreenName: 'UpdateProperty Details',
              ChangeOn: 'DirectionEast',
              ChangeOnControl: 'DirectionEastExisting',
              EntryType: 'Update',
            },
            { where: { OwnerID: property.OwnerID } }
          );

          // Save history for DirectionWest
          await PropertyDetailsChangeHistory.update(
            {
              OwnerID: property.OwnerID,
              ChangeDate: new Date(),
              UserID: user.UserID,
              BeforeChange: JSON.stringify({
                DirectionWest: property.DirectionWest,
              }),
              AfterChange: JSON.stringify({ DirectionWest: DirectionWest }),
              ScreenName: 'UpdateProperty Details',
              ChangeOn: 'DirectionWest',
              ChangeOnControl: 'DirectionWestExisting',
              EntryType: 'Update',
            },
            { where: { OwnerID: property.OwnerID } }
          );
          await PropertySocialDetails.update(updateData, {
            where: { OwnerId: property.OwnerID },
          });

          combinedResults.push({
            NewWardNo: property.NewWardNo,
            NewPropertyNo: property.NewPropertyNo,
            NewPartitionNo: property.NewPartitionNo,
            OwnerID: property.OwnerID,
            ...updateData,
            status: 'updated',
          });
        } catch (updateError) {
          console.error(
            `Error updating records for OwnerID ${property.OwnerID}:`,
            updateError
          );
          return res.status(500).json({
            message: `Error updating records for OwnerID ${property.OwnerID}`,
            error: updateError.message,
          });
        }
      } else {
        const directionalData = isCommonRemarkMap[property.OwnerID] || {
          DirectionNorth: null,
          DirectionSouth: null,
          DirectionEast: null,
          DirectionWest: null,
        };

        combinedResults.push({
          NewWardNo: property.NewWardNo,
          NewPropertyNo: property.NewPropertyNo,
          NewPartitionNo: property.NewPartitionNo,
          OwnerId: property.OwnerID,
          ...directionalData,
          status: 'unchanged',
        });
      }
    }

    return res.status(200).json({
      message: 'Common remark processed successfully.',
      combinedResults,
    });
  } catch (error) {
    console.error('Error processing Common remark:', error);
    return res.status(500).json({
      message: 'An error occurred while processing Common remark',
      error: error.message,
    });
  }
};

export const postWadhGhatRemark = async (req, res) => {
  try {
    const {
      ownerIDs,
      WadhGhatRemarkOne,
      WadhGhatRemarkTwo,
      wardNo,
      fromPropertyNo,
      toPropertyNo,
      user,
    } = req.body.requestData;

    // Validate required fields
    if (!wardNo || !fromPropertyNo || !toPropertyNo || !ownerIDs) {
      return res.status(400).json({
        message:
          'Required fields are missing: wardNo, fromPropertyNo, toPropertyNo, ownerIDs',
      });
    }

    // Ensure at least one of the remarks is provided
    if (WadhGhatRemarkOne === undefined && WadhGhatRemarkTwo === undefined) {
      return res.status(400).json({
        message:
          'At least one of WadhGhatRemarkOne or WadhGhatRemarkTwo must be provided.',
      });
    }

    const ownerNameResults = await PropertyMast.findAll({
      attributes: [
        [
          sequelize.fn(
            'TRIM',
            sequelize.literal(
              `TRAILING '-' FROM CONCAT_WS('-', NewPropertyNo, NewPartitionNo)`
            )
          ),
          'prop',
        ],
        'NewWardNo',
        'NewPropertyNo',
        'NewPartitionNo',
        'OwnerID',
        'WadhGhatRemarkOne',
        'WadhGhatRemarkTwo',
      ],
      where: {
        NewWardNo: wardNo,
        [Op.and]: [
          sequelize.where(
            sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
            Op.gte,
            fromPropertyNo
          ),
          sequelize.where(
            sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
            Op.lte,
            toPropertyNo
          ),
        ],
      },
      order: sequelize.literal('NewPropertyNo + 1'),
    });

    const combinedResults = [];

    for (const property of ownerNameResults) {
      if (ownerIDs.includes(property.OwnerID)) {
        // Build dynamic update data
        const updateData = {};
        if (WadhGhatRemarkOne !== undefined) {
          updateData.WadhGhatRemarkOne = WadhGhatRemarkOne;
        }
        if (WadhGhatRemarkTwo !== undefined) {
          updateData.WadhGhatRemarkTwo = WadhGhatRemarkTwo;
        }

        try {
          // Save history for WadhGhatRemarkOne
          await PropertyDetailsChangeHistory.update(
            {
              OwnerID: property.OwnerID,
              ChangeDate: new Date(),
              UserID: user.UserID,
              BeforeChange: JSON.stringify({
                WadhGhatRemarkOne: property.WadhGhatRemarkOne,
              }),
              AfterChange: JSON.stringify({
                WadhGhatRemarkOne: WadhGhatRemarkOne,
              }),
              ScreenName: 'UpdateProperty Details',
              ChangeOn: 'WadhGhatRemarkOne',
              ChangeOnControl: 'WadhGhatRemarkOneExisting',
              EntryType: 'Update',
            },
            { where: { OwnerID: property.OwnerID } }
          );

          // Save history for WadhGhatRemarkTwo
          await PropertyDetailsChangeHistory.update(
            {
              OwnerID: property.OwnerID,
              ChangeDate: new Date(),
              UserID: user.UserID,
              BeforeChange: JSON.stringify({
                WadhGhatRemarkTwo: property.WadhGhatRemarkTwo,
              }),
              AfterChange: JSON.stringify({
                WadhGhatRemarkTwo: WadhGhatRemarkTwo,
              }),
              ScreenName: 'UpdateProperty Details',
              ChangeOn: 'WadhGhatRemarkTwo',
              ChangeOnControl: 'WadhGhatRemarkTwoExisting',
              EntryType: 'Update',
            },
            { where: { OwnerID: property.OwnerID } }
          );
          // Update only the provided fields
          await PropertyMast.update(updateData, {
            where: { OwnerID: property.OwnerID },
          });

          combinedResults.push({
            NewWardNo: property.NewWardNo,
            NewPropertyNo: property.NewPropertyNo,
            NewPartitionNo: property.NewPartitionNo,
            OwnerID: property.OwnerID,
            ...updateData,
            status: 'updated',
          });
        } catch (updateError) {
          console.error(
            `Error updating records for OwnerID ${property.OwnerID}:`,
            updateError
          );
          return res.status(500).json({
            message: `Error updating records for OwnerID ${property.OwnerID}`,
            error: updateError.message,
          });
        }
      } else {
        combinedResults.push({
          NewWardNo: property.NewWardNo,
          NewPropertyNo: property.NewPropertyNo,
          NewPartitionNo: property.NewPartitionNo,
          OwnerID: property.OwnerID,
          WadhGhatRemarkOne: property.WadhGhatRemarkOne,
          WadhGhatRemarkTwo: property.WadhGhatRemarkTwo,
          status: 'unchanged',
        });
      }
    }

    return res.status(200).json({
      message: 'Property WadhGhat remark processed successfully.',
      combinedResults,
    });
  } catch (error) {
    console.error('Error processing Property WadhGhat remark:', error);
    return res.status(500).json({
      message: 'An error occurred while processing Property WadhGhat remark',
      error: error.message,
    });
  }
};

export const postOwnerNameSameAs = async (req, res) => {
  try {
    const {
      ownerIDs,
      ownerName,
      ownerNameMarathi,
      wardNo,
      fromPropertyNo,
      toPropertyNo,
      user,
    } = req.body.requestData;

    if (
      !wardNo ||
      !fromPropertyNo ||
      !toPropertyNo ||
      !ownerIDs ||
      !ownerName ||
      !ownerNameMarathi
    ) {
      return res.status(400).json({
        message:
          'Required fields are missing: wardNo, fromPropertyNo, toPropertyNo, ownerIDs, ownerName, ownerNameMarathi',
      });
    }

    const from = parseInt(fromPropertyNo, 10);
    const to = parseInt(toPropertyNo, 10);
    console.log(
      'Fetching PropertyMast with wardNo:',
      wardNo,
      'PropertyNo Range:',
      from,
      to
    );

    const ownerNameResults = await PropertyMast.findAll({
      attributes: [
        [
          sequelize.fn(
            'TRIM',
            sequelize.literal(
              `TRAILING '-' FROM CONCAT_WS('-', NewPropertyNo, NewPartitionNo)`
            )
          ),
          'prop',
        ],
        'OwnerName',
        'OwnerNameMarathi',
        'NewWardNo',
        'NewPropertyNo',
        'NewPartitionNo',
        'OwnerID',
      ],
      where: {
        NewWardNo: wardNo,
        [Op.and]: [
          sequelize.where(
            sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
            Op.gte,
            fromPropertyNo
          ),
          sequelize.where(
            sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
            Op.lte,
            toPropertyNo
          ),
        ],
      },
      order: sequelize.literal('NewPropertyNo + 1'),
    });

    console.log(
      'Filtered PropertyMast Results:',
      JSON.stringify(ownerNameResults, null, 2)
    );

    if (ownerNameResults.length === 0) {
      return res.status(404).json({
        message:
          'No owner names found within the specified property number range',
      });
    }

    const ownerIds = ownerNameResults.map((result) => result.OwnerID);
    console.log('OwnerIDsnnnnnnnnn:', ownerIds);

    const jointResults = await JoinOwnerDetails.findAll({
      attributes: ['isPrime', 'OwnerID'],
      where: { OwnerID: { [Op.in]: ownerIds } },
    });

    const isPrimeMap = jointResults.reduce((acc, result) => {
      acc[result.OwnerID] = result.isPrime;
      return acc;
    }, {});

    const combinedOwnerList = [];
    const updateErrors = [];

    for (const property of ownerNameResults) {
      const isPrime = isPrimeMap[property.OwnerID] || false;
      const shouldUpdate = isPrime && ownerIDs.includes(property.OwnerID);

      try {
        if (shouldUpdate) {
          // Save history for OwnerName
          await PropertyDetailsChangeHistory.create(
            {
              ChangeDate: new Date(),
              UserID: user.UserID,
              BeforeChange: JSON.stringify({ OwnerName: property.OwnerName }),
              AfterChange: JSON.stringify({ OwnerName: ownerName }),
              ScreenName: 'Update Property Details',
              ChangeOn: 'OwnerName',
              ChangeOnControl: 'OwnerNameExisting',
              EntryType: 'Update',
            },
            { where: { OwnerID: property.OwnerID } }
          );

          // Save history for OwnerNameMarathi
          await PropertyDetailsChangeHistory.update(
            {
              OwnerID: property.OwnerID,
              ChangeDate: new Date(),
              UserID: user.UserID,
              BeforeChange: JSON.stringify({
                OwnerNameMarathi: property.OwnerNameMarathi,
              }),
              AfterChange: JSON.stringify({
                OwnerNameMarathi: ownerNameMarathi,
              }),
              ScreenName: 'Update Property Details',
              ChangeOn: 'OwnerNameMarathi',
              ChangeOnControl: 'OwnerNameMarathiExisting',
              EntryType: 'Update',
            },
            { where: { OwnerID: property.OwnerID } }
          );

          // Update PropertyMast and JoinOwnerDetails
          await Promise.all([
            PropertyMast.update(
              { OwnerName: ownerName, OwnerNameMarathi: ownerNameMarathi },
              { where: { OwnerID: property.OwnerID } }
            ),
            JoinOwnerDetails.update(
              { OwnerName: ownerName, OwnerNameMarathi: ownerNameMarathi },
              { where: { OwnerID: property.OwnerID, isPrime: true } }
            ),
          ]);

          // Inline logic to update CombinedOwnerName
          const jointOwnerDetails = await JoinOwnerDetails.findAll({
            attributes: ['OwnerName', 'OwnerNameMarathi'],
            where: { OwnerID: property.OwnerID },
          });

          const concatenatedOwnerName = jointOwnerDetails
            .map((row) => row.OwnerName)
            .filter(Boolean)
            .join(', ');
          const concatenatedOwnerNameMarathi = jointOwnerDetails
            .map((row) => row.OwnerNameMarathi)
            .filter(Boolean)
            .join(', ');

          await CombinedOwnerName.update(
            {
              OwnerName: concatenatedOwnerName,
              MarathiOwnerName: concatenatedOwnerNameMarathi,
            },
            { where: { OwnerID: property.OwnerID } }
          );

          combinedOwnerList.push({
            OwnerID: property.OwnerID,
            OwnerName: ownerName,
            OwnerNameMarathi: ownerNameMarathi,
            NewWardNo: property.NewWardNo,
            NewPropertyNo: property.NewPropertyNo,
            NewPartitionNo: property.NewPartitionNo,
            isPrime,
            status: 'updated',
          });
        } else {
          combinedOwnerList.push({
            OwnerID: property.OwnerID,
            OwnerName: property.OwnerName,
            OwnerNameMarathi: property.OwnerNameMarathi,
            NewWardNo: property.NewWardNo,
            NewPropertyNo: property.NewPropertyNo,
            NewPartitionNo: property.NewPartitionNo,
            isPrime,
            status: 'unchanged',
          });
        }
      } catch (updateError) {
        console.error(
          `Error updating records for OwnerID ${property.OwnerID}:`,
          updateError
        );
        updateErrors.push({
          OwnerID: property.OwnerID,
          error: updateError.message,
        });
      }
    }

    return res.status(200).json({
      message: 'Owner names processed successfully.',
      combinedOwnerList,
      errors: updateErrors.length > 0 ? updateErrors : null,
    });
  } catch (error) {
    console.error('Error processing owner names:', error);
    return res.status(500).json({
      message: 'An error occurred while processing owner names',
      error: error.message,
    });
  }
};
