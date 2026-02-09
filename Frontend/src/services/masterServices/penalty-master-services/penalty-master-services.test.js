import axios from 'axios';
import { fetchPenaltyList, postUpdatedPenaltyList } from '../penalty-master-services/penalty-master.services'; 
import { PENALTY_LIST, PENALTY_ADD_UPDATE_LIST } from '../../../constants/MasterConstants/penalty-master-constants/penalty-masters.constants.js';

jest.mock('axios'); 

describe('Penalty Service', () => {
  describe('fetchPenaltyList', () => {
    it('should fetch the penalty list successfully', async () => {
      const mockData = [{ id: 1, penalty: 'Test Penalty' }];
      axios.get.mockResolvedValueOnce({ data: mockData });

      const result = await fetchPenaltyList();

      expect(axios.get).toHaveBeenCalledWith(PENALTY_LIST);
      expect(result).toEqual(mockData);
    });

    it('should throw an error if fetching the penalty list fails', async () => {
      const errorMessage = 'Error in Fetching List';
      axios.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(fetchPenaltyList()).rejects.toThrow(errorMessage);
      expect(axios.get).toHaveBeenCalledWith(PENALTY_LIST);
    });
  });

  describe('postUpdatedPenaltyList', () => {
    it('should post the updated penalty list successfully', async () => {
      const mockData = { success: true };
      const newList = [{ id: 1, penalty: 'Updated Penalty' }];
      axios.patch.mockResolvedValueOnce({ data: mockData });

      const result = await postUpdatedPenaltyList(newList);

      expect(axios.patch).toHaveBeenCalledWith(PENALTY_ADD_UPDATE_LIST, newList);
      expect(result).toEqual(mockData);
    });

    it('should throw an error if posting the updated penalty list fails', async () => {
      const errorMessage = 'Failed to post the updated tax list';
      const newList = [{ id: 1, penalty: 'Updated Penalty' }];
      axios.patch.mockRejectedValueOnce(new Error('Some error'));

      await expect(postUpdatedPenaltyList(newList)).rejects.toThrow(errorMessage);
      expect(axios.patch).toHaveBeenCalledWith(PENALTY_ADD_UPDATE_LIST, newList);
    });
  });
});
