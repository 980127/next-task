import { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Tabs, Tab, Typography, TextField, MenuItem } from '@mui/material';
import ColorButton from '../../../components/ColorButton';
import { MHidden } from '../../../components/@material-extend';
import ResultTable from './ResultTable';

const options = [
  {
    value: 'Refresh every 10 seconds',
    label: 'Refresh every 10 seconds'
  },
  {
    value: 'EUR',
    label: '€'
  },
  {
    value: 'BTC',
    label: '฿'
  },
  {
    value: 'JPY',
    label: '¥'
  }
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

ResultsContainer.propTypes = {
  isResultLoading: PropTypes.bool
};

function ResultsContainer(props) {
  const { isResultLoading } = props;
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider'
          //  display: 'flex',
          //  flexDirection: { xs: 'column', sm: 'column', md: 'row' },
        }}
      >
        <Tabs
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'column', md: 'row' },
            flexwrap: 'wrap'
          }}
          value={value}
          onChange={handleChange}
          aria-label="result  container"
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab label="Results" {...a11yProps(0)} />
          <Tab label="Backtests" {...a11yProps(1)} />
          <Tab label="Strategy" {...a11yProps(2)} />
          <MHidden width="mdDown">
            <Box
              sx={{
                position: { xs: 'relative', md: 'absolute' },
                right: 0,
                display: 'flex',
                width: '33%'
              }}
            >
              <TextField
                fullWidth
                size="small"
                sx={{ marginRight: 2 }}
                select
                placeholder="Refresh every 10 seconds"
                value={null}
                // onChange={handleChange}
              >
                {options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <ColorButton sx={{ paddingX: 3 }}>Column</ColorButton>
            </Box>
          </MHidden>
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <ResultTable isResultLoading={isResultLoading} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Backtests
      </TabPanel>
      <TabPanel value={value} index={2}>
        Strategy
      </TabPanel>
    </Box>
  );
}
export default ResultsContainer;
