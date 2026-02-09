import axios from 'axios';
import { getFactorInfo, saveFactorInfo } from '../setPoliciesService/setPoliciesService'; 

jest.mock('axios');

describe('Factor Info API Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getFactorInfo should return factor info data', async () => {
    const mockResponse = { data: { factor1: 10, factor2: 20 } };

    axios.get.mockResolvedValueOnce(mockResponse);

    const result = await getFactorInfo();

    expect(result).toEqual(mockResponse.data);
    expect(axios.get).toHaveBeenCalledWith(expect.any(String)); // Ensures axios.get is called
  });

  test('saveFactorInfo should return success message', async () => {
    const factorData = {
      FacterID: 1,
      FromFactor: 2,
      ToFactor: 3,
      FactorValue: 4
    };

    const mockResponse = {
      data: { message: 'Factor saved successfully' },
      status: 200, // Ensure status is included
      message: 'Factor saved successfully'
    };

    axios.post.mockResolvedValueOnce(mockResponse);

    const result = await saveFactorInfo(factorData);

    expect(result).toEqual({
      message: 'Factor saved successfully',
      status: 200,
      responseData: mockResponse.data
    });

    expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
      FacterID: factorData.FacterID,
      FromFactor: factorData.FromFactor,
      ToFactor: factorData.ToFactor,
      FactorValue: factorData.FactorValue
    });
  });

  test('getFactorInfo should throw an error on failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    await expect(getFactorInfo()).rejects.toThrow('Network Error');

    expect(axios.get).toHaveBeenCalledWith(expect.any(String));
  });

  test('saveFactorInfo should throw an error on failure', async () => {
    axios.post.mockRejectedValueOnce(new Error('Failed to save'));

    const factorData = {
      FacterID: 1,
      FromFactor: 2,
      ToFactor: 3,
      FactorValue: 4
    };

    await expect(saveFactorInfo(factorData)).rejects.toThrow('Failed to save');

    expect(axios.post).toHaveBeenCalledWith(expect.any(String), factorData);
  });
});
