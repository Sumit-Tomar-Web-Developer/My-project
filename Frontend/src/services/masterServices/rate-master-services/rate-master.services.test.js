import axios from 'axios';
import {
  fetchRateMasterList,
  postUpdateRateMasterList,
  deleteRateMasterList
} from '../rate-master-services/rate-master.services';

jest.mock('axios');

describe('Rate Master API Tests', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  /** Test: fetchRateMasterList */
  test('fetchRateMasterList should return rate master list on success', async () => {
    const mockResponse = { data: { rateList: [{ id: 1, year: 2024, zone: 'A' }] } };
    axios.get.mockResolvedValueOnce(mockResponse);

    const yearZoneList = { year: 2024, zone: 'A' };
    const response = await fetchRateMasterList(yearZoneList);

    expect(response).toEqual(mockResponse);
    expect(axios.get).toHaveBeenCalledWith(expect.any(String), { params: yearZoneList });
  });

  test('fetchRateMasterList should throw an error when API fails', async () => {
    const mockError = new Error('Failed to fetch rate master list');
    axios.get.mockRejectedValueOnce(mockError);

    const yearZoneList = { year: 2024, zone: 'A' };
    await expect(fetchRateMasterList(yearZoneList)).rejects.toEqual(mockError);
    expect(axios.get).toHaveBeenCalledWith(expect.any(String), { params: yearZoneList });
  });

  /** Test: postUpdateRateMasterList */
  test('postUpdateRateMasterList should return success message and status on success', async () => {
    const mockResponse = { data: { message: 'Rate Master Updated Successfully' }, status: 200 };
    axios.post.mockResolvedValueOnce(mockResponse);

    const rateMasterData = { year: 2024, rate: 10.5 };
    const response = await postUpdateRateMasterList(rateMasterData);

    expect(response).toEqual({ message: 'Rate Master Updated Successfully', status: 200 });
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), rateMasterData);
  });

  test('postUpdateRateMasterList should throw an error when API fails', async () => {
    const mockError = new Error('Failed to update rate master list');
    axios.post.mockRejectedValueOnce(mockError);

    const rateMasterData = { year: 2024, rate: 10.5 };
    await expect(postUpdateRateMasterList(rateMasterData)).rejects.toEqual(mockError);
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), rateMasterData);
  });

  /** Test: deleteRateMasterList */
  test('deleteRateMasterList should return success message and status on success', async () => {
    const mockResponse = { message: 'Rate Master Deleted Successfully', status: 200 };
    axios.delete.mockResolvedValueOnce(mockResponse);

    const year = { year: 2024 };
    const response = await deleteRateMasterList(year);

    expect(response).toEqual(mockResponse);
    expect(axios.delete).toHaveBeenCalledWith(expect.any(String), { data: year });
  });

  test('deleteRateMasterList should throw an error when API fails', async () => {
    const mockError = new Error('Failed to delete rate master list');
    axios.delete.mockRejectedValueOnce(mockError);

    const year = { year: 2024 };
    await expect(deleteRateMasterList(year)).rejects.toEqual(mockError);
    expect(axios.delete).toHaveBeenCalledWith(expect.any(String), { data: year });
  });
});
