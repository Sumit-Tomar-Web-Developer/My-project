import axios from 'axios';
import {
  saveOrUpdateZoneMaster,
  getZoneMasterList,
  deleteZoneMasterById
} from '../zone-master-services.js/zone-master-services';

jest.mock('axios');

describe('Zone Master Service Functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockResponse = {
    data: { message: 'Success' },
    status: 200
  };

  test('saveOrUpdateZoneMaster - success', async () => {
    const mockData = { zoneName: 'Zone A' };
    axios.post.mockResolvedValue(mockResponse);

    const response = await saveOrUpdateZoneMaster(mockData);
    console.log('saveOrUpdateZoneMaster response:', response);

    expect(response).toEqual({
      message: 'Success',
      status: 200,
      res: mockResponse
    });
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), mockData);
  });

  test('saveOrUpdateZoneMaster - failure', async () => {
    axios.post.mockRejectedValue(new Error('Post failed'));

    await expect(saveOrUpdateZoneMaster({})).rejects.toThrow('Failed to save or update zone master');
  });

  test('getZoneMasterList - success', async () => {
    const mockList = { zones: ['Zone 1', 'Zone 2'] };
    axios.get.mockResolvedValue({ data: mockList });

    const response = await getZoneMasterList();
    console.log('getZoneMasterList response:', response);

    expect(response).toEqual(mockList);
    expect(axios.get).toHaveBeenCalledWith(expect.any(String));
  });

  test('getZoneMasterList - failure', async () => {
    axios.get.mockRejectedValue(new Error('Fetch failed'));

    await expect(getZoneMasterList()).rejects.toThrow('Failed to fetch zone master list');
  });

  test('deleteZoneMasterById - success', async () => {
    const idsToDelete = [1, 2];
    axios.delete.mockResolvedValue({ data: { message: 'Deleted' } });

    const response = await deleteZoneMasterById(idsToDelete);
    console.log('deleteZoneMasterById response:', response);

    expect(response).toEqual({ message: 'Deleted' });
    expect(axios.delete).toHaveBeenCalledWith(expect.any(String), {
      data: { IDs: idsToDelete }
    });
  });

  test('deleteZoneMasterById - failure', async () => {
    axios.delete.mockRejectedValue(new Error('Delete failed'));

    await expect(deleteZoneMasterById([1])).rejects.toThrow('Delete failed');
  });
});
