import { Navigate } from "react-router-dom";
import { useAuth } from '../Providers/AuthProvider';

const PublicRoute = ({ children }) => {
    const { user } = useAuth();

    if (user && user.token) {
        return <Navigate to="/dashboard" />
    } else {
        return children;
    }
}

export default PublicRoute;