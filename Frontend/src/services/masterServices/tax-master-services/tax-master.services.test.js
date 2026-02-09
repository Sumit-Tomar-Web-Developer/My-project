import axios from 'axios';
import {
  fetchTaxMasterList,
  postUpdateTaxMasterList,
  deleteTaxMasterList,
} from '../tax-master-services/tax-master.services';
import {
  ADD_UPDATE_TAX_MASTER_LIST,
  DELETE_TAX_MASTER_LIST,
  TAX_MASTER_LIST,
} from '../../../constants/MasterConstants/tax-master-constants/tax-master.constants';

jest.mock('axios');

describe('Tax Master Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchTaxMasterList', () => {
    it('should fetch the tax master list successfully', async () => {
      const mockData = { page: 1, size: 10 };
      const mockResponse = { data: [{ id: 1, taxName: 'GST' }, { id: 2, taxName: 'VAT' }] };

      axios.get.mockResolvedValue(mockResponse);

      const result = await fetchTaxMasterList(mockData);

      expect(axios.get).toHaveBeenCalledWith(TAX_MASTER_LIST, { params: mockData });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if fetching fails', async () => {
      const mockData = { page: 1, size: 10 };
      axios.get.mockRejectedValue(new Error('Network Error'));

      await expect(fetchTaxMasterList(mockData)).rejects.toThrow('Network Error');
    });
  });

  describe('postUpdateTaxMasterList', () => {
    it('should post or update the tax master list successfully', async () => {
      const taxMasterData = { id: 1, taxName: 'GST', rate: 18 };
      const mockResponse = { data: { message: 'Success' }, status: 200 };

      axios.post.mockResolvedValue(mockResponse);

      const result = await postUpdateTaxMasterList(taxMasterData);

      expect(axios.post).toHaveBeenCalledWith(ADD_UPDATE_TAX_MASTER_LIST, taxMasterData);
      expect(result).toEqual({ message: 'Success', status: 200 });
    });

    it('should throw an error if updating fails', async () => {
      const taxMasterData = { id: 1, taxName: 'GST', rate: 18 };
      axios.post.mockRejectedValue(new Error('Network Error'));

      await expect(postUpdateTaxMasterList(taxMasterData)).rejects.toThrow('Network Error');
    });
  });

  describe('deleteTaxMasterList', () => {
    it('should delete the tax master list successfully', async () => {
      const taxMasterId = { id: 1 };
      const mockResponse = { data: { message: 'Deleted successfully' }, status: 200 };

      axios.delete.mockResolvedValue(mockResponse);

      const result = await deleteTaxMasterList(taxMasterId);

      expect(axios.delete).toHaveBeenCalledWith(DELETE_TAX_MASTER_LIST, { data: taxMasterId });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if deletion fails', async () => {
      const taxMasterId = { id: 1 };
      axios.delete.mockRejectedValue(new Error('Network Error'));

      await expect(deleteTaxMasterList(taxMasterId)).rejects.toThrow('Network Error');
    });
  });
});
