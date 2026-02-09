import { Op, QueryTypes } from "sequelize";
import PropertyMast from "../../models/models/propertymast.js";
import PropertySocialDetails from "../../models/models/propertysocialdetails.js";
import PropertyDetailsOld from "../../models/models/propertydetailsold.js";
import PropertyDetailsNew from "../../models/models/propertydetailsnew.js";
import ConstructionTypeMaster from "../../models/models/constructiontypemaster.js";
import FloorMaster from "../../models/models/floormaster.js";
import TypeofUseMaster from "../../models/models/typeofusemaster.js";
import CombinedOwnerName from "../../models/models/combinedownerrenternames.js";
import JoinOwnerDetails from "../../models/models/jointownerdetails.js";
import sequelize from "../../config/connectionDB.js";


// export const saveAutoWard = async (req, res) => {
//   const { NewWardNo, PropertyRange } = req.body;

//   try {
//     // ----------------------
//     // ✅ Input Validation
//     // ----------------------
//     if (
//       !NewWardNo || !Number.isInteger(NewWardNo) || NewWardNo <= 0 ||
//       !Array.isArray(PropertyRange) || PropertyRange.some(p => !Number.isInteger(p) || p <= 0)
//     ) {
//       return res.status(400).json({
//         message: "All fields must be integers and greater than zero.",
//       });
//     }

//     const uniquePropertyRange = Array.from(new Set(PropertyRange));

//     // ----------------------
//     // ✅ Check existing properties
//     // ----------------------
//     const existing = await PropertyMast.findAll({
//       where: { NewWardNo, NewPropertyNo: uniquePropertyRange },
//       attributes: ["NewPropertyNo", "OwnerID"],
//     });

//     const existingSet = new Set(existing.map(p => p.NewPropertyNo));
//     const createdRecords = [];
//     const skippedProperties = [];

//     // ----------------------
//     // ✅ Fetch default master values
//     // ----------------------
//     const defaultFloor = await FloorMaster.findOne({ order: [['FloorID', 'ASC']] });
//     const defaultConstruction = await ConstructionTypeMaster.findOne({ order: [['ConstructionId', 'ASC']] });
//     const defaultTypeOfUse = await TypeofUseMaster.findOne({ order: [['TypeOfUseID', 'ASC']] });

//     if (!defaultFloor || !defaultConstruction || !defaultTypeOfUse) {
//       return res.status(500).json({
//         message: "Master data missing. Please check FloorMaster, ConstructionTypeMaster, or TypeOfUseMaster.",
//       });
//     }

//     const FloorID = defaultFloor.FloorID;
//     const ConstructionType = defaultConstruction.ConstructionId;
//     const TypeOFUse = defaultTypeOfUse.TypeOfUseID;

//     // ----------------------
//     // ✅ CREATE NEW PROPERTIES
//     // ----------------------
//     for (let propertyNo of uniquePropertyRange) {
//       if (existingSet.has(propertyNo)) {
//         skippedProperties.push(propertyNo);
//         continue;
//       }

//       const [record, created] = await PropertyMast.findOrCreate({
//         where: { NewWardNo, NewPropertyNo: propertyNo },
//         defaults: {
//           NewWardNo,
//           NewPropertyNo: propertyNo,

//           // ---------- DEFAULT OWNER DETAILS ----------
//           OwnerTitle: "Other",
//           OwnerName: "ABC",
//           OwnerNameMarathi: "एबीसी",
//           Address: ".",
//           OwnerPatta: ".",
//           NewZoneNo:"Z"

//         },
//       });

//       if (created) {
//         createdRecords.push(record);
//         const ownerID = record.OwnerID;

//         // ----------------------------------------------------------
//         // ✅ INSERT — CombinedOwnerName (OWNER + MARATHI OWNER)
//         // ----------------------------------------------------------
//         await CombinedOwnerName.create({
//           OwnerID: ownerID,
//           OwnerName: "ABC",
//           MarathiOwnerName: "एबीसी",
//           RenterName: "",
//           MarathiRenterName: "",
//           OccupierName: "",
//           MarathiOccupierName: "",
//         });
//         await JoinOwnerDetails.create({
//           OwnerID: ownerID,
//           isPrime:1,
//           OwnerName: "ABC",
//           OwnerNameMarathi: "एबीसी",
//           Address: ".",
//           OwnerPatta: ".",
         
//         });
//         // ----------------------------------------------------------
//         // ✅ INSERT — Property Social Details
//         // ----------------------------------------------------------
//         await PropertySocialDetails.create({ OwnerID: ownerID });

//         // ----------------------------------------------------------
//         // ✅ INSERT — PropertyDetailsNew
//         // ----------------------------------------------------------
//         await PropertyDetailsNew.create({
//           OwnerID: ownerID,
//           FloorID,
//           ConstructionYear: 2000,
//           ConstructionType,
//           TypeOFUse,
//         });

//       } else {
//         skippedProperties.push(propertyNo);
//       }
//     }

//     // ----------------------
//     // ✅ RESPONSE
//     // ----------------------
//     return res.status(200).json({
//       message: skippedProperties.length > 0
//         ? "New properties added, but some were skipped (already exist)."
//         : "New properties added successfully.",
//       YearInfo: createdRecords.map(r => r.get({ plain: true })),
//       skipped: skippedProperties,
//     });

//   } catch (error) {
//     console.error("❌ Error in saveAutoWard:", error);
//     return res.status(500).json({
//       message: "Failed to add/update ward info.",
//       error: error.message,
//     });
//   }
// };
export const saveAutoWard = async (req, res) => {
  const { NewWardNo, PropertyRange, user } = req.body;

  try {
    if (!NewWardNo || !Array.isArray(PropertyRange) || PropertyRange.length === 0) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const startNumber = Math.min(...PropertyRange);
    const endNumber = Math.max(...PropertyRange);

    // Format date properly for MySQL
    const todayDate = new Date();
    const formattedDate = todayDate.toISOString().slice(0, 19).replace("T", " ");

    // Set session recursion depth (if needed)
    await sequelize.query(`SET SESSION cte_max_recursion_depth = 20000`);

    // Batch size (adjustable)
    const batchSize = 100;

    for (let i = startNumber; i <= endNumber; i += batchSize) {
      const batchEnd = Math.min(i + batchSize - 1, endNumber);

      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          await sequelize.query(
            `CALL prcCreateAutoWardEntry(
              :p_StartNumber,
              :p_EndNumber,
              :p_NewWardNo,
              :p_CreatedBy,
              :p_CreatedDate
            )`,
            {
              replacements: {
                p_StartNumber: i,
                p_EndNumber: batchEnd,
                p_NewWardNo: NewWardNo,
                p_CreatedBy: user?.UserID || null,
                p_CreatedDate: formattedDate
              },
              timeout: 0 // disable Sequelize query timeout for long batch
            }
          );

          // Batch processed successfully, exit retry loop
          break;
        } catch (err) {
          retryCount++;
          if (err.original?.errno === 1205 && retryCount < maxRetries) {
            // Lock wait timeout, retry after 2 sec
            console.warn(`Lock wait timeout, retrying batch ${i}-${batchEnd}...`);
            await new Promise(r => setTimeout(r, 2000));
          } else {
            throw err; // other errors or max retries reached
          }
        }
      }
    }

    return res.status(200).json({
      message: `Auto Ward created successfully for Ward ${NewWardNo}`
    });

  } catch (error) {
    console.error("❌ AutoWard SP Error:", error);
    return res.status(500).json({
      message: "Failed to create Auto Ward",
      error: error.message
    });
  }
};



// export const saveAutoWardOblique = async (req, res) => {
//   const { NewWardNo, NewPropertyNo, partitions,user } = req.body;

//   try {
   
//     if (
//       !NewWardNo ||
//       !NewPropertyNo ||
//       !Array.isArray(partitions) ||
//       partitions.length === 0
//     ) {
//       return res.status(400).json({
//         message: "Invalid request data"
//       });
//     }

    
//     const partitionNumbers = partitions
//       .map(p => Number(p.NewPartitionNo))
//       .filter(n => Number.isInteger(n));

//     if (partitionNumbers.length === 0) {
//       return res.status(400).json({
//         message: "Invalid partition numbers"
//       });
//     }

//     const startPartition = Math.min(...partitionNumbers);
//     const endPartition   = Math.max(...partitionNumbers);
//     const todayDate = new Date();

    
//     await sequelize.query(
//       `CALL prcCreateAutoWardEntryForObProperties(
//         :p_StartPartition,
//         :p_EndPartition,
//         :p_NewWardNo,
//         :p_NewPropertyNo,
//         :p_CreatedBy,
//         :p_CreatedDate
//       )`,
//       {
//         replacements: {
//           p_StartPartition: startPartition,
//           p_EndPartition: endPartition,
//           p_NewWardNo: NewWardNo,
//           p_NewPropertyNo: NewPropertyNo,
//           p_CreatedBy: user.UserID, 
//           p_CreatedDate: todayDate
//         }
//       }
//     );

    
//     return res.status(200).json({
//       message: `Oblique properties created successfully (Ward ${NewWardNo}, Property ${NewPropertyNo}, Partition ${startPartition}-${endPartition})`
//     });

//   } catch (error) {
//     console.error("❌ Oblique SP Error:", error);
//     return res.status(500).json({
//       message: "Failed to create oblique properties",
//       error: error.message
//     });
//   }
// };
export const saveAutoWardOblique = async (req, res) => {
  const { NewWardNo, NewPropertyNo, partitions, user } = req.body;

  try {
    if (!NewWardNo || !NewPropertyNo || !Array.isArray(partitions) || partitions.length === 0) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Extract integer partition numbers
    const partitionNumbers = partitions
      .map(p => Number(p.NewPartitionNo))
      .filter(n => Number.isInteger(n));

    if (partitionNumbers.length === 0) {
      return res.status(400).json({ message: "Invalid partition numbers" });
    }

    const startPartition = Math.min(...partitionNumbers);
    const endPartition = Math.max(...partitionNumbers);

    // Format date properly for MySQL
    const todayDate = new Date();
    const formattedDate = todayDate.toISOString().slice(0, 19).replace("T", " ");

    // Batch size
    const batchSize = 100;

    // Optional: set recursion depth if SP uses recursion
    await sequelize.query(`SET SESSION cte_max_recursion_depth = 20000`);

    // Process in batches
    for (let i = startPartition; i <= endPartition; i += batchSize) {
      const batchEnd = Math.min(i + batchSize - 1, endPartition);

      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          await sequelize.query(
            `CALL prcCreateAutoWardEntryForObProperties(
              :p_StartPartition,
              :p_EndPartition,
              :p_NewWardNo,
              :p_NewPropertyNo,
              :p_CreatedBy,
              :p_CreatedDate
            )`,
            {
              replacements: {
                p_StartPartition: i,
                p_EndPartition: batchEnd,
                p_NewWardNo: NewWardNo,
                p_NewPropertyNo: NewPropertyNo,
                p_CreatedBy: user?.UserID || null,
                p_CreatedDate: formattedDate
              },
              timeout: 0 // disables query timeout for long-running batches
            }
          );

          // Batch processed successfully, exit retry loop
          break;
        } catch (err) {
          retryCount++;
          if (err.original?.errno === 1205 && retryCount < maxRetries) {
            console.warn(`Lock wait timeout, retrying batch ${i}-${batchEnd}...`);
            await new Promise(r => setTimeout(r, 2000)); // wait 2 seconds before retry
          } else {
            throw err; // other errors or max retries reached
          }
        }
      }
    }

    return res.status(200).json({
      message: `Oblique properties created successfully for Ward ${NewWardNo}, Property ${NewPropertyNo}`
    });

  } catch (error) {
    console.error("❌ Oblique SP Error:", error);
    return res.status(500).json({
      message: "Failed to create oblique properties",
      error: error.message
    });
  }
};



export const getPropertyListByWard = async (req, res) => {
  try {
    const { wardNo } = req.body;

    if (!wardNo) {
      return res.status(400).json({ message: "wardNo is required" });
    }

    const properties = await PropertyMast.findAll({
      where: { NewWardNo: wardNo },
      attributes: ["NewPropertyNo", "NewPartitionNo"],
      order: [["NewPropertyNo", "ASC"], ["NewPartitionNo", "ASC"]],
      raw: true,
    });

    // format response
    const formatted = properties.map((p) => ({
      ...p,
      DisplayNo: p.NewPartitionNo ? `${p.NewPropertyNo}-${p.NewPartitionNo}` : `${p.NewPropertyNo}`,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch properties",
      error: err.message,
    });
  }
};

  
  
  
