const response = require('../../../app/helpers/response');

const json = jest.fn();

const mockResponse = {
  status: jest.fn(() => ({
    json,
  })),
};

describe('Response', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('success', () => {
    it('returns default status of 200 when not given status', () => {
      const status = 200;
  
      response.success(mockResponse, {});
  
      expect(mockResponse.status).toHaveBeenCalledWith(status);
    });

    it('returns givne status if part of data object and trim it off', () => {
      const status = 202;
      const mockData = { statusCode: status };

      response.success(mockResponse, mockData);
  
      expect(mockResponse.status).toHaveBeenCalledWith(status);
      expect(mockData.statusCode).toBe(undefined);
    });
  
    it('returns given status', () => {
      const status = 999;
  
      response.success(mockResponse, {}, status);
  
      expect(mockResponse.status).toHaveBeenCalledWith(status);
    });
  
    it('returns correct data object with success', () => {
      const mockData = { data: true };
      const expectedData = { success: true, data: mockData };

      response.success(mockResponse, mockData);

      expect(json).toHaveBeenCalledWith(expectedData);
    })
  });

  describe('error', () => {
    it('returns default status of 200 when not given status', () => {
      const status = 500;
  
      response.error(mockResponse, {});
  
      expect(mockResponse.status).toHaveBeenCalledWith(status);
    });

    it('returns givne status if part of data object and trim it off', () => {
      const status = 404;
      const mockData = { statusCode: status };

      response.error(mockResponse, mockData);
  
      expect(mockResponse.status).toHaveBeenCalledWith(status);
      expect(mockData.statusCode).toBe(undefined);
    });
  
    it('returns given status', () => {
      const status = 404;
  
      response.error(mockResponse, {}, status);
  
      expect(mockResponse.status).toHaveBeenCalledWith(status);
    });
  
    it('returns correct data object with success', () => {
      const mockData = { data: false };
      const expectedData = { success: false, error: mockData };

      response.error(mockResponse, mockData);

      expect(json).toHaveBeenCalledWith(expectedData);
    });
  });
});
