import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../Providers/AuthProvider';
import { USER_ROLES } from '../../../Utils/Constants';
import Users from '../AdminPages/Users';
import TenderSearch from './TenderSearch';
import AllSearch from './AllSearch';

export default function DashBoard(props) {
    const { user } = useAuth();

    switch (user.role) {
        case USER_ROLES.DATA_APPLICANT.id:
            return <AllSearch {...props} />
        case USER_ROLES.DIRECTOR.id:
            return <AllSearch {...props} />
        case USER_ROLES.FINANCE.id:
            return <AllSearch {...props} />
        case USER_ROLES.TECH_TEAM.id:
            return <AllSearch {...props} />
        case USER_ROLES.MD.id:
            return <AllSearch {...props} />
        case USER_ROLES.ADMIN.id:
            return <Users />
        default:
            return <Navigate to="/signin" />
    }
}