import axios from 'axios';
import { getCouncilList, saveAndUpdateCouncilDetails } from '../council-details/council-details-service'; 
import {
  FETCH_COUNCIL_LIST,
  SAVE_AND_UPDATE_COUNCIL_DETAILS
} from '../council-details/council-details-service';

jest.mock('axios');

describe('Council Service Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCouncilList', () => {
    it('should fetch the council list successfully', async () => {
      const mockResponse = {
        data: [
          { id: 1, name: 'Council A' },
          { id: 2, name: 'Council B' }
        ]
      };

      axios.get.mockResolvedValue(mockResponse);

      const result = await getCouncilList();

      expect(axios.get).toHaveBeenCalledWith(FETCH_COUNCIL_LIST);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when fetching the council list fails', async () => {
      const mockError = new Error('Network Error');

      axios.get.mockRejectedValue(mockError);

      await expect(getCouncilList()).rejects.toThrow('Network Error');
      expect(axios.get).toHaveBeenCalledWith(FETCH_COUNCIL_LIST);
    });
  });

  describe('saveAndUpdateCouncilDetails', () => {
    it('should save and update council details successfully', async () => {
      const mockCouncilData = { id: 1, name: 'Council A' };
      const mockResponse = {
        data: { message: 'Council details updated successfully' },
        status: 200
      };

      axios.post.mockResolvedValue(mockResponse);

      const result = await saveAndUpdateCouncilDetails(mockCouncilData);

      expect(axios.post).toHaveBeenCalledWith(SAVE_AND_UPDATE_COUNCIL_DETAILS, mockCouncilData);
      expect(result).toEqual({
        message: 'Council details updated successfully',
        status: 200,
        res: mockResponse
      });
    });

    it('should throw an error when saving or updating council details fails', async () => {
      const mockCouncilData = { id: 1, name: 'Council A' };
      const mockError = new Error('Network Error');

      axios.post.mockRejectedValue(mockError);

      await expect(saveAndUpdateCouncilDetails(mockCouncilData)).rejects.toThrow('Network Error');
      expect(axios.post).toHaveBeenCalledWith(SAVE_AND_UPDATE_COUNCIL_DETAILS, mockCouncilData);
    });
  });
});
