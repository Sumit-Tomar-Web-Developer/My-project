import sequelize from "../../config/connectionDB.js";


export const getDailyCollectionReportData = async (req, res) => {
    try {
        const requestInfo = req.body.requestInfo;
        // console.log(requestInfo, 'Parmas');
        if (!requestInfo.FromDate && !requestInfo.ToDate) {
            return res.status(402).json({
                message: "From & To Date required."
            });
        }
        const storedProcedureName = 'prcGetDailyCollectionReport';
        sequelize.query(`CALL ${storedProcedureName}(:fromDate, :toDate)`, {
            replacements: { fromDate: requestInfo.FromDate, toDate: requestInfo.ToDate },
            type: sequelize.QueryTypes.SELECT,
        }).then(([results]) => {
            const formattedResults = Object.values(results);
            res.status(200).json({ Response: formattedResults });
        }).catch((error) => {
            res.status(500).json({ error: "An error occurred in stored procedure.", details: error.message });
        });

    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching report info.", mainError: error.message });
    }
};


