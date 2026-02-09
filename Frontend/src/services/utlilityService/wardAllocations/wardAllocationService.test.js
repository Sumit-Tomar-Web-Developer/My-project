import axios from 'axios';
import {
  getUserInfoById,
  getUserNames,
  getUsersWithAllocatedWards,
  saveAllocatedWards
} from '../wardAllocations/wardAllocationService';

// Mock axios
jest.mock('axios');

describe('Ward Allocation API Tests', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  test('getUserInfoById should return user info on success', async () => {
    const mockData = { id: 1, name: 'John Doe' };
    axios.get.mockResolvedValueOnce({ data: mockData });

    const response = await getUserInfoById(1);
    expect(response).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/1'));
  });

  test('getUserNames should return a list of user names', async () => {
    const mockData = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
    axios.get.mockResolvedValueOnce({ data: mockData });

    const response = await getUserNames();
    expect(response).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith(expect.any(String));
  });

  test('getUsersWithAllocatedWards should return allocated users', async () => {
    const mockData = [{ id: 1, name: 'John', ward: 'Ward 1' }];
    axios.get.mockResolvedValueOnce({ data: mockData });

    const response = await getUsersWithAllocatedWards();
    expect(response).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith(expect.any(String));
  });

  test('saveAllocatedWards should return success response', async () => {
    const mockRequest = { userId: 1, wards: ['Ward 1', 'Ward 2'] };
    const mockResponse = { message: 'Wards allocated successfully', status: 200 };

    axios.post.mockResolvedValueOnce({ data: mockResponse });

    const response = await saveAllocatedWards(mockRequest);
    expect(response).toEqual(mockResponse);
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), mockRequest);
  });

  test('getUserInfoById should throw error on failure', async () => {
    const mockError = { response: { data: { message: 'User not found' } } };
    axios.get.mockRejectedValueOnce(mockError);

    await expect(getUserInfoById(999)).rejects.toEqual({ message: 'User not found' });
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/999'));
  });

  test('saveAllocatedWards should throw error on failure', async () => {
    const mockRequest = { userId: 1, wards: ['Ward 1', 'Ward 2'] };
    const mockError = { response: { data: { message: 'Failed to allocate wards' } } };
    axios.post.mockRejectedValueOnce(mockError);

    await expect(saveAllocatedWards(mockRequest)).rejects.toEqual({ message: 'Failed to allocate wards' });
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), mockRequest);
  });
});

test('getUserNames should throw an error when API fails', async () => {
  const mockError = { response: { data: { message: 'Failed to fetch user names' } } };
  axios.get.mockRejectedValueOnce(mockError);

  await expect(getUserNames()).rejects.toEqual({ message: 'Failed to fetch user names' });
  expect(axios.get).toHaveBeenCalledWith(expect.any(String));
});

test('getUsersWithAllocatedWards should throw an error when API fails', async () => {
  const mockError = { response: { data: { message: 'Failed to fetch allocated users' } } };
  axios.get.mockRejectedValueOnce(mockError);

  await expect(getUsersWithAllocatedWards()).rejects.toEqual({ message: 'Failed to fetch allocated users' });
  expect(axios.get).toHaveBeenCalledWith(expect.any(String));
});