

import sequelize from '../../config/connectionDB.js';
import { Op, QueryTypes } from 'sequelize';
import AssessmentMaster from '../../models/models/assessmentmaster.js';

export const saveCouncilInfo = async (req, res) => {
  try {
    const {
      AssessmentID,
      NPTitle,
      NPTitleMarathi,
      NPAddress,
      NPAddressInMarathi,
      NPRemark,
      NPContactNo,
      NPEmail,
      NPWebsite,
      FromYear,
      ToYear,
      MaxYear,
      MinRV,
      ThirdPartyName,
      ThirdPartyAddress,
      ThirdPartyContact,
      ThirdPartyWebSite,
      ThirdPartyEmail,
      ThirdPartyRemark,
      ActiveStatus,
      ThirdPartyCopyRight,
      PartyNameInMarathi,
      PartyAddressInMarathi,
      NPPrefix,
      UserID
    } = req.body;
  
    //const safeTitle = NPTitle?.toString().trim().replace(/\s+/g, '_');

    // Only set new paths if files uploaded
    const NPImage = req.files?.NPImage?.[0]
      ? `/Council/${NPTitle}/NPImage/${req.files.NPImage[0].filename}`
      : undefined;
    const NPIcon = req.files?.NPIcon?.[0]
      ? `/Council/${NPTitle}/NPIcon/${req.files.NPIcon[0].filename}`
      : undefined;
    const ThirdPartyImage = req.files?.ThirdPartyImage?.[0]
      ? `/Council/${NPTitle}/ThirdpartyProvider/ThirdPartyImage/${req.files.ThirdPartyImage[0].filename}`
      : undefined;
    const ThirdPartyIcon = req.files?.ThirdPartyIcon?.[0]
      ? `/Council/${NPTitle}/ThirdpartyProvider/ThirdPartyIcon/${req.files.ThirdPartyIcon[0].filename}`
      : undefined;

    const Id = AssessmentID ? parseInt(AssessmentID) : 0;

    let council = await AssessmentMaster.findOne({ where: { AssessmentID: Id } });

    if (!council) {
      // Create new
      council = await AssessmentMaster.create({
        AssessmentID: Id,
        NPTitle,
        NPTitleMarathi,
        NPAddress,
        NPAddressInMarathi,
        NPRemark,
        NPContactNo,
        NPEmail,
        NPWebsite,
        NPImage: NPImage || null,
        NPIcon: NPIcon || null,
        ThirdPartyImage: ThirdPartyImage || null,
        ThirdPartyIcon: ThirdPartyIcon || null,
        FromYear,
        ToYear,
        MaxYear,
        MinRV,
        ThirdPartyName,
        ThirdPartyAddress,
        ThirdPartyContact,
        ThirdPartyWebSite,
        ThirdPartyEmail,
        ThirdPartyRemark,
        ActiveStatus,
        ThirdPartyCopyRight,
        PartyNameInMarathi,
        PartyAddressInMarathi,
        NPPrefix,
        CreatedBy:UserID,
        CreatedDate: new Date(),
      });

      return res.status(200).json({ message: 'Council details added successfully', CouncilInfo: council });
    } else {
      // Update existing: only overwrite if new file uploaded
      await council.update({
        NPTitle,
        NPTitleMarathi,
        NPAddress,
        NPAddressInMarathi,
        NPRemark,
        NPContactNo,
        NPEmail,
        NPWebsite,
        NPImage: NPImage ?? council.NPImage,
        NPIcon: NPIcon ?? council.NPIcon,
        ThirdPartyImage: ThirdPartyImage ?? council.ThirdPartyImage,
        ThirdPartyIcon: ThirdPartyIcon ?? council.ThirdPartyIcon,
        FromYear,
        ToYear,
        MaxYear,
        MinRV,
        ThirdPartyName,
        ThirdPartyAddress,
        ThirdPartyContact,
        ThirdPartyWebSite,
        ThirdPartyEmail,
        ThirdPartyRemark,
        ActiveStatus,
        ThirdPartyCopyRight,
        PartyNameInMarathi,
        PartyAddressInMarathi,
        UpdatedDate: new Date(),
        UpdatedBy:UserID,
        NPPrefix,
      });

      return res.status(201).json({ message: 'Council details updated successfully', CouncilInfo: council });
    }
  } catch (error) {
    console.error('❌ Error saving council info:', error);
    res.status(500).json({ message: 'Failed to save council info', error: error.message });
  }
};

export const getCouncilInfo = async (req, res) => {
  try {
    const council = await AssessmentMaster.findOne();
    if (!council) {
      return res.status(404).json({ error: 'No council found' });
    }

    const data = council.toJSON();

    // 🧠 Buffer → string (path)
    const normalize = (val) => {
      if (!val) return null;
      if (Buffer.isBuffer(val)) return val.toString('utf8');
      if (val?.type === 'Buffer') return Buffer.from(val.data).toString('utf8');
      return val;
    };

    ['NPImage','NPIcon','ThirdPartyImage','ThirdPartyIcon'].forEach(k => {
      data[k] = normalize(data[k]);
    });

    const BASE_URL = `${req.protocol}://${req.get('host')}/Tax_Assessment_NTIS_Backend`;

    ['NPImage','NPIcon','ThirdPartyImage','ThirdPartyIcon'].forEach(k => {
      if (data[k] && !data[k].startsWith('http')) {
        data[k] = `${BASE_URL}${data[k]}`;
      }
    });

    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

