import axios from 'axios';
import { getMutationHistoryReportData } from '../mutation-history/mutationHistoryServices'; 
import { GET_MUTATION_HISTORY_REPORT_DATA } from '../../../constants/constants';

jest.mock('axios'); // Mock axios

describe('getMutationHistoryReportData', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test 
  });

  test('should fetch mutation history report data successfully', async () => {
    const mockRequestInfo = { propertyId: '12345', year: '2024' };
    const mockResponseData = { history: [{ mutationId: 1, details: 'Ownership change' }] };

    axios.post.mockResolvedValueOnce({ data: mockResponseData });

    const response = await getMutationHistoryReportData(mockRequestInfo);
    
    console.log('Response from service:', response); // Print response

    expect(axios.post).toHaveBeenCalledWith(GET_MUTATION_HISTORY_REPORT_DATA, { requestInfo: mockRequestInfo });
    expect(response).toEqual(mockResponseData);
  });

  test('should log error and throw when API request fails', async () => {
    const mockRequestInfo = { propertyId: '12345' };
    const mockError = new Error('Server error');

    axios.post.mockRejectedValueOnce(mockError);
    console.error = jest.fn(); // Mock console.error

    await expect(getMutationHistoryReportData(mockRequestInfo)).rejects.toThrow('Server error');

    expect(console.error).toHaveBeenCalledWith('Error fetching Mutation History Report Info:', mockError);
    expect(axios.post).toHaveBeenCalledWith(GET_MUTATION_HISTORY_REPORT_DATA, { requestInfo: mockRequestInfo });
  });
});
