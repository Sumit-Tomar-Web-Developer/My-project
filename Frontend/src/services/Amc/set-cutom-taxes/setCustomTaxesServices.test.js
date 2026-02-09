import axios from 'axios';
import { 
  getCustomTaxesByOwnerID, 
  saveCustomTax, 
  getPendingTaxStatusByYear 
} from '../set-cutom-taxes/setCustomTaxesServices'; // Replace with the actual path

jest.mock('axios');

describe('Custom Taxes API Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCustomTaxesByOwnerID', () => {
    it('should fetch custom taxes by owner ID successfully', async () => {
      const mockResponse = { data: { taxes: [{ id: 1, amount: 100 }] } };
      axios.post.mockResolvedValue(mockResponse);

      const result = await getCustomTaxesByOwnerID(123);

      expect(result).toEqual(mockResponse.data);
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), { OwnerID: 123 });
    });

    it('should throw an error if fetching custom taxes fails', async () => {
      axios.post.mockRejectedValue(new Error('API Error'));

      await expect(getCustomTaxesByOwnerID(123)).rejects.toThrow('API Error');
    });
  });

  describe('saveCustomTax', () => {
    it('should save custom tax successfully', async () => {
      const mockRequestData = { id: 1, amount: 500 };
      const mockResponse = { data: { message: 'Saved Successfully' }, status: 200 };
      axios.post.mockResolvedValue(mockResponse);

      const result = await saveCustomTax(mockRequestData, 123, 'PropertyTax', '2024');

      expect(result).toEqual({
        message: 'Saved Successfully',
        status: 200,
        response: mockResponse,
      });
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        CustomTaxes: mockRequestData,
        OwnerID: 123,
        taxType: 'PropertyTax',
        finacialYear: '2024',
      });
    });

    it('should throw an error if saving custom tax fails', async () => {
      axios.post.mockRejectedValue(new Error('API Error'));

      await expect(saveCustomTax({}, 123, 'PropertyTax', '2024')).rejects.toThrow('API Error');
    });
  });
  describe('getPendingTaxStatusByYear', () => {
    it('should fetch pending tax status by year successfully', async () => {
      const mockResponse = { data: { message: 'Pending Taxes Found', status: 200 } };
      axios.post.mockResolvedValue(mockResponse);
  
      const result = await getPendingTaxStatusByYear(2024, 123);
  
      // Fix: Check if status is inside result.data
      expect(result).toEqual({
        message: 'Pending Taxes Found',
        status: 200,
        data: mockResponse.data,
      });
  
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        year: 2024,
        ownerId: 123,
      });
    });
  
    it('should throw an error if fetching pending tax status fails', async () => {
      axios.post.mockRejectedValue(new Error('API Error'));
  
      await expect(getPendingTaxStatusByYear(2024, 123)).rejects.toThrow('API Error');
    });
  });
  
});
