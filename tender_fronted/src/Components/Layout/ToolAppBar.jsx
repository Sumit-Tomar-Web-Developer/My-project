import { Fragment, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { navStyle } from '../../Assets/Styles/CommonStyles';
import { API_STATUS, APP_NAME, TOOL_NAV_LINKS, USER_ROLES } from '../../Utils/Constants';
import DesktopMenuBar from './DesktopMenuBar';
import MobileMenuBar from './MobileMenuBar';
import { useAuth } from '../../Providers/AuthProvider';
import { useToast } from '../../Providers/ToastProvider';
import { getNavLinkByUserRole } from '../../Utils/UtilityFunctions';
import { Box } from '@mui/material';
import { getWorkListCountApi, getWorkListExpenseCountApi, postRequest } from '../../AppApis/ApiFunctions';
import ThemeSwitch from '../Common/ThemeSwitch';
import CpmmLogo from '../../cpmmLogo.png';

export default function ToolAppBar() {
  const { user } = useAuth();
  const { toastMessage } = useToast();
  const navigate = useNavigate();
  const [workListCount, setWorkListCount] = useState(0);

  const navBarLinks = getNavLinkByUserRole(user && user.role);

  useEffect(() => {
    if (user && user.role && user.role !== USER_ROLES.ADMIN.id &&
      window.location.pathname !== '/signin' && window.location.pathname !== '/logout') {
      getWorkListCount();
    }
  }, [user, window.location.pathname])

  const getWorkListCount = () => {
    Promise.all([
      getWorkListCountApi({}),
      getWorkListExpenseCountApi({})
    ])
      .then(([res1, res2]) => {
        let wlCount = 0;
        if (res1.data && res1.data.type === API_STATUS.SUCCESS) {
          wlCount += res1.data.data;
        } else if (res1.data && res1.data.message) {
          toastMessage.error(res1.data.message);
        } else {
          toastMessage.error("Error in Fetching WorkList Count!!");
        }

        if (res2.data && res2.data.type === API_STATUS.SUCCESS) {
          wlCount += res2.data.data;
        } else if (res2.data && res2.data.message) {
          toastMessage.error(res2.data.message);
        } else {
          toastMessage.error("Error in Fetching WorkList Count!!");
        }

        setWorkListCount(wlCount);
      })
      .catch((error) => {
        toastMessage.error("Error in Fetching Tender List!!");
      });
  };

  const handleCreateNewTender = (e) => {
    let baseTenderUrl = "/tenders/";
    postRequest(baseTenderUrl).then((res) => {
      if (res.data) {
        if (res.data.type === API_STATUS.SUCCESS) {
          navigate(`/edit_tender_details/${res.data.data.projectID}`);
        }
        else {
          toastMessage.error(res.data.message);
        }
      }
      else {
        toastMessage.error("Failed to create new Tender!!");
      }
    }).catch((error) => {
      if (error.data && error.data.message) {
        toastMessage.error(error.data.message);
      }
      else {
        toastMessage.error("Failed to create new Tender!!");
      }
    })
  }

  return (
    <Fragment>
      <AppBar position="fixed" >
        {user && user.name ? (
          <Fragment>
            <MobileMenuBar navBarLinks={navBarLinks} userData={user} workListCount={workListCount}
              handleCreateNewTender={handleCreateNewTender} />
            <DesktopMenuBar navBarLinks={navBarLinks} userData={user} workListCount={workListCount}
              handleCreateNewTender={handleCreateNewTender} />
          </Fragment>
        ) : (
          <Toolbar sx={{ flexGrow: 1 }} disableGutters>
            <Box sx={{ ...navStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <img
                alt={APP_NAME}
                src={CpmmLogo}
                style={{ width: 80 }}
              />
              <ThemeSwitch />
            </Box>
          </Toolbar>
        )
        }
      </AppBar>
      <Toolbar></Toolbar>
      <Box sx={{ margin: '1rem 2rem 1rem 2rem' }}>
        <Outlet />
      </Box>
    </Fragment>
  );
}