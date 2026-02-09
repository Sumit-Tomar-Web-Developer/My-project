export const APP_NAME = "CPMM"

export const PASS_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

/*** Local Storage Keys ***/
export const LOCAL_STORAGE_DATA_KEYS = {
  NAME: "name",
  ROLE: "role",
  USERID: "userID",
  DEPARTMENT: "department",
  DEPARTMENTNAME: "departmentName",
  TOKEN: "token",
  THEME: "theme"
}

/*** Alert Types ***/
export const TOAST_SEVERITY = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info"
}

/*** API Status Types ***/
export const API_STATUS = {
  SUCCESS: "success",
  ERROR: "error",
}

/*** API Status Types ***/
export const TABLE_CELL_TYPES = {
  TEXT: "text",
  LINK: "link",
  BUTTON: "button"
}

/*** User Roles ***/
export const USER_ROLES = {
  MD: { id: 1, roleName: 'MD', roleDescription: 'Managing Director' },
  DIRECTOR: { id: 2, roleName: 'Director', roleDescription: 'Director' },
  DATA_APPLICANT: { id: 3, roleName: 'Data Applicant', roleDescription: 'Data Applicant' },
  TECH_TEAM: { id: 4, roleName: 'Technical Team', roleDescription: 'Technical Team' },
  FINANCE: { id: 5, roleName: 'Finance', roleDescription: 'Finance' },
  ADMIN: { id: 6, roleName: 'Admin', roleDescription: 'Admin' }
}


/**Tender SubMenu Links ***/
export const TENDER_SUB_MENU_LINKS = [
  {
    urlLink: '/dashboard?tab=0', title: 'All Projects', logo: 'BusinessCenterIcon',
    subMenu: [],
    requiredRoles: [
      USER_ROLES.DATA_APPLICANT.id,
      USER_ROLES.TECH_TEAM.id,
      USER_ROLES.FINANCE.id,
      USER_ROLES.DIRECTOR.id
    ]
  },
  {
    urlLink: '/worklist?tab=0', title: 'Project WorkList', logo: 'AssignmentIcon',
    subMenu: [],
    requiredRoles: [
      USER_ROLES.DATA_APPLICANT.id,
      USER_ROLES.TECH_TEAM.id,
      USER_ROLES.FINANCE.id,
      USER_ROLES.DIRECTOR.id
    ]
  },
  {
    urlLink: '/create_new_tender', title: 'Create New Project', logo: 'PostAddIcon',
    subMenu: [],
    requiredRoles: [
      USER_ROLES.DATA_APPLICANT.id,
    ]
  },
  {
    urlLink: '/update_tender_corrigendum', title: 'Update Tender Corrigendum', logo: 'TaskIcon',
    subMenu: [],
    requiredRoles: [
      USER_ROLES.DATA_APPLICANT.id,
    ]
  },

];

/**Expense SubMenu Links ***/
export const EXPENSE_SUB_MENU_LINKS = [
  {
    urlLink: '/dashboard?tab=1', title: 'All Expenses', logo: 'AssuredWorkloadIcon',
    subMenu: [],
    requiredRoles: [
      USER_ROLES.DATA_APPLICANT.id,
      USER_ROLES.TECH_TEAM.id,
      USER_ROLES.FINANCE.id,
      USER_ROLES.DIRECTOR.id
    ]
  },
  {
    urlLink: '/worklist?tab=1', title: 'Expense WorkList', logo: 'AssignmentIcon',
    subMenu: [],
    requiredRoles: [
      USER_ROLES.DATA_APPLICANT.id,
      USER_ROLES.TECH_TEAM.id,
      USER_ROLES.FINANCE.id,
      USER_ROLES.DIRECTOR.id
    ]
  },
  {
    urlLink: '/add_expense', title: 'Add Expense', logo: 'PostAddIcon',
    subMenu: [],
    requiredRoles: [
      USER_ROLES.DATA_APPLICANT.id
    ]
  },
];

/**Report SubMenu Links ***/
export const REPORT_SUB_MENU_LINKS = [
  {
    urlLink: '/report/departmentExpenseReport', title: 'Expense Aggregated - Department', logo: 'SummarizeIcon',
    subMenu: [],
    requiredRoles: [
      USER_ROLES.DIRECTOR.id,
      USER_ROLES.MD.id
    ]
  },
  {
    urlLink: '/report/tenderAggExpenseReport', title: 'Expense Aggregated - Tender', logo: 'LocalMallIcon',
    subMenu: [],
    requiredRoles: [
      USER_ROLES.DIRECTOR.id,
      USER_ROLES.MD.id
    ]
  },
  {
    urlLink: '/report/tenderExpenseReport', title: 'Expense Detailed - Tender', logo: 'IntegrationInstructionsIcon',
    subMenu: [],
    requiredRoles: [
      USER_ROLES.DIRECTOR.id,
      USER_ROLES.MD.id
    ]
  },
  {
    urlLink: '/report/tenderMonitorReport', title: 'Project - Monitor Tender', logo: 'ContentPasteSearchIcon',
    subMenu: [],
    requiredRoles: [
      USER_ROLES.DIRECTOR.id,
      USER_ROLES.MD.id
    ]
  },
];

/*** Navigation Bar Link ***/
export const TOOL_NAV_LINKS = [
  {
    urlLink: '/dashboard', title: 'All Projects', logo: 'HomeIcon',
    subMenu: [],
    requiredRoles: [
      USER_ROLES.DATA_APPLICANT.id,
      USER_ROLES.TECH_TEAM.id,
      USER_ROLES.FINANCE.id,
      USER_ROLES.DIRECTOR.id,
      USER_ROLES.MD.id
    ]
  },
  {
    urlLink: '/dashboard', title: 'User Management', logo: 'HomeIcon',
    subMenu: [],
    requiredRoles: [
      USER_ROLES.ADMIN.id,
    ]
  },
  {
    urlLink: '/worklist', title: 'My WorkList', logo: 'FolderSpecialIcon',
    subMenu: [],
    requiredRoles: [
      USER_ROLES.DATA_APPLICANT.id,
      USER_ROLES.TECH_TEAM.id,
      USER_ROLES.FINANCE.id,
      USER_ROLES.DIRECTOR.id,
    ]
  },
  {
    urlLink: '/tenders', title: 'Projects', logo: 'WorkIcon',
    subMenu: TENDER_SUB_MENU_LINKS,
    requiredRoles: [
      USER_ROLES.DATA_APPLICANT.id,
      USER_ROLES.TECH_TEAM.id,
      USER_ROLES.FINANCE.id,
      USER_ROLES.DIRECTOR.id,
    ]
  },
  {
    urlLink: '/expenses', title: 'Expenses', logo: 'AccountBalanceIcon',
    subMenu: EXPENSE_SUB_MENU_LINKS,
    requiredRoles: [
      USER_ROLES.DATA_APPLICANT.id,
      USER_ROLES.TECH_TEAM.id,
      USER_ROLES.FINANCE.id,
      USER_ROLES.DIRECTOR.id,
    ]
  },
  {
    urlLink: '/report', title: 'Report', logo: 'PageviewIcon',
    subMenu: REPORT_SUB_MENU_LINKS,
    requiredRoles: [
      USER_ROLES.DIRECTOR.id,
      USER_ROLES.MD.id
    ]
  },
]

/**User SubMenu Links ***/
export const USER_MENU_LINKS = [
  // { urlLink: '/userinfo', title: 'My Info', requiredRoles: [], logo: 'AccountCircleIcon' },
  { urlLink: '/logout', title: 'Logout', requiredRoles: [], logo: 'LogoutIcon' },
];

export const PAYMENT_MODES = [
  { label: "Online", value: "Online" },
  { label: "DD", value: "DD" },
  { label: "FDR", value: "FDR" }
];

export const YES_NO_OPTIONS = [
  { label: "Yes", value: true },
  { label: "No", value: false }
];

export const TYPE_OF_EXPENSES = [
  { label: "Travel", value: 1 },
  { label: "Fees", value: 2 },
  { label: "Materials", value: 3 },
  { label: "Food", value: 4 },
]

export const TENDER_FORM_STEPS = [
  { name: "basicDetails", title: "Basic Details" },
  { name: "coverDetails", title: "Cover Details" },
  { name: "tenderFeeDetails", title: "Tender Fee Details" },
  { name: "emdFeeDetails", title: "EMD Fee Details" },
  { name: "workItemDetails", title: "Work/Items Details" },
  { name: "criticalDatesDetails", title: "Critical Dates" },
  { name: "stampDetails", title: "Stamp Details" },
  { name: "eligibilityCriteria", title: "Eligibility Criteria" },
  { name: "additionalDetails", title: "Additional Details" },
  { name: "uploadDocDetails", title: "Upload Document Details" },
]

export const ACTION_MODES = {
  CREATE: "Create",
  EDIT: "Edit",
  VIEW: "View",
  PREVIEW: "Preview",
}

export const TENDER_STATUS = {
  Draft: {
    id: 1, name: 'Draft',
    access: {
      [USER_ROLES.DATA_APPLICANT.id]: { path: "edit_tender_details", config: { value: "Resume Draft", color: "secondary", icon: "BorderColorIcon" } }
    }
  },
  Submitted: {
    id: 2, name: 'Created',
    access: {
      [USER_ROLES.TECH_TEAM.id]: { path: "tender_approval", config: { value: "Approval", color: "success", icon: "DoneAllIcon" } }
    }
  },
  TechnicalApprovalDone: {
    id: 3, name: 'Technical Approved',
    access: {
      [USER_ROLES.DIRECTOR.id]: { path: "tender_approval", config: { value: "Approval", color: "success", icon: "DoneAllIcon" } }
    }
  },
  DirectorApprovalDone: {
    id: 4, name: 'Director Approved',
    access: {
      [USER_ROLES.FINANCE.id]: { path: "fin_tender_approval", config: { value: "Finance Approval", color: "success", icon: "DoneAllIcon" } }
    }
  },
  FinanceApprovalDone: {
    id: 5, name: 'Finance Approved',
    access: {
      [USER_ROLES.DATA_APPLICANT.id]: { path: "da_doc_upload", config: { value: "Upload Physical Docs", color: "secondary", icon: "UploadFileIcon" } }
    }
  },
  PhysicalDocumentUploaded: {
    id: 6, name: 'Physical Document Uploaded',
    access: {
      [USER_ROLES.TECH_TEAM.id]: { path: "tl_tender_approval", config: { value: "Authorization", color: "warning", icon: "BeenhereIcon" } }
    }
  },
  PhysicalDocumentVerified: {
    id: 7, name: 'Physical Document Verified',
    access: {
      [USER_ROLES.DATA_APPLICANT.id]: { path: "da_doc_submission", config: { value: "Physical Docs Submission", color: "success", icon: "WorkOutlineIcon" } }
    }
  },
  PhysicalDocumentSubmitted: {
    id: 8, name: 'Physical Document Submitted',
    access: {
      [USER_ROLES.DATA_APPLICANT.id]: { path: "update_tender_status", config: { value: "Update Govt Status", color: "warning", icon: "GavelIcon" } }
    }
  },
  L1ApprovalReceived: {
    id: 9, name: 'L1 Received',
    access: {
      [USER_ROLES.FINANCE.id]: { path: "fin_lzero_acceptance", config: { value: "Update L0 Acceptance", color: "success", icon: "BorderColorIcon" } }
    }
  },
  L2L3ApprovalReceived: {
    id: 10, name: 'L2/L3 Received',
    access: {
      [USER_ROLES.FINANCE.id]: { path: "financial_closure", config: { value: "Financial Closure", color: "warning", icon: "AddTaskIcon" } }
    }
  },
  L0Acceptance: {
    id: 11, name: 'L0 Acceptance',
    access: {
      [USER_ROLES.DATA_APPLICANT.id]: { path: "l1_approval", config: { value: "Add L1 Approval Details", color: "success", icon: "AddTaskIcon" } }
    }
  },
  L1ApprovalDone: {
    id: 12, name: 'L1 Approved',
    access: {
      [USER_ROLES.TECH_TEAM.id]: { path: "physical_tracking_setup", config: { value: "Physical Tracking Setup", color: "success", icon: "WorkOutlineIcon" } }
    }
  },
  PhysicalSetupDone: {
    id: 13, name: 'Physical Setup Done',
    access: {
      [USER_ROLES.FINANCE.id]: { path: "financial_tracking_setup", config: { value: "Financial Tracking Setup", color: "success", icon: "WorkOutlineIcon" } }
    }
  },
  TrackingInProgress: {
    id: 14, name: 'Physical/Financial Tracking In Progress',
    access: {
      [USER_ROLES.TECH_TEAM.id]: { path: "physical_tracking_progress", config: { value: "Update Physical Progress", color: "secondary", icon: "BorderColorIcon" } },
      [USER_ROLES.FINANCE.id]: { path: "financial_tracking_progress", config: { value: "Update Financial Progress", color: "secondary", icon: "BorderColorIcon" } }
    }
  },
  TrackingCompleted: {
    id: 15, name: 'Tracking Completed',
    access: {
      [USER_ROLES.FINANCE.id]: { path: "financial_closure", config: { value: "Financial Closure", color: "warning", icon: "AddTaskIcon" } }
    }
  },
  FinancialClosed: {
    id: 16, name: 'Financial Closed',
    access: {
      [USER_ROLES.DIRECTOR.id]: { path: "project_closure", config: { value: "Close Project", color: "success", icon: "VerifiedIcon" } }
    }
  },
  ProjectCompleted: { id: 17, name: 'Project Completed', access: {} },
  TechnicalRejectDone: { id: 18, name: 'Technical Rejected', access: {} },
  DirectorRejectDone: { id: 19, name: 'Director Rejected', access: {} }
};

export const EXPENSE_STATUS = {
  Created: {
    id: 1, name: 'Created',
    access: {
      [USER_ROLES.TECH_TEAM.id]: { path: "expense_approval", config: { value: "Approval", color: "success", icon: "DoneAllIcon" } }
    }
  },
  TechnicalApprovalDone: {
    id: 2, name: 'Technical Approved',
    access: {
      [USER_ROLES.DIRECTOR.id]: { path: "expense_approval", config: { value: "Approval", color: "success", icon: "DoneAllIcon" } }
    }
  },
  DirectorApprovalDone: {
    id: 3, name: 'Director Approved',
    access: {
      [USER_ROLES.FINANCE.id]: { path: "fin_expense_approval", config: { value: "Complete", color: "success", icon: "DoneAllIcon" } }
    }
  },
  Completed: { id: 4, name: 'Completed', access: {} },
  TechnicalRejectDone: { id: 5, name: 'Technical Rejected', access: {} },
  DirectorRejectDone: { id: 6, name: 'Director Rejected', access: {} },
  FinanceRejectDone: { id: 7, name: 'Finance Rejected', access: {} },
};

export const TENDER_VIEW_MAP = {
  MD: { id: 1, roleName: 'MD', roleDescription: 'Managing Director' },
  DIRECTOR: { id: 2, roleName: 'Director', roleDescription: 'Director' },
  DATA_APPLICANT: { id: 3, roleName: 'Data Applicant', roleDescription: 'Data Applicant' },
  TECH_TEAM: { id: 4, roleName: 'Technical Team', roleDescription: 'Technical Team' },
  FINANCE: { id: 5, roleName: 'Finance', roleDescription: 'Finance' },
  ADMIN: { id: 6, roleName: 'Admin', roleDescription: 'Admin' }
}

export const TENDER_APPROVAL_STATUS = {
  APPROVED: { id: 1, name: "APPROVED" },
  REJECTED: { id: 2, name: "REJECTED" },
}

export const TENDER_GOV_STATUS = [
  { label: "L1", value: "L1" },
  { label: "L2", value: "L2" },
  { label: "L3", value: "L3" }
]

export const DEPARTMENTS = {
  ENVIRONMENT: { id: 1, name: "Environment" },
  PROPERTY_TAX_ASSESSMENT: { id: 2, name: "Property Tax Assessment" },
  ANNUAL_MAINTENANCE_CONTRACT: { id: 3, name: "Annual Maintenance Contract/Property Assessment" },
  PMC_AND_CIVIL: { id: 4, name: "PMC and Civil" },
  GIS: { id: 5, name: "GIS" },
  INFORMATION_TECHNOLOGY: { id: 6, name: "Information Technology" },
}

export const DEPARTMENT_TYPES = {
  [DEPARTMENTS.ENVIRONMENT.id]: {
    BIO_MINING: { label: "Bio Mining", value: "Bio Mining" },
    STP: { label: "STP", value: "STP" },
    TREE_CENSUS: { label: "Tree Census", value: "Tree Census" },
    WASTE_PROCESSING: { label: "Waste Processing", value: "Waste Processing" },
    OTHER: { label: "Other", value: "Other" },
  },
  [DEPARTMENTS.PROPERTY_TAX_ASSESSMENT.id]: {
    OTHER: { label: "Other", value: "Other" }
  },
  [DEPARTMENTS.ANNUAL_MAINTENANCE_CONTRACT.id]: {
    OTHER: { label: "Other", value: "Other" }
  },
  [DEPARTMENTS.PMC_AND_CIVIL.id]: {
    OTHER: { label: "Other", value: "Other" }
  },
  [DEPARTMENTS.GIS.id]: {
    OTHER: { label: "Other", value: "Other" }
  },
  [DEPARTMENTS.INFORMATION_TECHNOLOGY.id]: {
    OTHER: { label: "Other", value: "Other" }
  }
}

export const COVER_TYPES = {
  TECHNICAL: { id: 1, name: "Technical" },
  FINANCIAL: { id: 2, name: "Financial" }
}

export const COVER_DOC_TYPES = {
  PDF: { id: 1, name: "PDF" },
  ZIP: { id: 2, name: "ZIP" },
  RAR: { id: 3, name: "RAR" },
  EXCEL: { id: 4, name: "EXCEL" },
}