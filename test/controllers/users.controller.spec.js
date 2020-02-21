const request = require('supertest');
const app = require('../../app');
const usersService = require('../../app/services/users.service');

jest.mock('../../app/services/users.service');

const mockUsers = [
  { '_id': 'user-id-1' },
  { '_id': 'user-id-2' },
  { '_id': 'user-id-3' }
];

describe('/api/users', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully create a source and return the expected response', async () => {
    jest.spyOn(usersService, 'getAll').mockResolvedValue(mockUsers);

    request(app)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(mockUsers);
      });
  });

  it('should successfully create a source and return the expected response', async () => {
    jest.spyOn(usersService, '_delete').mockResolvedValue(mockUsers[0]);

    request(app)
      .delete('/api/users/1234')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(mockUsers[0]);
      });
  });
});
