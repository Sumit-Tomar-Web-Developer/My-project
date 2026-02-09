import axios from 'axios';
import {
  saveOrUpdateBankInfo,
  getBankInfo,
  deleteBankInfo
} from '../bank-masterServices/bank-master.services';
import {
  DELETE_BANK_MASTER,
  GET_BANK_MASTER,
  SAVE_AND_UPDATE_BANK_MASTER
} from '../../../constants/MasterConstants/bankMasterConstants/bank-master.constants';

jest.mock('axios');

describe('Bank Master Service Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveOrUpdateBankInfo', () => {
    it('should save or update bank information successfully', async () => {
      const mockBankData = { name: 'Bank A', code: '001' };
      const mockResponse = { data: { message: 'Bank saved successfully', status: 200 } };
      
      axios.post.mockResolvedValue(mockResponse);

      const result = await saveOrUpdateBankInfo(mockBankData);

      expect(axios.post).toHaveBeenCalledWith(SAVE_AND_UPDATE_BANK_MASTER, mockBankData);
      expect(result).toEqual({ message: 'Bank saved successfully', status: 200, res: mockResponse });
    });

    it('should throw an error when the API call fails', async () => {
      const mockBankData = { name: 'Bank A', code: '001' };
      const mockError = new Error('Network Error');
      
      axios.post.mockRejectedValue(mockError);

      await expect(saveOrUpdateBankInfo(mockBankData)).rejects.toThrow('Network Error');
      expect(axios.post).toHaveBeenCalledWith(SAVE_AND_UPDATE_BANK_MASTER, mockBankData);
    });
  });

  describe('getBankInfo', () => {
    it('should fetch bank information successfully', async () => {
      const mockResponse = { data: [{ id: 1, name: 'Bank A' }, { id: 2, name: 'Bank B' }] };
      
      axios.get.mockResolvedValue(mockResponse);

      const result = await getBankInfo();

      expect(axios.get).toHaveBeenCalledWith(GET_BANK_MASTER);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when the API call fails', async () => {
      const mockError = new Error('Network Error');
      
      axios.get.mockRejectedValue(mockError);

      await expect(getBankInfo()).rejects.toThrow('Network Error');
      expect(axios.get).toHaveBeenCalledWith(GET_BANK_MASTER);
    });
  });

  describe('deleteBankInfo', () => {
    it('should delete bank information successfully', async () => {
      const mockIDs = [1, 2];
      const mockResponse = { data: { message: 'Banks deleted successfully', status: 200 } };
      
      axios.delete.mockResolvedValue(mockResponse);

      const result = await deleteBankInfo(mockIDs);

      expect(axios.delete).toHaveBeenCalledWith(DELETE_BANK_MASTER, { data: { IDs: mockIDs } });
      expect(result).toEqual({ message: 'Banks deleted successfully', status: 200, res: mockResponse });
    });

    it('should throw an error when the API call fails', async () => {
      const mockIDs = [1, 2];
      const mockError = new Error('Network Error');
      
      axios.delete.mockRejectedValue(mockError);

      await expect(deleteBankInfo(mockIDs)).rejects.toThrow('Network Error');
      expect(axios.delete).toHaveBeenCalledWith(DELETE_BANK_MASTER, { data: { IDs: mockIDs } });
    });
  });
});
