import axios from 'axios';
import { saveAndUpdatePolicyFactors, getFactorList, deletePolicyFactor } from '../services/factor_policy_master.service';
import { DELETE_POLICY_FACTOR, GET_FACTOR_LIST, SAVE_AND_UPDATE_POLICY_FACTORS } from '../constants/constants';

jest.mock('axios');

describe('Policy Factors Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveAndUpdatePolicyFactors', () => {
    it('should save or update policy factors successfully', async () => {
      const mockData = { name: 'Test Factor', value: 10 };
      const mockResponse = { message: 'Policy factor saved successfully', status: 200 };

      axios.post.mockResolvedValue({ data: mockResponse, status: 200 });

      const result = await saveAndUpdatePolicyFactors(mockData);

      expect(axios.post).toHaveBeenCalledWith(SAVE_AND_UPDATE_POLICY_FACTORS, mockData);
      expect(result).toEqual({ message: 'Policy factor saved successfully', status: 200, res: { data: mockResponse, status: 200 } });
    });

    it('should throw an error if saving or updating fails', async () => {
      const mockData = { name: 'Test Factor', value: 10 };
      axios.post.mockRejectedValue(new Error('Network Error'));

      await expect(saveAndUpdatePolicyFactors(mockData)).rejects.toThrow('Error saving and updating policy factors: Network Error');
    });
  });

  describe('getFactorList', () => {
    it('should fetch the factor list successfully', async () => {
      const mockResponse = { data: [{ id: 1, name: 'Factor A' }, { id: 2, name: 'Factor B' }] };

      axios.get.mockResolvedValue(mockResponse);

      const result = await getFactorList();

      expect(axios.get).toHaveBeenCalledWith(GET_FACTOR_LIST);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error if fetching the factor list fails', async () => {
      axios.get.mockRejectedValue(new Error('Network Error'));

      await expect(getFactorList()).rejects.toThrow('Error getting factor list: Network Error');
    });
  });

  describe('deletePolicyFactor', () => {
    it('should delete a policy factor successfully', async () => {
      const mockIDs = [1, 2];
      const mockResponse = { message: 'Policy factors deleted successfully', status: 200 };

      axios.delete.mockResolvedValue({ data: mockResponse });

      const result = await deletePolicyFactor(mockIDs);

      expect(axios.delete).toHaveBeenCalledWith(DELETE_POLICY_FACTOR, { data: { FacterIDs: mockIDs } });
      expect(result).toEqual({ message: 'Policy factors deleted successfully', status: 200, res: { data: mockResponse } });
    });

    it('should throw an error if deleting a policy factor fails', async () => {
        const mockIDs = [1];
        axios.delete.mockRejectedValue(new Error('Network Error'));
      
        await expect(deletePolicyFactor(mockIDs)).rejects.toThrow('Network Error');
      });
      
  });
});
