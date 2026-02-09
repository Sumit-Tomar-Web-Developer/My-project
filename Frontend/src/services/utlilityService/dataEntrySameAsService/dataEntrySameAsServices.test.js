import axios from 'axios';
import { fetchPropertyRangeByWard, saveDataEntryDetails } from '../dataEntrySameAsService/dataEntrySameAsServices'; 
jest.mock('axios');

describe('Data Entry API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test('fetchPropertyRangeByWard should return property details', async () => {
    const wardNo = '123';
    const mockResponse = { data: { message: 'Success', data: [{ propertyId: 1, name: 'Test Property' }] } };

    axios.post.mockResolvedValueOnce(mockResponse);

    const result = await fetchPropertyRangeByWard(wardNo);
    expect(result).toEqual(mockResponse.data);
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), { wardNo });
  });

  test('fetchPropertyRangeByWard should throw an error on failure', async () => {
    const wardNo = '123';
    axios.post.mockRejectedValueOnce(new Error('Network Error'));

    await expect(fetchPropertyRangeByWard(wardNo)).rejects.toThrow('Network Error');
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), { wardNo });
  });

  test('saveDataEntryDetails should return success message', async () => {
    const ownerIds = [1, 2, 3];
    const propertyMastData = { key: 'value' };
  
    const mockResponse = {
      data: { message: 'Data copied successfully', status: 200 },
      status: 200, // Explicitly include status here
    };
  
    axios.post.mockResolvedValueOnce(mockResponse);
  
    const result = await saveDataEntryDetails(ownerIds, propertyMastData);
  
    expect(result).toEqual({
      message: 'Data copied successfully',
      status: 200,
      response: mockResponse, // Ensure this matches what is returned by the function
    });
  
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), { data: { ownerIds, propertyMastData } });
  });

  test('saveDataEntryDetails should throw an error on failure', async () => {
    const ownerIds = [1, 2, 3];
    const propertyMastData = { key: 'value' };
    axios.post.mockRejectedValueOnce(new Error('Request failed'));

    await expect(saveDataEntryDetails(ownerIds, propertyMastData)).rejects.toThrow('Request failed');
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), { data: { ownerIds, propertyMastData } });
  });
});
