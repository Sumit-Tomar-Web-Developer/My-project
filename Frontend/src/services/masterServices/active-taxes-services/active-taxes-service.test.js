import axios from 'axios';
import {
  getActiveMasterList,
  saveAndUpdateActiveTaxes,
  deleteActiveTaxes
} from '../active-taxes-services/active-taxes-service.js'; // Adjust the path as needed
import {
  DELETE_ACTIVE_TAXES,
  FETCH_ACTIVE_TAXES_LIST,
  SAVE_AND_UPDATE_ACTIVE_TAXES
} from '../../../constants/MasterConstants/active-taxesConstants/active-taxes-constants.js';

jest.mock('axios');

describe('Active Taxes Service Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getActiveMasterList', () => {
    it('should fetch the active master list successfully', async () => {
      const mockResponse = { data: [{ id: 1, name: 'Tax A' }, { id: 2, name: 'Tax B' }] };
      
      axios.get.mockResolvedValue(mockResponse);

      const result = await getActiveMasterList();

      expect(axios.get).toHaveBeenCalledWith(FETCH_ACTIVE_TAXES_LIST);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when the API call fails', async () => {
      const mockError = new Error('Network Error');
      
      axios.get.mockRejectedValue(mockError);

      await expect(getActiveMasterList()).rejects.toThrow('Network Error');
      expect(axios.get).toHaveBeenCalledWith(FETCH_ACTIVE_TAXES_LIST);
    });
  });

  describe('saveAndUpdateActiveTaxes', () => {
    it('should save and update taxes successfully', async () => {
      const taxData = { id: 1, name: 'Tax A', rate: 10 };
      const mockResponse = { data: { message: 'Tax saved successfully' }, status: 200 };
      
      axios.post.mockResolvedValue(mockResponse);

      const result = await saveAndUpdateActiveTaxes(taxData);

      expect(axios.post).toHaveBeenCalledWith(SAVE_AND_UPDATE_ACTIVE_TAXES, taxData);
      expect(result).toEqual({ message: 'Tax saved successfully', status: 200, res: mockResponse });
    });

    it('should throw an error when the API call fails', async () => {
      const taxData = { id: 1, name: 'Tax A', rate: 10 };
      const mockError = new Error('Network Error');
      
      axios.post.mockRejectedValue(mockError);

      await expect(saveAndUpdateActiveTaxes(taxData)).rejects.toThrow('Network Error');
      expect(axios.post).toHaveBeenCalledWith(SAVE_AND_UPDATE_ACTIVE_TAXES, taxData);
    });
  });

  describe('deleteActiveTaxes', () => {
    it('should delete taxes successfully', async () => {
      const IDs = [1, 2];
      const mockResponse = { data: { message: 'Taxes deleted successfully' }, status: 200 };
      
      axios.delete.mockResolvedValue(mockResponse);

      const result = await deleteActiveTaxes(IDs);

      expect(axios.delete).toHaveBeenCalledWith(DELETE_ACTIVE_TAXES, { data: { IDs } });
      expect(result).toEqual({ message: 'Taxes deleted successfully', status: 200, res: mockResponse });
    });

    it('should throw an error when the API call fails', async () => {
      const IDs = [1, 2];
      const mockError = new Error('Network Error');
      
      axios.delete.mockRejectedValue(mockError);

      await expect(deleteActiveTaxes(IDs)).rejects.toThrow('Failed to delete  active taxonomy: Network Error');

      expect(axios.delete).toHaveBeenCalledWith(DELETE_ACTIVE_TAXES, { data: { IDs } });
    });
  });
});
