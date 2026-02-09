import axios from 'axios';
import {
  saveAndUpdateActiveYear,
  getActiveYear,
  deleteActiveYear
} from '../active-yearServices/active-year.services'; // Adjust the path as needed
import {
  DELETE_ACTIVE_YEAR,
  GET_ACTIVE_YEAR,
  SAVE_AND_UPDATE_ACTIVE_YEAR
} from '../../../constants/MasterConstants/active-yearConstants/active-year.constants';

jest.mock('axios');

describe('Active Year Service Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveAndUpdateActiveYear', () => {
    it('should save and update the active year successfully', async () => {
      const activeYearData = { year: 2024, description: 'Active Year 2024' };
      const mockResponse = { data: { message: 'Active year saved successfully' }, status: 200 };
      
      axios.post.mockResolvedValue(mockResponse);

      const result = await saveAndUpdateActiveYear(activeYearData);

      expect(axios.post).toHaveBeenCalledWith(SAVE_AND_UPDATE_ACTIVE_YEAR, activeYearData);
      expect(result).toEqual({ message: 'Active year saved successfully', status: 200, res: mockResponse });
    });

    it('should throw an error when the API call fails', async () => {
      const activeYearData = { year: 2024, description: 'Active Year 2024' };
      const mockError = new Error('Network Error');
      
      axios.post.mockRejectedValue(mockError);

      await expect(saveAndUpdateActiveYear(activeYearData)).rejects.toThrow('Network Error');
      expect(axios.post).toHaveBeenCalledWith(SAVE_AND_UPDATE_ACTIVE_YEAR, activeYearData);
    });
  });

  describe('getActiveYear', () => {
    it('should fetch the active year successfully', async () => {
      const mockResponse = { data: { year: 2024, description: 'Active Year 2024' } };
      
      axios.get.mockResolvedValue(mockResponse);

      const result = await getActiveYear();

      expect(axios.get).toHaveBeenCalledWith(GET_ACTIVE_YEAR);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when the API call fails', async () => {
      const mockError = new Error('Network Error');
      
      axios.get.mockRejectedValue(mockError);

      await expect(getActiveYear()).rejects.toThrow('Network Error');
      expect(axios.get).toHaveBeenCalledWith(GET_ACTIVE_YEAR);
    });
  });

  describe('deleteActiveYear', () => {
    it('should delete the active year successfully', async () => {
      const IDs = [1, 2];
      const mockResponse = { data: { message: 'Active years deleted successfully', status: 200 } };
      
      axios.delete.mockResolvedValue(mockResponse);

      const result = await deleteActiveYear(IDs);

      expect(axios.delete).toHaveBeenCalledWith(DELETE_ACTIVE_YEAR, { data: { IDs } });
      expect(result).toEqual({ message: 'Active years deleted successfully', status: 200, res: mockResponse });
    });

    it('should throw an error when the API call fails', async () => {
      const IDs = [1, 2];
      const mockError = new Error('Network Error');
      
      axios.delete.mockRejectedValue(mockError);

      await expect(deleteActiveYear(IDs)).rejects.toThrow('Network Error');
      expect(axios.delete).toHaveBeenCalledWith(DELETE_ACTIVE_YEAR, { data: { IDs } });
    });
  });
});
