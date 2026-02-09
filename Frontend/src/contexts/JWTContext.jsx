import React, { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import { jwtDecode } from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';

// project import
import Loader from 'components/Loader';
import axios from 'utils/axios';
import { setLayerID, setNewUserData, setPageNameList, setPermissions } from 'state/reducers/newUser/newUserSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { getSavedPermissions } from 'services/AdminServices/managePageLevelAccess/ManagePageLevelAcessService.js';
import { fetchPageNames } from 'services/AdminServices/pageNameMaster/PageNameMasterService';
import { resetAccessLevel } from 'state/reducers/dataEntry/accessLevelDataEntrySlice';
import { logoutUserService } from 'services/AuthService/authService';
import { API_BASE_URL } from 'constants/constants';

const chance = new Chance();

// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyToken = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }
  const decoded = jwtDecode(serviceToken);
  /**
   * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);

    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const reduxDispatch = useDispatch();

  // useEffect(() => {
  //   const init = async () => {
  //     try {
  //       const serviceToken = window.localStorage.getItem('serviceToken');
  //       //const userStr = window.localStorage.getItem('user');
  //       if (serviceToken && verifyToken(serviceToken)) {
  //         setSession(serviceToken);
  //         console.log(serviceToken);

  //         const response = await axios.get('/user-admin');
  //         if (response?.data?.user) {
  //           const { user } = response.data;

  //           dispatch({
  //             type: LOGIN,
  //             payload: {
  //               isLoggedIn: true,
  //               user
  //             }
  //           });
  //         } else {
  //           console.warn('No user data returned from /user-admin.');
  //           dispatch({ type: LOGOUT });
  //         }
  //       } else {
  //         dispatch({ type: LOGOUT });
  //       }
  //     } catch (err) {
  //       console.error('🔥 Error in init():', err?.response?.data || err.message || err);
  //       dispatch({ type: LOGOUT });
  //     }
  //   };

  //   init();
  // }, []);

  // Get LayerID from Redux

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        const userStr = window.localStorage.getItem('user');

        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken);

          let user;

          if (userStr) {
            user = JSON.parse(userStr);
          } else {
            // fallback: get fresh user data from API
            const response = await axios.get(`${API_BASE_URL}/user-admin`);
            console.log('✅ User fetched from API:', response.data);
            user = response?.data?.user;
          }

          

          if (user) {
            dispatch({
              type: LOGIN,
              payload: {
                isLoggedIn: true,
                user
              }
            });

            reduxDispatch(setNewUserData(user));

            if (user?.LayerID) {
              const rawPermissions = await getSavedPermissions(user.LayerID);
              console.log(rawPermissions,"permissionssss")
              reduxDispatch(setPermissions(rawPermissions));
            }
          }
           else {
            dispatch({ type: LOGOUT });
          }
        } else {
          dispatch({ type: LOGOUT });
        }
      } catch (err) {
        console.error('🔥 Error in init():', err?.response?.data || err.message || err);
        dispatch({ type: LOGOUT });
      }
    };

    init();
  }, []);

  const layerID = useSelector((state) => state.newUserDetails.initialUserData.LayerID);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!layerID) return;

      try {
        const rawPermissions = await getSavedPermissions(layerID);
        console.log('Fetched Permissions from useEffect:', rawPermissions);
        reduxDispatch(setPermissions(rawPermissions));
      } catch (error) {
        console.error('Error fetching permissions in useEffect:', error);
      }
    };

    fetchPermissions();
  }, [layerID, reduxDispatch]);

  useEffect(() => {
    const getPageNames = async () => {
      try {
        const response = await fetchPageNames();
        console.log('Page Names config user', response.data);
        reduxDispatch(setPageNameList(response.data));
      } catch (err) {
        console.error('Error fetching page names', err);
      }
    };
    getPageNames();
  }, []);

  const login = async ({ identifier, password }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      identifier,
      password
    });
      // 🔴 Check if error is returned from backend
      if (response.data?.error) {
        return response.data; // Return the error to the form
      }

      const { token, user } = response.data;

      console.log(user, 'logged in user data');
      console.log(response.data);

      setSession(token);
      localStorage.setItem('user', JSON.stringify(user));

      
    // 🔥 FIRST LOGIN HANDLING (WRITE HERE)
    if (user.isfirstlogin) {
      // 👉 store identifier for reset-password page
      localStorage.setItem('resetIdentifier', identifier);

      // ⛔ do NOT dispatch LOGIN yet
      return response.data;
    }


      dispatch({
        type: LOGIN,
        payload: {
          isLoggedIn: true,
          user
        }
      });

      if (user?.LayerID) {
        try {
          const rawPermissions = await getSavedPermissions(user.LayerID);
          reduxDispatch(setPermissions(rawPermissions));
        } catch (err) {
          console.error('Error fetching permissions:', err);
        }
      }

      reduxDispatch(setNewUserData(user));

      return response.data;
    } catch (err) {
      console.error('Login API error:', err);
      return err.response?.data || { error: 'Login failed' };
    }
  };

  const register = async (email, password, firstname, lastname, company) => {
    // todo: this flow need to be recode as it not verified
    const id = chance.bb_pin();
    const response = await axios.post(`${API_BASE_URL}/register`, {
      id,
      firstname,
      lastname,
      email,
      company,
      password
    });
    let users = response.data;

    if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
      const localUsers = window.localStorage.getItem('users');
      users = [
        ...JSON.parse(localUsers),
        {
          id,
          email,
          password,
          company,
          name: `${firstname} ${lastname}`
        }
      ];
    }

    window.localStorage.setItem('users', JSON.stringify(users));
  };

  // const logout = () => {
  //   setSession(null);
  //   localStorage.removeItem('user');
  //   dispatch({ type: LOGOUT });
  //   reduxDispatch(resetAccessLevel());
  // };

  const logout = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.UserID) {
      await logoutUserService(user.UserID); // ✅ Log to backend
    }

    // Clear frontend session
    setSession(null);
    localStorage.removeItem('user');
    dispatch({ type: LOGOUT });
    reduxDispatch(resetAccessLevel());

  } catch (err) {
    console.error('🔥 Logout error:', err);
  }
};

  const resetPassword = async (email) => {
    console.log('email - ', email);
  };

  const updateProfile = () => {};

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile }}>{children}</JWTContext.Provider>;
};

export default JWTContext;
