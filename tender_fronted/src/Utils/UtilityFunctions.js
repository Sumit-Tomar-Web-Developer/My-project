import { EXPENSE_STATUS, TENDER_STATUS, TOOL_NAV_LINKS, USER_ROLES } from "./Constants"

export const userDataFormat = (userID, name, role, department, departmentName, token) => {
    return { userID, name, role, department, departmentName, token }
}

export const getDepartmentName = (departmentId, departmentList) => {
    for (let dep of departmentList) {
        if (dep.id === departmentId) {
            return dep.departmentname;
        }
    }
    return "";
}

export const getUserRoleName = (userRoleID) => {
    for (let userRole of Object.values(USER_ROLES)) {
        if (userRole.id === userRoleID) {
            return userRole.roleName;
        }
    }
    return "";
}

export const getTenderStatusName = (status) => {
    for (let tenderStatus of Object.values(TENDER_STATUS)) {
        if (tenderStatus.id === status) {
            return tenderStatus.name;
        }
    }
    return "";
}

export const getExpenseStatusName = (status) => {
    for (let expenseStatus of Object.values(EXPENSE_STATUS)) {
        if (expenseStatus.id === status) {
            return expenseStatus.name;
        }
    }
    return "";
}

export const getNavLinkByUserRole = (role) => {
    return TOOL_NAV_LINKS
        .filter(link => !link.requiredRoles || link.requiredRoles.includes(role))
        .map(link => ({
            ...link,
            subMenu: link.subMenu
                ? link.subMenu.filter(sub => !sub.requiredRoles || sub.requiredRoles.includes(role))
                : undefined
        }));
};

export const getUserActionName = (actionType) => {
    switch (actionType) {
        case 'APPROVED':
            return 'Approve';
        case 'REJECTED':
            return 'Reject';
        default:
            return '';
    }
};

export const isValidDate = (date) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Matches YYYY-MM-DD format
    return dateRegex.test(date);
};

export const formatDateForInput = (date) => {
    if (!date) return ''; // Handle empty or null dates
    return toLocalTimeString(new Date(date)).split('T')[0]; // Extract YYYY-MM-DD
};

export const isValidDateTimeFormat = (dateTime) => {
    // Matches YYYY-MM-DDTHH:MM where hours 00-23 and minutes 00-59
    const regex = /^(\d{4})-(\d{2})-(\d{2})T([01]\d|2[0-3]):([0-5]\d)$/;
    const match = regex.exec(dateTime);
    if (!match) return false;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    // Validate month/day using JS Date to account for month lengths and leap years
    if (month < 1 || month > 12) return false;
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) return false;

    return true;
};

export const toLocalTimeString = (date) => {
    const pad = (n) => `${Math.floor(Math.abs(n))}`.padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Month is 0-indexed
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const milliseconds = pad(date.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
};

export const formatDateTimeForInput = (date) => {
    if (!date) return null; // Handle empty or null dates
    return toLocalTimeString(new Date(date)).substring(0, 16); // Extract YYYY-MM-DD
};


export const formatDateForTable = (date) => {
    if (!date) return ''; // Handle empty or null dates

    const d = new Date(date);
    const pad = (num) => String(num).padStart(2, '0'); // Helper function to pad numbers

    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1); // Months are 0-based
    const year = d.getFullYear();
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

export const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}


export const getKeyValue = (colData, row) => {
    let cellValue = '';
    try {
        let keyList = String(colData.key).split('.');
        if (keyList.length > 0) {
            cellValue = row[keyList[0]];
        }
        for (let i = 1; i < keyList.length; i++) {
            cellValue = cellValue[keyList[i]];
        }
    }
    catch (e) {
        cellValue = '';
    }

    return cellValue;
}

export const flattenListOfLists = (listOfLists) => {
    return listOfLists.reduce((acc, list) => acc.concat(list), []);
}