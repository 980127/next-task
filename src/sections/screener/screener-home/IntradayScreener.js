import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { Paper, Grid, Typography, Box, Divider, Card, Button } from '@mui/material';
import NewsPanel from './components/NewsPanelDemo';

export default function IntradayScreener() {
  return (
    <Box>
      <Box
        as="div"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          minWidth: { sm: '360px' }
        }}
      >
        <Typography sx={{ fontSize: '14px', color: '#333333', fontWeight: 600 }}>Intraday screeners</Typography>
        <Box as="div">
          <SearchIcon sx={{ fontSize: '25px', color: '#BDBDBD', marginRight: '15px' }} />
          <FilterAltIcon sx={{ fontSize: '25px', color: '#BDBDBD' }} />
        </Box>
      </Box>
      <Divider sx={{ margin: '12px 0 0px', color: '#E0E0E0' }} />
      {[0, 1, 2, 3, 4].map(() => (
        <>
          <NewsPanel />
        </>
      ))}
    </Box>
  );
}
