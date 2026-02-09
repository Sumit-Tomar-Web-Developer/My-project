import { Op } from 'sequelize';
import BillBookEntry from '../../../models/models/billbookentry.js';

// Function to create or update a bill book entry


// export const createOrUpdateBillBookEntry = async (req, res) => {
//     try {
//         const entryData = req.body;

//         // Validate and parse the Date
//         if (entryData.Date) {
//             const parsedDate = new Date(entryData.Date);
//             if (isNaN(parsedDate.getTime())) {
//                 return res.status(400).json({ message: 'Invalid date format' });
//             }
//             entryData.Date = parsedDate; // Assign the valid date
//         }

//         // Check for duplicates based on BillBookType
//         const duplicateEntry = await BillBookEntry.findOne({
//             where: {
//                  Year: entryData.Year,
//                 BillBookNo: entryData.BillBookNo,
//                 BillBookType: entryData.BillBookType,
//             },
//         });

//         if (duplicateEntry) {
//             const typeMessage = entryData.BillBookType === "Counter" 
//                 ? 'Duplicate Year and Bill Book No. for Counter.' 
//                 : 'Duplicate Year and Bill Book No. for Manually.';

//             return res.status(400).json({ message: typeMessage });
//         }

//         // If the entry does not exist, create a new entry
//         const newEntry = await BillBookEntry.create(entryData);
//         return res.status(201).json({ message: 'Entry created successfully', data: newEntry });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'An error occurred while processing the bill book entry.' });
//     }
// };

export const createOrUpdateBillBookEntry = async (req, res) => {
  try {
      const entryData = req.body;

      // Validate and parse the Date
      if (entryData.date) {
          const parsedDate = new Date(entryData.date);
          if (isNaN(parsedDate.getTime())) {
              return res.status(400).json({ message: 'Invalid date format' });
          }
          entryData.Date = parsedDate; // Use this if your column in DB is named 'Date'
      }

      // Check for duplicates based on Year and BillBookNo
      const duplicateEntry = await BillBookEntry.findOne({
          where: {
              Year: entryData.Year,
              BillBookNo: entryData.BillBookNo,
              BillBookType: entryData.BillBookType,
          },
      });

      if (duplicateEntry) {
          const typeMessage = entryData.BillBookType === "Counter" 
              ? 'Duplicate Year and Bill Book No. for Counter.' 
              : 'Duplicate Year and Bill Book No. for Manually.';

          return res.status(201).json({ message: typeMessage });
      }

      // Create a new entry with all fields
      const newEntry = await BillBookEntry.create({
          BillBookNo: entryData.BillBookNo,
          Year: entryData.Year,
          ZoneNo: entryData.ZoneNo,
          Status: entryData.status, 
          BillBookType: entryData.BillBookType,
          EmpName: entryData.IssueByName,
          Date: entryData.Date, 
          ReceiptNoFrom: entryData.fromReceipt, 
          ReceiptNoTo: entryData.toReceipt, 
          Remark: entryData.remark, 
          Role: entryData.Role ,
          WardNo: entryData.WardNos.join(',')  ,
          UserID: entryData.UserID ,
          CreatedBy: entryData.UserID,  
          CreatedDate: new Date(),
          UpdatedBy: entryData.UserID,  
          UpdatedDate: new Date(),
        });

      return res.status(200).json({ message: 'Entry created successfully', data: newEntry });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred while processing the bill book entry.' });
  }
};

// Function to get all bill book entries
export const getBillBookEntries = async (req, res) => {
  try {
    const entries = await BillBookEntry.findAll();
    return res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while fetching entries.' });
  }
};

// Function to delete a bill book entry by ID
export const deleteBillBookEntry = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEntry = await BillBookEntry.destroy({ where: { Id: id } });

    if (deletedEntry === 0) {
      return res.status(404).json({ message: 'Bill book entry not found.' });
    }

    return res.status(200).json({ message: 'Bill book entry deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while deleting the entry.' });
  }
};

// Helper function to check for duplicates
const checkForDuplicates = async (year, billBookNo, billBookType, issuedBy = null, id = null) => {
  const whereClause = {
    Year: year,
    BillBookNo: billBookNo,
    BillBookType: billBookType,
  };

  // If the type is 'Manual' and issuedBy is provided, add it to the where clause
  if (billBookType === 'Manual' && issuedBy) {
    whereClause.IssuedBy = issuedBy; // Add issuedBy field for checking duplicates
  }

  // Exclude the current ID from the duplicate check
  if (id) {
    whereClause.Id = { [Op.ne]: id }; // Exclude current entry
  }

  const existingEntries = await BillBookEntry.findAll({ where: whereClause });
  return existingEntries.length > 0; // Returns true if duplicates are found
};
  