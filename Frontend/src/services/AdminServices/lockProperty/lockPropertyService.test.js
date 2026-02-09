import axios from 'axios';
import {
  getLockedUnlockedProperties,
  saveLockedProperties,
  saveUnLockedProperties
} from '../lockProperty/lockPropertyService';

// Mock axios
jest.mock('axios');

describe('Lock Property API Tests', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  describe('getLockedUnlockedProperties', () => {
    test('should return property data on success', async () => {
      const mockResponse = { data: { properties: ['Property1', 'Property2'] } };
      axios.post.mockResolvedValueOnce(mockResponse);

      const response = await getLockedUnlockedProperties(1, 100, 200);

      expect(response).toEqual(mockResponse.data);
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        wardNo: 1,
        fromPropertyNo: 100,
        toPropertyNo: 200
      });
    });

    test('should throw an error when API fails', async () => {
      const mockError = { response: { data: { message: 'Failed to fetch properties' } } };
      axios.post.mockRejectedValueOnce(mockError);

      await expect(getLockedUnlockedProperties(1, 100, 200)).rejects.toEqual(mockError);
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        wardNo: 1,
        fromPropertyNo: 100,
        toPropertyNo: 200
      });
    });
  });

  describe('saveLockedProperties', () => {
    test('should return success response when properties are locked', async () => {
      const mockResponse = { data: { message: 'Properties locked successfully' }, status: 200 };
      axios.post.mockResolvedValueOnce(mockResponse);

      const requestData = {
        selectedWard: 1,
        selectedPropertyNoFrom: 100,
        selectedPropertyNoTo: 200,
        unLockedOwnerIds: [101, 102]
      };

      const response = await saveLockedProperties(requestData);

      expect(response).toEqual({
        data: mockResponse.data,
        status: 200,
        message: 'Properties locked successfully'
      });

      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        wardNo: 1,
        fromPropertyNo: 100,
        toPropertyNo: 200,
        ownerIds: [101, 102]
      });
    });

    test('should throw an error when input is invalid', async () => {
      const invalidRequestData = {
        selectedWard: 1,
        selectedPropertyNoFrom: 100,
        selectedPropertyNoTo: 200,
        unLockedOwnerIds: []
      };

      await expect(saveLockedProperties(invalidRequestData)).rejects.toThrow(
        'Invalid input: selectedWard, selectedPropertyNoFrom, selectedPropertyNoTo, and unLockedOwnerIds are required.'
      );
    });

    test('should throw an error when API fails', async () => {
      const mockError = { response: { data: { message: 'Failed to lock properties' } } };
      axios.post.mockRejectedValueOnce(mockError);

      const requestData = {
        selectedWard: 1,
        selectedPropertyNoFrom: 100,
        selectedPropertyNoTo: 200,
        unLockedOwnerIds: [101, 102]
      };

      await expect(saveLockedProperties(requestData)).rejects.toEqual(mockError);
    });
  });

  describe('saveUnLockedProperties', () => {
    test('should return success response when properties are unlocked', async () => {
      const mockResponse = { data: { message: 'Properties unlocked successfully' }, status: 200 };
      axios.post.mockResolvedValueOnce(mockResponse);

      const requestData = {
        selectedWard: 1,
        selectedPropertyNoFrom: 100,
        selectedPropertyNoTo: 200,
        lockedOwnerIds: [101, 102]
      };

      const response = await saveUnLockedProperties(requestData);

      expect(response).toEqual({
        data: mockResponse.data,
        status: 200,
        message: 'Properties unlocked successfully'
      });

      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        wardNo: 1,
        fromPropertyNo: 100,
        toPropertyNo: 200,
        ownerIds: [101, 102]
      });
    });

    test('should throw an error when input is invalid', async () => {
      const invalidRequestData = {
        selectedWard: 1,
        selectedPropertyNoFrom: 100,
        selectedPropertyNoTo: 200,
        lockedOwnerIds: []
      };

      await expect(saveUnLockedProperties(invalidRequestData)).rejects.toThrow(
        'Invalid input: wardNo, fromPropertyNo, toPropertyNo, and ownerIds are required.'
      );
    });

    test('should throw an error when API fails', async () => {
      const mockError = { response: { data: { message: 'Failed to unlock properties' } } };
      axios.post.mockRejectedValueOnce(mockError);

      const requestData = {
        selectedWard: 1,
        selectedPropertyNoFrom: 100,
        selectedPropertyNoTo: 200,
        lockedOwnerIds: [101, 102]
      };

      await expect(saveUnLockedProperties(requestData)).rejects.toEqual(mockError);
    });
  });
});
