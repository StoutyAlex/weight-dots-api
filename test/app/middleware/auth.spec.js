const jwt = require('jsonwebtoken');
const auth = require('../../../app/middleware/auth');

const response = require('../../../app/helpers/response');

jest.mock('../../../app/helpers/response');

const mockRequest = {
  header: jest.fn().mockReturnValue('Bearer bearer-token'),
};

describe('Middleware: Auth', () => {
  let errorResponse;
  let nextCallback;

  beforeEach(() => {
    jest.clearAllMocks();

    errorResponse = jest.spyOn(response, 'error');
    nextCallback = jest.fn();
  });

  it('should return request with userId when token is valid', async () => {
    const userId = 'user-id';
    const jwtVerifyMock = jest.spyOn(jwt, 'verify').mockReturnValue({ id: userId });

    await auth(mockRequest, {}, nextCallback);

    expect(jwtVerifyMock).toHaveBeenCalled();
    expect(nextCallback).toHaveBeenCalled();
    expect(mockRequest.userId).toBe(userId);
  });

  it('should return 401 error when token is invalid', async () => {
    const jwtVerifyMock = jest.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error();
    });

    const response = {};

    await auth(mockRequest, response, nextCallback);

    expect(jwtVerifyMock).toHaveBeenCalled();
    expect(nextCallback).not.toHaveBeenCalled();
    expect(errorResponse).toHaveBeenCalledWith(response, {
      error: 'Not authorized to access this resource'
    }, 401);
  });
});
