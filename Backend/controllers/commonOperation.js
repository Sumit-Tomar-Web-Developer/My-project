import sequelize from '../config/connectionDB.js';
import PropertyMast from '../models/models/propertymast.js';
import JoinOwnerDetails from '../models/models/jointownerdetails.js';
import { Op } from 'sequelize';
import AssessmentMaster from '../models/models/assessmentmaster.js';
import PageNameMaster from '../models/models/pagenamemaster.js';
import { OldPropertyMast } from '../models/models/oldpropertymast.js';

// get Wards
export const getAllWards = async (req, res) => {
  try {
    const wards = await PropertyMast.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('NewWardNo')), 'NewWardNo'],
      ],
      where: {
        NewWardNo: {
          [Op.notLike]: 'd_%',
        },
      },
      order: [['NewWardNo', 'ASC']],
    });
    res.json(wards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get From & to Property Range
export const getPropertyNoFromWard = async (req, res) => {
  try {
    const { NewWardNo } = req.params;
    const { from, to } = req.query;

    console.log(
      `Received parameters - Ward: ${NewWardNo}, From: ${from}, To: ${to}`
    );

    // const whereConditions = {
    //   NewWardNo: NewWardNo,
    // };

    // if (from && to) {
    //   whereConditions.NewPropertyNo = {
    //     [Op.between]: [parseInt(from), parseInt(to)],
    //   };
    // }

    // const PropertyRange = await PropertyMast.findAll({
    //   attributes: [
    //     [sequelize.col('NewPropertyNo'), 'NewPropertyNo'],
    //     [sequelize.col('OwnerID'), 'OwnerID'],
    //     [sequelize.col('NewPartitionNo'), 'NewPartitionNo'],
    //     [sequelize.col('NewWardNo'), 'NewWardNo'],
    //   ],
    //   where: whereConditions,
    // });

    const PropertyRange = await PropertyMast.findAll({
      attributes: [
        [
          sequelize.fn(
            'TRIM',
            sequelize.literal(
              `TRAILING '-' FROM CONCAT_WS('-', NewPropertyNo, NewPartitionNo)`
            )
          ),
          'prop',
        ],
        'NewWardNo',
        'NewPartitionNo',
        'NewPropertyNo',
        'OwnerID',
      ],
      where: {
        NewWardNo: NewWardNo,
        [Op.and]: [
          sequelize.where(
            sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
            Op.gte,
            from
          ),
          sequelize.where(
            sequelize.cast(sequelize.col('NewPropertyNo'), 'INTEGER'),
            Op.lte,
            to
          ),
        ],
      },
      order: sequelize.literal('`NewPropertyNo` + 1'),
    });

    res.json(PropertyRange);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPropPartNoFromWard = async (req, res) => {
  try {
    const PropertyRange = await PropertyMast.findAll({
      attributes: [
        [
          sequelize.fn(
            'TRIM',
            sequelize.literal(
              `TRAILING '-' FROM CONCAT_WS('-', NewPropertyNo, NewPartitionNo)`
            )
          ),
          'PropNo',
        ],
      ],
      where: {
        NewWardNo: req.params.NewWardNo,
      },
      order: sequelize.literal('`NewPropertyNo` + 1'),
    });
    res.json(PropertyRange);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Post Ward Number Selected and GET OwnerName, Property Number, Partition Number and OwnerId.
export const postWardSelection = async (req, res) => {
  const { wardNo } = req.body;

  if (!wardNo) {
    return res.status(400).json({ error: 'Ward number is required' });
  }
  try {
    const properties = await PropertyMast.findAll({
      attributes: ["NewWardNo", 'OwnerName', 'NewPropertyNo', 'OwnerID', 'NewPartitionNo'],
      where: {
        NewWardNo: wardNo,
      },
    });
    if (properties.length === 0) {
      return res
        .status(203)
        .json({ message: 'No properties found for the given ward number' });
    }
    return res.status(200).json({ message: 'Properties found', properties });
  } catch (error) {
    console.error('Error querying database:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Post Owner and Receive JointOwner Details Related to same OwnerID
export const postOwnerIdSelection = async (req, res) => {
  const { OwnerID } = req.body;

  if (!OwnerID) {
    return res.status(400).json({ error: 'Owner ID is required' });
  }
  try {
    const transferProperties = await JoinOwnerDetails.findAll({
      where: {
        OwnerID: OwnerID,
      },
    });
    if (transferProperties.length === 0) {
      return res.status(203).json({
        message: 'No Owner Details found for the given Owner ID',
      });
    }
    return res
      .status(200)
      .json({ message: 'Owner Details found', transferProperties });
  } catch (error) {
    console.error('Error querying database:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOwnerIdByWardPropPartNo = async (req, res) => {
  try {
    const { wdNo, propNo, partNo } = req.query;
    const PropertyRange = await PropertyMast.findOne({
      attributes: [[sequelize.col('OwnerID'), 'OwnerId']],
      where: {
        NewWardNo: wdNo,
        NewPropertyNo: propNo,
        NewPartitionNo: partNo,
      },
      order: sequelize.literal('`NewPropertyNo` + 1'),
    });
    res.json(PropertyRange);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch Assessment Information

export const getAssessmentInfo = async (req, res) => {
  try {
    const assessmentInfo = await AssessmentMaster.findOne({
      attributes: ['AssesmentID'],
    });
    res.status(200).json(assessmentInfo);
  } catch (error) {
    res.status(500).json({
      message: 'Internal Error Occurred',
      error: error.message,
    });
  }
};

//utility folders functions
export const FetchOwnerIdsAndOtherDetails = async (req, res) => {
  const { wardNo } = req.body;

  if (!wardNo) {
    return res.status(400).json({ error: 'Ward number is required' });
  }
  try {
    const properties = await PropertyMast.findAll({
      attributes: ['OwnerID', 'NewWardNo', 'NewPropertyNo', 'NewPartitionNo'],
      where: {
        NewWardNo: wardNo,
      },
    });
    if (properties.length === 0) {
      return res
        .status(203)
        .json({ message: 'No properties found for the given ward number' });
    }
    return res.status(200).json({ message: 'Properties found', properties });
  } catch (error) {
    console.error('Error querying database:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
export const fetchOwnerDetailsByWdAndProp = async (req, res) => {
  try {
    const { wardNo, property } = req.body.data;
    const result = await PropertyMast.findAll({
      attributes: [
        'OwnerID',
        'NewWardNo',
        'NewPropertyNo',
        'NewPartitionNo',
        'OwnerName',
      ],
      where: {
        NewWardNo: wardNo,
        NewPropertyNo: property,
      },
    });
    return res.json(result);
  } catch (error) {
    throw error;
  }
};

//for getting access page wise

export const getPageIdByPageName = async (req, res) => {
  try {
    const { pageName } = req.body;
    // const resultPageID = await PageNameMaster.findOne({
    //   attributes: ['PageID'],
    //   where: {
    //     PageAlias: pageName,
    //   },
    // });
    const resultPageID = await PageNameMaster.findOne({
      attributes: ['PageID'],
      where: sequelize.where(
        sequelize.fn('TRIM', sequelize.col('PageAlias')),
        pageName.trim()
      ),
    });

    console.log(resultPageID, 'result id ka');
    return res.json(resultPageID);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOldPropertyNoByOldWard = async(req,res)=>{
  const{wardNo} = req.body;
  try{
    const result  = await OldPropertyMast.findAll({
      attributes:['OldPropertyNo'],
      where:{
        OldWardNo:wardNo
      }
    })
    console.log(result,'Old Propert No');
    res.send(result)
  }catch(error){
    console.log(error);
    res.send('Error in getting Old property no.')
  }

}

//fun to fetch existing property owner data
export const fetchPropertyOwner = async (req, res) => {
  try {
    const { wardNo, propertyNo, partitionNo } = req.body.data;
    if (partitionNo === undefined) {
      partitionNo = "";
    }
    const result = await PropertyMast.findAll({
      attributes: [
        "OwnerID",
        "NewWardNo",
        "NewPropertyNo",
        "NewPartitionNo",
      ],
      where: {
        NewWardNo: wardNo,
        NewPropertyNo: propertyNo,
        NewPartitionNo:
          partitionNo && partitionNo !== ""
            ? partitionNo
            : { [Op.or]: [null, ""] },
      },
    });
    console.log("fetchOwnerIdByProperty",res.data);
    return res.json(result);
  } catch (error) {
    throw error;
  }
};
