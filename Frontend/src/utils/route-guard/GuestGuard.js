
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// project import
import { APP_DEFAULT_PATH } from 'config';
import useAuth from 'hooks/useAuth';
import { useSelector } from 'react-redux';

// ==============================|| GUEST GUARD ||============================== //

const GuestGuard = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userStr = localStorage.getItem('user');

let user = null;

try {
  if (userStr && userStr !== 'undefined' && userStr !== 'null') {
    user = JSON.parse(userStr);
  }
} catch (e) {
  console.error('Invalid user JSON — clearing storage', e);
  localStorage.removeItem('user');
}

  // 🔹 OTP related
  const otpPending = localStorage.getItem('otpPending');

  
  const otpLoginEnabled = useSelector(
    (state) => state.appSetting?.otpLoginEnabled
  );

  // useEffect(() => {
  //   if (!isLoggedIn) return;

  //   if (user?.isfirstlogin) {
  //     return;
  //   }

  //   /**
  //    * 2️⃣ OTP ENABLED CASE
  //    */
  //   if (otpLoginEnabled && otpPending) return;

  //   if (otpLoginEnabled && !otpPending) {
  //     navigate(APP_DEFAULT_PATH, { replace: true });
  //     return;
  //   }

  //   navigate(location?.state?.from || APP_DEFAULT_PATH, {
  //     replace: true
  //   });

  // }, [
  //   isLoggedIn,
  //   otpPending,
  //   otpLoginEnabled,
  //   user,
  //   navigate,
  //   location
  // ]);
useEffect(() => {
  console.log("🟡 GUEST GUARD CHECK");

  console.log({
    isLoggedIn,
    user,
    isfirstlogin: user?.isfirstlogin,
    otpLoginEnabled,
    otpPending,
    currentPath: location.pathname
  });

  if (!isLoggedIn) {
    console.log("👤 NOT LOGGED IN — allow page");
    return;
  }

  if (user?.isfirstlogin) {
    console.log("🔐 FIRST LOGIN — allow reset page");
    return;
  }

  if (otpLoginEnabled && otpPending === 'true') {
    console.log("🛑 OTP PENDING — stay on OTP page");
    return;
  }

  if (otpLoginEnabled && !otpPending) {
    console.log("🚦 OTP REQUIRED BUT NOT STARTED — allow login page");
    return;
  }

  console.log("🏠 REDIRECT → DASHBOARD");
  navigate(location?.state?.from || APP_DEFAULT_PATH, { replace: true });

}, [
  isLoggedIn,
  otpPending,
  otpLoginEnabled,
  user,
  navigate,
  location
]);


  
  return children;
};

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default GuestGuard;
