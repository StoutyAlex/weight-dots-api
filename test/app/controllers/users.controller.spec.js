const request = require('supertest');
const app = require('../../../app');
const usersService = require('../../../app/services/users.service');

jest.mock('../../../app/services/users.service');

const mockUsers = [
  { '_id': 'user-id-1' },
  { '_id': 'user-id-2' },
  { '_id': 'user-id-3' }
];

describe('/api/users', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    it('should successfully create a source and return the expected response', (done) => {
      jest.spyOn(usersService, 'getAll').mockResolvedValue(mockUsers);
  
      request(app)
        .get('/api/users')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.success).toBe(true);
          expect(response.body.data).toEqual(mockUsers);
          done();
        });
    });

    it('should return error if user does not exist', (done) => {
      jest.spyOn(usersService, 'getAll').mockImplementation(() => { throw new Error('Error getting users') });
  
      request(app)
        .get('/api/users')
        .expect('Content-Type', /json/)
        .expect(500)
        .then((response) => {
          expect(response.body.success).toBe(false);
          done();
        });
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should successfully create a source and return the expected response', (done) => {
      jest.spyOn(usersService, 'delete').mockResolvedValue(mockUsers[0]);
  
      request(app)
        .delete('/api/users/1234')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.success).toBe(true);
          expect(response.body.data).toEqual(mockUsers[0]);
          done();
        });
    });

    it('should successfully create a source and return the expected response', (done) => {
      jest.spyOn(usersService, 'delete').mockImplementation(() => { throw new Error('Error deleting user') });

      request(app)
        .delete('/api/users/1234')
        .expect('Content-Type', /json/)
        .expect(500)
        .then((response) => {
          expect(response.body.success).toBe(false);
          done();
        });
    });
  });

  describe('POST /api/users/login', () => {
    it('should successfully log in a user when the user exists and password is correct', (done) => {
      const loginSpy = jest.spyOn(usersService, 'login').mockResolvedValue(mockUsers[0]);
  
      const newUserRequest = {
        username: 'AlexStout',
        password: 'password'
      }

      request(app)
        .post('/api/users/login')
        .send(newUserRequest)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.success).toBe(true);
          expect(response.body.data).toEqual(mockUsers[0]);
          expect(loginSpy).toHaveBeenCalledWith(newUserRequest);
          done();
        });
    });

    it('should throw error when login throw error', (done) => {
      const loginSpy = jest.spyOn(usersService, 'login').mockImplementation(() => { throw new Error() });

      const newUserRequest = {
        username: 'AlexStout',
        password: 'password'
      }

      request(app)
        .post('/api/users/login')
        .send(newUserRequest)
        .expect('Content-Type', /json/)
        .expect(500)
        .then((response) => {
          expect(response.body.success).toBe(false);
          expect(loginSpy).toHaveBeenCalledWith(newUserRequest);
          done();
        });
    });
  });

  describe('POST /api/users/signup', () => {
    it('should successfully sign up a user', (done) => {
      const signupSpy = jest.spyOn(usersService, 'create');
      const loginSpy = jest.spyOn(usersService, 'login').mockResolvedValue(mockUsers[0]);
  
      const newUserRequest = {
        username: 'AlexStout',
        password: 'password'
      }

      request(app)
        .post('/api/users/signup')
        .send(newUserRequest)
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body.success).toBe(true);
          expect(response.body.data).toEqual(mockUsers[0]);
          expect(signupSpy).toHaveBeenCalledWith(newUserRequest);
          expect(loginSpy).toHaveBeenCalledWith(newUserRequest);
          done();
        });
    });

    it('should return error when error sign up a user', (done) => {
      const signupSpy = jest.spyOn(usersService, 'create').mockImplementation(() => { throw new Error() });
      const loginSpy = jest.spyOn(usersService, 'login').mockResolvedValue(mockUsers[0]);
  
      const newUserRequest = {
        username: 'AlexStout',
        password: 'password'
      }

      request(app)
        .post('/api/users/signup')
        .send(newUserRequest)
        .expect('Content-Type', /json/)
        .expect(500)
        .then((response) => {
          expect(response.body.success).toBe(false);
          expect(signupSpy).toHaveBeenCalledWith(newUserRequest);
          expect(loginSpy).not.toHaveBeenCalledWith(newUserRequest);
          done();
        });
    });
  });
});
