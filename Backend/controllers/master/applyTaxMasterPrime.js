import { ApplyTaxMasterPrime } from "../../models/models/applytaxesmasterprime.js";
import TypeofUseMaster from "../../models/models/typeofusemaster.js"
import TypeOfUsePrimeMaster from '../../models/models/typeofuseprimemaster.js'




// Fetch Apply Tax Prime List

export const getApplyTaxPrimeList = async (req, res) => {
  try {
    console.log('controller is running')
    const applyTaxList = await ApplyTaxMasterPrime.findAll();
    console.log(applyTaxList, 'applyTaxList')
    res.status(200).json(applyTaxList);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Update Apply Tax Prime List

export const patchApplyTaxPrime = async (req, res) => {
  const dataToUpdate = req.body;

  try {

    for (let i = 0; i < dataToUpdate.length; i++) {
      const { id } = dataToUpdate[i];
      const updateData = dataToUpdate[i];
      const CreatedDate = new Date();

      const applyTaxList = await ApplyTaxMasterPrime.findByPk(id);

      if (!applyTaxList) {
        return res.status(203).json({ message: `Record with AtmId ${id} not found` });
      }

      console.log("applyTaxList:", applyTaxList);

      await applyTaxList.update({
        ...updateData,
        CreatedDate,
      });
    }

    res.status(200).json({ message: "Lists Updated Successfully" });
  } catch (error) {
    console.error("Error in patchApplyTaxPrime:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
export const getTypeOFUseMasterPrime = async(req,res)=>{
  try {
    console.log('controller is running')
    const applyTaxList = await TypeOfUsePrimeMaster.findAll();
    console.log(applyTaxList, 'applyTaxList')
    res.status(200).json(applyTaxList);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
export const getTypeOFUseMaster = async(req,res)=>{
  try {
    console.log('controller is running')
    const applyTaxList = await TypeofUseMaster.findAll();
    console.log(applyTaxList, 'applyTaxList')
    res.status(200).json(applyTaxList);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
