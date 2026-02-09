import { LOCAL_STORAGE_DATA_KEYS } from './Constants';

export const getTokenFromLocal = () => {
    return localStorage.getItem(LOCAL_STORAGE_DATA_KEYS.TOKEN);
}

export const getThemePreferenceFromLocal = () => {
    return localStorage.getItem(LOCAL_STORAGE_DATA_KEYS.THEME);
}

export const setThemePreferenceToLocal = (theme) => {
    localStorage.setItem(LOCAL_STORAGE_DATA_KEYS.THEME, theme);
}

export const getUserDataFromLocal = () => {
    let userData = {
        userID: localStorage.getItem(LOCAL_STORAGE_DATA_KEYS.USERID),
        name: localStorage.getItem(LOCAL_STORAGE_DATA_KEYS.NAME),
        role: parseInt(localStorage.getItem(LOCAL_STORAGE_DATA_KEYS.ROLE)),
        department: localStorage.getItem(LOCAL_STORAGE_DATA_KEYS.DEPARTMENT),
        departmentName: localStorage.getItem(LOCAL_STORAGE_DATA_KEYS.DEPARTMENTNAME),
        token: localStorage.getItem(LOCAL_STORAGE_DATA_KEYS.TOKEN)
    }
    return userData;
}

export const setUserDataToLocal = (userData) => {
    localStorage.setItem(LOCAL_STORAGE_DATA_KEYS.USERID, userData.userID);
    localStorage.setItem(LOCAL_STORAGE_DATA_KEYS.NAME, userData.name);
    localStorage.setItem(LOCAL_STORAGE_DATA_KEYS.ROLE, userData.role);
    localStorage.setItem(LOCAL_STORAGE_DATA_KEYS.DEPARTMENT, userData.department);
    localStorage.setItem(LOCAL_STORAGE_DATA_KEYS.DEPARTMENTNAME, userData.departmentName);
    localStorage.setItem(LOCAL_STORAGE_DATA_KEYS.TOKEN, userData.token);
}


export const clearUserDataFromLocal = () => {
  
    localStorage.removeItem(LOCAL_STORAGE_DATA_KEYS.USERID);
    localStorage.removeItem(LOCAL_STORAGE_DATA_KEYS.NAME);
    localStorage.removeItem(LOCAL_STORAGE_DATA_KEYS.ROLE);
    localStorage.removeItem(LOCAL_STORAGE_DATA_KEYS.DEPARTMENT);
    localStorage.removeItem(LOCAL_STORAGE_DATA_KEYS.DEPARTMENTNAME);
    localStorage.removeItem(LOCAL_STORAGE_DATA_KEYS.TOKEN);
}

export const clearThemePreferenceFromLocal = () => {
    localStorage.removeItem(LOCAL_STORAGE_DATA_KEYS.THEME);
}

export const clearAllLocalData = () => {
   localStorage.clear();
}