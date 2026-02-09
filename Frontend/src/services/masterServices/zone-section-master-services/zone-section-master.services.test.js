import axios from 'axios';
import {
  fetchZoneSectionMasterList,
  fetchZoneSectionDetailsList,
  postAddUpdateZoneSectionMasterList,
  postAddZoneDetails,
  deleteZoneSectionMasterList
} from '../zone-section-master-services/zone-section-master.services'; 

jest.mock('axios');

describe('Zone Section Master Services', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockData = { data: { message: 'Success' }, status: 200 };

  test('fetchZoneSectionMasterList - success', async () => {
    axios.get.mockResolvedValue(mockData);

    const response = await fetchZoneSectionMasterList();
    console.log(response);
    expect(response).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith(expect.any(String));
  });

  test('fetchZoneSectionMasterList - error', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    await expect(fetchZoneSectionMasterList()).rejects.toThrow('Network Error');
  });

  test('fetchZoneSectionDetailsList - success', async () => {
    axios.get.mockResolvedValue(mockData);

    const response = await fetchZoneSectionDetailsList();
    console.log(response);
    expect(response).toEqual(mockData);
    expect(axios.get).toHaveBeenCalledWith(expect.any(String));
  });

  test('postAddUpdateZoneSectionMasterList - success', async () => {
    const data = { id: 1, name: 'Zone 1' };
    axios.post.mockResolvedValue(mockData);

    const response = await postAddUpdateZoneSectionMasterList(data);
    console.log(response);
    expect(response).toEqual({ message: 'Success', status: 200 });
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), data);
  });

  test('postAddUpdateZoneSectionMasterList - error', async () => {
    axios.post.mockRejectedValue(new Error('Post failed'));

    await expect(postAddUpdateZoneSectionMasterList({})).rejects.toThrow('Post failed');
  });

  test('postAddZoneDetails - success', async () => {
    const details = { zone: 'A', section: '1' };
    axios.post.mockResolvedValue(mockData);

    const response = await postAddZoneDetails(details);
    console.log(response);
    expect(response).toEqual({ message: 'Success', status: 200 });
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), details);
  });

  test('deleteZoneSectionMasterList - success', async () => {
    axios.delete.mockResolvedValue(mockData);

    const id = { id: 1 };
    const response = await deleteZoneSectionMasterList(id);
    console.log(response);
    expect(response).toEqual({ message: 'Success', status: 200 });
    expect(axios.delete).toHaveBeenCalledWith(expect.any(String), { data: id });
  });

  test('deleteZoneSectionMasterList - error', async () => {
    axios.delete.mockRejectedValue(new Error('Delete failed'));

    await expect(deleteZoneSectionMasterList({ id: 1 })).rejects.toThrow('Delete failed');
  });
});
