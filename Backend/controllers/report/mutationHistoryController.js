import sequelize from "../../config/connectionDB.js";

export const getMutationReportData = async (req, res) => {
  try {
    const OwnerID = req.body.requestInfo.OwnerID;
    const storedProcedureName = 'GetMutationHistoryDetails';

    sequelize.query(`CALL ${storedProcedureName}(:p_OwnerID)`, {
      replacements: { p_OwnerID: OwnerID },
      type: sequelize.QueryTypes.SELECT,
    }).then(([results]) => {
      const formattedResults = Object.values(results);
      res.status(200).json({ Response: formattedResults });
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching report info.", mainError: error.message });
  }
};


