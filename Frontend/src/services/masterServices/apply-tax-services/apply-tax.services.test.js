import axios from 'axios';
import {
  fetchWards,
  fetchPropertyRange,
  fetchAppliedTaxes,
  fetchAllOwnerIDs,
  saveAppliedTaxes
} from '../apply-tax-services/apply-tax.services'; // Adjust the path as needed
import {
  WARD_LIST,
  PROPERTY_RANGE,
  APPLIED_TAX_OWNER_ID,
  GET_ALL_OWNER_IDS,
  APPLY_TAXES_TO_ALL
} from '../../../constants/constants';

jest.mock('axios');

describe('Ward Tax Service Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchWards', () => {
    it('should fetch ward list successfully', async () => {
      const mockResponse = { data: [{ wardNo: 1, name: 'Ward A' }, { wardNo: 2, name: 'Ward B' }] };
      
      axios.get.mockResolvedValue(mockResponse);

      const result = await fetchWards();

      expect(axios.get).toHaveBeenCalledWith(WARD_LIST);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when the API call fails', async () => {
      const mockError = new Error('Network Error');
      
      axios.get.mockRejectedValue(mockError);

      await expect(fetchWards()).rejects.toThrow('Network Error');
      expect(axios.get).toHaveBeenCalledWith(WARD_LIST);
    });
  });

  describe('fetchPropertyRange', () => {
    it('should fetch property range successfully', async () => {
      const wardNo = 1;
      const from = 10;
      const to = 20;
      const mockResponse = { data: { range: [10, 11, 12] } };
      
      axios.get.mockResolvedValue(mockResponse);

      const result = await fetchPropertyRange(wardNo, from, to);

      expect(axios.get).toHaveBeenCalledWith(`${PROPERTY_RANGE}/${wardNo}`, { params: { from, to } });
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when the API call fails', async () => {
      const wardNo = 1;
      const from = 10;
      const to = 20;
      const mockError = new Error('Network Error');
      
      axios.get.mockRejectedValue(mockError);

      await expect(fetchPropertyRange(wardNo, from, to)).rejects.toThrow('Network Error');
      expect(axios.get).toHaveBeenCalledWith(`${PROPERTY_RANGE}/${wardNo}`, { params: { from, to } });
    });
  });

  describe('fetchAppliedTaxes', () => {
    it('should fetch applied taxes successfully for an owner ID', async () => {
      const ownerID = 123;
      const mockResponse = { data: { taxes: ['Tax1', 'Tax2'] } };
      
      axios.get.mockResolvedValue(mockResponse);

      const result = await fetchAppliedTaxes(ownerID);

      expect(axios.get).toHaveBeenCalledWith(`${APPLIED_TAX_OWNER_ID}/${ownerID}`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when the API call fails', async () => {
      const ownerID = 123;
      const mockError = new Error('Network Error');
      
      axios.get.mockRejectedValue(mockError);

      await expect(fetchAppliedTaxes(ownerID)).rejects.toThrow('Network Error');
      expect(axios.get).toHaveBeenCalledWith(`${APPLIED_TAX_OWNER_ID}/${ownerID}`);
    });
  });

  describe('fetchAllOwnerIDs', () => {
    it('should fetch all owner IDs successfully', async () => {
      const mockResponse = { data: [1, 2, 3] };
      
      axios.get.mockResolvedValue(mockResponse);

      const result = await fetchAllOwnerIDs();

      expect(axios.get).toHaveBeenCalledWith(GET_ALL_OWNER_IDS);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when the API call fails', async () => {
      const mockError = new Error('Network Error');
      
      axios.get.mockRejectedValue(mockError);

      await expect(fetchAllOwnerIDs()).rejects.toThrow('Network Error');
      expect(axios.get).toHaveBeenCalledWith(GET_ALL_OWNER_IDS);
    });
  });

  describe('saveAppliedTaxes', () => {
    it('should save applied taxes successfully', async () => {
      const taxValues = { tax: 'Tax A', value: 100 };
      const mockResponse = { data: { message: 'Taxes applied successfully' }, status: 200 };
      
      axios.post.mockResolvedValue(mockResponse);

      const result = await saveAppliedTaxes(taxValues);

      expect(axios.post).toHaveBeenCalledWith(APPLY_TAXES_TO_ALL, taxValues);
      expect(result).toEqual({ message: 'Taxes applied successfully', status: 200 });
    });

    it('should throw an error when the API call fails', async () => {
      const taxValues = { tax: 'Tax A', value: 100 };
      const mockError = new Error('Network Error');
      
      axios.post.mockRejectedValue(mockError);

      await expect(saveAppliedTaxes(taxValues)).rejects.toThrow('Network Error');
      expect(axios.post).toHaveBeenCalledWith(APPLY_TAXES_TO_ALL, taxValues);
    });
  });
});
