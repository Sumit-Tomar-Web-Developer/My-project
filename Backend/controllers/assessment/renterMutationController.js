import CombinedOwnerName from '../../models/models/combinedownerrenternames.js';
import JoinOwnerDetails from '../../models/models/jointownerdetails.js';
import RenterMutation from '../../models/models/mutationrenterdetails.js';
import PropertyDetailsNew from '../../models/models/propertydetailsnew.js';

// API handler using the helper function
export const getRenterMutationDataByOwnerID = async (req, res) => {
  const { OwnerID } = req.body;
  const result = await fetchRenterMutationDataByOwnerID(OwnerID);
  if (result.success) {
    return res.status(200).json({ RenterInfo: result.renterData });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

// Helper function to fetch data directly
export const fetchRenterMutationDataByOwnerID = async (OwnerID) => {
  try {
    if (OwnerID > 0) {
      const jointOwnerInfo = await JoinOwnerDetails.findAll({
        where: { OwnerID: OwnerID },
      });

      const prevRenterTransferDetails = await RenterMutation.findAll({
        where: { OwnerID: OwnerID },
      });

      const propertyDetailsNew = await PropertyDetailsNew.findAll({
        where: { OwnerID: OwnerID },
      });

      // Combine all results into a single object
      const renterData = {
        jointOwnerInfo,
        prevRenterTransferDetails,
        propertyDetailsNew,
      };
      return { success: true, renterData };
    } else {
      return { success: false, message: 'OwnerID must be greater than zero.' };
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      success: false,
      message: 'Internal server error',
      error: error.message,
    };
  }
};

export const saveRenterMutationInfo = async (req, res) => {
  const { RenterInfo } = req.body;
  const UpdateRenterNameInCombined = async (ownerId) => {
    const pdnData = await PropertyDetailsNew.findAll({
      where: { OwnerID: ownerId },
    });
    let renterName = '',
      occName = '',
      renterNameMar = '',
      occNameMar = '';

    for (const pdnInfo of pdnData) {
      renterName +=
        (pdnInfo.RenterName === null ? '' : pdnInfo.RenterName) + ',';
      occName +=
        (pdnInfo.OccupierName === null ? '' : pdnInfo.OccupierName) + ',';
      renterNameMar +=
        (pdnInfo.RenterNameMarathi === null ? '' : pdnInfo.RenterNameMarathi) +
        ',';
      occNameMar +=
        (pdnInfo.OccupierNameMarathi === null
          ? ''
          : pdnInfo.OccupierNameMarathi) + ',';
    }

    renterName = renterName.replace(/,\s*$/, '');
    renterNameMar = renterName.replace(/,\s*$/, '');
    occName = renterName.replace(/,\s*$/, '');
    occNameMar = renterName.replace(/,\s*$/, '');

    await CombinedOwnerName.update(
      {
        RenterName: renterName,
        MarathiRenterName: renterNameMar,
        OccupierName: occName,
        MarathiOccupierName: occNameMar,
      },
      {
        where: { OwnerID: ownerId },
      }
    );
  };
  const IsAlreadyExists = async (pdnId, occName, renterName) => {
    const transferInfo = await RenterMutation.findOne({
      where: {
        PDNID: pdnId,
        CurrentRenter: renterName,
        CurrentOccupier: occName,
      },
    });
    if (transferInfo) return false;
    else return true;
  };
  try {
    if (Array.isArray(RenterInfo)) {
      for (const renterDetails of RenterInfo) {
        if (renterDetails.PDNID && renterDetails.PDNID > 0) {
          if (
            await IsAlreadyExists(
              renterDetails.PDNID,
              renterDetails.CurrentOccupier,
              renterDetails.CurrentRenter
            )
          ) {
            const renterResponse = await RenterMutation.create({
              ...renterDetails,
            });
            if (renterResponse) {
              await PropertyDetailsNew.update(
                {
                  RenterName: renterDetails.CurrentRenter,
                  RenterNameMarathi: renterDetails.MCurrentRenter,
                  OccupierName: renterDetails.CurrentOccupier,
                  OccupierNameMarathi: renterDetails.MCurrentOccupier,
                },
                { where: { PDNId: renterDetails.PDNID } }
              );
            }
          } else
            return res
              .status(202)
              .json({ message: 'Renter or Occupier Name already exists.' });
        } else
          return res.status(400).json({ message: 'PDNID greater than zero.' });
      }
    } else return res.status(404).json({ message: 'No Records found.' });
    await UpdateRenterNameInCombined(RenterInfo[0].OwnerID);
    const result = await fetchRenterMutationDataByOwnerID(
      RenterInfo[0].OwnerID
    );
    return res
      .status(200)
      .json({ message: 'Renter Details updated successfully', result });
  } catch (error) {
    console.error('Error saving renter Info:', error.message);
    return res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
};
