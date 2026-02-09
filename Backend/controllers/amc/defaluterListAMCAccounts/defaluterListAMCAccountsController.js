import sequelize from "../../../config/connectionDB.js";
import CombinedOwnerName from "../../../models/models/combinedownerrenternames.js";
import PropertyMast from '../../../models/models/propertymast.js';
import { TaxPendingDetails } from '../../../models/models/taxpendingdetails.js';
import { where, literal, Op } from "sequelize";

export const fetchGetProperties = async (req, res) => {
    const {
        selectWards,
        selectedPropertyNoFrom,
        selectedPropertyNoTo,
        year,
        penalty,
        topProperty,
        taxTotalGreater,
        penaltyDate,
        moreinfo
    } = req.body;
    console.log(req.body, 'req.body in fetchGetProperties');
    const propertyMastFields = ['BuildingOrShopNameMarathi', 'BuildingOrShopName', 'Address'];
    const combinedOwnerFields = ['OwnerName', 'RenterName', 'OccupierName', 'MarathiRenterName', 'MarathiOccupierName', 'MarathiOwnerName'];
    const allFieldsPending = ['All Taxes(Head Wise)P'];
    const allFieldsCurrent = ['All Taxes(Head Wise)C'];
    const propertyMastAttrs = moreinfo.filter(field => propertyMastFields.includes(field));
    const combinedOwnerAttrs = moreinfo.filter(field => combinedOwnerFields.includes(field));
    const allFieldsPendingAttrs = moreinfo.filter(field => allFieldsPending.includes(field));
    const allFieldsCurrentAttrs = moreinfo.filter(field => allFieldsCurrent.includes(field));
    console.log('allFieldsCurrentAttrs', allFieldsCurrentAttrs);
    console.log('allFieldsPendingAttrs', allFieldsPendingAttrs);

    let allFieldsCurrentObj = [];
    let allFieldsPendingObj = [];

    let ownerIds = [];
    let propertyDetails = [];
    let ownerDetails = [];
    let currentBalanceDetails = [];
    let pendingBalanceDetails = [];
    let totalBalanceDetails = [];
    let penaltyCurrent = [];
    let penaltyPending = [];
    let prevPendingInterestList = [];
    let netTotal = [];

    try {
        // ✅ STEP 1: Get owner IDs
        if (Array.isArray(selectWards) && selectWards.length > 1) {
            for (const wardId of selectWards) {
                const wardOwnerIds = await PropertyMast.findAll({
                    attributes: ['OwnerID', 'NewWardNo', 'NewPropertyNo', 'NewPartitionNo', 'MobileNo', 'EmailID', ...propertyMastAttrs],
                    where: { NewWardNo: wardId },
                    raw: true
                });

                // Extract only OwnerIDs
                ownerIds.push(...wardOwnerIds.map(owner => owner.OwnerID));

                // Extract the other details
                propertyDetails.push(...wardOwnerIds.map(owner => ({
                    // OwnerID: owner.OwnerID, // Keep OwnerID to link with balances etc.
                    NewWardNo: owner.NewWardNo,
                    NewPropertyNo: owner.NewPropertyNo,
                    NewPartitionNo: owner.NewPartitionNo,
                    ModebileNo: owner.MobileNo,
                    EmailID: owner.EmailID,
                    ...(propertyMastAttrs.reduce((acc, field) => ({ ...acc, [field]: owner[field] }), {
                    }))
                })));

            }
        } else {
            const castedCondition = where(
                literal('CAST(NewPropertyNo AS UNSIGNED)'),
                { [Op.between]: [Number(selectedPropertyNoFrom), Number(selectedPropertyNoTo)] }
            );

            const wardOwnerIds = await PropertyMast.findAll({
                attributes: ['OwnerID', 'NewWardNo', 'NewPropertyNo', 'NewPartitionNo', 'MobileNo', 'EmailID', ...propertyMastAttrs],
                where: {
                    NewWardNo: selectWards[0],
                    [Op.and]: [castedCondition]
                },
                raw: true
            });

            ownerIds.push(...wardOwnerIds.map(owner => owner.OwnerID));

            // Extract the other details
            propertyDetails.push(...wardOwnerIds.map(owner => ({
                // OwnerID: owner.OwnerID, // Keep OwnerID to link with balances etc.
                NewWardNo: owner.NewWardNo,
                NewPropertyNo: owner.NewPropertyNo,
                NewPartitionNo: owner.NewPartitionNo,
                ModebileNo: owner.MobileNo,
                EmailID: owner.EmailID,
                ...(propertyMastAttrs.reduce((acc, field) => ({ ...acc, [field]: owner[field] }), {
                }))
            })));

        }

        // ✅ STEP 2: Fetch owner info
        if (combinedOwnerAttrs.length > 0) {
            console.log(ownerIds, 'ownerIds fetched');
            for (const owner of ownerIds) {
                console.log(owner, 'ownerIds fetched');
                const ownerInfo = await CombinedOwnerName.findAll({
                    attributes: combinedOwnerAttrs,
                    where: { OwnerID: owner },
                    raw: true
                });
                ownerDetails.push(...ownerInfo);
            }
        }

        // ✅ STEP 3: Fetch balances for each owner
        if (selectWards.length > 1) {
            for (const owner of ownerIds) {
                const currentBalance = await sequelize.query(
                    `CALL funAMCGetCurrentBalance('', null, null, '', null, :ownerId, :year, null, null)`,
                    {
                        replacements: { ownerId: owner, year },
                        type: sequelize.QueryTypes.SELECT
                    }
                );

                const [pendingBalance] = await sequelize.query(
                    `CALL funAMCGetPendingBalance('', null, null, '', null, :ownerId, :year, null, null)`,
                    {
                        replacements: { ownerId: owner, year },
                        type: sequelize.QueryTypes.SELECT
                    }
                );

                if (allFieldsCurrentAttrs.length) {
                    allFieldsCurrentObj.push(currentBalance[2])
                }
                if (allFieldsPendingAttrs.length) {
                    allFieldsPendingObj.push(pendingBalance)
                }
                const totalCurrent = currentBalance[2]?.TotalTax || 0;
                const totalPending = pendingBalance?.TotalTax || 0;

                currentBalanceDetails.push({ OwnerID: owner, TotalTax: totalCurrent });
                pendingBalanceDetails.push({ OwnerID: owner, TotalTax: totalPending });
                totalBalanceDetails.push({ OwnerID: owner, TotalBalance: totalCurrent + totalPending });
            }
        } else {
            console.log('Single ward selected, fetching balances by property range');
            const currentBalance = await sequelize.query(
                `CALL funAMCGetCurrentBalance(:wardNo, :propertyNoFrom, :propertyNoTo, '', null, null, :year, null, null)`,
                {
                    replacements: { wardNo: selectWards[0], propertyNoFrom: selectedPropertyNoFrom, propertyNoTo: selectedPropertyNoTo, year },
                    type: sequelize.QueryTypes.SELECT
                }
            );

            const pendingBalance = await sequelize.query(
                `CALL funAMCGetPendingBalance(:wardNo, :propertyNoFrom, :propertyNoTo, '', null, null, :year, null, null)`,
                {
                    replacements: { wardNo: selectWards[0], propertyNoFrom: selectedPropertyNoFrom, propertyNoTo: selectedPropertyNoTo, year },
                    type: sequelize.QueryTypes.SELECT
                }
            );
            if (allFieldsCurrentAttrs.length) {

                allFieldsCurrentObj.push(currentBalance[3])
                console.log(allFieldsCurrentObj, 'allFieldsCurrentObj')
            }
            if (allFieldsPendingAttrs.length) {
                allFieldsPendingObj.push(pendingBalance[1])
                console.log(pendingBalance[1], 'pendingBalance')

            }
            console.log((Object.keys(currentBalance[3]).length), 'currentBalance[3].length')
            for (let i = 0; i < Object.keys(currentBalance[3]).length; i++) {
                const current = currentBalance[3][i];
                const pending = pendingBalance[1][i] || {};

                const currentTax = Number(current?.TaxTotal || 0);
                const pendingTax = Number(pending?.TaxTotal || 0);

                console.log(currentTax, 'currentTax');
                console.log(pendingTax, 'pendingTax');

                currentBalanceDetails.push({
                    OwnerID: current?.OwnerID || null,
                    TotalTax: currentTax
                });

                pendingBalanceDetails.push({
                    OwnerID: pending?.OwnerID || current?.OwnerID || null,
                    TotalTax: pendingTax
                });

                totalBalanceDetails.push({
                    OwnerID: current?.OwnerID || null,
                    TotalBalance: currentTax + pendingTax
                });
                console.log(totalBalanceDetails,'totalBalanceDetails')
            }
        }

        // ✅ STEP 4: Fetch interest & penalties
        for (const owner of ownerIds) {
            // Interest
            console.log(owner, 'Calculating interest and penalties for owner');
            const prevPendingInterest = await TaxPendingDetails.findOne({
                attributes: ['Interest'],
                where: { OwnerID: owner },
                raw: true
            });
            const interest = Number(prevPendingInterest?.Interest || 0);
            prevPendingInterestList.push(interest);

            // Current penalty
            if (penalty.currentPenalty) {
                const currentPenalty = await sequelize.query(
                    `CALL funAMCcalculateCurrentPenalty(:ownerId,:year,null,null,null,null,:date)`,
                    {
                        replacements: { ownerId: owner, year, date: new Date(penaltyDate) },
                        type: sequelize.QueryTypes.SELECT
                    }
                );

                const penaltyObj = currentPenalty[currentPenalty.length - 2];
                penaltyCurrent.push(penaltyObj ? penaltyObj['0'].Penalty : 0);
                console.log(penaltyObj, 'currentPenalty')
            } else {
                penaltyCurrent.push(0);
            }

            // Pending penalty
            if (penalty.pendingPenalty) {
                const pendingPenalty = await sequelize.query(
                    `CALL funAMCcalculatePendingPenalty(:ownerId,:year,null,null,:date)`,
                    {
                        replacements: { ownerId: owner, year, date: new Date(penaltyDate) },
                        type: sequelize.QueryTypes.SELECT
                    }
                );
                const penaltyPendingObj = pendingPenalty[2];
                penaltyPending.push(penaltyPendingObj ? penaltyPendingObj['0'].Penalty : 0);
                console.log(penaltyPendingObj, 'penaltyObjPending')
            } else {
                penaltyPending.push(0);
            }
        }

        // ✅ STEP 5: Calculate Grand Total
        netTotal = totalBalanceDetails.map((item, index) => {
            const interest = prevPendingInterestList[index] || 0;
            const currentPen = penaltyCurrent[index] || 0;
            const pendingPen = penaltyPending[index] || 0;
            return {
                OwnerID: item.OwnerID,
                GrandTotal: (item.TotalBalance || 0) + interest + currentPen + pendingPen
            };
        });

        // ✅ STEP 6: Filter by Total Tax (if taxTotalGreater is passed)
        if (taxTotalGreater && !isNaN(Number(taxTotalGreater))) {
            const minTax = Number(taxTotalGreater);

            const filteredOwnerIds = totalBalanceDetails
                .filter(item => item.TotalBalance > minTax)
                .map(item => item.OwnerID);

            ownerDetails = ownerDetails.filter(o => filteredOwnerIds.includes(o.OwnerID));
            currentBalanceDetails = currentBalanceDetails.filter(o => filteredOwnerIds.includes(o.OwnerID));
            pendingBalanceDetails = pendingBalanceDetails.filter(o => filteredOwnerIds.includes(o.OwnerID));
            totalBalanceDetails = totalBalanceDetails.filter(o => filteredOwnerIds.includes(o.OwnerID));
            netTotal = netTotal.filter(o => filteredOwnerIds.includes(o.OwnerID));
        }
        if (topProperty && !isNaN(Number(topProperty))) {
            const topN = Number(topProperty);

            // Sort netTotal by GrandTotal in descending order and get top N
            const topOwners = netTotal
                .sort((a, b) => (b.GrandTotal || 0) - (a.GrandTotal || 0))
                .slice(0, topN)
                .map(item => item.OwnerID);

            ownerDetails = ownerDetails.filter(o => topOwners.includes(o.OwnerID));
            currentBalanceDetails = currentBalanceDetails.filter(o => topOwners.includes(o.OwnerID));
            pendingBalanceDetails = pendingBalanceDetails.filter(o => topOwners.includes(o.OwnerID));
            totalBalanceDetails = totalBalanceDetails.filter(o => topOwners.includes(o.OwnerID));
            netTotal = netTotal.filter(o => topOwners.includes(o.OwnerID));
        }
        console.log(propertyDetails, 'propertyDetails')
        // ✅ Final Response
        return res.status(200).json({
            success: true,
            message: 'Properties fetched successfully',
            data: {
                ownerIds: ownerIds.map(id => ({ OwnerID: id })),
                propertyDetails: propertyDetails,
                ownerDetails,
                allFieldsCurrent: allFieldsCurrentObj,
                allFieldsPending: allFieldsPendingObj,
                currentBalanceDetails,
                pendingBalanceDetails,
                totalBalanceDetails,
                prevPendingInterestList,
                penaltyCurrent,
                penaltyPending,
                netTotal
            }
        });

    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching properties',
            error: error.message
        });
    }
};













export const sendToAll = async (req, res) => {
    try {
        const response = {}; //Apply Store Procedure 
        return res.json(response);
    } catch (error) {
        throw error;
    }

}
export const sendToSelected = async (req, res) => {
    try {
        const response = {}; //Apply Store Procedure 
        return res.json(response);
    } catch (error) {
        throw error;
    }

}
export const importFromExcel = async (req, res) => {
    try {
        const response = {}; //Apply Store Procedure 
        return res.json(response);
    } catch (error) {
        throw error;
    }

}
export const exportToExcel = async (req, res) => {
    try {
        const response = {}; //Apply Store Procedure 
        return res.json(response);
    } catch (error) {
        throw error;
    }

}