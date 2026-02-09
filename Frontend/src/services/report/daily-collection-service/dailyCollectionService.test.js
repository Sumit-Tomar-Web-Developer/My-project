import axios from 'axios';
import { getDailyCollectionReportData } from '../../report/daily-collection-service/dailyCollectionService'; 
import { GET_DAILY_COLLECTION_REPORT_DATA } from '../../../constants/constants';

jest.mock('axios'); // Mock axios

describe('getDailyCollectionReportData', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test('should fetch daily collection report data successfully', async () => {
    const mockRequestInfo = { date: '2024-02-21', branch: 'Main' };
    const mockResponseData = { totalAmount: 1000, transactions: 25 };

    axios.post.mockResolvedValueOnce({ data: mockResponseData });

    const response = await getDailyCollectionReportData(mockRequestInfo);
    
    console.log('Response from service:', response); // Print response

    expect(axios.post).toHaveBeenCalledWith(GET_DAILY_COLLECTION_REPORT_DATA, { requestInfo: mockRequestInfo });
    expect(response).toEqual(mockResponseData);
  });

  test('should log error and throw when API request fails', async () => {
    const mockRequestInfo = { date: '2024-02-21' };
    const mockError = new Error('Server error');

    axios.post.mockRejectedValueOnce(mockError);
    console.error = jest.fn(); // Mock console.error

    await expect(getDailyCollectionReportData(mockRequestInfo)).rejects.toThrow('Server error');

    expect(console.error).toHaveBeenCalledWith('Error fetching Daily Collection Report Info:', mockError);
    expect(axios.post).toHaveBeenCalledWith(GET_DAILY_COLLECTION_REPORT_DATA, { requestInfo: mockRequestInfo });
  });
});
