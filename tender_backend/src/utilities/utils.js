/*** API Status Types ***/
const API_STATUS = {
    SUCCESS: "success",
    ERROR: "error",
}

// Generate a random strong password
const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$';
    const length = 12; // Password length
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

const getCurrentDateTime = () => {
    let date_time = new Date();

    // get current date
    // adjust 0 before single digit date
    let date = ("0" + date_time.getDate()).slice(-2);

    // get current month
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);

    // get current year
    let year = date_time.getFullYear();

    // get current hours
    let hours = date_time.getHours();

    // get current minutes
    let minutes = date_time.getMinutes();

    // get current seconds
    let seconds = date_time.getSeconds();

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
}

const USER_ROLES = {
    MD: { id: 1, roleName: 'MD', roleDescription: 'Managing Director',DLEmails:'tmscommunication@proton.me' },
    DIRECTOR: { id: 2, roleName: 'Director', roleDescription: 'Director',DLEmails:'tmscommunication@proton.me' },
    DATA_APPLICANT: { id: 3, roleName: 'Data Applicant', roleDescription: 'Data Applicant',DLEmails:'tmscommunication@proton.me' },
    TECH_TEAM: { id: 4, roleName: 'Technical Team', roleDescription: 'Technical Team' ,DLEmails:'tmscommunication@proton.me'},
    FINANCE: { id: 5, roleName: 'Finance', roleDescription: 'Finance',DLEmails:'tmscommunication@proton.me' },
    ADMIN: { id: 6, roleName: 'Admin', roleDescription: 'Admin',DLEmails:'tmscommunication@proton.me'}
}

const TENDER_STATUS = {
    Draft: { id: 1, name: 'Draft' },
    Submitted: { id: 2, name: 'Created' },
    TechnicalApprovalDone: { id: 3, name: 'Technical Approved' },
    DirectorApprovalDone: { id: 4, name: 'Director Approved' },
    FinanceApprovalDone: { id: 5, name: 'Finance Approved' },
    PhysicalDocumentUploaded: { id: 6, name: 'Physical Document Uploaded' },
    PhysicalDocumentVerified: { id: 7, name: 'Physical Document Verified' },
    PhysicalDocumentSubmitted: { id: 8, name: 'Physical Document Submitted' },
    L1ApprovalReceived: { id: 9, name: 'L1 Received' },
    L2L3ApprovalReceived: { id: 10, name: 'L2/L3 Received' },
    L0Acceptance: { id: 11, name: 'L0 Acceptance' },
    L1ApprovalDone: { id: 12, name: 'L1 Approved' },
    PhysicalSetupDone: { id: 13, name: 'Physical Setup Done' },
    TrackingInProgress: { id: 14, name: 'Physical/Financial Tracking In Progress' },
    TrackingCompleted: { id: 15, name: 'Tracking Completed' },
    FinancialClosed: { id: 16, name: 'Financial Closed' },
    ProjectCompleted: { id: 17, name: 'Project Completed' },
    TechnicalRejectDone: { id: 18, name: 'Technical Rejected' },
    DirectorRejectDone: { id: 19, name: 'Director Rejected' }
};

const EXPENSE_STATUS = {
    Created: { id: 1, name: 'Created' },
    TechnicalApprovalDone: { id: 2, name: 'Technical Approved' },
    DirectorApprovalDone: { id: 3, name: 'Director Approved' },
    Completed: { id: 4, name: 'Completed' },
    TechnicalRejectDone: { id: 5, name: 'Technical Rejected' },
    DirectorRejectDone: { id: 6, name: 'Director Rejected' },
    FinanceRejectDone: { id: 7, name: 'Finance Rejected' }
};

const DEPARTMENTS =
{
    Environment: { id: 1, departmentname: 'Environment' },
    PropertyTaxAssessment: { id: 2, departmentname: 'Property Tax Assessment' },
    AMCandPropertyManagement: { id: 3, departmentname: 'AMC & Property Mgmt' },
    PMCandCivil: { id: 4, departmentname: 'PMC & Civil' },
    GIS: { id: 5, departmentname: 'GIS' },
    IT: { id: 6, departmentname: 'IT' }

}

const TENDER_APPROVAL_STATUS = {
    APPROVED: { id: 1, name: "APPROVED" },
    REJECTED: { id: 2, name: "REJECTED" },
}


const TENDER_EXPENSE_TYPE = {
    SiteVisit_VariousSiteVisits: {
        id: 1,
        expenseType: "Site Visit - Various Site Visits",
        expenseDescription: ""
    },
    TenderProcess_TenderFees: {
        id: 2,
        expenseType: "Tender Process - Tender Fees",
        expenseDescription: ""
    },
    TenderProcess_EMD: {
        id: 3,
        expenseType: "Tender Process - EMD",
        expenseDescription: ""
    },
    TenderProcess_Stamp_and_Notary: {
        id: 4,
        expenseType: "Tender Process - Stamp & Notary",
        expenseDescription: ""
    },
    TenderProcess_Printouts: {
        id: 5,
        expenseType: "Tender Process - Printouts",
        expenseDescription: ""
    },
   SitePreProcessing_LandWorship: {
        id: 6,
        expenseType: "SitePreProcessing - Land Worship Flex/Banner" ,
        expenseDescription: ""
    },
    SitePreProcessing_WeighBridge: {
        id: 7,
        expenseType: "SitePreProcessing - Weigh Bridge" ,
        expenseDescription: ""
    },
    SitePreProcessing_TotalStationSurvey: {
        id: 8,
        expenseType: "SitePreProcessing - Total Station Survey" ,
        expenseDescription: ""
    },
    SitePreProcessing_BaseLineSurvey: {
        id: 9,
        expenseType: "SitePreProcessing - Base Line Survey" ,
        expenseDescription: ""
    },
    SitePreProcessing_BioCulturePurchase: {
        id: 10,
        expenseType: "SitePreProcessing - Bio Culture Purchase" ,
        expenseDescription: ""
    },

    SitePreProcessing_SafetyEquipments_InstallationCCTV: {
        id: 11,
        expenseType: "SitePreProcessing -Safety Equipments / Installation (CCTV)" ,
        expenseDescription: ""
    },

    SitePreProcessing_Printer_Computer_Purchased_and_Site_Material: {
        id: 12,
        expenseType: "SitePreProcessing - Printer & Computer Purchased & Site Material" ,
        expenseDescription: ""
    },

    SitePreProcessing_DroneSurvey: {
        id: 13,
        expenseType: "SitePreProcessing - Drone Survey" ,
        expenseDescription: ""
    },
   MachinarySetup_Transport: {
        id: 14,
        expenseType: "Machinary Setup - Transport" ,
        expenseDescription: ""
    },
    MachinarySetup_Installation_Machinary_GPS: {
        id: 15,
        expenseType: "Machinary Setup - Installation (Machinery) (GPS)" ,
        expenseDescription: ""
    },
    MachinarySetup_Machine_and_Material_Expense: {
        id: 16,
        expenseType: "Machinary Setup - Machine and Material Expense" ,
        expenseDescription: ""
    },
    MachinarySetup_Civl_Construction: {
        id: 17,
        expenseType: "Machinary Setup - Civl Construction" ,
        expenseDescription: ""
    },
    SiteProcessingDisposal_Diesel: {
        id: 18,
        expenseType: "Site Processing/Disposal - Diesel" ,
        expenseDescription: ""
    },
    SiteProcessingDisposal_MaterialShifting_and_Disposal_RDF: {
        id: 19,
        expenseType: "Site Processing/Disposal - Material Shifting and Disposal- RDF" ,
        expenseDescription: ""
    },
    SiteProcessingDisposal_Soil: {
        id: 20,
        expenseType: "Site Processing/Disposal - Soil" ,
        expenseDescription: ""
    },
    SiteProcessingDisposal_Inert: {
        id: 21,
        expenseType: "Site Processing/Disposal - Inert" ,
        expenseDescription: ""
    },
    Machinery_elec_expense_food_expense_machine_rent_emi: {
        id: 22,
        expenseType: "Machinery/Electronic Expense /Food Expense - Machinery Rent/EMI" ,
        expenseDescription: ""
    },
    Machinery_elec_expense_food_expense_Electronic_Expense: {
        id: 23,
        expenseType: "Machinery/Electronic Expense /Food Expense - Electronic Expense" ,
        expenseDescription: ""
    },
    Machinery_elec_expense_food_expense_Machnical_Machinery_Exp: {
        id: 24,
        expenseType: "Machinery/Electronic Expense /Food Expense - Machnical Machinery Exp" ,
        expenseDescription: ""
    },
    Machinery_elec_expense_food_expense_machine_maintainence: {
        id: 25,
        expenseType: "Machinery/Electronic Expense /Food Expense - Machine Maintainence" ,
        expenseDescription: ""
    },
    Machinery_elec_expense_food_expense_Operator_Food: {
        id: 26,
        expenseType: "Machinery/Electronic Expense /Food Expense - Operator Food" ,
        expenseDescription: ""
    },
    Reimbursement_Lodging: {
        id: 27,
        expenseType: "Reimbursement - Lodging" ,
        expenseDescription: ""
    },
    Reimbursement_Travel: {
        id: 28,
        expenseType: "Reimbursement - Travel" ,
        expenseDescription: ""
    },
    Reimbursement_Food: {
        id: 29,
        expenseType: "Reimbursement - Food and aqua" ,
        expenseDescription: ""
    },
    SiteExpense_Room_Rent_Furniture_Required: {
        id: 30,
        expenseType: "Site Expense - Room Rent,Furniture Required" ,
        expenseDescription: ""
    },
    SiteExpense_Electricity_Exp: {
        id: 31,
        expenseType: "Site Expense -  Electricity Exp.(Elec Room Rent, Site Elec,Elec room Cons.)" ,
        expenseDescription: ""
    },
    Manpower_Security_Guard: {
        id: 32,
        expenseType: "Manpower - Security Guard" ,
        expenseDescription: ""
    },
    Manpower_LabourCharges: {
        id: 32,
        expenseType: "Manpower - Labour Charges" ,
        expenseDescription: ""
    },
    Manpower_Salary: {
        id: 32,
        expenseType: "Manpower - Salary" ,
        expenseDescription: ""
    },
    Other_Stationery_Printing: {
        id: 33,
        expenseType: "Other - Stationery/Printing" ,
        expenseDescription: ""
    },
    Other_Misc_Expense: {
        id: 33,
        expenseType: "Other - Misc. Expense" ,
        expenseDescription: ""
    },
    KBC: {
        id: 33,
        expenseType: "KBC" ,
        expenseDescription: ""
    },

};





module.exports = { API_STATUS, DEPARTMENTS, USER_ROLES, TENDER_STATUS, EXPENSE_STATUS, TENDER_EXPENSE_TYPE, TENDER_APPROVAL_STATUS, generateRandomPassword, getCurrentDateTime };