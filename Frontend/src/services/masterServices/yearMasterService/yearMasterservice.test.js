import axios from 'axios';
import {
  saveAndUpdateYearMaster,
  getYearMaster,
  deleteYearMaster
} from '../yearMasterService/yearMaster.service'; // Adjust the import path as needed
import {
  DELETE_YEAR_MASTER_BY_ID,
  GET_YEAR_MASTER_LIST,
  SAVE_AND_UPDATE_YEAR_MASTER
} from '../../../constants/MasterConstants/yearMasterConstants/yearMaster.constants.js';

jest.mock('axios'); // Mock axios

describe('Year Master Services', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  describe('saveAndUpdateYearMaster', () => {
    it('should save or update year master successfully', async () => {
      const mockYearInfo = { id: 1, year: 2024 };
      const mockResponse = { data: { message: 'Year saved successfully' }, status: 200 };
      axios.post.mockResolvedValue(mockResponse);

      const result = await saveAndUpdateYearMaster(mockYearInfo);

      expect(axios.post).toHaveBeenCalledWith(SAVE_AND_UPDATE_YEAR_MASTER, mockYearInfo);
      expect(result).toEqual({ message: 'Year saved successfully', status: 200, res: mockResponse });
    });

    it('should throw an error if saving/updating fails', async () => {
      const mockYearInfo = { id: 1, year: 2024 };
      axios.post.mockRejectedValue(new Error('Save failed'));

      await expect(saveAndUpdateYearMaster(mockYearInfo)).rejects.toThrow('Save failed');
      expect(axios.post).toHaveBeenCalledWith(SAVE_AND_UPDATE_YEAR_MASTER, mockYearInfo);
    });
  });

  describe('getYearMaster', () => {
    it('should fetch year master list successfully', async () => {
      const mockData = [{ id: 1, year: 2024 }, { id: 2, year: 2025 }];
      axios.get.mockResolvedValue({ data: mockData });

      const result = await getYearMaster();

      expect(axios.get).toHaveBeenCalledWith(GET_YEAR_MASTER_LIST);
      expect(result).toEqual(mockData);
    });

    it('should throw an error if fetching fails', async () => {
      axios.get.mockRejectedValue(new Error('Fetch failed'));

      await expect(getYearMaster()).rejects.toThrow('Fetch failed');
      expect(axios.get).toHaveBeenCalledWith(GET_YEAR_MASTER_LIST);
    });
  });

  describe('deleteYearMaster', () => {
    it('should delete year master successfully', async () => {
      const mockIDs = [1, 2];
      const mockResponse = { data: { message: 'Years deleted successfully', status: 200 } };
      axios.delete.mockResolvedValue(mockResponse);

      const result = await deleteYearMaster(mockIDs);

      expect(axios.delete).toHaveBeenCalledWith(DELETE_YEAR_MASTER_BY_ID, { data: { FinanceYears: mockIDs } });
      expect(result).toEqual({ message: 'Years deleted successfully', status: 200, res: mockResponse });
    });

    it('should throw an error if deleting fails', async () => {
      const mockIDs = [1, 2];
      axios.delete.mockRejectedValue(new Error('Delete failed'));

      await expect(deleteYearMaster(mockIDs)).rejects.toThrow('Delete failed');
      expect(axios.delete).toHaveBeenCalledWith(DELETE_YEAR_MASTER_BY_ID, { data: { FinanceYears: mockIDs } });
    });
  });
});
