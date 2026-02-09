import sequelize from '../../config/connectionDB.js';
import { Op, QueryTypes } from 'sequelize';
import TypeofUseMaster from '../../models/models/typeofusemaster.js';
import RateMaster from '../../models/models/ratemaster.js';
import OldTypeOfUseMaster from '../../models/models/oldtypeofusemaster.js';
import { ApplyTaxMasterPrime } from '../../models/models/applytaxesmasterprime.js';
import TypeofUsePrime from '../../models/models/typeofuseprimemaster.js';
import PropertyDetailsOld from '../../models/models/propertydetailsold.js';

export const getTypeOfUseInfo = async (req, res) => {
  try {
    const getTypeOfUseInfo = await TypeofUseMaster.findAll();
    res.status(200).json(getTypeOfUseInfo);
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while getting  Type Of Use.',
    });
  }
};
export const saveTypeOfUseInfo = async (req, res) => {
  const { ID, TypeOfUseID, Type, Description, GroupId, GroupDescription,UserID } = req.body;

  // Validation
  if (!TypeOfUseID) {
    return res.status(401).json({ message: 'Type of Use required' });
  }
  if (!Type) {
    return res.status(402).json({ message: 'Type required' });
  }

  try {
    let Id = ID || 0;

    // Check if record exists
    let TypeInfo = await TypeofUseMaster.findOne({ where: { ID: Id } });

    if (!TypeInfo) {
      // Check for duplicate TypeOfUseID
      const isTypeExists = await TypeofUseMaster.findOne({ where: { TypeOfUseID } });
      if (isTypeExists) {
        return res.status(202).json({ message: `Duplicate Type of Use '${TypeOfUseID}' found` });
      }

      // Create new TypeOfUseMaster record
      TypeInfo = await TypeofUseMaster.create({
        TypeOfUseID,
        Description,
        Type,
        GroupID: GroupId,
        GroupDescription,
        CreatedBy: UserID,        
        CreatedDate: new Date()
      });

      await ApplyTaxMasterPrime.create({
        TypeofUseId: TypeOfUseID,
        Type,
        CreatedBy: UserID,        
        CreatedDate: new Date()
      });

      return res.status(200).json({ message: 'Type Of Use created successfully', TypeInfo });
    } else {
      // Update existing TypeOfUseMaster record
      const isTypeExists = await TypeofUseMaster.findOne({ where: { TypeOfUseID } });
      if (isTypeExists && isTypeExists.ID != ID) {
        return res.status(202).json({ message: `Duplicate Type of Use '${TypeOfUseID}' found` });
      }

      // Update ApplyTaxMasterPrime record if exists
      const applyTaxInfo = await ApplyTaxMasterPrime.findOne({ where: { TypeofUseId: TypeInfo.TypeOfUseID } });
      if (applyTaxInfo) {
        await applyTaxInfo.update({ TypeofUseId: TypeOfUseID, Type });
      }

      // Update TypeOfUseMaster record
      await TypeInfo.update({
        TypeOfUseID,
        Description,
        Type,
        GroupID: GroupId,
        GroupDescription,
        UpdatedBy: UserID,       
        UpdatedDate: new Date()
      });

      return res.status(201).json({ message: 'Type Of Use updated successfully', TypeInfo });
    }
  } catch (error) {
    console.error('Error saving/updating Type Of Use:', error);
    return res.status(500).json({ message: 'Failed to update/create Type Of Use', error: error.message });
  }
};


// export const saveTypeOfUseInfo = async (req, res) => {
//   const { ID, TypeOfUseID, Type, Description, GroupDescription } = req.body;
//   if (!TypeOfUseID == undefined) {
//     return res.status(401).json({
//       message: 'Type of Use required',
//     });
//   }

//   if (!Type == undefined) {
//     return res.status(402).json({
//       message: 'Type required',
//     });
//   }

//   let Id = 0;
//   if (!ID == undefined) Id = 0;
//   else Id = ID;
//   try {
//     let TypeInfo = await TypeofUseMaster.findOne({
//       where: { ID: Id },
//     });

//     if (!TypeInfo) {
//       let isTypeExists = await TypeofUseMaster.findOne({
//         where: { TypeOfUseID },
//       });
//       if (isTypeExists)
//         return res.status(202).json({
//           message: `Duplicate Type of Use '${TypeOfUseID}' found`,
//         });

//       TypeInfo = await TypeofUseMaster.create({
//         TypeOfUseID,
//         Description,
//         Type,
//         GroupDescription,
//       });

//       await ApplyTaxMasterPrime.create({
//         TypeofUseId: TypeOfUseID,
//         Type: Type,
//       });

//       return res.status(200).json({
//         message: ' Type Of Use created successfully',
//         TypeInfo,
//       });
//     } else {
//       let isTypeExists = await TypeofUseMaster.findOne({
//         where: { TypeOfUseID },
//       });
//       if (isTypeExists)
//         if (isTypeExists.ID != ID)
//           return res.status(202).json({
//             message: `Duplicate Type of Use '${TypeOfUseID}' found`,
//           });
//       const applyTaxInfo = await ApplyTaxMasterPrime.findOne({
//         where: { TypeofUseId: TypeInfo.TypeOfUseID },
//       });
//       if (applyTaxInfo)
//         applyTaxInfo.update({
//           TypeofUseId: TypeOfUseID,
//           Type: Type,
//         });
//       await TypeInfo.update({
//         TypeOfUseID,
//         Description,
//         Type,
//         GroupDescription,
//       });

//       return res.status(201).json({
//         message: ' Type Of Use updated successfully',
//         TypeInfo: TypeInfo,
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: 'Failed to update/create  Type Of Use',
//       error: error.message,
//     });
//   }
// };

export const deleteTypeOfUseInfo = async (req, res) => {
  const { IDs } = req.body;

  if (!IDs || !Array.isArray(IDs) || IDs.length === 0) {
    return res.status(400).json({
      message: 'IDs are required and must be a non-empty array',
    });
  }

  try {
    // Delete multiple Ids by their IDs
    await TypeofUseMaster.destroy({
      where: {
        ID: IDs,
      },
    });

    return res.status(200).json({
      message: 'new type of use deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed to delete new type of use',
      error: error.message,
    });
  }
};

//old

export const getOldTypeOfUseInfo = async (req, res) => {
  try {
    const getOldTypeOfUseInfo = await OldTypeOfUseMaster.findAll();
    res.status(200).json(getOldTypeOfUseInfo);
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while getting  Type Of Use.',
    });
  }
};

// export const saveOldTypeOfUseInfo = async (req, res) => {
//   const { ID, OldTypeOfUseID, OldType, OldDescription } = req.body;

//   console.log(req.body, 'old type of use request');
//   if (!OldTypeOfUseID == undefined) {
//     return res.status(401).json({
//       message: 'Type of Use required',
//     });
//   }

//   if (!OldType == undefined) {
//     return res.status(402).json({
//       message: 'Type required',
//     });
//   }

//   let Id = 0;
//   if (!ID == undefined) Id = 0;
//   else Id = ID;
//   try {
//     let isTypeExists = await OldTypeOfUseMaster.findOne({
//       where: { OldTypeOfUseID },
//     });
//     if (!isTypeExists) {
//       let TypeInfo = await OldTypeOfUseMaster.findOne({
//         where: { ID: Id },
//       });

//       if (!TypeInfo) {
//         TypeInfo = await OldTypeOfUseMaster.create({
//           OldTypeOfUseID,
//           OldDescription,
//           OldType,
//         });

//         return res.status(200).json({
//           message: ' Old Type Of Use created successfully',
//           TypeInfo,
//         });
//       } else {
//         await TypeInfo.update({
//           OldTypeOfUseID,
//           OldDescription,
//           OldType,
//         });

//         return res.status(201).json({
//           message: ' Old Type Of Use updated successfully',
//           TypeInfo,
//         });
//       }
//     } else {
//       return res.status(202).json({
//         message: `Duplicate Old Type of Use '${OldTypeOfUseID}' found`,
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: 'Failed to update/create Old Type Of Use',
//       error: error.message,
//     });
//   }
// };

export const saveOldTypeOfUseInfo = async (req, res) => {
  const { ID, OldTypeOfUseID, OldType, OldDescription ,UserID} = req.body;

  console.log(req.body, 'old type of use request');

  // Validation
  if (!OldTypeOfUseID) {
    return res.status(401).json({
      message: 'Old Type of Use ID is required',
    });
  }

  if (!OldType) {
    return res.status(402).json({
      message: 'Old Type is required',
    });
  }

  try {
    // Check for duplicate OldTypeOfUseID
    const existingType = await OldTypeOfUseMaster.findOne({
      where: { OldTypeOfUseID },
    });

    if (existingType && (!ID || existingType.ID !== ID)) {
      return res.status(202).json({
        message: `Duplicate Old Type of Use '${OldTypeOfUseID}' found`,
      });
    }

    let TypeInfo;

    if (!ID) {
      // Create new record
      TypeInfo = await OldTypeOfUseMaster.create({
        OldTypeOfUseID,
        OldDescription,
        OldType,
        CreatedBy: UserID,        
        CreatedDate: new Date()
      });

      return res.status(200).json({
        message: 'Old Type Of Use created successfully',
        TypeInfo,
      });
    } else {
      // Update existing record
      TypeInfo = await OldTypeOfUseMaster.findOne({
        where: { ID },
      });

      if (!TypeInfo) {
        return res.status(404).json({
          message: `Old Type Of Use with ID ${ID} not found`,
        });
      }

      await TypeInfo.update({
        OldTypeOfUseID,
        OldDescription,
        OldType,
        UpdatedBy: UserID,       
        UpdatedDate: new Date()
      });

      return res.status(201).json({
        message: 'Old Type Of Use updated successfully',
        Factor: TypeInfo,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to update/create Old Type Of Use',
      error: error.message,
    });
  }
};

// export const deleteOldTypeOfUseInfo = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const typeIds = req.body.OldTypeOfUseIDs; // Assuming you receive an array of IDs

//     if (
//       !Array.isArray(typeIds) ||
//       !typeIds.every((id) => Number.isInteger(id) && id > 0)
//     ) {
//       return res.status(400).json({
//         message: 'Type of Use Ids must be an array of positive integers',
//       });
//     }

//     const typeOfUseRecords = await OldTypeOfUseMaster.findAll({
//       where: { ID: typeIds },
//       transaction: t,
//     });

//     if (typeOfUseRecords.length === 0) {
//       await t.rollback();
//       return res.status(203).json({ message: 'Type of Use records not found' });
//     }

//     // Check if any of the types are used in PropertyDetailsSold table
//     for (const record of typeOfUseRecords) {
//       const typeUseId = record.OldTypeOfUseID;
//       const pdnInfo = await PropertyDetailsSold.findOne({
//         where: { OldTypeOFUse: typeUseId },
//         transaction: t,
//       });

//       if (pdnInfo) {
//         await t.rollback();
//         return res.status(400).json({
//           message: `Cannot delete Old Type Of Use ID ${record.ID} as it is present in the PropertyDetailsSold table`,
//         });
//       }
//     }

//     const result = await OldTypeOfUseMaster.destroy({
//       where: { ID: typeIds },
//       transaction: t,
//     });

//     if (result > 0) {
//       await t.commit();
//       res.status(200).json({ message: 'Type Of Use deleted successfully' });
//     } else {
//       await t.rollback();
//       res.status(203).json({ message: 'Records Not Found' });
//     }
//   } catch (error) {
//     await t.rollback();
//     console.error('Error deleting Type Of Use:', error);
//     res.status(500).json({
//       error: 'An error occurred while deleting Type Of Use.',
//     });
//   }
// };
export const deleteOldTypeOfUseInfo = async (req, res) => {
  const { IDs } = req.body;

  if (!IDs || !Array.isArray(IDs) || IDs.length === 0) {
    return res.status(400).json({
      message: 'IDs are required and must be a non-empty array',
    });
  }

  try {
    // Delete multiple Ids by their IDs
    await OldTypeOfUseMaster.destroy({
      where: {
        ID: IDs,
      },
    });

    return res.status(200).json({
      message: 'old type of use deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Failed to delete old type of use',
      error: error.message,
    });
  }
};
