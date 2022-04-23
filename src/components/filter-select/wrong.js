import React, { useEffect, useState } from 'react';
import { Box, Typography, Autocomplete, TextField, ClickAwayListener, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SettingsOverscanIcon from '@mui/icons-material/SettingsOverscan';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Head from 'next/head';

FilterSelect.propTypes = {
  showArrow: PropTypes.bool,
  optionProps: PropTypes.func,
  valSx: PropTypes.object,
  variant: PropTypes.string,
  handleChange: PropTypes.func,
  value: PropTypes.any,
  showInput: PropTypes.bool,
  isDisabled: PropTypes.bool,
  handleBlur: PropTypes.func,
  viewMoreProps: PropTypes.object
};

export default function FilterSelect(props) {
  const {
    showArrow,
    variant,
    optionProps,
    valSx,
    handleChange,
    value,
    showInput,
    isDisabled,
    handleBlur,
    viewMoreProps = {},
  } = props;
  const [open, setOpen] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);

  const [customHead, setCustomHead] = useState()

  // Filters data
  const [filters] = React.useState({
    'Key Metrics': {
      'desc': `<p><strong>A paragraph </strong> of  <span className='text-danger'>text</span> with on <a href="">unassigned link</a> </p>
                  <p><strong>A <span className='fst-italic'>second</span> <span className='text-decoration-underline'>row</span> <span className='text-decoration-line-through'>text</span> </strong>  with a <a href="">web link</a> </p>`,
      'items': {
        'PE Ratio': `<p><strong>A paragraph </strong> of  <span className='text-danger'>text</span> with on <a href="">unassigned link</a> </p>
                  <p><strong>A <span className='fst-italic'>second</span> <span className='text-decoration-underline'>row</span> <span className='text-decoration-line-through'>text</span> </strong>  with a <a href="">web link</a> </p>`
      },

    },
    'Technical Indicators': {
      'desc': `<p><strong>A paragraph </strong> of  <span className='text-danger'>text</span> with on <a href="">unassigned link</a> </p>
                  <p><strong>A <span className='fst-italic'>second</span> <span className='text-decoration-underline'>row</span> <span className='text-decoration-line-through'>text</span> </strong>  with a <a href="">web link</a> </p>`,
      'items': {}
    },
    'Cash Flow': {
      'desc': `<p><strong>A paragraph </strong> of  <span className='text-danger'>text</span> with on <a href="">unassigned link</a> </p>
                  <p><strong>A <span className='fst-italic'>second</span> <span className='text-decoration-underline'>row</span> <span className='text-decoration-line-through'>text</span> </strong>  with a <a href="">web link</a> </p>`,
      'items': {
        'Item One': `<p><strong>A paragraph </strong> of  <span className='text-danger'>text</span> with on <a href="">unassigned link</a> </p>
                  <p><strong>A <span className='fst-italic'>second</span> <span className='text-decoration-underline'>row</span> <span className='text-decoration-line-through'>text</span> </strong>  with a <a href="">web link</a> </p>`,
        'Item Two': `<p><strong>A paragraph </strong> of  <span className='text-danger'>text</span> with on <a href="">unassigned link</a> </p>
                  <p><strong>A <span className='fst-italic'>second</span> <span className='text-decoration-underline'>row</span> <span className='text-decoration-line-through'>text</span> </strong>  with a <a href="">web link</a> </p>`,
        'Item Three': `<p><strong>A paragraph </strong> of  <span className='text-danger'>text</span> with on <a href="">unassigned link</a> </p>
                  <p><strong>A <span className='fst-italic'>second</span> <span className='text-decoration-underline'>row</span> <span className='text-decoration-line-through'>text</span> </strong>  with a <a href="">web link</a> </p>`,
        'Item Four': `<p><strong>A paragraph </strong> of  <span className='text-danger'>text</span> with on <a href="">unassigned link</a> </p>
                  <p><strong>A <span className='fst-italic'>second</span> <span className='text-decoration-underline'>row</span> <span className='text-decoration-line-through'>text</span> </strong>  with a <a href="">web link</a> </p>`,
        'Item Five': `<p><strong>A paragraph </strong> of  <span className='text-danger'>text</span> with on <a href="">unassigned link</a> </p>
                  <p><strong>A <span className='fst-italic'>second</span> <span className='text-decoration-underline'>row</span> <span className='text-decoration-line-through'>text</span> </strong>  with a <a href="">web link</a> </p>`,
        'Item Six': `<p><strong>A paragraph </strong> of  <span className='text-danger'>text</span> with on <a href="">unassigned link</a> </p>
                  <p><strong>A <span className='fst-italic'>second</span> <span className='text-decoration-underline'>row</span> <span className='text-decoration-line-through'>text</span> </strong>  with a <a href="">web link</a> </p>`,
        'Item Seven': `<p><strong>A paragraph </strong> of  <span className='text-danger'>text</span> with on <a href="">unassigned link</a> </p>
                  <p><strong>A <span className='fst-italic'>second</span> <span className='text-decoration-underline'>row</span> <span className='text-decoration-line-through'>text</span> </strong>  with a <a href="">web link</a> </p>`,
      }
    },
    'Alternate Data': {
      'desc': `<p><strong>A paragraph </strong> of  <span className='text-danger'>text</span> with on <a href="">unassigned link</a> </p>
                  <p><strong>A <span className='fst-italic'>second</span> <span className='text-decoration-underline'>row</span> <span className='text-decoration-line-through'>text</span> </strong>  with a <a href="">web link</a> </p>`,
      'items': {}
    }
  })
  const [filterTitle, setFilterTitle] = React.useState('Select Filter')
  const [filterDesc, setFilterDesc] = React.useState('')
  const [itemTitle, setItemTitle] = React.useState('')
  const [itemDesc, setItemDesc] = React.useState('')
  const [keyword, setKeyword] = React.useState('')

  useEffect(() => {
    if (showInput) {
      setOpen(true);
    }
  }, [showInput]);

  const handleSetFilter = (filter) => {
    setItemTitle('')
    setItemDesc('')
    setFilterTitle(filter)
    setFilterDesc(filters[filter]['desc'])
  }

  const handleSetItem = (item) => {
    setItemTitle(item)
    setItemDesc(filters[filterTitle]['desc'])
  }

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClickAway = () => {
    setOpen(false);
  };
  const OpenDialogBT = () => {
    setOpen(false)
    setOpenDialog(true);
  }


  const CustomPaper = (props) => {
    const { viewMoreProps, OpenDialogBT, ...other } = props;
    return (
      <Paper elevation={8} {...other}>

        {props.children}
        <span style={{ float: 'right' }} onMouseDown={() => OpenDialogBT()}>
          {viewMoreProps?.isVisible && (
            <Button variant="text" onMouseDown={() => OpenDialogBT()} size="small" endIcon={<SettingsOverscanIcon />}>
              Expand
            </Button>
          )}
        </span>
      </Paper>
    );
  };


  return (
    <>
      {customHead}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth='lg'
        fullWidth
      >
        <DialogTitle className='px-5'>
          <TextField id="outlined-search" fullWidth label="Search" type="search" className='mb-3' onChange={data => setKeyword(data.target.value)} />
          <section className='d-flex flex-warp justify-content-evenly' >
            {Object.entries(filters).map((item) => {
              return <Button onClick={() => handleSetFilter(item[0])} variant="outlined">{item[0]}</Button>
            })}
          </section>
        </DialogTitle>
        <DialogContent className='px-5'>
          <section className='row mt-5'>
            <aside className='col-md-6'>
              <h3>{filterTitle}</h3>
              {filterTitle != 'Select Filter' && <List
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                aria-label="contacts"
              >
                {Object.entries(filters[filterTitle]['items']).map(item => {
                  if (item[0].toLowerCase().includes(keyword.toLowerCase())) {
                    return <ListItem onClick={() => handleSetItem(item[0])} disablePadding>
                      <ListItemButton>
                        <ListItemText inset primary={item[0]} />
                      </ListItemButton>
                    </ListItem>
                  }

                })}
              </List>}

            </aside>
            <aside className='col-md-6'>
              {filterTitle != 'Select Filter' && <section className="mb-5">
                <h3>What is {filterTitle}?</h3>
                <div dangerouslySetInnerHTML={{ __html: filterDesc }}></div>
              </section>}

              {itemTitle && <section>
                <h3>What is {itemTitle}?</h3>
                <div dangerouslySetInnerHTML={{ __html: itemDesc }}></div>
              </section>}

            </aside>
          </section>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setOpenDialog(false)} autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <ClickAwayListener onClickAway={() => handleClickAway()}>
        <Box
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            cursor: isDisabled && 'not-allowed',
          }}
        >
          {!open || isDisabled ? (
            <Typography
              as="div"
              noWrap
              sx={{
                display: 'flex',
                backgroundColor: 'white',
                color: '#828282',
                fontSize: 12,
                height: 28,
                justifyContent: 'center',
                alignItems: 'center',
                padding: '7px 4px',
                ...valSx,
              }}
              onClick={handleClick}
            >
              {value?.value || value?.name || 'Value'}{' '}
              {showArrow && (
                <KeyboardArrowDownOutlinedIcon fontSize="small" sx={{ color: '#828282', marginLeft: '2px' }} />
              )}
            </Typography>
          ) : (
            <Autocomplete
              sx={{ backgroundColor: 'white', minWidth: '200px' }}
              freeSolo
              onOpen={() => setCustomHead(<Head>
                <script type="text/javascript" src="/js/main.js"></script>
              </Head>)}
              onClose={() => setCustomHead()}
              fullWidth
              openOnFocus
              disableClearable
              PaperComponent={(prop) => <CustomPaper OpenDialogBT={OpenDialogBT} {...prop} viewMoreProps={viewMoreProps} />}
              onBlur={(event) => handleBlur && handleBlur(event?.target?.value)}
              value={value}
              onChange={(event, newValue) => {
                handleChange(newValue);
                setOpen(!open);
              }}
              {...optionProps}
              id="filter-select-autocomplete"
              variant={variant && 'standard'}
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  color="secondary"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    autoFocus: true,
                  }}
                />
              )}
            />
          )}
        </Box>
      </ClickAwayListener>
    </>
  )
}
