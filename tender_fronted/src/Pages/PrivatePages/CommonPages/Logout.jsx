import { useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { useAuth } from '../../../Providers/AuthProvider';
import { useToast } from '../../../Providers/ToastProvider';

export default function Logout() {
    const navigate = useNavigate();
    const { toastMessage } = useToast();
    const { logout } = useAuth();

    useEffect(() => {
        // Todo make API call to logout
        toastMessage.success("Logged Out!!");
        logout();
        navigate("/signin");
    }, [])
}