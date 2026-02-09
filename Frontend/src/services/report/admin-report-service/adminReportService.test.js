import axios from 'axios';
import { getAdminReportData } from '../admin-report-service/adminReportService'; 
import { GET_ADMIN_REPORT_DATA } from '../../../constants/constants';

jest.mock('axios'); // Mock axios

describe('getAdminReportData', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test('should fetch admin report data successfully', async () => {
    const mockRequestInfo = { userId: 123, dateRange: "2024-01-01 to 2024-01-31" };
    const mockResponseData = { report: [{ id: 1, name: 'Test Report' }] };

    axios.post.mockResolvedValueOnce({ data: mockResponseData });

    const response = await getAdminReportData(mockRequestInfo);
    
    console.log('Response from service:', response); // Print response

    expect(axios.post).toHaveBeenCalledWith(GET_ADMIN_REPORT_DATA, { requestInfo: mockRequestInfo });
    expect(response).toEqual(mockResponseData);
  });

  test('should log error and throw when API request fails', async () => {
    const mockRequestInfo = { userId: 123 };
    const mockError = new Error('Server error');

    axios.post.mockRejectedValueOnce(mockError);
    console.error = jest.fn(); // Mock console.error

    await expect(getAdminReportData(mockRequestInfo)).rejects.toThrow('Server error');

    expect(console.error).toHaveBeenCalledWith('Error fetching Owner Info:', mockError);
    expect(axios.post).toHaveBeenCalledWith(GET_ADMIN_REPORT_DATA, { requestInfo: mockRequestInfo });
  });
});
