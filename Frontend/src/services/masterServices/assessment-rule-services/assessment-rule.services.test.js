import axios from 'axios';
import {
  SaveAssessmentRules,
  getAssessmentData,
  GenerateAssesmentNo
} from '../assessment-rule-services/assessment-rule.services'; 
import {
  ADD_ASSESSMENT_RULES,
  GET_ASSESSMENT_RULES,
  GENERATE_ASSESSNO_NO
} from '../../../constants/constants.js';

jest.mock('axios');

describe('Assessment Service Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('SaveAssessmentRules', () => {
    it('should save assessment rules successfully', async () => {
      const mockData = { rule: 'Rule1', value: 'Value1' };
      const mockResponse = { data: { message: 'Rules added successfully' }, status: 200 };

      axios.post.mockResolvedValue(mockResponse);

      const result = await SaveAssessmentRules(mockData);

      expect(axios.post).toHaveBeenCalledWith(ADD_ASSESSMENT_RULES, mockData);
      expect(result).toEqual({ message: 'Rules added successfully', status: 200, res: mockResponse });
    });

    it('should throw an error when the API call fails', async () => {
      const mockData = { rule: 'Rule1', value: 'Value1' };
      const mockError = new Error('Network Error');

      axios.post.mockRejectedValue(mockError);

      await expect(SaveAssessmentRules(mockData)).rejects.toThrow('Network Error');
      expect(axios.post).toHaveBeenCalledWith(ADD_ASSESSMENT_RULES, mockData);
    });
  });

  describe('getAssessmentData', () => {
    it('should fetch assessment data successfully', async () => {
      const mockResponse = { data: [{ id: 1, rule: 'Rule1' }, { id: 2, rule: 'Rule2' }] };

      axios.get.mockResolvedValue(mockResponse);

      const result = await getAssessmentData();

      expect(axios.get).toHaveBeenCalledWith(GET_ASSESSMENT_RULES);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when the API call fails', async () => {
      const mockError = new Error('Network Error');

      axios.get.mockRejectedValue(mockError);

      await expect(getAssessmentData()).rejects.toThrow('Network Error');
      expect(axios.get).toHaveBeenCalledWith(GET_ASSESSMENT_RULES);
    });
  });

  describe('GenerateAssesmentNo', () => {
    it('should generate assessment number successfully', async () => {
      const mockResponse = { data: { assessNo: '12345' }, status: 200 };

      axios.get.mockResolvedValue(mockResponse);

      const result = await GenerateAssesmentNo();

      expect(axios.get).toHaveBeenCalledWith(GENERATE_ASSESSNO_NO);
      expect(result).toEqual({ message: mockResponse.data, status: 200, res: mockResponse });
    });

    it('should throw an error when the API call fails', async () => {
      const mockError = new Error('Network Error');

      axios.get.mockRejectedValue(mockError);

      await expect(GenerateAssesmentNo()).rejects.toThrow('Network Error');
      expect(axios.get).toHaveBeenCalledWith(GENERATE_ASSESSNO_NO);
    });
  });
});