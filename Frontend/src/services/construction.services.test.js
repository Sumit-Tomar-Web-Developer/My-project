import axios from 'axios';
import {
  fetchConstructionType,
  createNewConstruction,
  fetchOldConstructionTypes,
  createOldConstruction,
  deleteNewConstructionInfo,
  deleteOldConstructionInfo
} from '../../src/services/construction.services'; 

import {
  SAVE_NEW_CONSTRUCTION_INFO,
  GET_NEW_CONSTRUCTION_INFO,
  GET_OLD_CONSTRUCTION_INFO,
  SAVE_OLD_CONSTRUCTION_INFO,
  DELETE_NEW_CONSTRUCTION_INFO,
  DELETE_OLD_CONSTRUCTION_INFO
} from '../constants/constants';

jest.mock('axios');

describe('Construction Service Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ========== Fetch New Construction Types ==========
  test('fetchConstructionType - should return data', async () => {
    const mockData = [{ id: 1, name: 'RCC' }];
    axios.get.mockResolvedValueOnce({ data: mockData });

    const response = await fetchConstructionType();
    console.log('fetchConstructionType Response:', response);

    expect(axios.get).toHaveBeenCalledWith(GET_NEW_CONSTRUCTION_INFO);
    expect(response).toEqual(mockData);
  });

  // ========== Create New Construction ==========
  test('createNewConstruction - should save and return data', async () => {
    const mockInput = { name: 'Load Bearing' };
    const mockResponse = {
      data: { message: 'Added successfully' },
      status: 200
    };

    axios.post.mockResolvedValueOnce(mockResponse);

    const response = await createNewConstruction(mockInput);
    console.log('createNewConstruction Response:', response);

    expect(axios.post).toHaveBeenCalledWith(SAVE_NEW_CONSTRUCTION_INFO, mockInput);
    expect(response).toEqual({ message: 'Added successfully', status: 200, res: mockResponse });
  });

  // ========== Delete New Construction ==========
  test('deleteNewConstructionInfo - should delete and return message', async () => {
    const id = 5;
    const mockResponse = { data: { message: 'Deleted' }, status: 200 };
    axios.delete.mockResolvedValueOnce(mockResponse);

    const response = await deleteNewConstructionInfo(id);
    console.log('deleteNewConstructionInfo Response:', response);

    expect(axios.delete).toHaveBeenCalledWith(`${DELETE_NEW_CONSTRUCTION_INFO}?CTMId=${id}`);
    expect(response).toEqual({ message: 'Deleted', status: 200 });
  });

  // ========== Fetch Old Construction ==========
  test('fetchOldConstructionTypes - should return data', async () => {
    const mockData = [{ id: 2, name: 'Stone Masonry' }];
    axios.get.mockResolvedValueOnce({ data: mockData });

    const response = await fetchOldConstructionTypes();
    console.log('fetchOldConstructionTypes Response:', response);

    expect(axios.get).toHaveBeenCalledWith(GET_OLD_CONSTRUCTION_INFO);
    expect(response).toEqual(mockData);
  });

  // ========== Create Old Construction ==========
  test('createOldConstruction - should post data and return response', async () => {
    const mockInput = { name: 'Mud Walls' };
    const mockResponse = { data: { message: 'Saved' }, status: 200 };

    axios.post.mockResolvedValueOnce(mockResponse);

    const response = await createOldConstruction(mockInput);
    console.log('createOldConstruction Response:', response);

    expect(axios.post).toHaveBeenCalledWith(SAVE_OLD_CONSTRUCTION_INFO, mockInput);
    expect(response).toEqual({ message: 'Saved', status: 200, res: mockResponse });
  });

  // ========== Delete Old Construction ==========
  test('deleteOldConstructionInfo - should delete old data by id', async () => {
    const id = 10;
    const mockResponse = { data: { message: 'Deleted old' }, status: 200 };
    axios.delete.mockResolvedValueOnce(mockResponse);

    const response = await deleteOldConstructionInfo(id);
    console.log('deleteOldConstructionInfo Response:', response);

    expect(axios.delete).toHaveBeenCalledWith(`${DELETE_OLD_CONSTRUCTION_INFO}?OldID=${id}`);
    expect(response).toEqual({ message: 'Deleted old', status: 200 });
  });

});
