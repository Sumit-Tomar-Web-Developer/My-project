import TransYearMast from "../../../models/models/transyearmast.js";



export const getYear = async (re, res) => {
    try {
      const getyear = await TransYearMast.findAll();
      res.status(200).json(getyear);
    } catch (error) {
      console.error("Error getting year Details:", error);
      res.status(500).json({
        error: "An error occurred while getting year Details.",
      });
    }
  };