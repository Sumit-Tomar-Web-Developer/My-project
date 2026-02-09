import axios from 'axios';
import { fetchSearchedProperties, savePenaltyByOwnerId } from '../penaltyOwnerIdWise/penalltyOwnerIdWiseServices'; 


jest.mock('axios');

describe('Penalty Owner ID Wise API Tests', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  describe('fetchSearchedProperties', () => {
    test('should return searched properties on success', async () => {
      const mockResponse = { data: { properties: [{ id: 1, name: 'Property 1' }] } };
      axios.post.mockResolvedValueOnce(mockResponse);

      const wardNo = 5, from = 101, to = 200;
      const response = await fetchSearchedProperties(wardNo, from, to);

      expect(response).toEqual(mockResponse.data);
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        wardNo,
        fromPropertyNo: from,
        toPropertyNo: to
      });
    });

    test('should throw an error when API fails', async () => {
      const mockError = new Error('Failed to fetch properties');
      axios.post.mockRejectedValueOnce(mockError);

      const wardNo = 5, from = 101, to = 200;

      await expect(fetchSearchedProperties(wardNo, from, to)).rejects.toEqual(mockError);
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        wardNo,
        fromPropertyNo: from,
        toPropertyNo: to
      });
    });
  });

  describe('savePenaltyByOwnerId', () => {
    test('should return success response when penalty is applied', async () => {
      const mockResponse = { data: { message: 'Penalty applied successfully' }, status: 200 };
      axios.post.mockResolvedValueOnce(mockResponse);

      const penaltyData = { ownerId: 1, penaltyAmount: 500 };
      const response = await savePenaltyByOwnerId(penaltyData);

      expect(response).toEqual({
        data: mockResponse.data,
        status: 200,
        message: undefined 
      });

      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        dataToUpdate: penaltyData
      });
    });

    test('should throw an error when API fails', async () => {
      const mockError = new Error('Failed to apply penalty');
      axios.post.mockRejectedValueOnce(mockError);

      const penaltyData = { ownerId: 2, penaltyAmount: 300 };

      await expect(savePenaltyByOwnerId(penaltyData)).rejects.toThrow('Failed to post the updated tax list');
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        dataToUpdate: penaltyData
      });
    });
  });
});
