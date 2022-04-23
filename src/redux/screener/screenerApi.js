import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'utils/axios';
import { screenerUrlCreator } from 'utils/jwt';

const url = {
  create: `createScreener`,
  update: 'updateScreener',
  getScreenerByUser: `getScreenersByUser`,
  deleteUserScreener: 'deleteScreener',
  getScreenersId: 'getScreenersId',
  getAllCategories: 'getAllCategories',
  getScreenerByCategory: 'getScreenerByCategory',
  generateScreenerQuery: 'generateScreenerQuery',
};

export const createScreenerApi = createAsyncThunk('findScan/screener/createScreenerApi', async (params, thunkApi) => {
  try {
    const response = await axios.post(screenerUrlCreator(url.create), params);
    // if (Array.isArray(response.data) && response.data.length >= 1) {
    //   const data = await response.data;
    //   return data;
    // }
    if (response.data) {
      return response.data;
    }
    return thunkApi.rejectWithValue('Something went wrong with this');
  } catch (err) {
    return thunkApi.rejectWithValue('Something went wrong. Please try again');
  }
});

export const updateScreenerApi = createAsyncThunk('findScan/screener/updateScreenerApi', async (params, thunkApi) => {
  try {
    const response = await axios.put(screenerUrlCreator(url.update), params);
    // if (Array.isArray(response.data) && response.data.length >= 1) {
    //   const data = await response.data;
    //   return data;
    // }
    if (response.data) {
      return response.data;
    }
    return thunkApi.rejectWithValue('Something went wrong with this');
  } catch (err) {
    return thunkApi.rejectWithValue('Something went wrong. Please try again');
  }
});

export const getScreenerByUserApi = createAsyncThunk(
  'findScan/screener/getScreenerByUser',
  async (params, thunkApi) => {
    try {
      const response = await axios.get(screenerUrlCreator(url.getScreenerByUser));
      // if (Array.isArray(response.data) && response.data.length >= 1) {
      //   const data = await response.data;
      //   return data;
      // }
      if (response.data?.data) {
        return response.data?.data;
      }
      return thunkApi.rejectWithValue('Something went wrong with this');
    } catch (err) {
      return thunkApi.rejectWithValue('Something went wrong. Please try again');
    }
  }
);

export const getScreenerByCategoryApi = createAsyncThunk(
  'findScan/screener/getScreenerByUser',
  async (params, thunkApi) => {
    try {
      const response = await axios.get(screenerUrlCreator(url.getScreenerByCategory), { params });
      // if (Array.isArray(response.data) && response.data.length >= 1) {
      //   const data = await response.data;
      //   return data;
      // }
      if (response.data?.data) {
        return response.data?.data;
      }
      return thunkApi.rejectWithValue('Something went wrong with this');
    } catch (err) {
      return thunkApi.rejectWithValue('Something went wrong. Please try again');
    }
  }
);

export const deleteUserScreenerApi = createAsyncThunk(
  'findScan/screener/deleteUserScreenerApi',
  async (params, thunkApi) => {
    try {
      const response = await axios.delete(screenerUrlCreator(`${url.deleteUserScreener}/${params.screenerId}`));
      // if (Array.isArray(response.data) && response.data.length >= 1) {
      //   const data = await response.data;
      //   return data;
      // }
      if (response.data?.data) {
        return response.data?.data;
      }
      return thunkApi.rejectWithValue('Something went wrong with this');
    } catch (err) {
      return thunkApi.rejectWithValue('Something went wrong. Please try again');
    }
  }
);

export const getScreenersIdApi = createAsyncThunk('findScan/screener/getScreenersId', async (params, thunkApi) => {
  try {
    const response = await axios.get(screenerUrlCreator(`${url.getScreenersId}/${params.screenerId}`));
    // if (Array.isArray(response.data) && response.data.length >= 1) {
    //   const data = await response.data;
    //   return data;
    // }
    if (response.data?.data) {
      return response.data?.data;
    }
    return thunkApi.rejectWithValue('Something went wrong with this');
  } catch (err) {
    return thunkApi.rejectWithValue('Something went wrong. Please try again');
  }
});

export const getAllCategoryApi = createAsyncThunk('findScan/screener/getAllCategory', async (params, thunkApi) => {
  try {
    const response = await axios.get(screenerUrlCreator(url.getAllCategories));
    if (response.data?.data) {
      return response.data?.data;
    }
    return thunkApi.rejectWithValue('Something went wrong with this');
  } catch (err) {
    return thunkApi.rejectWithValue('Something went wrong. Please try again');
  }
});

export const generateScreenerQueryApi = createAsyncThunk(
  'findScan/screener/generateScreenerQuery',
  async (params, thunkApi) => {
    try {
      const response = await axios.post(screenerUrlCreator(url.generateScreenerQuery), params);
      console.log('response is', response.data);
      // if (Array.isArray(response.data) && response.data.length >= 1) {
      //   const data = await response.data;
      //   return data;
      // }
      if (response.data?.data) {
        return response.data?.data;
      }
      return thunkApi.rejectWithValue('Something went wrong with this');
    } catch (err) {
      return thunkApi.rejectWithValue('Something went wrong. Please try again');
    }
  }
);
