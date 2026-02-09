import sequelize from '../../config/connectionDB.js';
import { Op, QueryTypes } from "sequelize";
import ActiveYearMaster from '../../models/models/activeyearmaster.js';

export const getActiveYearInfo = async (req, res) => {
    try {
        const getActiveYearInfo = await ActiveYearMaster.findAll({
            order: [["ActiveYear", "desc"]]
        });

        res.status(200).json(getActiveYearInfo);
    } catch (error) {
        console.error('Error getting Active Year:', error);
        res.status(500).json({
            error: 'An error occurred while getting Active Year.',
        });
    }
};

export const saveActiveYearInfo = async (req, res) => {
    const { ActiveYearID, ActiveYear, Name, Description, TaxTable, Status,UserID } = req.body;

    let Id = 0;
    if (!ActiveYearID)
        Id = 0;
    else
        Id = ActiveYearID;
    try {

        if (!Number.isInteger(Status) && Status < 0)
            return res.status(400).json({
                message: 'Status can not be type of string or zero'
            });
        let ActiveYearInfo = await ActiveYearMaster.findOne({
            where: { 'ActiveYearID': Id },
        });

        if (!ActiveYearInfo) {
            ActiveYearInfo = await ActiveYearMaster.create({
                ActiveYear, Name, Description, TaxTable, Status,
                CreatedBy: UserID,        
        CreatedDate: new Date()
            });

            return res.status(200).json({
                message: 'Active Year created successfully',
                ActiveYearInfo,
            });

        } else {
            await ActiveYearInfo.update({
                ActiveYear, Name, Description, TaxTable, Status,
                UpdatedBy: UserID,       
                UpdatedDate: new Date()
            });

            return res.status(201).json({
                message: 'Active Year updated successfully',
                ActiveYearInfo,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update/create Active Year',
            error: error.message,
        });
    }
};

export const deleteActiveYearInfo = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const ids = req.body.IDs;  // Assuming you receive an array of IDs

        if (!Array.isArray(ids) || !ids.every(id => Number.isInteger(id) && id > 0)) {
            return res.status(400).json({
                message: 'Active Year Ids must be an array of positive integers'
            });
        }

        const activeYearRecords = await ActiveYearMaster.findAll({
            where: { ActiveYearID: ids },
            transaction: t
        });

        if (activeYearRecords.length === 0) {
            await t.rollback();
            return res.status(203).json({ message: 'Active Year records not found' });
        }

        const result = await ActiveYearMaster.destroy({
            where: { ActiveYearID: ids },
            transaction: t
        });

        if (result > 0) {
            await t.commit();
            res.status(200).json({ message: 'Active Year deleted successfully' });
        } else {
            await t.rollback();
            res.status(203).json({ message: 'Records Not Found' });
        }
    } catch (error) {
        await t.rollback();
        console.error('Error deleting Active Year:', error);
        res.status(500).json({
            error: 'An error occurred while deleting Active Year.',
        });
    }
};




