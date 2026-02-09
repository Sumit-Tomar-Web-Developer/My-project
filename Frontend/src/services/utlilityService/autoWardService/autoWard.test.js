import axios from 'axios';
import { saveAndUpdateAutoWard, saveAndUpdateOblique } from '../autoWardService/autoWard.service'; 
import { SAVE_AND_UPDATE_AUTO_OBLIQUE, SAVE_AND_UPDATE_AUTO_WARD } from '../../../constants/Utility/autoWardConstant/autoWard.constant';

jest.mock('axios'); // Mock axios globally

describe('Auto Ward & Oblique API Tests', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test to avoid conflicts
  });

  describe('saveAndUpdateAutoWard', () => {
    it('should save and update ward successfully', async () => {
      const mockResponse = { data: { message: 'Ward updated successfully' }, status: 200 };
      axios.post.mockResolvedValue(mockResponse);

      const wardInfo = { id: 1, name: 'Ward 1' };
      const result = await saveAndUpdateAutoWard(wardInfo);

      expect(result).toEqual({
        message: 'Ward updated successfully',
        status: 200,
        res: mockResponse,
      });

      expect(axios.post).toHaveBeenCalledWith(SAVE_AND_UPDATE_AUTO_WARD, wardInfo);
    });

    it('should throw an error when saving/updating ward fails', async () => {
      axios.post.mockRejectedValue(new Error('API Error'));

      await expect(saveAndUpdateAutoWard({ id: 1, name: 'Ward 1' })).rejects.toThrow('API Error');
    });
  });

  describe('saveAndUpdateOblique', () => {
    it('should save and update oblique successfully', async () => {
      const mockResponse = { data: { message: 'Oblique updated successfully' }, status: 200 };
      axios.post.mockResolvedValue(mockResponse);

      const obliqueData = { id: 2, type: 'Oblique Type' };
      const result = await saveAndUpdateOblique(obliqueData);

      expect(result).toEqual({
        message: 'Oblique updated successfully',
        status: 200,
        res: mockResponse,
      });

      expect(axios.post).toHaveBeenCalledWith(SAVE_AND_UPDATE_AUTO_OBLIQUE, obliqueData);
    });

    it('should throw an error when saving/updating oblique fails', async () => {
      axios.post.mockRejectedValue(new Error('API Error'));

      await expect(saveAndUpdateOblique({ id: 2, type: 'Oblique Type' })).rejects.toThrow('API Error');
    });
  });
});
