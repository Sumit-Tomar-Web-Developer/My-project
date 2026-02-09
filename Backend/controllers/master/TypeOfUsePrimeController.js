import sequelize from '../../config/connectionDB.js';
import { Op, QueryTypes } from "sequelize";
import TypeofUsePrime from '../../models/models/typeofuseprimemaster.js';
import RateMaster from '../../models/models/ratemaster.js';

export const getPrimeTypeOfUseInfo = async (req, res) => {
    try {
        const getPrimeTypeOfUseInfo = await TypeofUsePrime.findAll();
        res.status(200).json(getPrimeTypeOfUseInfo);
    } catch (error) {
        console.error('Error getting Prime Type Of Use:', error);
        res.status(500).json({
            error: 'An error occurred while getting Prime Type Of Use.',
        });
    }
};

export const savePrimeTypeOfUseInfo = async (req, res) => {
    const { ID, Type, Description, TypeTaxableStatus } = req.body;
    if (!Description) {
        return res.status(401).json({
            message: 'Type Description required',
        });
    }

    if (!TypeTaxableStatus == undefined) {
        return res.status(402).json({
            message: 'Type Taxable Status required',
        });
    }
    if (ValidateTypeTaxableStatus(TypeTaxableStatus)) {
        return res.status(403).json({
            message: 'Invalid value for TypeTaxableStatus. Must be 0, 1, true, or false.',
        });
    }
    let typeUseId = 0;
    if (!ID)
        typeUseId = 0;
    else
        typeUseId = ID;
    try {
        let primeTypeInfo = await TypeofUsePrime.findOne({
            where: { 'ID': typeUseId },
        });

        if (!primeTypeInfo) {
            let isTypeExists = await TypeofUsePrime.findOne({
                where: { Type }
            });
            if (isTypeExists)
                return res.status(202).json({
                    message: `Duplicate Type ${Type} found`,
                    primeTypeInfo,
                });

            primeTypeInfo = await TypeofUsePrime.create({
                Type, Description, TypeTaxableStatus
            });

            return res.status(200).json({
                message: 'Prime Type Of Use created successfully',
                primeTypeInfo,
            });

        } else {
            let isTypeExists = await TypeofUsePrime.findOne({
                where: { Type }
            });
            if (isTypeExists)
                if (isTypeExists.ID != ID)
                    return res.status(202).json({
                        message: `Duplicate Type ${Type} found`,
                        primeTypeInfo,
                    });
            await primeTypeInfo.update({
                Type, Description, TypeTaxableStatus
            });

            return res.status(201).json({
                message: 'Prime Type Of Use updated successfully',
                Factor: primeTypeInfo,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update/create Prime Type Of Use',
            error: error.message,
        });
    }
};

export const deletePrimeTypeOfUseInfo = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const typeIds = req.body.IDs;  // Assuming you receive an array of IDs

        if (!Array.isArray(typeIds) || !typeIds.every(id => Number.isInteger(id) && id > 0)) {
            return res.status(400).json({
                message: 'Type of Use Prime IDs must be an array of positive integers'
            });
        }

        const typeOfUsePrimeRecords = await TypeofUsePrime.findAll({
            where: { ID: typeIds },
            transaction: t
        });

        if (typeOfUsePrimeRecords.length === 0) {
            await t.rollback();
            return res.status(203).json({ message: 'Type of Use Prime records not found' });
        }

        // Check if any of the records are present in RateMaster table
        const typeIdsToDelete = typeOfUsePrimeRecords.map(record => record.ID);
        const rateMasterRecords = await RateMaster.findAll({
            where: { TypeOfUseID: typeIdsToDelete },
            transaction: t
        });

        if (rateMasterRecords.length > 0) {
            await t.rollback();
            return res.status(400).json({
                message: 'Cannot delete Type of Use Prime records as they are present in RateMaster table'
            });
        }

        const result = await TypeofUsePrime.destroy({
            where: { ID: typeIds },
            transaction: t
        });

        if (result > 0) {
            await t.commit();
            res.status(200).json({ message: 'Type of Use Prime records deleted successfully' });
        } else {
            await t.rollback();
            res.status(203).json({ message: 'Records Not Found' });
        }
    } catch (error) {
        await t.rollback();
        console.error('Error deleting Type of Use Prime records:', error);
        res.status(500).json({
            error: 'An error occurred while deleting Type of Use Prime records.',
        });
    }
};


function ValidateTypeTaxableStatus(value) {
    // Check if value is a boolean, if so, convert to corresponding integer
    if (typeof value === 'boolean') {
        return false;
    }

    // Check if value is an integer and within the range of 0 and 1
    if (Number.isInteger(value) && (value === 0 || value === 1)) {
        return false;
    }

    // If the value does not match any valid type, throw an error
    return true;
}


