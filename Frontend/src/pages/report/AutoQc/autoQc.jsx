// material-ui
import {
  Grid,
  InputLabel,
  Stack,
  TextField,
  Box,
  Tab,
  Tabs,
  Button,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

// project import
import MainCard from 'components/MainCard';
import { useState } from 'react';
import { HomeOutlined } from '@ant-design/icons';
import QualityControl from './QualityControl.jsx';
import PropertyClassification from './propertyClassfication.jsx';
import QC from './Qc.jsx';

// ==============================|| PropertyClassification PAGE ||============================== //

function AutoQc() {
  let selectedTab = 0;
  const [value, setValue] = useState(selectedTab);

  const [openDialog, setOpenDialog] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  function TabPanel({ children, value, index, ...other }) {
    return (
      <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
        {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    value: PropTypes.number,
    index: PropTypes.number
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  }

  return (
    <MainCard title="Auto Qc">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Property Classification" icon={<HomeOutlined />} iconPosition="start" {...a11yProps(0)} />
          <Tab label="Quality Control" icon={<HomeOutlined />} iconPosition="start" {...a11yProps(1)} />
          <Tab label="QC" icon={<HomeOutlined />} iconPosition="start" {...a11yProps(2)} />
        </Tabs>

        {/* //1st tab */}
        <TabPanel value={value} index={0}>
          <MainCard title="Property Classification" style={{ color: '#1677ff' }}>
            <PropertyClassification />
          </MainCard>
        </TabPanel>

        {/* 2nd tab */}

        <TabPanel value={value} index={1}>
          <QualityControl />
        </TabPanel>

        {/* 3rd tab */}
        <TabPanel value={value} index={2}>
          <QC />
        </TabPanel>
      </Box>
    </MainCard>
  );
}

export default AutoQc;
