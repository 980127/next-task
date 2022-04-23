import React from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, ListItemText, ListItemIcon, Stack } from '@mui/material';
import BalanceIcon from '@mui/icons-material/Balance';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { DateRangePicker } from 'rsuite';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Line } from "react-chartjs-2";
import dynamic from "next/dynamic";
import "rsuite/dist/rsuite.min.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { getHistoricalChartApi, getHistoricalDailyChartApi } from 'redux/fundamentals/stockApi';
import moment from "moment";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import useResponsive from 'hooks/useResponsive';
const {
  allowedMaxDays,
  allowedDays,
  allowedRange,
  beforeToday,
  afterToday,
  combine
} = DateRangePicker;
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)
export default function Stockchart(props) {
  const isDesktop = useResponsive('up', 'md');
  const dispatch = useDispatch();
  const router = useRouter();
  const { stockId } = router.query;
  const fundamental = useSelector((state) => state.fundamentalsReducer);
  const { historicalChart, historicalDailyChart } = fundamental
  const [value, setValue] = useState([null, null]);
  const [dataChart, setDataChart] = useState([]);
  const [typeChart, setTypeChart] = useState('line');
  const [period, setPeriod] = useState('Daily');
  const [isFullScreen, setIsFullScreen] = useState(false);

  const fullScreenStyles = {
    zIndex: '9999',
    width: '100%',
    height: '100%',
    position: 'fixed',
    top: '0',
    left: '0',
    padding: '100px',
    backgroundColor: 'white',
  }

  const TradingViewWidget = dynamic(
    () => import("react-tradingview-widget"),
    {
      ssr: false,
    }
  );
  useEffect(() => {
    if (period === "Daily") {
      dispatch(getHistoricalDailyChartApi({ ticker: stockId }));
    } else {
      dispatch(getHistoricalChartApi({ period: period, ticker: stockId }));
    }

  }, [period])

  useEffect(() => {
    if (period === "Daily") {
      if (historicalDailyChart?.historical) {
        setDataChart(historicalDailyChart?.historical.slice(0, 7))
        return
      }
    } else {
      if (historicalChart[0]) {
        setDataChart(historicalChart.slice(0, 100))
        return
      }
    }
  }, [historicalDailyChart, historicalChart])

  useEffect(() => {
    if (historicalDailyChart?.historical && value) {
      const filterDate = historicalDailyChart?.historical.filter(a => {
        return (moment(a.date).isAfter(moment(value[0]).subtract(1, 'days')) && moment(a.date).isBefore(moment(value[1]).add(1, 'days')));
      });
    }
    setDataChart(filterDate)
    setPeriod("Daily")
  }, [value])


  const handleChangeTypeChart = (event) => {
    setTypeChart(event.target.value);
  };

  const handleChangePeriod = (event) => {
    setPeriod(event.target.value);
  };
  const options = {
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    },
    elements: {
      point: {
        borderWidth: 0,
        radius: 0,
        backgroundColor: 'rgba(0,0,0,0)'
      }
    }
  }
  const data = {
    labels: dataChart
      ? dataChart.reverse().map((value) => {
        return value.date;
      })
      : null,
    datasets: [
      {
        colors: ['', 'red', 'green', 'blue'],
        label: "price",
        data: dataChart
          ? dataChart.reverse().map((value) => {
            return value.close;
          })
          : null,
        fill: true,
        // backgroundColor: "white",
        borderColor: "#F14B47",
        tension: 0.1,
        borderWidth: 1,
      }
    ]
  };

  return (
    <Box sx={isFullScreen ? fullScreenStyles : { py: 4 }}>
      <Typography sx={{ fontSize: '20px', lineHeight: '30px', fontWeight: 600, color: '#302F42' }}>
        {stockId.toUpperCase()} stock chart
      </Typography>
      <Stack direction={isDesktop ? "row" : "column"} sx={{ justifyContent: 'space-between', mt: '20px' }}>
        <Typography sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }}>
          C: 121.78
        </Typography>
        <Typography sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }}>
          O: 124.34
        </Typography>
        <Typography sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }}>
          H: 126.96
        </Typography>
        <Typography sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }}>
          L: 120.55
        </Typography>
        <Typography sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }}>
          B: 122.69 x 1300
        </Typography>
        <Typography sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }}>
          A: 122.89 x 800
        </Typography>
        <Typography sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }}>
          V: 62,452,563
        </Typography>
      </Stack>
      <Stack direction={isDesktop ? "row" : "column"} sx={{ justifyContent: 'space-between', mt: '20px' }}>
        <Stack direction="row" spacing={1} sx={{ textAlign: 'center', alignItems: 'center' }}>
          <BalanceIcon sx={{ height: '16px' }} />
          <Typography sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }}>
            Compare to
          </Typography>
          <KeyboardArrowDownIcon sx={{ fontSize: '14px' }} />
          {/* <DateRangeOutlinedIcon sx={{ pl: '14px', height: '50px' }} /> */}

          {/* <KeyboardArrowDownIcon sx={{ fontSize: '14px' }} /> */}
          {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
          <DateRangePicker
            sx={{ maxHeight: '200px' }}
            startText="Start date"
            endText="End date"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            disabledDate={afterToday()}
            renderInput={({ inputProps, ...startProps }, endProps) => {
              const startValue = inputProps.value;
              delete inputProps.value
              return (
                <TextField
                  sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }}
                  variant='outlined'
                  {...startProps}
                  inputProps={inputProps}
                  value={`${startValue}-${endProps.inputProps.value}`}
                />
              )
            }}
          />
          {/* </LocalizationProvider> */}
          <Typography sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }}>
            Date Range
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", textAlign: 'center', alignItems: 'center', mt: isDesktop ? "0" : '30px' }}>
          <Box component="img" src="/assets/fund-page/overviewTab-img/Vector.svg" sx={{ color: '#302F42' }} />
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            {/* <InputLabel id="demo-simple-select-standard-label">Age</InputLabel> */}
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={period}
              onChange={handleChangePeriod}
              label="Period"
              sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }}
            >
              <MenuItem sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }} value="">
                <em>None</em>
              </MenuItem>
              <MenuItem sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }} value={"1min"}>1 min</MenuItem>
              <MenuItem sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }} value={"5min"}>5 min</MenuItem>
              <MenuItem sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }} value={"15min"}>15 min</MenuItem>
              <MenuItem sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }} value={"30min"}>30 min</MenuItem>
              <MenuItem sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }} value={"1hour"}>1 hour</MenuItem>
              <MenuItem sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }} value={"Daily"}>Daily</MenuItem>

            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={typeChart}
              onChange={handleChangeTypeChart}
              label="Type chart"
              sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }}
            >
              <MenuItem sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }} value="">
                <em>None</em>
              </MenuItem>
              <MenuItem sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }} value={"line"}>Line</MenuItem>
              <MenuItem sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }} value={"candle"}>Candle</MenuItem>

            </Select>
          </FormControl>

          {/* <Typography sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }}>Line</Typography> */}
          {/* <KeyboardArrowDownIcon sx={{ fontSize: '14px' }} /> */}
          {/* <Typography sx={{ fontSize: '12px', lineHeight: '18px', fontWeight: 500, color: '#302F42' }}>Line</Typography> */}
          {/* <KeyboardArrowDownIcon sx={{ fontSize: '14px' }} /> */}
          <Box
            onClick={() => {
              setIsFullScreen(!isFullScreen)
            }} component="img" src="/assets/fund-page/overviewTab-img/expand.png" sx={{ pl: '12px', cursor: "pointer" }} />
        </Stack>

      </Stack>


      {typeChart === "line" && (<Box sx={{ mt: '30px', paddingRight: '45px' }}>
        <Line height={"100rem"} data={data} options={options} />
      </Box>)}
      {typeChart === "candle" && (<Box sx={{ mt: '30px', paddingRight: '45px' }}>
        <TradingViewWidget
          symbol={stockId.toUpperCase()}
          width="100%"
          height="400px"
          theme="light"
          interval="D"
          timezone="Etc/UTC"
          style="9"
          locale="en"
          toolbar_bg="#f1f3f6"
          enable_publishing={false}
          hide_top_toolbar={true}
          save_image={false}
          container_id="tradingview_5abee"
        />
      </Box>)}

    </Box>
  );
}
