import React, { createContext, useContext, useState } from 'react';
import { TOAST_SEVERITY } from '../Utils/Constants';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ open: false, serverity: '', message: '' });

    const successToastMessage = (message) => {
        setToast({ open: true, severity: TOAST_SEVERITY.SUCCESS, message });
    }

    const errorToastMessage = (message) => {
        setToast({ open: true, severity: TOAST_SEVERITY.ERROR, message });
    }

    const infoToastMessage = (message) => {
        setToast({ open: true, severity: TOAST_SEVERITY.INFO, message });
    }

    const warningToastMessage = (message) => {
        setToast({ open: true, severity: TOAST_SEVERITY.WARNING, message });
    }

    const clearToastMessage = () => {
        setToast({ open: false, serverity: '', message: '' });
    }

    const toastMessage = {
        success: successToastMessage,
        error: errorToastMessage,
        warning: warningToastMessage,
        info: infoToastMessage,
        clear: clearToastMessage
    }

    return (
        <ToastContext.Provider value={{ toast, toastMessage }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);