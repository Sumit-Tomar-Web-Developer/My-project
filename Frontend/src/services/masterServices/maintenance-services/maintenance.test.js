import axios from 'axios';
import { deleteMaintenanceList, fetchMaintenanceList, updateMaintenanceList } from '../maintenance-services/maintenance.services.js';
import {
  MAINTENANCE_DELETE_LIST,
  MAINTENANCE_LIST,
  MAINTENANCE_UPDATE_LIST
} from '../../../constants/MasterConstants/maintenance-master-constants/maintenance-master-constants.constants.js';

jest.mock('axios');

describe('Maintenance Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchMaintenanceList', () => {
    it('should fetch the maintenance list successfully', async () => {
      const mockData = [{ id: 1, name: 'Test Item' }];
      axios.get.mockResolvedValue({ data: mockData });

      const result = await fetchMaintenanceList();
      expect(axios.get).toHaveBeenCalledWith(MAINTENANCE_LIST);
      expect(result).toEqual(mockData);
    });

    it('should throw an error if fetching fails', async () => {
      axios.get.mockRejectedValue(new Error('Fetch failed'));

      await expect(fetchMaintenanceList()).rejects.toThrow('Fetch failed');
      expect(axios.get).toHaveBeenCalledWith(MAINTENANCE_LIST);
    });
  });

  describe('updateMaintenanceList', () => {
    it('should update the maintenance list successfully', async () => {
      const mockData = { id: 1, name: 'Updated Item' };
      const mockResponse = { data: { message: 'Updated successfully' }, status: 200 };
      axios.post.mockResolvedValue(mockResponse);

      const result = await updateMaintenanceList(mockData);
      expect(axios.post).toHaveBeenCalledWith(MAINTENANCE_UPDATE_LIST, mockData);
      expect(result).toEqual({ message: 'Updated successfully', status: 200 });
    });

    it('should throw an error if updating fails', async () => {
      const mockData = { id: 1, name: 'Updated Item' };
      axios.post.mockRejectedValue(new Error('Update failed'));

      await expect(updateMaintenanceList(mockData)).rejects.toThrow('Update failed');
      expect(axios.post).toHaveBeenCalledWith(MAINTENANCE_UPDATE_LIST, mockData);
    });
  });

  describe('deleteMaintenanceList', () => {
    it('should delete the maintenance list successfully', async () => {
      const mockIDs = [1, 2, 3];
      axios.delete.mockResolvedValue({});

      await deleteMaintenanceList(mockIDs);
      expect(axios.delete).toHaveBeenCalledWith(MAINTENANCE_DELETE_LIST, { data: { IDs: mockIDs } });
    });

    it('should throw an error if deleting fails', async () => {
      const mockIDs = [1, 2, 3];
      axios.delete.mockRejectedValue(new Error('Delete failed'));

      await expect(deleteMaintenanceList(mockIDs)).rejects.toThrow('Delete failed');
      expect(axios.delete).toHaveBeenCalledWith(MAINTENANCE_DELETE_LIST, { data: { IDs: mockIDs } });
    });
  });
}); 
