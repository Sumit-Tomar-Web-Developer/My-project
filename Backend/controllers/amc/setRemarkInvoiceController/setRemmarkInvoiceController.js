import { Op } from "sequelize";
import sequelize from "../../../config/connectionDB.js";
import BillBookEntry from "../../../models/models/billbookentry.js";
import InvoiceNoMaster from "../../../models/models/invoicemaster.js";

//getting year range
export const getBillBookYear = async (req, res) => {
    try {
      const getFinancialYear = await BillBookEntry.findAll({
        attributes: [
          [
            sequelize.fn(
              "concat",
              sequelize.col("Year"),
              "-",
              sequelize.literal("Year + 1")
            ),
            "FinanceYearRange",
          ],
        ],
        group: [sequelize.col("Year")],
        order: [[sequelize.col("Year"), "DESC"]],
      });
      res.status(200).json(getFinancialYear);
    } catch (error) {
      console.error("Error getting Financial Year:", error);
      res.status(500).json({
        error: "An error occurred while getting Financial Year.",
      });
    }
  };

//range wise bill book list and invoice
  export const getBillBookEntriesByYearRange = async (req, res) => {
    try {
        const { yearRange } = req.body; // Get yearRange from the request body

        if (!yearRange) {
            return res.status(400).json({ message: 'Year range is required.' });
        }

        // Split the yearRange to get the start year
        const [startYear] = yearRange.split('-').map(Number);

        // Fetch BillBookNo, ReceiptNoFrom, ReceiptNoTo for the selected year (start year)
        const billBookEntries = await BillBookEntry.findAll({
            attributes: ['BillBookNo', 'ReceiptNoFrom', 'ReceiptNoTo'], // Select specific columns
            where: {
                Year: startYear,  // Filter by the selected start year
            },
        });

        // If no entries are found
        if (billBookEntries.length === 0) {
            return res.status(404).json({ message: `No entries found for the year range: ${yearRange}` });
        }

        // Send the fetched entries as a response
        return res.status(200).json(billBookEntries);

    } catch (error) {
        console.error("Error fetching Bill Book entries:", error);
        return res.status(500).json({
            message: 'An error occurred while fetching Bill Book entries.',
        });
    }
};


// Controller for inserting a new invoice
export const createInvoice = async (req, res) => {
  const {
    Year,
    BillBookNo,
    InvoiceNo,
    Status,
    Reason,
    PreviousReason,
    UserID
    
  } = req.body;

  try {
    // Create a new invoice entry
    const newInvoice = await InvoiceNoMaster.create({
      Year,
      BillBookNo,
      InvoiceNo,
      Status,
      Reason,
      PreviousReason,
      CreatedBy: UserID,        
      CreationDate: new Date()
    });

    // Return the created invoice as a response
    res.status(200).json({ message: 'Invoice saved successfully',newInvoice});
  } catch (error) {
    console.error('Error inserting invoice:', error);
    res.status(500).json({error: 'An error occurred while inserting the invoice.' });
  }
};

// Controller for fetching invoices
export const getInvoices = async (req, res) => {
  const { year, billBookNo } = req.query; 

  try {
    const whereClause = {};
    if (year) {
      whereClause.Year = year; 
    }
    if (billBookNo) {
      whereClause.BillBookNo = billBookNo; 
    }

    // Fetch invoices based on the provided filters
    const invoices = await InvoiceNoMaster.findAll({ where: whereClause });

    // Return the list of invoices
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'An error occurred while fetching invoices.' });
  }
};
 

//get invoice master
export const getInvoiceStatusByInvoiceNo = async (req, res) => {
  const { invoiceNo, year } = req.body; // Read invoiceNo and year from request body

  // Debug: Log the incoming request
  console.log("Received request:", { invoiceNo, year });

  if (!invoiceNo || !year) {
    return res.status(400).json({ message: 'InvoiceNo and Year are required' });
  }

  try {
    // Parse the year range if it's in the format "2022-2023"
    let yearStart, yearEnd;
    if (year.includes('-')) {
      const years = year.split('-').map(Number); // Convert to numbers
      yearStart = years[0];
      yearEnd = years[1];
      console.log("Parsed year range:", { yearStart, yearEnd }); // Debug
    } else {
      yearStart = yearEnd = Number(year); // Handle as a single year
    }

    // Fetch invoice based on InvoiceNo and Year range
    const invoice = await InvoiceNoMaster.findOne({
      where: {
        InvoiceNo: invoiceNo,
        Year: {
          [Op.gte]: yearStart, // Greater than or equal to start year
          [Op.lte]: yearEnd    // Less than or equal to end year
        }
      }
    });

    // Debug: Log the invoice found (or not)
    if (invoice) {
      console.log("Invoice found:", invoice);
    } else {
      console.log("No invoice found.");
    }

    // Check if the invoice exists
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found for the given year' });
    }

    // Return the invoice status
    return res.status(200).json({ Status: invoice.Status, Reason: invoice.Reason });
  } catch (error) {
    console.error('Error fetching invoice status:', error); // Detailed error logging
    return res.status(500).json({ message: 'Internal server error' });
  }
};