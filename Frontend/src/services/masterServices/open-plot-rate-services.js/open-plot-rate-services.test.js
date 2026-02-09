import axios from 'axios';
import {
  DELETE_OPEN_PLOT_RATE,
  GET_OPEN_PLOT_RATE_LIST,
  SAVE_AND_UPDATE_OPEN_PLOT_RATE
} from '../../../constants/MasterConstants/open-plot-rateConstants/open-plot-rate';
import {
  saveAndUpdateOpenPlotRate,
  getOpenPlotRateList,
  deleteOpenPlotRate
} from '../open-plot-rate-services.js/open-plot-rate-services';

jest.mock('axios');

describe('Open Plot Rate Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveAndUpdateOpenPlotRate', () => {
    it('should save or update open plot rate successfully', async () => {
      const mockData = { rate: 100, zone: 'A' };
      const mockResponse = { message: 'Success', status: 200 };

      axios.post.mockResolvedValue({ data: mockResponse, status: 200 });

      const result = await saveAndUpdateOpenPlotRate(mockData);

      expect(axios.post).toHaveBeenCalledWith(SAVE_AND_UPDATE_OPEN_PLOT_RATE, mockData);
      expect(result).toEqual({ message: 'Success', status: 200, res: { data: mockResponse, status: 200 } });
    });

    it('should throw an error if saving or updating fails', async () => {
      const mockData = { rate: 100, zone: 'A' };
      axios.post.mockRejectedValue(new Error('Network Error'));

      await expect(saveAndUpdateOpenPlotRate(mockData)).rejects.toThrow('Error saving and updating open plot rate: Network Error');
    });
  });

  describe('getOpenPlotRateList', () => {
    it('should fetch the open plot rate list successfully', async () => {
      const mockResponse = [{ id: 1, rate: 100, zone: 'A' }];

      axios.get.mockResolvedValue({ data: mockResponse });

      const result = await getOpenPlotRateList();

      expect(axios.get).toHaveBeenCalledWith(GET_OPEN_PLOT_RATE_LIST);
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if fetching the list fails', async () => {
      axios.get.mockRejectedValue(new Error('Network Error'));

      await expect(getOpenPlotRateList()).rejects.toThrow('Error getting open plot rate list: Network Error');
    });
  });

  describe('deleteOpenPlotRate', () => {
    it('should delete open plot rates successfully', async () => {
      const mockIDs = [1, 2, 3];
      const mockResponse = { message: 'Deleted successfully', status: 200 };

      axios.delete.mockResolvedValue({ data: mockResponse });

      const result = await deleteOpenPlotRate(mockIDs);

      expect(axios.delete).toHaveBeenCalledWith(DELETE_OPEN_PLOT_RATE, { data: { IDs: mockIDs } });
      expect(result).toEqual({ message: 'Deleted successfully', status: 200, res: { data: mockResponse } });
    });

    it('should throw an error if deleting fails', async () => {
        const mockIDs = [1, 2, 3];
        axios.delete.mockRejectedValue(new Error('Network Error'));
      
        await expect(deleteOpenPlotRate(mockIDs)).rejects.toThrow('Network Error');
      });     
  });
});
