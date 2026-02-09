import axios from 'axios';
import {
  getPropertyRangeFromAndTo,
  getOwnerNames,
  saveOwnerNames,
  getJointOwnerDetails,
  saveAddress,
  saveRoad,
  savePropertyDesc,
  saveShop,
  saveCommonRemark,
  saveWadhGhat
} from '../updatePropertyDetailsService/updatePropertyDetailsService'; 

jest.mock('axios');

describe('Update Property Details API Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getPropertyRangeFromAndTo should return property range', async () => {
    const mockData = { message: 'Success', data: { range: [1, 2, 3] } };
    axios.post.mockResolvedValueOnce({ data: mockData });

    const response = await getPropertyRangeFromAndTo(1, 100, 200);
    expect(response).toEqual(mockData);
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
      wardNo: 1,
      fromPropertyNo: 100,
      toPropertyNo: 200
    });
  });
 
  test('getOwnerNames should return owner names', async () => {
    const mockData = { message: 'Success', owners: ['Alice', 'Bob'] };
    axios.post.mockResolvedValueOnce({ data: mockData });

    const response = await getOwnerNames(1, 100, 200);
    expect(response).toEqual(mockData);
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), {
      wardNo: 1,
      fromPropertyNo: 100,
      toPropertyNo: 200
    });
  });

  test('saveOwnerNames should return success response', async () => {
    const mockData = { message: 'Owner saved successfully', status: 200 };
    axios.post.mockResolvedValueOnce({ data: mockData });

    const requestData = { ownerId: 123, name: 'John Doe' };
    const response = await saveOwnerNames(requestData);
    expect(response).toEqual(mockData);
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), { requestData });
  });

  test('getJointOwnerDetails should return joint owner details', async () => {
    const mockData = { message: 'Success', owners: [{ id: 1, name: 'John' }] };
    axios.post.mockResolvedValueOnce({ data: mockData });

    const response = await getJointOwnerDetails(1);
    expect(response).toEqual(mockData);
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), { OwnerID: 1 });
  });

  test('saveAddress should return success response', async () => {
    const mockData = { message: 'Address saved successfully', status: 200 };
    axios.post.mockResolvedValueOnce({ data: mockData, status: 200 });
  
    const requestData = { address: '123 Street' };
    const response = await saveAddress(requestData);
  
    expect(response).toEqual({
      message: 'Address saved successfully',
      status: 200,
      res: { data: mockData, status: 200 }
    });
  
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), { requestData });
  });
  

  test('saveRoad should return success response', async () => {
    const mockData = { message: 'Road saved successfully', status: 200 };
    axios.post.mockResolvedValueOnce({ data: mockData, status: 200 });
  
    const requestData = { roadWidth: 10 };
    const response = await saveRoad(requestData);
  
    expect(response).toEqual({
      message: 'Road saved successfully',
      status: 200,
      res: { data: mockData, status: 200 }  // Ensuring the response structure matches
    });
  
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), { requestData });
  });
  

  test('savePropertyDesc should return success response', async () => {
    const mockData = { message: 'Property description saved', status: 200 };
    axios.post.mockResolvedValueOnce({ data: mockData, status: 200 });
  
    const requestData = { description: 'Test Property' };
    const response = await savePropertyDesc(requestData);
  
    expect(response).toEqual({
      message: 'Property description saved',
      status: 200,
      res: { data: mockData, status: 200 } // Ensure this matches the function return
    });
  
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), { requestData });
  });
  

  test('saveShop should return success response', async () => {
    const mockData = { message: 'Shop saved', status: 200 };
    axios.post.mockResolvedValueOnce({ data: mockData, status: 200 });
  
    const requestData = { shopName: 'Supermart' };
    const response = await saveShop(requestData);
  
    expect(response).toEqual({
      message: 'Shop saved',
      status: 200,
      res: { data: mockData, status: 200 } // Ensure this matches the actual function response
    });
  
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), { requestData });
  });
  

  test('saveCommonRemark should return success response', async () => {
    const mockData = { message: 'Remark saved', status: 200 };
    axios.post.mockResolvedValueOnce({ data: mockData, status: 200 });
  
    const requestData = { remark: 'Test Remark' };
    const response = await saveCommonRemark(requestData);
  
    expect(response).toEqual({
      message: 'Remark saved',
      status: 200,
      res: { data: mockData, status: 200 } // Ensure this matches the actual response structure
    });
  
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), { requestData });
  });
  

  test('saveWadhGhat should return success response', async () => {
    const mockData = { message: 'Wadh Ghat saved', status: 200 };
    axios.post.mockResolvedValueOnce({ data: mockData, status: 200 });
  
    const requestData = { details: 'Some details' };
    const response = await saveWadhGhat(requestData);
  
    expect(response).toEqual({
      message: 'Wadh Ghat saved',
      status: 200,
      res: { data: mockData, status: 200 }  // Ensuring response structure matches
    });
  
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), { requestData });
  });
  

  test('saveAddress should handle errors', async () => {
    axios.post.mockRejectedValueOnce(new Error('Failed to save address'));

    const requestData = { address: '123 Street' };
    await expect(saveAddress(requestData)).rejects.toThrow('Failed to save address');
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), { requestData });
  });
});
