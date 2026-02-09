import axios from 'axios';
import {
  fetchNewFloor,
  createNewFloor,
  fetchOldFloor,
  createOldFloor,
  deleteNewFloor,
  deleteOldFloor
} from '../services/floorMaster.service';
import { GET_OLD_FLOOR_INFO, GET_NEW_FLOOR_INFO, SAVE_NEW_FLOOR_INFO } from '../../src/constants/constants';
jest.mock('axios');

describe('Floor Service - Success and Error Scenarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  // ---------- ✅ SUCCESS TESTS ----------

  test('fetchNewFloor - success', async () => {
    const mockData = [{ id: 1, name: 'Ground Floor' }];
    axios.get.mockResolvedValue({ data: mockData });

    const response = await fetchNewFloor();

    expect(response).toEqual(mockData);

    expect(axios.get).toHaveBeenCalledWith(GET_NEW_FLOOR_INFO);
  });

  test('createNewFloor - success', async () => {
    const floorData = { name: 'First Floor' };
    const mockRes = {
      data: { message: 'Floor added successfully' },
      status: 200
    };

    axios.post.mockResolvedValue(mockRes);

    const response = await createNewFloor(floorData);

    expect(response).toEqual({
      message: 'Floor added successfully',
      status: 200,
      res: mockRes
    });

    expect(axios.post).toHaveBeenCalledWith(SAVE_NEW_FLOOR_INFO, floorData);
  });

  test('fetchOldFloor - success', async () => {
    const mockData = [{ id: 1, name: 'Ground Floor' }];
    axios.get.mockResolvedValue({ data: mockData });

    const response = await fetchOldFloor();

    expect(response).toEqual(mockData);

    expect(axios.get).toHaveBeenCalledWith(GET_OLD_FLOOR_INFO);
  });

  test('createOldFloor - success', async () => {
    const floorData = { name: 'Old Basement' };
    const mockRes = {
      data: { message: 'Old floor added' },
      status: 201
    };
    axios.post.mockResolvedValueOnce(mockRes);

    const response = await createOldFloor(floorData);
    console.log('createOldFloor response:', response);

    expect(response).toEqual({ message: 'Old floor added', status: 201, res: mockRes });
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), { name: 'Old Basement' });

  });

  test('deleteNewFloor - success', async () => {
    const mockRes = {
      data: { message: 'Deleted successfully' },
      status: 200
    };
    axios.delete.mockResolvedValueOnce(mockRes);

    const response = await deleteNewFloor(5);
    console.log('deleteNewFloor response:', response);

    expect(response).toEqual({ message: 'Deleted successfully', status: 200 });
    expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining('?FMId=5'));
  });

  test('deleteOldFloor - success', async () => {
    const mockRes = {
      data: { message: 'Old floor deleted' },
      status: 200
    };
    axios.delete.mockResolvedValueOnce(mockRes);

    const response = await deleteOldFloor(9);
    console.log('deleteOldFloor response:', response);

    expect(response).toEqual({ message: 'Old floor deleted', status: 200 });
    expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining('?ID=9'));
  });

  // ---------- ❌ ERROR TESTS ----------

  test('fetchNewFloor - error', async () => {
    const mockError = new Error('Failed to fetch new floor');
    axios.get.mockRejectedValueOnce(mockError);

    await expect(fetchNewFloor()).rejects.toThrow('Failed to fetch new floor');
    expect(console.error).toHaveBeenCalledWith('Error fetching new floor:', mockError);
  });

  test('createNewFloor - error', async () => {
    const floorData = { name: 'Error Floor' };
    const mockError = new Error('Failed to add floor');
    axios.post.mockRejectedValueOnce(mockError);

    await expect(createNewFloor(floorData)).rejects.toThrow('Failed to add floor');
    expect(console.error).toHaveBeenCalledWith('Error in adding floor:', mockError);
  });

  test('fetchOldFloor - error', async () => {
    const mockError = new Error('Failed to fetch old floor');
    axios.get.mockRejectedValueOnce(mockError);

    await expect(fetchOldFloor()).rejects.toThrow('Failed to fetch old floor');
    expect(console.error).toHaveBeenCalledWith('Error fetching old Floor:', mockError);
  });

  test('createOldFloor - error', async () => {
    const floorData = { name: 'Broken Floor' };
    const mockError = new Error('Failed to add old floor');
    axios.post.mockRejectedValueOnce(mockError);

    await expect(createOldFloor(floorData)).rejects.toThrow('Failed to add old floor');
    expect(console.error).toHaveBeenCalledWith('Error in adding old floor:', mockError);
  });

  test('deleteNewFloor - error', async () => {
    const mockError = {
      response: { data: { message: 'Delete failed' }, status: 400 }
    };
    axios.delete.mockRejectedValueOnce(mockError);

    const result = await deleteNewFloor(77);
    console.log('deleteNewFloor error result:', result);

    expect(result).toEqual({ message: 'Delete failed', status: 400 });
    expect(console.error).toHaveBeenCalledWith('Error deleting new Floor info:', mockError);
  });

  test('deleteOldFloor - unknown error', async () => {
    const mockError = new Error('Network error');
    axios.delete.mockRejectedValueOnce(mockError);

    const result = await deleteOldFloor(33);
    console.log('deleteOldFloor error result:', result);

    expect(result).toEqual({ message: 'Unknown error occurred', status: 500 });
    expect(console.error).toHaveBeenCalledWith('Error deleting Old Floor info:', mockError);
  });
});
