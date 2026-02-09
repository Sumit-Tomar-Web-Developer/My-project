import sequelize from "../../config/connectionDB.js";
import PropertyDetailsNew from "../../models/models/propertydetailsnew.js";
import PropertyMast from "../../models/models/propertymast.js";
import { Op, QueryTypes } from "sequelize";
import Users from "../../models/models/users.js";

export const updatePropertyZone = async (req, res) => {
    const { ZoneNo, WardNo, FromProperty, ToProperty, UserID } = req.body;
  
    console.log(req.body, "body request");
  
    if (ZoneNo == null || ZoneNo == 0)
      return res.status(402).json({ message: "Zone No can not be null." });
    if (WardNo == null || WardNo == "")
      return res.status(402).json({ message: "Ward No can not be null." });
    if (FromProperty == null || !Number.isInteger(FromProperty) || FromProperty <= 0)
      return res.status(402).json({ message: "From Property can not be null." });
    if (ToProperty == null || !Number.isInteger(ToProperty) || ToProperty <= 0)
      return res.status(402).json({ message: "To Property can not be null." });
  
    try {
         // ✅ Fetch role from UserID
         const user = await Users.findOne({ where: { UserID: UserID }, attributes: ['role'] });
         const userRole = user ? user.role : 'Unknown';

      // Fetch the previous zone for this range
      const previousProperties = await PropertyMast.findAll({
        where: {
          NewWardNo: WardNo,
          NewPropertyNo: { [Op.between]: [FromProperty, ToProperty] }
        },
        attributes: ['NewZoneNo']
      });
  
      const previousZone = previousProperties.length > 0 
        ? previousProperties[0].NewZoneNo 
        : null;
  
      // Update zone
      await PropertyMast.update(
        { 
            NewZoneNo: ZoneNo,
            UpdatedBy: UserID  
         },
        {
          where: {
            NewWardNo: WardNo,
            NewPropertyNo: { [Op.between]: [FromProperty, ToProperty] }
          }
        }
      );
  
      // Return updated rows for frontend table
      const updatedRows = await PropertyMast.findAll({
        where: {
          NewWardNo: WardNo,
          NewPropertyNo: { [Op.between]: [FromProperty, ToProperty] }
        },
        attributes: ['NewWardNo', 'NewPropertyNo', 'NewZoneNo']
      });
  
      res.status(200).json({
        message: "Zone No Updated Successfully",
        updatedBy: UserID, // you can fetch user name from UserID if needed
        previousZone: previousZone,
        zoneData: updatedRows
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while updating properties.",
        error: error.message
      });
    }
  };
  

// export const updatePropertyZone = async (req, res) => {
//     const { ZoneNo, WardNo, FromProperty, ToProperty } = req.body;

//     console.log(req.body, "body request");
//     if (ZoneNo == null || ZoneNo == 0)
//         return res.status(402).json({
//             message: "Zone No can not be null."
//         });
//     else if (WardNo == null || WardNo == "")
//         return res.status(402).json({
//             message: "Ward No can not be null."
//         });
//     else if (FromProperty == null || !Number.isInteger(FromProperty) || FromProperty <= 0)
//         return res.status(402).json({
//             message: "From Property can not be null."
//         });
//     else if (ToProperty == null || !Number.isInteger(ToProperty) || ToProperty <= 0)
//         return res.status(402).json({
//             message: "To Property can not be null."
//         });
//     try {
//         const result = await PropertyMast.update(
//             { 'NewZoneNo': ZoneNo },
//             {
//                 where: {
//                     'NewWardNo': WardNo,
//                     'NewPropertyNo': {
//                         [Op.between]: [FromProperty, ToProperty]
//                     }
//                 }
//             }
//         );
//         res.status(200).json({ message: "Zone No Updated Successfully" });
//     } catch (error) {
//         res.status(500).json({
//             message: "An error occurred while updating properties.",
//             error: error.message
//         });
//     }
// };


export const updatePropertyZoneYearWise = async (req, res) => {
    const ipData = req.body;
    console.log(req.body, "ipData")
    const zoneList = ipData.ZoneNoList;
    let pmWhere = [];
    try {
        console.log(zoneList)
        if (ipData.MaxYear == null || !Number.isInteger(ipData.MaxYear) || ipData.MaxYear <= 0)
            return res.status(402).json({
                message: "Max Year can not be null or type of string or zero."
            });
        else if (ipData.MaxYear > new Date().getFullYear())
            return res.status(402).json({
                message: "Max Year must be less than current year."
            })

        if (ipData.WardNos == null || ipData.WardNos == "")
            return res.status(402).json({
                message: "Ward No can not be null"
            });
        if (zoneList == null || zoneList.length == 0)
            return res.status(402).json({
                message: "Zone No List can not be null"
            });
        for (let index = 0; index < zoneList.length; index++) {
            if (zoneList[index].ZoneNos == null || zoneList[index].ZoneNos == "")
                return res.status(400).json({
                    message: "Zone No can not be null"
                });
            else if (zoneList[index].MainZone == null || zoneList[index].MainZone == "")
                return res.status(402).json({
                    message: "Main Zone No List can not be null"
                });
            else if (zoneList[index].Range == null || zoneList[index].Range == "")
                return res.status(402).json({
                    message: "Range can not be null"
                });
            if (ipData.WardNos.toLowerCase() == "all")
                pmWhere.push({ 'NewZoneNo': zoneList[index].ZoneNos });
            else
                pmWhere.push({ 'NewZoneNo': zoneList[index].ZoneNos, 'NewWardNo': ipData.WardNos });

            const propInfo = await PropertyMast.findAll({
                attributes: [
                    'PropertyMast.OwnerID', 'OwnerID'
                ],
                include: [{
                    model: PropertyDetailsNew,
                    required: true
                }],
                where: pmWhere
            });

            for (let ownerInfo = 0; ownerInfo < propInfo.length; ownerInfo++) {
                const maxConsYear = await PropertyDetailsNew.findOne({
                    attributes: [
                        [sequelize.fn('MAX', sequelize.col('ConstructionYear')), 'maxConstructionYear']
                    ],
                    where: {
                        OwnerID: propInfo[ownerInfo].OwnerID
                    }
                });


                if (maxConsYear > 0) {
                    let splitedValues = zoneList[index].Range.split('-');
                    let MinValue = parseInt(splitedValues[0], 10);
                    let MaxValue = parseInt(splitedValues[1], 10);

                    let AgeDiff = ipData.MaxYear - maxConsYear;
                    if (MinValue <= AgeDiff && AgeDiff <= MaxValue) {
                        // Update PropertyMast
                        await PropertyMast.update(
                            { NewZoneNo: zoneList[index].ZoneNos },
                            {
                                where: {
                                    OwnerID: propInfo[ownerInfo].OwnerID,
                                    NewZoneNo: zoneList[index].MainZone
                                }

                            }
                        );

                        // Check if ZoneNo exists in ZoneMaster
                        let ExistingZoneNo = await ZoneMaster.findOne({
                            where: { ZoneNo: zoneList[index].ZoneNos }

                        });

                        if (!ExistingZoneNo) {
                            // Insert new ZoneNo in ZoneMaster
                            await ZoneMaster.create({
                                ZoneNo: zoneList[index].ZoneNo,
                                ZoneType: 'Default',
                                Remark: 'Default'
                            });
                        }
                    }
                }
            }
        }
        return res.status(200).json({
            message: "Zone Updated Successfully."
        })
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while updating properties.",
            error: error.message
        });
    }
};

export const getOwnerDetailsByID = async (req,res) => {
    try {
      const { OwnerID } = req.body;

    if (!OwnerID) {
      return res.status(400).json({ message: "OwnerID is required" });
    }

    // DB se fetch karna
    const ownerDetails = await PropertyMast.findAll({
      where: { OwnerID },
      attributes: ['NewWardNo', 'NewPropertyNo', 'OwnerNameMarathi']
    });

    if (!ownerDetails || ownerDetails.length === 0) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // Response send karna
    res.json(ownerDetails);



  } catch (error) {
    console.error("Error fetching owner details:", error);
    return null;
  }
};
