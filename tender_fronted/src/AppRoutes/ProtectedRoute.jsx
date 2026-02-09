import { Route, Navigate } from "react-router-dom";
import { useAuth } from '../Providers/AuthProvider';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const { user } = useAuth();

    if (user) {
        if (allowedRoles.includes(user.role)) {
            return children;
        }
        else {
            return <Navigate to="/access_denied" />
        }
    } else {
        return <Navigate to="/signin" />
    }
}

export default ProtectedRoute;