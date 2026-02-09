import sequelize from '../../config/connectionDB.js';
import { Op, QueryTypes } from "sequelize";
import ActiveTaxesMaster from '../../models/models/activetaxesmaster.js';



export const getActiveTaxesInfo = async (req, res) => {
    try {
        const getActiveTaxesInfo = await ActiveTaxesMaster.findAll();
        res.status(200).json(getActiveTaxesInfo);
    } catch (error) {
        console.error('Error getting Active Taxes:', error);
        res.status(500).json({
            error: 'An error occurred while getting Active Taxes.',
        });
    }
};

export const saveActiveTaxesInfo = async (req, res) => {
  
    
    const { TaxNameID, TaxName, TaxNameAlias, Status, TaxNameOrder } = req.body;

    let Id = 0;
    if (!TaxNameID)
        Id = 0;
    else
        Id = TaxNameID;
    try {

        if (!Number.isInteger(Status) && Status < 0)
            return res.status(400).json({
                message: 'Tax Name Status can not be type of string or zero'
            });
        if (!Number.isInteger(TaxNameOrder) && TaxNameOrder < 0)
            return res.status(400).json({
                message: 'Tax Name Order can not be type of string or zero'
            });

        let ActiveTaxesInfo = await ActiveTaxesMaster.findOne({
            where: { 'TaxNameID': Id },
        });

        if (!ActiveTaxesInfo) {
            ActiveTaxesInfo = await ActiveTaxesMaster.create({
                TaxName, TaxNameAlias, Status, TaxNameOrder,
         
                CreatedDate: new Date(),
            });

            return res.status(200).json({
                message: 'Active Taxes created successfully',
                ActiveTaxesInfo,
            });

        } else {
            await ActiveTaxesInfo.update({
                TaxName, TaxNameAlias, Status, TaxNameOrder,
           
                UpdatedDate: new Date(),
            });

            return res.status(201).json({
                message: 'Active Taxes updated successfully',
                ActiveTaxesInfo,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update/create Active Taxes',
            error: error.message,
        });
    }
};

export const deleteActiveTaxesInfo = async (req, res) => {
   
    const t = await sequelize.transaction();
    try {
        const Ids = req.body.Ids;  // Assuming you receive an array of IDs
       

        if (!Array.isArray(Ids) || !Ids.every(id => Number.isInteger(id) && id > 0)) {
            return res.status(400).json({
                message: 'Active Taxes Ids must be an array of positive integers'
            });
        }

        const activeTaxesRecords = await ActiveTaxesMaster.findAll({
            where: { TaxNameID: Ids },
            transaction: t
        });

        if (activeTaxesRecords.length === 0) {
            await t.rollback();
            return res.status(203).json({ message: 'Active Taxes records not found' });
        }

        const result = await ActiveTaxesMaster.destroy({
            where: { TaxNameID: Ids },
            transaction: t
        });

        if (result > 0) {
            await t.commit();
            res.status(200).json({ message: 'Active Taxes deleted successfully' });
        } else {
            await t.rollback();
            res.status(203).json({ message: 'Records Not Found' });
        }
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            error: 'An error occurred while deleting Active Taxes.',
        });
    }
};




