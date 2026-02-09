import sequelize from '../../config/connectionDB.js';
import { Op, QueryTypes } from "sequelize";
import PropertyTypeMaster from '../../models/models/propertytypemaster.js';

export const getPropertyTypeInfo = async (req, res) => {
    try {
        const getPropertyTypeInfo = await PropertyTypeMaster.findAll();
        res.status(200).json(getPropertyTypeInfo);
    } catch (error) {
        console.error('Error getting Property Type:', error);
        res.status(500).json({
            error: 'An error occurred while getting Property Type.',
        });
    }
};

// export const savePropertyTypeInfo = async (req, res) => {
//     const { PropertyTypeID, PropertyDescription, Type, PropertyTypeGroupID, Tax } = req.body;

//     let Id = 0;
//     if (!PropertyTypeID)
//         Id = 0;
//     else
//         Id = PropertyTypeID;
//     try {
//         let PropertyTypeInfo = await PropertyTypeMaster.findOne({
//             where: { 'PropertyTypeID': Id },
//         });

//         if (!PropertyTypeInfo) {
//             let isDescriptionExist = await PropertyTypeMaster.findOne({
//                 where: { PropertyDescription }
//             });
//             if (isDescriptionExist)
//                 return res.status(202).json({
//                     message: `Duplicate Description ${PropertyDescription} found`,
//                     PropertyTypeInfo,
//                 });

//             PropertyTypeInfo = await PropertyTypeMaster.create({
//                 PropertyDescription, Type, PropertyTypeGroupID, Tax
//             });

//             return res.status(200).json({
//                 message: 'Property Type created successfully',
//                 PropertyTypeInfo,
//             });

//         } else {
//             let isDescriptionExist = await PropertyTypeMaster.findOne({
//                 where: { PropertyDescription }
//             });
//             if (isDescriptionExist)
//                 if (isDescriptionExist.PropertyTypeID != PropertyTypeID)
//                     return res.status(202).json({
//                         message: `Duplicate Description ${PropertyDescription} found`,
//                         PropertyTypeInfo,
//                     });
//             await PropertyTypeInfo.update({
//                 PropertyDescription, Type, PropertyTypeGroupID, Tax
//             });

//             return res.status(201).json({
//                 message: 'Property Type updated successfully',
//                 PropertyTypeInfo: PropertyTypeInfo,
//             });
//         }
//     } catch (error) {
//         res.status(500).json({
//             message: 'Failed to update/create Property Type',
//             error: error.message,
//         });
//     }
// };
export const savePropertyTypeInfo = async (req, res) => {
    const { PropertyTypeID, PropertyDescription, Type, PropertyTypeGroupID, Tax,UserID } = req.body;

    let Id = (!PropertyTypeID || PropertyTypeID === 0) ? 0 : PropertyTypeID;

    try {
        let PropertyTypeInfo = null;
        if (Id !== 0) {
            PropertyTypeInfo = await PropertyTypeMaster.findOne({
                where: { 'PropertyTypeID': Id },
            });
        }

        if (!PropertyTypeInfo) {
            /* ======================================================
            ====================================================== */
            
            // Description duplicate check karein
            let isDescriptionExist = await PropertyTypeMaster.findOne({
                where: { PropertyDescription }
            });

            if (isDescriptionExist) {
                return res.status(202).json({
                    message: `Duplicate Description "${PropertyDescription}" found`,
                    success: false
                });
            }

            PropertyTypeInfo = await PropertyTypeMaster.create({
                PropertyDescription, 
                Type, 
                PropertyTypeGroupID, 
                Tax,
                CreatedBy: UserID,        
        CreatedDate: new Date()
            });

            return res.status(200).json({
                message: 'Property Type created successfully',
                PropertyTypeInfo, // Isme aapko nayi ID (47) mil jayegi
            });

        } else {
            /* ======================================================
            ====================================================== */
            
            let isDescriptionExist = await PropertyTypeMaster.findOne({
                where: { 
                    PropertyDescription,
                    PropertyTypeID: { [Op.ne]: Id } 
                }
            });

            if (isDescriptionExist) {
                return res.status(202).json({
                    message: `Duplicate Description "${PropertyDescription}" found on another ID`,
                    success: false
                });
            }

            // Record update karein
            await PropertyTypeInfo.update({
                PropertyDescription, 
                Type, 
                PropertyTypeGroupID, 
                Tax,
                UpdatedBy: UserID,       
                UpdatedDate: new Date()
            });

            return res.status(201).json({
                message: 'Property Type updated successfully',
                PropertyTypeInfo: PropertyTypeInfo,
            });
        }
    } catch (error) {
        console.error('Error in savePropertyTypeInfo:', error);
        res.status(500).json({
            message: 'Failed to update/create Property Type',
            error: error.message,
        });
    }
};
export const deletePropertyTypeInfo = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const ids = req.body.PropertyTypeIDs;  // Assuming you receive an array of IDs

        if (!Array.isArray(ids) || !ids.every(id => Number.isInteger(id) && id > 0)) {
            return res.status(400).json({
                message: 'Property Type IDs must be an array of positive integers'
            });
        }

        const propertyTypeRecords = await PropertyTypeMaster.findAll({
            where: { PropertyTypeID: ids },
            transaction: t
        });

        if (propertyTypeRecords.length === 0) {
            await t.rollback();
            return res.status(203).json({ message: 'Property Type records not found' });
        }

        const result = await PropertyTypeMaster.destroy({
            where: { PropertyTypeID: ids },
            transaction: t
        });

        if (result > 0) {
            await t.commit();
            res.status(200).json({ message: 'Property Type records deleted successfully' });
        } else {
            await t.rollback();
            res.status(203).json({ message: 'Records Not Found' });
        }
    } catch (error) {
        await t.rollback();
        console.error('Error deleting Property Type records:', error);
        res.status(500).json({
            error: 'An error occurred while deleting Property Type records.',
        });
    }
};




