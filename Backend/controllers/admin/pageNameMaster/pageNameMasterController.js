import PageNameMaster from '../../../models/models/pagenamemaster.js';
import sequelize from '../../../config/connectionDB.js';
export const getPageNames = async (req, res) => {
  try {
    const pageNames = await PageNameMaster.findAll({
      attributes: ['PageName', 'PageID', 'PageAlias'],
    });
    res.status(200).json({
      message: 'Page names retrieved successfully',
      data: pageNames,
    });
  } catch (err) {
    console.error('Error getting page names:', err);
    res.status(500).json({
      error: 'An error occurred while getting page names.',
    });
  }
};

export const savePageName = async (req, res) => {
  const { pageInfo } = req.body;

  const { PageName, PageAlias, PageID } = pageInfo;
  let Id = 0;
  if (!PageID) Id = 0;
  else Id = PageID;
  try {
    if (!PageName)
      return res.status(400).json({
        message: 'Page Name can not be empty.',
      });
    if (!PageAlias)
      return res.status(400).json({
        message: 'Page Alias can not be empty.',
      });

    let NewPageInfo = await PageNameMaster.findOne({
      where: { PageID: Id },
    });
    if (!NewPageInfo) {
      NewPageInfo = await PageNameMaster.create({
        PageName,
        PageAlias,
      });

      return res.status(200).json({
        message: 'New Page Name added successfully',
        NewPageInfo,
      });
    } else {
      await NewPageInfo.update({
        PageName,
        PageAlias,
      });

      return res.status(201).json({
        message: 'Page Name updated successfully',
        NewPageInfo,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update/create Page Name',
      error: error.message,
    });
  }
};

export const deletePageInfo = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    console.log('Delete Page', req.body);

    const Ids = req.body.IDs;
    console.log(Ids, 'delete');
    if (
      !Array.isArray(Ids) ||
      !Ids.every((id) => Number.isInteger(id) && id > 0)
    ) {
      return res.status(400).json({
        message: 'Page Ids must be an array of positive integers',
      });
    }

    const pageRecords = await PageNameMaster.findAll({
      where: { PageID: Ids },
      transaction: t,
    });

    if (pageRecords.length === 0) {
      await t.rollback();
      return res.status(203).json({ message: 'page records not found' });
    }

    const result = await PageNameMaster.destroy({
      where: { PageID: Ids },
      transaction: t,
    });

    if (result > 0) {
      await t.commit();
      res.status(200).json({ message: 'Page Name deleted successfully' });
    } else {
      await t.rollback();
      res.status(203).json({ message: 'Records Not Found' });
    }
    0;
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      error: 'An error occurred while deleting page name.',
    });
  }
};
