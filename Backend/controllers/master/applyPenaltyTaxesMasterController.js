import  ApplyPenaltyTaxesMaster  from "../../models/models/applypenaltytaxesmaster.js";

export const getApplyTaxPenaltyMasterList = async (req, res) => {
  try {
    const penaltyList = await ApplyPenaltyTaxesMaster.findAll( );
    console.log(penaltyList)
    res.status(200).json(penaltyList);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const patchApplyPenaltyTaxPrime = async (req, res) => {
  const dataToUpdate = req.body;

  try {
    for (let i = 0; i < dataToUpdate.length; i++) {
      const { id } = dataToUpdate[i];
      const updateData = { ...dataToUpdate[i] };
      const CreatedDate = new Date();

      let applyPenaltyList = await ApplyPenaltyTaxesMaster.findByPk(id);

      if (!applyPenaltyList) {
        applyPenaltyList = await ApplyPenaltyTaxesMaster.create({
          ...updateData,
          CreatedDate,
        });
      } else {
        applyPenaltyList = await applyPenaltyList.update({
          ...updateData,
          CreatedDate,
        });
      }

      console.log("Updated or inserted applyPenaltyList:", applyPenaltyList);
    }

    res.status(200).json({ message: "Lists Updated Successfully" });
  } catch (error) {
    console.error("Error in patchApplyPenaltyTaxPrime", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


