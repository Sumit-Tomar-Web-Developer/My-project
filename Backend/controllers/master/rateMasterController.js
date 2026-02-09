import sequelize from '../../config/connectionDB.js';
import { Op, QueryTypes } from "sequelize";
import RateMaster from '../../models/models/ratemaster.js';
import RateMasterCV from '../../models/models/ratemastercv.js';
import RateChartMaster from '../../models/models/ratechartmaster.js';
import FloorMaster from '../../models/models/floormaster.js';
import TypeofUsePrime from '../../models/models/typeofuseprimemaster.js';


export const getRateMasterInfo = async (req, res) => {
    const { Year, ZoneSectionNo, TypeOfRate, } = req.query;
    if (TypeOfRate === 'RV') {
        try {
            const rateMasterInfo = {
                YearRange: [],
                ResidentialRateChart: [],
                IndustrialMultiplier: 0,
                CommercialMultiplier: 0,
                CommZone: [],
                RateChartInfo: []
            }
            rateMasterInfo.YearRange = await RateMaster.findAll({
                where: { Year, ZoneSectionNo, TypeOfUseID: "R" },

                attributes: [[
                    sequelize.fn(
                        "concat",
                        sequelize.col("MinYear"),
                        "-",
                        sequelize.col("MaxYear")
                    ),
                    "Year",
                ]],
                group: ['MinYear', 'MaxYear']
            });

            rateMasterInfo.ResidentialRateChart = await RateMaster.findAll({
                where: { Year, ZoneSectionNo, TypeOfUseID: "R" },
                attributes: ['ConstructionID', 'ZoneNo', ['RateSquareMeter', "Rate"]]
            });


            rateMasterInfo.RateChartInfo = await RateChartMaster.findAll({
                where: { Year, ZoneSectionNo },
            })

            // if (rateChartInfo) {
            //     rateMasterInfo.CommercialMultiplier = rateChartInfo.CommercialMultiplier || 0;
            //     rateMasterInfo.IndustrialMultiplier = rateChartInfo.IndustrialMultiplier || 0;
            //     if (rateChartInfo.CommMultiplierAppliedToZone)
            //         rateMasterInfo.CommZone = rateChartInfo.CommMultiplierAppliedToZone.split(',');
            // }
            res.status(200).json(rateMasterInfo);
        } catch (error) {
            console.error('Error getting Rate Master:', error);
            res.status(500).json({
                error: 'An error occurred while getting Rate Master.',
            });
        }
    } else {
        try {
            const rateMasterInfo = {
                YearRange: [],
                ResidentialRateChart: [],
                IndustrialMultiplier: 0,
                CommercialMultiplier: 0,
                CommZone: [],
                RateChartInfo: []
            }
            rateMasterInfo.YearRange = await RateMasterCV.findAll({
                where: { Year, ZoneSectionNo, TypeOfUseID: "R" },

                attributes: [[
                    sequelize.fn(
                        "concat",
                        sequelize.col("MinYear"),
                        "-",
                        sequelize.col("MaxYear")
                    ),
                    "Year",
                ]],
                group: ['MinYear', 'MaxYear']
            });

            rateMasterInfo.ResidentialRateChart = await RateMasterCV.findAll({
                where: { Year, ZoneSectionNo, TypeOfUseID: "R" },
                attributes: ['ConstructionID', 'ZoneNo', ['RateSquareMeter', "Rate"]]
            });

            rateMasterInfo.RateChartInfo = await RateChartMaster.findAll({
                where: { Year, ZoneSectionNo },
            })

            // if (rateChartInfo) {
            //     rateMasterInfo.CommercialMultiplier = rateChartInfo.CommercialMultiplier || 0;
            //     rateMasterInfo.IndustrialMultiplier = rateChartInfo.IndustrialMultiplier || 0;
            //     if (rateChartInfo.CommMultiplierAppliedToZone)
            //         rateMasterInfo.CommZone = rateChartInfo.CommMultiplierAppliedToZone.split(',');
            // }
            res.status(200).json(rateMasterInfo);
        } catch (error) {
            console.error('Error getting Rate Master:', error);
            res.status(500).json({
                error: 'An error occurred while getting Rate Master.',
            });
        }
    }
};

export const saveRateMasterInfo = async (req, res) => {
    // Payload can be one object or an array of objects

    const items = Array.isArray(req.body) ? req.body : [req.body];
    console.log(items, 'items')
    const rateSqFt = Number(process.env.RATE_SQUARE_FEET || 0.092903); // fallback if needed

    // Models you already have:
    // RateMaster, RateMasterCV, RateChartMaster, FloorMaster, TypeofUsePrime

    try {
        // ---- basic validations (array-level + per-item) ----
        if (!items.length) {
            return res.status(400).json({ message: 'Payload is empty.' });
        }

        for (const it of items) {
            if (!it.ZoneSectionNo) {
                return res.status(402).json({ message: 'ZoneSectionNo is required.' });
            }
            if (!/^\d{4}$/.test(String(it.Year || '').trim())) {
                return res.status(402).json({ message: 'Year must be exactly 4 digits.' });
            }
            if (!Number.isInteger(Number(it.MinYear)) || !Number.isInteger(Number(it.MaxYear))) {
                return res.status(402).json({ message: 'Min/Max Year must be numeric.' });
            }
            if (Number(it.MinYear) > Number(it.MaxYear)) {
                return res.status(402).json({ message: 'Min Year cannot be greater than Max Year.' });
            }
            if (it.ZoneNo === undefined || it.ZoneNo === null || it.ZoneNo === '') {
                return res.status(402).json({ message: 'ZoneNo is required per item.' });
            }
            if (!it.ResidentialRateChart || Object.keys(it.ResidentialRateChart).length === 0) {
                return res.status(402).json({ message: 'ResidentialRateChart cannot be empty.' });
            }

            // For multiplier mode (when TypeOfUseID is not provided), multipliers must be numeric
            if (!it.TypeOfUseID) {
                if (Number.isNaN(Number(it.IndustrialMultiplier)) || Number.isNaN(Number(it.CommercialMultiplier))) {
                    return res.status(402).json({ message: `Multipliers must be numeric (zone ${it.ZoneNo}).` });
                }
                if (it.ZoneNo != "Z") {
                    if (Number(it.IndustrialMultiplier) <= 0 || Number(it.CommercialMultiplier) <= 0) {
                        return res.status(402).json({ message: `Multipliers must be > 0 (zone ${it.ZoneNo}).` });
                    }
                }
            }

            if (!it.TypeOfRate || !['CV', 'RV'].includes(String(it.TypeOfRate).toUpperCase())) {
                return res.status(402).json({ message: 'TypeOfRate must be CV or RV.' });
            }
        }

        // ---- Fetch common reference lists once ----
        const [floorList, typeOfUseList] = await Promise.all([
            FloorMaster.findAll(),
            TypeofUsePrime.findAll()
        ]);

        if (!floorList.length) return res.status(402).json({ message: 'Floors not available.' });
        if (!typeOfUseList.length) return res.status(402).json({ message: 'Type of Uses not available.' });

        // Map full Type list for quick lookups
        const allTypes = typeOfUseList.map(t => t.Type); // e.g., ['C','I','R',...]

        // ---- For each item (per zone), delete old + insert new ----
        for (const it of items) {
            const yearNum = Number(it.Year);
            const minYearNum = Number(it.MinYear);
            const maxYearNum = Number(it.MaxYear);
            const zoneSectionNo = it.ZoneSectionNo;
            const zoneNo = it.ZoneNo;
            const typeOfRateUpper = String(it.TypeOfRate).toUpperCase(); // 'CV' or 'RV'
            const Model = typeOfRateUpper === 'CV' ? RateMasterCV : RateMaster;

            // Flatten ResidentialRateChart: { [ConstructionId]: { [ZoneNo]: rate } }
            // We only insert rows matching this item's zoneNo
            const residentialRateList = [];
            for (const constructionId of Object.keys(it.ResidentialRateChart)) {

                const perZoneMap = it.ResidentialRateChart[constructionId] || {};
                console.log(zoneNo, 'perZoneMap')


                console.log(perZoneMap.hasOwnProperty(zoneNo), 'perZoneMap.hasOwnProperty(zoneNo)')
                if (perZoneMap.hasOwnProperty(zoneNo)) {
                    residentialRateList.push({
                        ConstructionID: constructionId,
                        ZoneNo: zoneNo,
                        Rate: Number(perZoneMap[zoneNo]) ? Number(perZoneMap[zoneNo]) : 0
                    });
                } else {
                    residentialRateList.push({
                        ConstructionID: constructionId,
                        ZoneNo: zoneNo,
                        Rate: 0
                    });
                }
            }

            if (!residentialRateList.length) {
                // No base rate provided for this zone—skip or error as you prefer
                // Here we’ll error:
                return res.status(402).json({
                    message: `No residential rate entries found for Zone ${zoneNo}.`
                });
            }

            // 1) Delete existing rows for this (Year + ZoneSectionNo + ZoneNo) in correct table
            await Model.destroy({
                where: { Year: yearNum, ZoneSectionNo: zoneSectionNo, ZoneNo: zoneNo }
            });

            // 2) Build the list of types to insert:
            let typesToInsert = allTypes;
            const usingType = !!it.TypeOfUseID;
            if (usingType) {
                // Only insert for the selected type
                typesToInsert = allTypes.filter(t => String(t).toUpperCase() === String(it.TypeOfUseID).toUpperCase());
                if (!typesToInsert.length) {
                    return res.status(402).json({ message: `Invalid TypeOfUseID ${it.TypeOfUseID} for Zone ${zoneNo}.` });
                }
            }

            // 3) Insert combinations
            for (const floor of floorList) {
                for (const typeCode of typesToInsert) {
                    for (const resRate of residentialRateList) {
                        const baseRate = Number(resRate.Rate) || 0;
                        let rateSqM = baseRate;
                        if (zoneNo === "Z") {
                            baseRate = 0;  // Set rate to 0 for all types if ZoneNo is "Z"
                            rateSqM = 0;   // Set multipliers to 0 if ZoneNo is "Z"
                            it.IndustrialMultiplier = 0;  // Set multipliers to 0
                            it.CommercialMultiplier = 0;
                        }

                        if (!usingType) {
                            // multiplier mode
                            const t = String(typeCode).toUpperCase();
                            if (t === 'C') {
                                rateSqM = baseRate * Number(it.CommercialMultiplier);
                            } else if (t === 'I') {
                                rateSqM = baseRate * Number(it.IndustrialMultiplier);
                            } else {
                                rateSqM = baseRate; // other types unchanged
                            }
                        } else {
                            // using-type mode: multipliers are effectively 1
                            rateSqM = baseRate;
                        }

                        const rateSqFtVal = rateSqM * rateSqFt;

                        // Only insert meaningful rows
                        if (yearNum > 0 && rateSqM > 0) {
                            await Model.create({
                                Year: yearNum,
                                ZoneNo: zoneNo,
                                ConstructionID: resRate.ConstructionID,
                                TypeOfUseID: typeCode,              // for using-type limited to selected type
                                RateSquareMeter: rateSqM,
                                RateSquareFeet: rateSqFtVal,
                                FloorID: floor.FloorID,
                                MinYear: minYearNum,
                                MaxYear: maxYearNum,
                                ZoneSectionNo: zoneSectionNo,
                                Remark: 'Normal Rate',
                             
                                CreatedDate:new Date(),
                                UpdatedDate:new Date()
                            });
                        }
                    }
                }
            }
        }

        // ---- (Optional) RateChartMaster handling ----
        // If you still need a summary row in RateChartMaster per Year + ZoneSectionNo,
        // we’ll rebuild a simple entry from the first item, and store the zones with commercial multiplier > 1
        try {
            const first = items[0];
            const yearNum = Number(first.Year);
            const zoneSectionNo = first.ZoneSectionNo;

            // Build rows: one per zone
            const masterRows = items.map(it => ({
                Year: Number(it.Year),
                ZoneSectionNo: it.ZoneSectionNo,
                CommMultiplierAppliedToZone: String(it.ZoneNo),
                IndustrialMultiplier: Number(it.IndustrialMultiplier || 1),
                CommercialMultiplier: Number(it.CommercialMultiplier || 1),
                MinYear: Number(it.MinYear),
                MaxYear: Number(it.MaxYear)
            }));


            await RateChartMaster.bulkCreate(masterRows, {
                updateOnDuplicate: [
                    'IndustrialMultiplier',
                    'CommercialMultiplier',
                    'MinYear',
                    'MaxYear'
                ]
            });
        } catch (err) {
            console.error('Error saving RateChartMaster per zone:', err);
            // Not fatal for main operation
        }

        return res.status(200).json({ message: 'Rate Master created successfully.' });
    } catch (error) {
        console.error('Main saveRateMasterInfo error:', error);
        return res.status(500).json({
            message: 'Failed to update/create Rate Master',
            error: error.stack
        });
    }
};



export const deleteRateMasterInfo = async (req, res) => {
    console.log(req.body, 'Year, Type, ZoneSection')
    const { Year, Type, ZoneSection } = req.body;

    try {



        if (Type === 'RV') {
            if (Number.isInteger(Year) && Year > 0) {
                // Retrieve the TypeofUsePrime record to get the 'type'
                const RateMasterInfo = await RateMaster.findOne({ where: { Year: Year, ZoneSectionNo: ZoneSection } });
                if (!RateMasterInfo)
                    return res.status(203).json({ message: 'Rate Master record not found' });

                const result = await RateMaster.destroy({ where: { Year: Year, ZoneSectionNo: ZoneSection } });
                if (result > 0) {
                    await RateChartMaster.destroy({ where: { Year: Year, ZoneSectionNo: ZoneSection } })
                    res.status(200).json({ message: 'Rate Master deleted successfully' });
                }
                else {
                    res.status(203).json({ message: 'Records Not Found' });
                }
            }
            else {
                return res.status(400).json({
                    message: 'Year can not be type of string or zero'
                });
            }
        } else {

            if (Number.isInteger(Year) && Year > 0) {
                // Retrieve the TypeofUsePrime record to get the 'type'
                const RateMasterInfo = await RateMasterCV.findOne({ where: { Year: Year, ZoneSectionNo: ZoneSection } });
                if (!RateMasterInfo)
                    return res.status(203).json({ message: 'Rate Master record not found' });

                const result = await RateMasterCV.destroy({ where: { Year: Year, ZoneSectionNo: ZoneSection } });
                if (result > 0) {
                    await RateChartMaster.destroy({ where: { Year: Year, ZoneSectionNo: ZoneSection } })
                    res.status(200).json({ message: 'Rate Master deleted successfully' });
                }
                else {
                    res.status(203).json({ message: 'Records Not Found' });
                }
            }
            else {
                return res.status(400).json({
                    message: 'Year can not be type of string or zero'
                });
            }

        }
    } catch (error) {
        console.error('Error getting Rate Master:', error);
        res.status(500).json({
            error: 'An error occurred while deleting Rate Master.',
        });
    }
};


// Example: Get all "Type" values
export const getAllTypes = async (req, res) => {
    try {
        const types = await TypeofUsePrime.findAll({
            attributes: ['ID', 'Type']
        });

        res.status(200).json(types);
    } catch (error) {
        console.error('Error fetching types:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};




// get rate master
export const getRateMasterByYearTypeZones = async (req, res) => {
    try {
        const { Year, TypeOfUseID, ZoneNos } = req.body;

        if (!Year || !TypeOfUseID || !Array.isArray(ZoneNos) || ZoneNos.length === 0) {
            return res.status(400).json({ message: 'Year, TypeOfUseID, and ZoneNos are required' });
        }

        const rateMasters = await RateMaster.findAll({
            where: {
                Year,
                TypeOfUseID,
                ZoneNo: ZoneNos
            }
        });

        if (rateMasters.length === 0) {
            return res.status(404).json({ message: 'No rate master data found for the given criteria' });
        }

        return res.status(200).json(rateMasters);
    } catch (error) {
        console.error('Error fetching rate master:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const fetchRangeForType = async (req, res) => {
    try {
        const rateMaster = await RateMaster.findAll()
        const rateMasterCV = await RateMasterCV.findAll()

        const result = { ...rateMaster, ...rateMasterCV }
        return res.status(200).json(result)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
