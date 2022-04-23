import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import {
  createScreenerApi,
  updateScreenerApi,
  getScreenerByUserApi,
  getScreenersIdApi,
  getAllCategoryApi,
  generateScreenerQueryApi,
} from './screenerApi';
// import { createAlertApi } from './alertApi';

const initialState = {
  // businessSelected: {},
  filterPanelList: [{ data: [], bgColor: '#F2F4F9', relation: 'AND', type: 'filter', isActive: true }],
  selectedScreener: {},
  screenerList: [],
  alertList: [],
  isListLoading: false,
  categoryList: [],
  screenerQuery: '',
  isScreenerQueryLoading: false,
};

const slice = createSlice({
  name: 'screenerSlice',
  initialState,
  reducers: {
    setFilterPanelList: (state, action) => {
      state.filterPanelList = action.payload;
    },
    resetSelectedScreener: (state, action) => {
      state.filterPanelList = initialState.filterPanelList;
      state.selectedScreener = {};
    },
  },
  extraReducers: {
    [createScreenerApi.fulfilled]: (state, action) => {
      state.selectedScreener = action.payload?.data;
    },
    [updateScreenerApi.fulfilled]: (state, action) => {
      state.selectedScreener = action.payload?.data;
    },
    [getScreenerByUserApi.pending]: (state) => {
      state.isListLoading = true;
      state.screenerList = [];
      state.alertList = [];
    },
    [getScreenerByUserApi.fulfilled]: (state, action) => {
      state.screenerList = action.payload;
      state.isListLoading = false;
      state.alertList = _.chain(action.payload)
        .filter((screener) => !!screener?.alert)
        .map((screener) => ({ ...screener.alert, screenerName: screener?.screenerName, screenerId: screener?._id }))
        .value();
    },
    [getScreenerByUserApi.rejected]: (state) => {
      state.isListLoading = false;
      state.screenerList = [];
      state.alertList = [];
    },
    [getScreenersIdApi.fulfilled]: (state, action) => {
      state.selectedScreener = action.payload;
      state.filterPanelList = action.payload.filterPanelList;
    },
    [getAllCategoryApi.fulfilled]: (state, action) => {
      state.categoryList = action.payload;
    },
    [generateScreenerQueryApi.pending]: (state, action) => {
      state.isScreenerQueryLoading = true;
    },
    [generateScreenerQueryApi.fulfilled]: (state, action) => {
      state.isScreenerQueryLoading = false;
      state.screenerQuery = action.payload;
    },
    [generateScreenerQueryApi.rejected]: (state, action) => {
      state.isScreenerQueryLoading = false;
      state.screenerQuery = '';
    },
  },
});

export const screenerAction = slice.actions;
export default slice.reducer;
