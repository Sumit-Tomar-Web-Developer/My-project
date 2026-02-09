import { RouterProvider } from 'react-router-dom';

// project import
import router from 'routes';
import ThemeCustomization from 'themes';

// import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';

// auth provider
import { JWTProvider as AuthProvider } from './contexts/JWTContext';


// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

const App = () => (
  <ThemeCustomization>
    {/* <RTLLayout> */}

    <ScrollTop>
      <AuthProvider>
        <>
          <Notistack>
            <RouterProvider router={router} />
            <Snackbar />
          </Notistack>
        </>
      </AuthProvider>
    </ScrollTop>

    {/* </RTLLayout> */}
  </ThemeCustomization>
);

export default App;
