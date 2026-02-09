import axios from 'axios'; 
import { fetchPageNames, savePageNames, deletePageInfo } from '../pageNameMaster/PageNameMasterService'; 

jest.mock('axios');

describe('Page Management API Tests', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  describe('fetchPageNames', () => {
    test('should return page names on success', async () => {
      const mockResponse = { data: { pages: ['Home', 'About', 'Contact'] } };
      axios.get.mockResolvedValueOnce(mockResponse);

      const response = await fetchPageNames();
      console.log('fetchPageNames Response:', response);

      expect(response).toEqual(mockResponse.data);
      console.log('fetchPageNames Comparison Successful');
      expect(axios.get).toHaveBeenCalledWith(expect.any(String));
    });

    test('should throw an error when API fails', async () => {
      const mockError = new Error('Failed to fetch pages');
      axios.get.mockRejectedValueOnce(mockError);

      await expect(fetchPageNames()).rejects.toEqual(mockError);
      console.log('fetchPageNames Error Comparison Successful');
      expect(axios.get).toHaveBeenCalledWith(expect.any(String));
    });
  });

  describe('savePageNames', () => {
    test('should return success response when page is saved', async () => {
      const mockResponse = { data: { message: 'Page saved successfully' }, status: 200 };
      axios.post.mockResolvedValueOnce(mockResponse);

      const requestData = { pageName: 'Services' };
      const response = await savePageNames(requestData);
      console.log('savePageNames Response:', response);

      expect(response).toEqual({
        message: 'Page saved successfully',
        status: 200,
        res: mockResponse
      });
      console.log('savePageNames Comparison Successful');

      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        pageInfo: requestData
      });
    });

    test('should throw an error when API fails', async () => {
      const mockError = new Error('Failed to save page');
      axios.post.mockRejectedValueOnce(mockError);

      const requestData = { pageName: 'Blog' };

      await expect(savePageNames(requestData)).rejects.toEqual(mockError);
      console.log('savePageNames Error Comparison Successful');
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
        pageInfo: requestData
      });
    });
  });

  describe('deletePageInfo', () => {
    test('should return success response when pages are deleted', async () => {
      const mockResponse = { data: { message: 'Pages deleted successfully' }, status: 200 };
      axios.post.mockResolvedValueOnce(mockResponse);

      const pageIDs = [1, 2, 3];
      const response = await deletePageInfo(pageIDs);
      console.log('deletePageInfo Response:', response);

      expect(response).toEqual(mockResponse);
      console.log('deletePageInfo Comparison Successful');
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), { IDs: pageIDs });
    });

    test('should throw an error when API fails', async () => {
      const mockError = new Error('Failed to delete pages');
      axios.post.mockRejectedValueOnce(mockError);

      const pageIDs = [4, 5, 6];

      await expect(deletePageInfo(pageIDs)).rejects.toThrow('Failed to delete pages: Failed to delete pages');
      console.log('deletePageInfo Error Comparison Successful');
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), { IDs: pageIDs });
    });
  });
});
