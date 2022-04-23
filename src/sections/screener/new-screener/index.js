import React, { useState, useEffect, useRef } from 'react';
import { Paper, Grid, Typography, Box, Button, TextField } from '@mui/material';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import dynamic from 'next/dynamic';
import { arrayMoveImmutable } from 'array-move';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import _ from 'lodash';
import Page from 'components/Page';
import useAuth from 'hooks/useAuth';
import randomColor from 'randomcolor';
import { useSelector, useDispatch } from 'react-redux';
import Chip from '@mui/material/Chip';
import closeFill from '@iconify/icons-eva/close-fill';
import editOutline from '@iconify/icons-eva/edit-outline';
import checkOutline from '@iconify/icons-eva/checkmark-outline';
import closeOutline from '@iconify/icons-eva/close-outline';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import { MIconButton } from 'components/@material-extend';

import { PATH_AUTH } from 'routes/paths';
import { unwrapResult } from '@reduxjs/toolkit';
import StockBanner from 'components/StockBanner';
import DialogAlert from 'components/DialogAlert';
import ResultsContainer from '../components/ResultsContainer';
import FilterNavbar from '../components/FilterNavbar';
import FilterPanel from '../components/FilterPanel';
import { screenerAction } from 'redux/screener/screenerSlice';
import FilterFooterButtons from '../components/FilterFooterButtons';
import FormScreenerScan from '../components/FormScreenerScan';
import FormScreenerAlert from '../components/FormScreenerAlert';
import GroupToggler from '../components/GroupToggler';
import { getScreenersIdApi, updateScreenerApi, generateScreenerQueryApi } from 'redux/screener/screenerApi';
import { saveFormConst } from '../utils/constants';
import { useRouter } from 'next/router';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute',
        bgcolor: 'background.paper',
      }}
    >
      Loading...
    </Box>
  ),
});

const RootStyle = styled(Page)({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
});

const useStyles = makeStyles((theme) => ({
  createStock: {
    [theme.breakpoints.up('md')]: {
      width: '80%',
    },
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '18px 16px',
    marginBottom: '24px',
  },
  stockList: {
    width: '80%',
    height: 643,
    backgroundColor: 'white',
    marginTop: '44px',
    borderRadius: 2,
    boxShadow: 3,
  },
  reactQuill: {
    width: '500px !important',
    'MuiBox-root &': {
      width: '500px',
    },
    '& .ql-toolbar': {
      border: 'none'
    },
    '& .ql-container': {
      border: 'none',
      '& .ql-editor': {
        minHeight: '100px',
      },
    },
  },
  descriptionRoot: {
    display: 'flex',
    alignItems: 'flex-start'
  },
  desBtn: {
    cursor: 'pointer',
    borderBottom: '1px solid #0066CC',
    color: '#0066CC'
  },
  noBorder: {
    border: 'none',
    '&:focus' :{
      outline: 'none'
    }
  }
}));

const SortableItem = sortableElement((props) => <FilterPanel {...props} />);

const SortableContainer = sortableContainer(({ children }) => <div>{children}</div>);

export default function NewScreenerPage() {
  const dispatch = useDispatch();
  const navigate = useRouter();
  const formsRef = useRef();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { isAuthenticated } = useAuth();
  const { filterPanelList, selectedScreener, screenerQuery, isScreenerQueryLoading } = useSelector(
    ({ screenerReducer }) => screenerReducer
  );
  const [showSaveForm, setSaveForm] = useState(null);
  const [handleScreener, setHanldeScreener] = useState(false);
  const [collapse, setCollapse] = useState(true);
  const [isResultLoading, setResultLoading] = useState(false);
  const [alertDialog, setAlertDialog] = useState(false);

  const [titleEditFlag, setTitleEditFlag] = useState(false);
  const [descriptionEditFlag, setDescriptionEditFlag] = useState(false);

  const [tempTitle, setTempTitle] = useState(selectedScreener?.screenerName || 'Stock Screener');
  const [tempDescription, setTempDescription] = useState(selectedScreener?.description || '');

  const onSortEnd = ({ oldIndex, newIndex }) => {
    const updatedFilterVals = arrayMoveImmutable(filterPanelList, oldIndex, newIndex);
    console.log('updated filter fal is', updatedFilterVals);
    dispatch(screenerAction.setFilterPanelList(updatedFilterVals));
  };

  const onhandleScreener = () => {
    // setFormScreenerScan((fom) => !fom);
    setResultLoading(true);

    setTimeout(() => {
      setResultLoading(false);
    }, 3000);
  };

  useEffect(() => {
    setTempTitle(selectedScreener?.screenerName || 'Stock Screener');
    setTempDescription(selectedScreener?.description || '');
  }, [selectedScreener])

  const pathname = navigate?.pathname;
  useEffect(() => {
    const lastPath = pathname?.split('/').pop();
    if (lastPath === 'new-screener') {
      dispatch(screenerAction.resetSelectedScreener());
    } else if (lastPath !== 'screener') {
      dispatch(getScreenersIdApi({ screenerId: lastPath }));
    }
  }, [navigate]);

  const classes = useStyles();

  const setToggler = (itemIndex) => {
    const updatedToggle = _.cloneDeep(filterPanelList);
    if (updatedToggle[itemIndex].relation === 'AND') {
      updatedToggle[itemIndex].relation = 'OR';
    } else {
      updatedToggle[itemIndex].relation = 'AND';
    }
    dispatch(screenerAction.setFilterPanelList(updatedToggle));
  };

  const onBtGroupping = () => {
    const updatedPanel = _.cloneDeep(filterPanelList);

    const rdClr = randomColor({
      luminosity: 'light',
      format: 'rgba',
      alpha: 0.5,
    });
    updatedPanel.push({ data: [], relation: 'AND', type: 'group' });
    updatedPanel.push({ data: [], bgColor: rdClr, relation: 'AND', type: 'filter' });
    dispatch(screenerAction.setFilterPanelList(updatedPanel));
  };

  const onBtSave = async () => {
    if (isAuthenticated) {
      if (_.isEmpty(selectedScreener)) {
        setSaveForm((val) => (val === saveFormConst.SCREENER_SAVE ? null : saveFormConst.SCREENER_SAVE));
      } else {
        const params = { ...selectedScreener, filterPanelList };
        let response = await dispatch(updateScreenerApi(params));
        response = unwrapResult(response);
        if (response.data) {
          enqueueSnackbar('Saved successfully', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            ),
          });
        }
        setSaveForm(null);
      }
    } else {
      navigate.push(PATH_AUTH.login);
    }
  };

  const onBtAlert = async () => {
    if (isAuthenticated) {
      if (!_.isEmpty(selectedScreener)) {
        setSaveForm((val) => (val === saveFormConst.ALERT_SAVE ? null : saveFormConst.ALERT_SAVE));
      } else {
        setAlertDialog(true);
      }
    } else {
      navigate.push(PATH_AUTH.login);
    }
  };

  const onBtEditScreener = () => {
    setSaveForm(saveFormConst.SCREENER_SAVE);
    formsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const onGenerateQuery = () => {
    const params = { filterPanelList };
    dispatch(generateScreenerQueryApi(params));
  };

  const onClickTitleEdit = () => {
    setTitleEditFlag(true);
  }

  const onTitleChange = e => {
    setTempTitle(e.target.value)
  }

  const cancelTitleEdit = () => {
    setTitleEditFlag(false);
    setTempTitle(selectedScreener?.screenerName || 'Stock Screener');
  }

  const saveTitle = async () => {
    let response = await dispatch(updateScreenerApi({
      ...selectedScreener,
      screenerName: tempTitle,
    }));
    response = unwrapResult(response);
    if (response.data) {
      enqueueSnackbar('Saved successfully', {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        ),
      });
      setTitleEditFlag(false);
      setTempTitle(response.data.screenerName);
    }
  }

  const onClickDescriptionEdit = () => {
    setDescriptionEditFlag(true);
  }

  const onDescriptionChange = value => {
    setTempDescription(value)
  }

  const cancelDescriptionEdit = () => {
    setDescriptionEditFlag(false);
    setTempDescription(selectedScreener?.description || '');
  }

  const saveDescription = async () => {
    let response = await dispatch(updateScreenerApi({
      ...selectedScreener,
      description: tempDescription,
    }));
    response = unwrapResult(response);
    if (response.data) {
      enqueueSnackbar('Saved successfully', {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        ),
      });
      setDescriptionEditFlag(false);
      setTempDescription(response.data.description);
    }
  }

  return (
    <RootStyle title="Screener">
      <DialogAlert
        handleClose={() => setAlertDialog(false)}
        title="Information"
        message="Please create or select a screener to create alert"
        dialogOpen={alertDialog}
      />
      <Paper elevation={3} className={classes.createStock}>
        <Grid sx={{ flexGrow: 1, flex: 1 }} container spacing={2}>
          <Grid item xs={12} lg={12}>
            <StockBanner />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            lg={12}
            sx={{
              marginLeft: 2,
              width: '100%',
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '16px', sm: '16px', md: '18px' },
                color: '#333333',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {titleEditFlag ? (
                <input
                  type="text"
                  id="screener-name"
                  name="screenerName"
                  variant="outlined"
                  dense
                  size="small"
                  value={tempTitle}
                  onChange={onTitleChange}
                  className={classes.noBorder}
                />
              ) : (
                selectedScreener?.screenerName || 'Stock Screener'
              )}
              {titleEditFlag && (
                <>
                  <MIconButton size="small" onClick={cancelTitleEdit}>
                    <Icon icon={closeOutline} />
                  </MIconButton>
                  <MIconButton size="small" onClick={saveTitle}>
                    <Icon icon={checkOutline} />
                  </MIconButton>
                </>
              )}
              {!titleEditFlag && (
                <MIconButton size="small" onClick={() => onClickTitleEdit()}>
                  <Icon icon={editOutline} />
                </MIconButton>
              )}
              {!_.isEmpty(selectedScreener) && selectedScreener?.scanCategory && (
                <Chip
                  label={selectedScreener?.scanCategory}
                  variant="outlined"
                  size="small"
                  sx={{ fontSize: '10px' }}
                />
              )}
            </Typography>
            <div style={{ position: 'relative', marginBottom: '30px'}}>
              {descriptionEditFlag ? (
                <>
                  <Box as="div" fullWidth sx={{ width: '100%' }}>
                    <ReactQuill
                      className={classes.reactQuill}
                      value={tempDescription}
                      name="description"
                      onChange={onDescriptionChange}
                    />
                  </Box>
                  <>
                    <MIconButton size="small" onClick={cancelDescriptionEdit}>
                      <Icon icon={closeOutline} />
                    </MIconButton>
                    <MIconButton size="small" onClick={saveDescription}>
                      <Icon icon={checkOutline} />
                    </MIconButton>
                  </>
                </>
              ) : (
                selectedScreener?.description ? (
                  <div className={classes.descriptionRoot}>
                    <Typography
                      sx={{
                        fontSize: { xs: '12px', sm: '12px', md: '14px' },
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {selectedScreener?.description && (
                        <div
                          style={collapse ? { height: '100px', overflow: 'hidden' } : { minHeight: '100px' }}
                          dangerouslySetInnerHTML={{ __html: selectedScreener?.description }}
                        />
                      )}
                    </Typography>
                    <MIconButton size="small" style={{ marginTop: -10 }} onClick={() => onClickDescriptionEdit()}>
                      <Icon icon={editOutline} />
                    </MIconButton>
                  </div>
                ) : (
                  <span className={classes.desBtn} onClick={onClickDescriptionEdit}>Add Description</span>
                )
              )}
              {' '}
              
              {selectedScreener?.description && (
                <div style={{ textAlign: 'center', bottom: collapse && '-5px', position: 'absolute', 
                width:'100%', marginTop: !collapse && '-15px', backgroundColor: collapse && '#ffffffa8'
              }}>
                  <Button variant="text" fullWidth  onClick={() => setCollapse(!collapse)}>
                    {collapse ? 'Read more' : 'Read Less'}
                  </Button>
                </div>
              )}
            </div>
          </Grid>
          <Grid item xs={12} lg={12}>
            <FilterNavbar />
            <SortableContainer onSortEnd={onSortEnd} useDragHandle>
              {_.map(filterPanelList, (val, index) =>
                val.type === 'filter' ? (
                  <SortableItem
                    itemIndex={index}
                    key={`item-${index}`}
                    index={index}
                    valueUploaded={val.data}
                    bgColor={val?.bgColor}
                    relation={val?.relation}
                    isActive={val?.isActive}
                    disabled={!val?.isActive}
                  />
                ) : (
                  <GroupToggler
                    setToggleButton={() => setToggler(index)}
                    key={`item-${index}`}
                    relation={val?.relation}
                  />
                )
              )}
            </SortableContainer>
            <FilterFooterButtons
              onRunScreenerClick={() => onhandleScreener(!handleScreener)}
              onSaveClick={onBtSave}
              onBtGroupping={onBtGroupping}
              onBtAlert={onBtAlert}
              onGenerateQuery={onGenerateQuery}
            />
            <Box
              as="div"
              ref={formsRef}
              sx={{
                opacity: showSaveForm ? '1' : '0',
                height: showSaveForm ? 'auto' : '0px',
                overFLow: showSaveForm ? 'visible' : 'hidden',
                transition: 'height 0.3s, display: 1s',
                // display: formScreenerScan ? 'block' : 'none'
                // transition: 'display 1s ease-in-out'
              }}
            >
              {showSaveForm === saveFormConst.SCREENER_SAVE && <FormScreenerScan setSaveForm={setSaveForm} />}
              {showSaveForm === saveFormConst.ALERT_SAVE && <FormScreenerAlert setSaveForm={setSaveForm} />}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      {screenerQuery && (
        <Paper elevation={3} className={classes.createStock}>
          {screenerQuery}
        </Paper>
      )}
      <Paper elevation={3} className={classes.createStock}>
        <ResultsContainer isResultLoading={isResultLoading} />
      </Paper>
    </RootStyle>
  );
}
