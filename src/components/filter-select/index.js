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


  const [filterTitle, setFilterTitle] = React.useState('Select Filter')
  const [keyword, setKeyword] = React.useState('')
  const [groups, setGroups] = React.useState([])
  const [item, setItem] = React.useState([])
  const [filterJson, setFilterJson] = React.useState([])
  const [list, setList] = React.useState([])
  const [isActive, setActive] = React.useState();
  const [name,setName] = React.useState()
  useEffect(() => {
    if (showInput) {
      setOpen(true);
    }
    handleGroupList()

  }, [showInput, optionProps]);

  function handleGroupList() {
    const result = optionProps.options
      .reduce((hash, obj) => {
        if (obj['groupedAs'] === undefined) return hash;
        return Object.assign(hash, { [obj['groupedAs']]: (hash[obj['groupedAs']] || []).concat(obj) })
      }, {})
    setList(result)
  }

  const handleSetGroups = (groupsPar) => {
    if (groupsPar) {
      setFilterJson(groupsPar)
      let groupsTemp = []
      groupsPar.children[2].props.children.map(item => {
        groupsTemp.push(item.props.children[0].props.children)
        setGroups(groupsTemp)
      })
    }
  }


  const handleSetFilter = (index, filter) => {
    const options = document.querySelectorAll('.MuiPaper-root h4')[index].scrollIntoView({ behavior: 'smooth' });
    console.log('options', options)
    setFilterTitle(filter)
  }

  const handleSetItem = (item,i) => {
    setItem(item)
    setName(item.name)
    setActive(i);
  }

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClickAway = () => {
    setOpen(false);
  };
  const OpenDialogBT = (groups = null) => {
    setOpen(false)
    setOpenDialog(true);
    handleSetGroups(groups)
  }


  const CustomPaper = (props) => {
    const { viewMoreProps, OpenDialogBT, ...other } = props;
    return (
      <Paper elevation={8} {...other}>

        {props.children}
        <span style={{ float: 'right' }} onMouseDown={() => OpenDialogBT(props)}>
          {viewMoreProps?.isVisible && (
            <Button variant="text" onMouseDown={() => OpenDialogBT()} size="small" endIcon={<SettingsOverscanIcon />}>
              Expand
            </Button>
          )}
        </span>
      </Paper>
    );
  };

  const handleSubmit = () => {
    handleChange(item)
  }


  return (
    <>
      {customHead}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth='lg'
        style={{minWidh: '800px'}}
        id="new-screen_dialog"
        fullWidth
      >
        <DialogTitle className='px-5'>
          <TextField id="outlined-search" fullWidth label="Search" type="search" className='mb-3' onChange={data => setKeyword(data.target.value)} />
          <section className='' style={{overflow:'auto'}} >
            {groups.map((item, index) => {
              return <Button style={{marginRight:'5px',marginBottom:'5px'}} onClick={() => handleSetFilter(index, item)} variant="outlined">{item}</Button>
            })}
          </section>
        </DialogTitle>
        <DialogContent className='px-5' >
          <section className='row mt-5'>
            <aside className='col-md-6'>
              <Paper style={{ maxHeight: 400, overflow: 'auto',borderWidth:'1px',borderStyle:'solid',borderColor:'rgb(237,237,237)', borderRadius:'3px', padding:'10px' }}>
                {Object.entries(list).map( item => {
                   const count=0;
                    {item[1].map(item => {
                          if (item.name.toLowerCase().includes(keyword.toLowerCase())) {
                            count++;
                          }
                        })}
                      
                  return <>
                     {count != 0 ?  <h4>{item[0]}</h4>:''}
                    <List>
                      {item[1].map((item,i) => {
                        if (item.name.toLowerCase().includes(keyword.toLowerCase())) {
                          return <ListItem disablePadding onClick={() => handleSetItem(item,i)}>
                  
                            <ListItemButton className={ isActive === i && name == item.name ? 'active':''}>
                              <ListItemText inset primary={item.name} />
                            </ListItemButton>
                          </ListItem>
                        }
                      })}
                    </List>
                  </>
                })}
              </Paper>


            </aside>
            <aside className='col-md-6'>
              {filterTitle != 'Select Filter' && <section className="mb-5">
                <h3>What is {filterTitle}?</h3>
                <p><strong>A paragraph </strong> of  <span className='text-danger'>text</span> with on <a href="">unassigned link</a> </p>
                <p><strong>A <span className='fst-italic'>second</span> <span className='text-decoration-underline'>row</span> <span className='text-decoration-line-through'>text</span> </strong>  with a <a href="">web link</a> </p>
              </section>}

              {item.name && <section>
                <h3>What is {item.name}?</h3>
                <p><strong>A paragraph </strong> of  <span className='text-danger'>text</span> with on <a href="">unassigned link</a> </p>
                <p><strong>A <span className='fst-italic'>second</span> <span className='text-decoration-underline'>row</span> <span className='text-decoration-line-through'>text</span> </strong>  with a <a href="">web link</a> </p>
              </section>}

            </aside>
          </section>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => { setOpenDialog(false); handleSubmit() }} autoFocus>
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
