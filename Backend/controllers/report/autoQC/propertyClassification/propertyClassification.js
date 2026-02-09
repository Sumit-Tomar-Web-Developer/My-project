import { OldPropertyMast } from '../../../../models/models/oldpropertymast.js';
import PropertyMast from '../../../../models/models/propertymast.js'
import TransMast from '../../../../models/models/transmast.js'
import { TaxPendingDetails } from '../../../../models/models/taxpendingdetails.js'
import sequelize from '../../../../config/connectionDB.js';

export const getPropertyCountByDescription = async (req, res) => {
    const { selectedDescriptions, selectedWard } = req.body;

    console.log(selectedDescriptions, selectedWard, 'selectedDescriptions, selectedWard ')
    try {
        if (!selectedDescriptions || selectedDescriptions.length === 0) {
            return res.status(200).json([]); // return empty array if nothing selected
        }

        const totalCount = [];

        for (const descriptionID of selectedDescriptions) {
            const count = await PropertyMast.count({
                where: {
                    PropertyTypeID: descriptionID,
                    NewWardNo: selectedWard
                },
            });

            totalCount.push({ PropertyTypeID: descriptionID, count });
        }

        return res.status(200).json(totalCount);
    } catch (error) {
        console.error('Error fetching property count:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPropertyClassification = async (req, res) => {
    const {
        selectedWard,
        selectedYear,
        selectedDescriptions,
        isCurrentChecked,
        isPendingChecked
    } = req.body;

    try {
        if (!selectedDescriptions?.length || !selectedWard || !selectedYear) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const descriptionsString = Array.isArray(selectedDescriptions)
            ? selectedDescriptions.join(',')
            : selectedDescriptions;

        const query = `
            CALL prcGetPropertyClassification(
                :ward,
                :year,
                :descriptions,
                :current,
                :pending
            )
        `;

        const result = await sequelize.query(query, {
            replacements: {
                ward: selectedWard,
                year: selectedYear,
                descriptions: descriptionsString,
                current: isCurrentChecked ? 1 : 0,
                pending: isPendingChecked ? 1 : 0
            }
        });

        // First resultset contains the rows
        const rows = result;
 
        console.log(result,'result')
        return res.status(200).json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

