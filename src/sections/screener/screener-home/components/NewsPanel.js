import React, { useState } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NextLink from 'next/link';
import { PATH_SCREENER } from 'routes/paths';

export default function NewsPanel(props) {
  const { dashboardScreener, scrName, scrDesc, screenerData } = props;
  const [screener, setScreener] = useState(dashboardScreener);
  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        minHeight: '61px',
        padding: '8px 14px 11px',
        flexWrap: { xs: 'wrap', sm: 'wrap', md: 'nowrap' },
        backgroundColor: '#F2F4F9',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderLeft: '3px solid #3F6DC7',
        borderRadius: '2px 0px 0px 2px',
        // marginTop: '12px'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          flexDirection: 'column',
          maxWidth: '220px',
        }}
      >
        <NextLink href={`${PATH_SCREENER.root}/${screenerData?._id}`}>
          <Typography
            sx={{
              fontSize: '12px',
              color: '#4F4F4F',
              fontWeight: 600,
              lineHeight: '16px',
              marginBottom: '5px',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            {scrName}
          </Typography>
        </NextLink>
        <Typography sx={{ fontSize: '9px', color: '#828282', fontWeight: 500, lineHeight: '10px' }}>
          <div style={{ height: '50px', overflow: 'scroll' }} dangerouslySetInnerHTML={{ __html: scrDesc }} />
        </Typography>
      </Box>
    </Paper>
  );
}
