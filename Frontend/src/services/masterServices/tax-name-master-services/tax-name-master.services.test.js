import axios from 'axios';
import {
  getTaxList,
  postUpdateTaxList,
  deleteTaxList
} from '../tax-name-master-services/tax-name-master.services';
import {
  TAX_NAME_MASTER_LIST,
  ADD_UPDATE_TAX_NAME_LIST,
  DELETE_TAX_NAME_MASTER
} from '../../../constants/MasterConstants/tax-name-master-constants/tax-name-master.constants';

jest.mock('axios');

describe('Tax Name Master Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTaxList', () => {
    it('should fetch the tax name master list successfully', async () => {
      const mockResponse = { data: [{ id: 1, name: 'Tax A' }, { id: 2, name: 'Tax B' }] };

      axios.get.mockResolvedValue(mockResponse);

      const result = await getTaxList();

      expect(axios.get).toHaveBeenCalledWith(TAX_NAME_MASTER_LIST);
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if fetching fails', async () => {
      axios.get.mockRejectedValue(new Error('Network Error'));

      await expect(getTaxList()).rejects.toThrow('Network Error');
    });
  });

  describe('postUpdateTaxList', () => {
    it('should post or update the tax name list successfully', async () => {
      const taxNamedata = { id: 1, name: 'Tax A Updated' };
      const mockResponse = { data: { message: 'Success' }, status: 200 };

      axios.patch.mockResolvedValue(mockResponse);

      const result = await postUpdateTaxList(taxNamedata);

      expect(axios.patch).toHaveBeenCalledWith(ADD_UPDATE_TAX_NAME_LIST, [taxNamedata]);
      expect(result).toEqual({ message: 'Success', status: 200 });
    });

    it('should throw an error if posting fails', async () => {
      const taxNamedata = { id: 1, name: 'Tax A Updated' };

      axios.patch.mockRejectedValue(new Error('Network Error'));

      await expect(postUpdateTaxList(taxNamedata)).rejects.toThrow('Network Error');
    });
  });

  describe('deleteTaxList', () => {
    it('should delete a tax name list successfully', async () => {
      const taxID = { id: 1 };
      const mockResponse = { data: { message: 'Deleted successfully' }, status: 200 };

      axios.delete.mockResolvedValue(mockResponse);

      const result = await deleteTaxList(taxID);

      expect(axios.delete).toHaveBeenCalledWith(DELETE_TAX_NAME_MASTER, { data: taxID });
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if deletion fails', async () => {
      const taxID = { id: 1 };

      axios.delete.mockRejectedValue(new Error('Network Error'));

      await expect(deleteTaxList(taxID)).rejects.toThrow('Network Error');
    });
  });
});
