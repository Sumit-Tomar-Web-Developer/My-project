import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppProvider } from './Providers/AppProvider';
import { CustomThemeProvider } from './Providers/CustomThemeProvider'
import AppRouting from './AppRoutes/AppRouting';
import AppAlert from './Components/Common/AppToast';
// import ErrorBoundary from './Components/Common/ErrorBoundary';

import './App.css'



function App() {

  console.log("%cTENDER MANAGEMENT APP", "color: #7289DA;-webkit-text-stroke: 2px black; font-size:55px;font-weight:bold;"); 
  console.log("%cVERSION:1.0","font-size:24px;;");
  console.log("%cDO NOT PASTE HERE ANYTHING IF YOU DONT KNOW WHAT YOU ARE DOING.","color:rgb(210, 47, 47); font-size:20px;");
  return (
    <CustomThemeProvider>
      {/* <ErrorBoundary> */}
      <AppProvider>
        <AppAlert />
        <AppRouting />
      </AppProvider>
      {/* </ErrorBoundary> */}
    </CustomThemeProvider>
  );
}

export default App;

