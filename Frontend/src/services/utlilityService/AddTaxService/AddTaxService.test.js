import axios from 'axios';
import { 
  fetchFinanceYearProperty, 
  saveAddTaxButton, 
  RemoveAdvanceTax, 
  updateAdvance, 
  fetchAdvance, 
  getMiscellaneouse, 
  fetchFinanceYearPropertyFromTo, 
  saveAddTaxButtonFromTo, 
  RemoveAdvanceTaxFromTo, 
  updateAdvanceFromTo, 
  fetchAdvanceFromTo, 
  getMiscellaneouseFromTo 
} from '../AddTaxService/AddTaxService.js'; 

jest.mock('axios');

describe('AddTax API tests', () => {
  
  it('should fetch finance year property successfully', async () => {
    const wardNo = 123;
    const mockResponse = { data: { year: 2025 } };
    axios.get.mockResolvedValue(mockResponse);

    const result = await fetchFinanceYearProperty(wardNo);
    expect(result).toEqual(mockResponse.data);
    expect(axios.get).toHaveBeenCalledWith('GET_FETCHING_FINANCE_YEAR_PROPERTY', { wardNo });
  });

  it('should handle error when fetching finance year property', async () => {
    const wardNo = 123;
    const mockError = new Error('Network Error');
    axios.get.mockRejectedValue(mockError);

    await expect(fetchFinanceYearProperty(wardNo)).rejects.toThrow('Network Error');
    expect(axios.get).toHaveBeenCalledWith('GET_FETCHING_FINANCE_YEAR_PROPERTY', { wardNo });
  });

  it('should save add tax button data successfully', async () => {
    const ward = 123, propertyNo = 'abc', patitionNo = 'xyz';
    const mockResponse = { data: { message: 'Success' }, status: 200 };
    axios.post.mockResolvedValue(mockResponse);

    const result = await saveAddTaxButton(ward, propertyNo, patitionNo);
    expect(result.message).toBe('Success');
    expect(axios.post).toHaveBeenCalledWith('SAVE_ADD_TAX', {
      data: { ward, propertyNo, patitionNo }
    });
  });

  it('should handle error when saving add tax button data', async () => {
    const ward = 123, propertyNo = 'abc', patitionNo = 'xyz';
    const mockError = new Error('Failed to save data');
    axios.post.mockRejectedValue(mockError);

    await expect(saveAddTaxButton(ward, propertyNo, patitionNo)).rejects.toThrow('Failed to save data');
    expect(axios.post).toHaveBeenCalledWith('SAVE_ADD_TAX', {
      data: { ward, propertyNo, patitionNo }
    });
  });

  it('should remove advance tax successfully', async () => {
    const ownerIds = [1, 2, 3];
    const mockResponse = { data: { message: 'Tax Removed' }, status: 200 };
    axios.post.mockResolvedValue(mockResponse);

    const result = await RemoveAdvanceTax(ownerIds);
    expect(result.message).toBe('Tax Removed');
    expect(axios.post).toHaveBeenCalledWith('REMOVE_ADD_TAX', { OwnerID: ownerIds });
  });

  it('should handle error when removing advance tax', async () => {
    const ownerIds = [1, 2, 3];
    const mockError = new Error('Failed to remove tax');
    axios.post.mockRejectedValue(mockError);

    await expect(RemoveAdvanceTax(ownerIds)).rejects.toThrow('Failed to remove tax');
    expect(axios.post).toHaveBeenCalledWith('REMOVE_ADD_TAX', { OwnerID: ownerIds });
  });

  it('should update advance successfully', async () => {
    const advanceId = 1, amount = 500;
    const mockResponse = { data: { message: 'Update Success' }, status: 200 };
    axios.put.mockResolvedValue(mockResponse);

    const result = await updateAdvance(advanceId, amount);
    expect(result.message).toBe('Update Success');
    expect(axios.put).toHaveBeenCalledWith('UPDATE_ADVANVCE_ADD_TAX', { advanceId, amount });
  });

  it('should handle error when updating advance', async () => {
    const advanceId = 1, amount = 500;
    const mockError = new Error('Failed to update advance');
    axios.put.mockRejectedValue(mockError);

    await expect(updateAdvance(advanceId, amount)).rejects.toThrow('Failed to update advance');
    expect(axios.put).toHaveBeenCalledWith('UPDATE_ADVANVCE_ADD_TAX', { advanceId, amount });
  });

  it('should fetch advance amount successfully', async () => {
    const advanceId = 1;
    const mockResponse = { data: { message: 'Fetched Success' }, status: 200 };
    axios.get.mockResolvedValue(mockResponse);

    const result = await fetchAdvance(advanceId);
    expect(result.message).toBe('Fetched Success');
    expect(axios.get).toHaveBeenCalledWith('GET_FETCHING_ADVANCE_AMOUNT/1');
  });

  it('should handle error when fetching advance amount', async () => {
    const advanceId = 1;
    const mockError = new Error('Failed to fetch advance');
    axios.get.mockRejectedValue(mockError);

    await expect(fetchAdvance(advanceId)).rejects.toThrow('Failed to fetch advance');
    expect(axios.get).toHaveBeenCalledWith('GET_FETCHING_ADVANCE_AMOUNT/1');
  });

  it('should get miscellaneous data successfully', async () => {
    const wardNo = 123;
    const mockResponse = { data: { amount: 1500 }, status: 200 };
    axios.get.mockResolvedValue(mockResponse);

    const result = await getMiscellaneouse(wardNo);
    expect(result.message).toBeUndefined();
    expect(result.response.amount).toBe(1500);
    expect(axios.get).toHaveBeenCalledWith('GET_FETCHING_MISCELLANEOUS_AMOUNT/123');
  });

  it('should handle error when getting miscellaneous data', async () => {
    const wardNo = 123;
    const mockError = new Error('Failed to fetch miscellaneous data');
    axios.get.mockRejectedValue(mockError);

    await expect(getMiscellaneouse(wardNo)).rejects.toThrow('Failed to fetch miscellaneous data');
    expect(axios.get).toHaveBeenCalledWith('GET_FETCHING_MISCELLANEOUS_AMOUNT/123');
  });

});
