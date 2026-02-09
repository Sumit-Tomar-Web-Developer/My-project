import sequelize from '../../config/connectionDB.js';
import { Op, QueryTypes } from "sequelize";
import BankMaster from '../../models/models/bankmaster.js';

export const getBankMasterInfo = async (req, res) => {
    try {
        const getBankMasterInfo = await BankMaster.findAll();
        res.status(200).json(getBankMasterInfo);
    } catch (error) {
        console.error('Error getting Bank Master:', error);
        res.status(500).json({
            error: 'An error occurred while getting Bank Master.',
        });
    }
};

// export const saveBankMasterInfo = async (req, res) => {
//     const { BankID, BankName, Address, Phone,UserID } = req.body;

//     let Id = 0;
//     if (!BankID)
//         Id = 0;
//     else
//         Id = BankID;
//     try {

//         if (BankName == null || BankName == undefined || BankName == "")
//         return res.status(400).json({
//             message: 'Bank Name can not be null'
//         });

//         let BankMasterInfo = await BankMaster.findOne({
//             where: { 'BankID': Id },
//         });

//         if (!BankMasterInfo) {
//             BankMasterInfo = await BankMaster.create({
//                 BankName, Address, Phone, CreatedBy: UserID,        
//                 CreatedDate: new Date()
//             });

//             return res.status(200).json({
//                 message: 'Bank Master created successfully',
//                 BankMasterInfo,
//             });

//         } else {

//             await BankMasterInfo.update({
//                 BankName, Address, Phone,UpdatedBy: UserID,       
//                 UpdatedDate: new Date()
//             });

//             return res.status(201).json({
//                 message: 'Bank Master updated successfully',
//                 BankMasterInfo: BankMasterInfo,
//             });
//         }
//     } catch (error) {
//         res.status(500).json({
//             message: 'Failed to update/create Bank Master',
//             error: error.message,
//         });
//     }
// };

export const saveBankMasterInfo = async (req, res) => {
    const { BankID, BankName, Address, Phone, UserID } = req.body;

    let Id = BankID && BankID !== '0' ? BankID : 0;

    try {
        if (!BankName || BankName.trim() === "") {
            return res.status(400).json({ message: 'Bank Name cannot be null' });
        }

        const existingRecord = await BankMaster.findOne({
            where: {
                BankName: BankName,
                Phone: Phone,
                BankID: { [Op.ne]: Id } 
            }
        });

        if (existingRecord) {
            return res.status(400).json({ 
                message: `Duplicate Entry: Bank '${BankName}' with Phone '${Phone}' already exists in the list.` 
            });
        }

        let BankMasterInfo = await BankMaster.findOne({
            where: { 'BankID': Id },
        });

        if (!BankMasterInfo) {
            // INSERT CASE
            BankMasterInfo = await BankMaster.create({
                BankName, 
                Address, 
                Phone, 
                CreatedBy: UserID,        
                CreatedDate: new Date()
            });

            return res.status(200).json({
                message: 'Bank Master created successfully',
                BankMasterInfo,
            });

        } else {
            // UPDATE CASE
            await BankMasterInfo.update({
                BankName, 
                Address, 
                Phone,
                UpdatedBy: UserID,       
                UpdatedDate: new Date()
            });

            return res.status(201).json({
                message: 'Bank Master updated successfully',
                BankMasterInfo: BankMasterInfo,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Failed to process Bank Master request',
            error: error.message,
        });
    }
};
export const deleteBankMasterInfo = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const ids = req.body.IDs;  // Assuming you receive an array of IDs

        if (!Array.isArray(ids) || !ids.every(id => Number.isInteger(id) && id > 0)) {
            return res.status(400).json({
                message: 'Bank Master Ids must be an array of positive integers'
            });
        }

        const bankMasterRecords = await BankMaster.findAll({
            where: { BankID: ids },
            transaction: t
        });

        if (bankMasterRecords.length === 0) {
            await t.rollback();
            return res.status(203).json({ message: 'Bank Master records not found' });
        }

        const result = await BankMaster.destroy({
            where: { BankID: ids },
            transaction: t
        });

        if (result > 0) {
            await t.commit();
            res.status(200).json({ message: 'Bank Master deleted successfully' });
        } else {
            await t.rollback();
            res.status(203).json({ message: 'Records Not Found' });
        }
    } catch (error) {
        await t.rollback();
        console.error('Error deleting Bank Master:', error);
        res.status(500).json({
            error: 'An error occurred while deleting Bank Master.',
        });
    }
};




