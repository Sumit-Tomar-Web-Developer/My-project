import axios from 'axios';
import { 
  getTransYear, 
  getBillBookList, 
  createOrUpdateBillBookEntry 
} from '../bill-book-entry-services/transYearMasterService'; 

jest.mock('axios');

describe('Trans Year Master API Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTransYear', () => {
    it('should fetch transaction year list successfully', async () => {
      const mockResponse = { data: [{ year: 2023 }, { year: 2024 }] };
      axios.get.mockResolvedValue(mockResponse);

      const result = await getTransYear();

      expect(result).toEqual(mockResponse.data);
      expect(axios.get).toHaveBeenCalledWith(expect.any(String));
    });

    it('should throw an error if fetching transaction year fails', async () => {
      axios.get.mockRejectedValue(new Error('API Error'));

      await expect(getTransYear()).rejects.toThrow('API Error');
    });
  });

  describe('getBillBookList', () => {
    it('should fetch bill book entry list successfully', async () => {
      const mockResponse = { data: [{ id: 1, name: 'Bill Entry 1' }, { id: 2, name: 'Bill Entry 2' }] };
      axios.get.mockResolvedValue(mockResponse);

      const result = await getBillBookList();

      expect(result).toEqual(mockResponse.data);
      expect(axios.get).toHaveBeenCalledWith(expect.any(String));
    });

    it('should throw an error if fetching bill book entry list fails', async () => {
      axios.get.mockRejectedValue(new Error('API Error'));

      await expect(getBillBookList()).rejects.toThrow('API Error');
    });
  });

  describe('createOrUpdateBillBookEntry', () => {
    it('should create or update bill book entry successfully', async () => {
      const mockRequestData = { id: 1, name: 'New Bill Entry' };
      const mockResponse = { data: { message: 'Success' }, status: 200 };
      axios.post.mockResolvedValue(mockResponse);

      const result = await createOrUpdateBillBookEntry(mockRequestData);

      expect(result).toEqual({
        message: 'Success',
        status: 200,
        response: mockResponse,
      });
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), mockRequestData);
    });

    it('should throw an error if creating/updating bill book entry fails', async () => {
      axios.post.mockRejectedValue(new Error('API Error'));

      await expect(createOrUpdateBillBookEntry({ id: 1, name: 'Error Entry' })).rejects.toThrow('API Error');
    });
  });
});
