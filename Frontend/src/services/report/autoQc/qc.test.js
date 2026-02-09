import axios from "axios";
import {
  getMissingPhotos,
  fetchMissingData,
  missingPropertyNo,
  missingToiletData,
} from "../../report/autoQc/qc"; 

// Mock axios
jest.mock("axios");

describe("QC Missing Data API Tests", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  /** Test: getMissingPhotos */
  test("getMissingPhotos should return missing photos data on success", async () => {
    const mockResponse = { data: [{ id: 1, property: "A1" }, { id: 2, property: "B2" }] };
    axios.post.mockResolvedValueOnce(mockResponse);

    const selectedData = { ward: "10", range: "A1-B2" };
    const response = await getMissingPhotos(selectedData);

    console.log("Response from getMissingPhotos:", response);

    expect(response).toEqual(mockResponse.data);
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), selectedData);
  });

  /** Test: fetchMissingData */
  test("fetchMissingData should return missing data on success", async () => {
    const mockResponse = { data: [{ id: 1, missingField: "Address" }] };
    axios.post.mockResolvedValueOnce(mockResponse);

    const selectedFilters = { ward: "12", category: "Residential" };
    const response = await fetchMissingData(selectedFilters);

    console.log("Response from fetchMissingData:", response);

    expect(response).toEqual(mockResponse.data);
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), selectedFilters);
  });

  /** Test: missingPropertyNo */
  test("missingPropertyNo should return missing property numbers on success", async () => {
    const mockResponse = { data: [{ id: 1, propertyNo: "123A" }] };
    axios.post.mockResolvedValueOnce(mockResponse);

    const selectedFilters = { ward: "15", zone: "East" };
    const response = await missingPropertyNo(selectedFilters);

    console.log("Response from missingPropertyNo:", response);

    expect(response).toEqual(mockResponse.data);
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), selectedFilters);
  });

  /** Test: missingToiletData */
  test("missingToiletData should return missing toilet data on success", async () => {
    const mockResponse = { data: [{ id: 1, toiletType: "Public", missingCount: 2 }] };
    axios.post.mockResolvedValueOnce(mockResponse);

    const selectedFilters = { ward: "18", category: "Commercial" };
    const response = await missingToiletData(selectedFilters);

    console.log("Response from missingToiletData:", response);

    expect(response).toEqual(mockResponse.data);
    expect(axios.post).toHaveBeenCalledWith(expect.any(String), selectedFilters);
  });

  /** Test: fetchMissingData failure scenario */
  test("fetchMissingData should log error and return undefined on failure", async () => {
    const mockError = { response: { data: { message: "Server error" } } };
    axios.post.mockRejectedValueOnce(mockError);
  
    console.error = jest.fn(); // Mock console.error
    global.alert = jest.fn();  // Mock window.alert
  
    const selectedFilters = { ward: "12", category: "Residential" };
    const response = await fetchMissingData(selectedFilters);
  
    expect(console.error).toHaveBeenCalledWith("Error fetching missing data:", expect.any(Object));
    expect(response).toBeUndefined();
  });
  
});
