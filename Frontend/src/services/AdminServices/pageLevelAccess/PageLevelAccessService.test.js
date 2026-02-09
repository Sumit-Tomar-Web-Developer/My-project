import axios from 'axios';
import {
  getSecurityLayer,
  AddOrUpdateSecurityLayer,
  DeleteSecurityLayer
} from '../pageLevelAccess/PageLevelAccessService'; 

import {
  GET_SECURITY_LAYER,
  ADD_SECURITY_LAYER,
  DELETE_SECURITY_LAYER
} from '../../../constants/AdminConstants/pageLevelAccessConstants';

jest.mock('axios');

describe('Security Layer Service - Success and Error Scenarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getSecurityLayer - success', async () => {
    const mockData = { layers: ['Admin', 'User'] };
    axios.get.mockResolvedValue({ data: mockData });

    const response = await getSecurityLayer();

    console.log('getSecurityLayer response:', response);

    expect(response).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith(GET_SECURITY_LAYER);
  });

  test('getSecurityLayer - error', async () => {
    const error = new Error('Network error');
    axios.get.mockRejectedValue(error);
    console.error = jest.fn();

    const response = await getSecurityLayer();

    expect(console.error).toHaveBeenCalledWith(error, 'Error getting security layer');
    expect(response).toBeUndefined();
  });

  test('AddOrUpdateSecurityLayer - success', async () => {
    const securityObject = { id: 1, name: 'New Layer' };
    const mockRes = { message: 'Saved successfully' };

    axios.post.mockResolvedValue({ data: mockRes });

    const response = await AddOrUpdateSecurityLayer(securityObject);

    console.log('AddOrUpdateSecurityLayer response:', response);

    expect(response).toEqual(mockRes);
    expect(axios.post).toHaveBeenCalledWith(ADD_SECURITY_LAYER, { LayerObject: securityObject });
  });

  test('AddOrUpdateSecurityLayer - error', async () => {
    const securityObject = { id: 2 };
    const error = new Error('Internal error');
    axios.post.mockRejectedValue(error);
    console.error = jest.fn();

    const response = await AddOrUpdateSecurityLayer(securityObject);

    expect(console.error).toHaveBeenCalledWith(error, 'Error in Adding security layer');
    expect(response).toBeUndefined();
  });

  test('DeleteSecurityLayer - success', async () => {
    const LayerID = 99;
    const mockRes = { message: 'Deleted successfully' };

    axios.post.mockResolvedValue({ data: mockRes });

    const response = await DeleteSecurityLayer(LayerID);

    console.log('DeleteSecurityLayer response:', response);

    expect(response).toEqual(mockRes);
    expect(axios.post).toHaveBeenCalledWith(DELETE_SECURITY_LAYER, { LayerID });
  });
  test('DeleteSecurityLayer - error', async () => {
    const error = new Error('Delete failed');
    axios.post.mockRejectedValue(error);
    console.error = jest.fn();
  
    const response = await DeleteSecurityLayer(123); // simulate delete
  
    expect(console.error).toHaveBeenCalledWith(error, 'Error deleting security layer');
    expect(response).toBeUndefined();
  });
  
});
