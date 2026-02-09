import customAxios from "./ApiClient";
import { API_URLS } from "./APIUrls";

const axiosForJSON = customAxios("application/json");
const axiosForMultipart = customAxios("multipart/form-data");

export const getRequest = (url, query = {}) => {
  return axiosForJSON.get(url, { params: query });
};

export const postRequest = (url, data) => {
  return axiosForJSON.post(url, JSON.stringify(data));
};

const putRequest = (url, data, query) => {
  return axiosForJSON.put(url, JSON.stringify(data), { params: query });
};

const deleteRequest = (url, query) => {
  return axiosForJSON.delete(url, { params: query });
};

const postFileRequest = (url, data) => {
  return axiosForMultipart.post(url, data);
};


/************************** POST REQUEST **************************/
export const signUpUserApi = (data) => {
  return postRequest(API_URLS.POST.SIGN_UP, data);
};

export const signInUserApi = (data) => {
  return postRequest(API_URLS.POST.SIGN_IN, data);
};

export const resetPasswordApi = (data) => {
  return postRequest(API_URLS.POST.RESET_PASSWORD, data);
};

export const getOTPApi = (data) => {
  return postRequest(API_URLS.POST.GET_OTP, data);
};

export const addUserDataApi = (data) => {
  return postRequest(API_URLS.POST.ADD_USER_DATA, data);
};

export const submitTenderActionApi = (data) => {
  return postRequest(API_URLS.POST.SUBMIT_TENDER_ACTION_API, data);
}

export const submitExpenseActionApi = (data) => {
  return postRequest(API_URLS.POST.SUBMIT_EXPENSE_ACTION_API, data);
}

/************************** POST File REQUEST **************************/
export const uploadDocsApi = (data, tenderId) => {
  return postFileRequest(API_URLS.POST.UPLOAD_DOCS + "/" + tenderId, data);
}

/************************** GET REQUEST **************************/
export const getUserListApi = (data) => {
  return getRequest(API_URLS.GET.GET_USER_DATA_LIST, data);
};

export const getDocsApi = (data) => {
  return getRequest(API_URLS.GET.GET_DOCS_DETAILS, data);
};

export const getDepartmentListApi = (data) => {
  return getRequest(API_URLS.GET.GET_DEPARTMENT_LIST, data);
};

export const getSearchFiltersApi = (data) => {
  return getRequest(API_URLS.GET.GET_SEARCH_FILTERS, data);
};

export const getExpenseSearchFiltersApi = (data) => {
  return getRequest(API_URLS.GET.GET_EXPENSE_SEARCH_FILTERS, data);
};

export const getTenderListApi = (data) => {
  return getRequest(API_URLS.GET.GET_TENDER_LIST, data);
};

export const getExpenseListApi = (data) => {
  return getRequest(API_URLS.GET.GET_EXPENSE_LIST, data);
};

export const getCorrigenDumList = (data) => {
  return getRequest(API_URLS.GET.GET_CORRIGENDUM_LIST, data);
}

export const getExpenseList = (data) => {
  return getRequest(API_URLS.GET.GET_EXPENSE_LIST, data);
}

export const getExpenseTypeList = (data) => {
  return getRequest(API_URLS.GET.GET_EXPENSE_TYPE_LIST, data);
}

export const getAllUserListApi = (data) => {
  return getRequest(API_URLS.GET.GET_ALL_USER_LIST, data);
}

export const getWorkListCountApi = (data) => {
  return getRequest(API_URLS.GET.GET_WORK_LIST_COUNT, data);
}

export const getWorkListExpenseCountApi = (data) => {
  return getRequest(API_URLS.GET.GET_WORK_LIST_EXPENSE_COUNT, data);
}

export const getDepartmentAggExpReportApi = (data) => {
  return getRequest(API_URLS.GET.GET_DEPARTMENT_AGG_EXP_REPORT, data);
}

export const getTenderAggExpReportApi = (data) => {
  return getRequest(API_URLS.GET.GET_TENDER_AGG_EXP_REPORT, data);
}

export const getTenderExpReportApi = (data) => {
  return getRequest(API_URLS.GET.GET_TENDER_EXP_REPORT, data);
}

export const getTenderMonitorReportApi = (data) => {
  return getRequest(API_URLS.GET.GET_TENDER_MONITOR_REPORT, data);
}

/************************** PUT REQUEST **************************/
export const updateUserDataApi = (data, query) => {
  return putRequest(API_URLS.PUT.UPDATE_USER_DATA, data, query);
};


/************************DELETE REQUEST *************************/
export const deleteUserDataApi = (data) => {
  return deleteRequest(API_URLS.DELETE.DELETE_USER_DATA, data);
}
