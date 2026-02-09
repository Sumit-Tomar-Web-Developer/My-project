import sequelize from '../../config/connectionDB.js';
import { Op, QueryTypes } from "sequelize";
import MaintenanceMaster from '../../models/models/maintenancemaster.js';

export const getMaintenanceInfo = async (req, res) => {
    try {
        const getMaintenanceInfo = await MaintenanceMaster.findAll();
        res.status(200).json(getMaintenanceInfo);
    } catch (error) {
        console.error('Error getting Maintenance:', error);
        res.status(500).json({
            error: 'An error occurred while getting Maintenance.',
        });
    }
};

export const saveMaintenanceInfo = async (req, res) => {
    const { ID, year, rate } = req.body;

    let Id = 0;
    if (!ID)
        Id = 0;
    else
        Id = ID;
    try {
        let maintenanceInfo = await MaintenanceMaster.findOne({
            where: { 'ID': Id },
        });

        if (!maintenanceInfo) {
            let isYearExist = await MaintenanceMaster.findOne({
                where: { year }
            });
            if (isYearExist)
                return res.status(202).json({
                    message: `Duplicate Year ${year} found`,
                    maintenanceInfo,
                });

            maintenanceInfo = await MaintenanceMaster.create({
                year, rate
            });

            return res.status(200).json({
                message: 'Maintenance created successfully',
                maintenanceInfo,
            });

        } else {
            let isYearExist = await MaintenanceMaster.findOne({
                where: { year }
            });
            if (isYearExist)
                if (isYearExist.ID != ID)
                    return res.status(202).json({
                        message: `Duplicate Year ${year} found`,
                        maintenanceInfo,
                    });
            await maintenanceInfo.update({
                year, rate
            });

            return res.status(201).json({
                message: 'Maintenance updated successfully',
                Factor: maintenanceInfo,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update/create Maintenance',
            error: error.message,
        });
    }
};

export const deleteMaintenanceInfo = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const ids = req.body.IDs;  // Assuming you receive an array of IDs

        if (!Array.isArray(ids) || !ids.every(id => Number.isInteger(id) && id > 0)) {
            return res.status(400).json({
                message: 'Maintenance IDs must be an array of positive integers'
            });
        }

        const maintenanceRecords = await MaintenanceMaster.findAll({
            where: { ID: ids },
            transaction: t
        });

        if (maintenanceRecords.length === 0) {
            await t.rollback();
            return res.status(203).json({ message: 'Maintenance records not found' });
        }

        const result = await MaintenanceMaster.destroy({
            where: { ID: ids },
            transaction: t
        });

        if (result > 0) {
            await t.commit();
            res.status(200).json({ message: 'Maintenance records deleted successfully' });
        } else {
            await t.rollback();
            res.status(203).json({ message: 'Records Not Found' });
        }
    } catch (error) {
        await t.rollback();
        console.error('Error deleting Maintenance records:', error);
        res.status(500).json({
            error: 'An error occurred while deleting Maintenance records.',
        });
    }
};




