import axios from 'axios';
import {
  saveAndUpdatePropertyMaster,
  getPropertyList,
  deletePropertyMaster
} from '../property-typeService/property-type-master.service';

// Mock axios
jest.mock('axios');

describe('Property Type API Tests', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  /** Test: saveAndUpdatePropertyMaster */
  test('saveAndUpdatePropertyMaster should return success message and status on success', async () => {
    const mockResponse = { data: { message: 'Property type saved successfully' }, status: 200 };
    axios.post.mockResolvedValueOnce(mockResponse);

    const propertyData = { type: 'Residential', description: 'Residential Property' };
    const response = await saveAndUpdatePropertyMaster(propertyData);

    expect(response).toEqual({ message: 'Property type saved successfully', status: 200, response: mockResponse });
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), propertyData);
  });

  test('saveAndUpdatePropertyMaster should throw an error when API fails', async () => {
    const mockError = new Error('Failed to save property type');
    axios.post.mockRejectedValueOnce(mockError);

    const propertyData = { type: 'Residential', description: 'Residential Property' };
    await expect(saveAndUpdatePropertyMaster(propertyData)).rejects.toThrow(
      'Error saving and updating type of use: Failed to save property type'
    );
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), propertyData);
  });

  /** Test: getPropertyList */
  test('getPropertyList should return property list on success', async () => {
    const mockResponse = { data: [{ id: 1, type: 'Residential' }, { id: 2, type: 'Commercial' }] };
    axios.get.mockResolvedValueOnce(mockResponse);

    const response = await getPropertyList();

    expect(response).toEqual(mockResponse.data);
    expect(axios.get).toHaveBeenCalledWith(expect.any(String));
  });

  test('getPropertyList should throw an error when API fails', async () => {
    const mockError = new Error('Failed to fetch property list');
    axios.get.mockRejectedValueOnce(mockError);

    await expect(getPropertyList()).rejects.toThrow('Error getting type of use list: Failed to fetch property list');
    expect(axios.get).toHaveBeenCalledWith(expect.any(String));
  });

  /** Test: deletePropertyMaster */
  test('deletePropertyMaster should return success response on success', async () => {
    const mockResponse = { message: 'Property types deleted successfully' };
    axios.delete.mockResolvedValueOnce({ data: mockResponse });

    const propertyTypeIDs = [1, 2, 3];
    const response = await deletePropertyMaster(propertyTypeIDs);

    expect(response).toEqual(mockResponse);
    expect(axios.delete).toHaveBeenCalledWith(expect.any(String), { data: { PropertyTypeIDs: propertyTypeIDs } });
  });

  test('deletePropertyMaster should throw an error when API fails', async () => {
    const mockError = { response: { data: { message: 'Failed to delete property type' } } };
    axios.delete.mockRejectedValueOnce(mockError);

    const propertyTypeIDs = [1, 2, 3];
    await expect(deletePropertyMaster(propertyTypeIDs)).rejects.toThrow('Failed to delete property type');
    expect(axios.delete).toHaveBeenCalledWith(expect.any(String), { data: { PropertyTypeIDs: propertyTypeIDs } });
  });

  test('deletePropertyMaster should throw an error for invalid propertyTypeIDs', async () => {
    const invalidIDs = ['a', -1, null];

    await expect(deletePropertyMaster(invalidIDs)).rejects.toThrow(
      'Property Type IDs must be an array of positive integers'
    );
  });
});
