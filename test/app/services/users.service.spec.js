const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const dbHandler = require('../../testHelpers/dbHandler');
const usersService = require('../../../app/services/users.service');
const User = require('../../../app/models/users.model');

jest.mock('../../../app/services/socket');

const mockData = [
  {
    username: 'test-user-1',
    password: 'password-1',
    hash: 'hash-1'
  },
  {
    username: 'test-user-2',
    password: 'password-2',
    hash: 'hash-2'
  },
  {
    username: 'test-user-3',
    password: 'password-3',
    hash: 'hash-3'
  },
];

let mockDatabase = [];
describe('Users Service', () => {

  beforeEach(async () => await dbHandler.connect());

  afterEach(async () => await dbHandler.closeDatabase());

  describe('CREATE', () => {

    beforeEach(() => {
      jest.clearAllMocks();
      mockData.forEach((userData) => {
        const user = new User(userData);
        mockDatabase.push(user);
        user.save();
      })
    })
    
    afterEach(async () => {
      await dbHandler.clearDatabase();
      mockDatabase = [];
    });
  
    it('Creates a new user', async() => {
      const newUser = {
        username: 'test-user',
        password: 'test-password',
      };
  
      await usersService.create(newUser);
  
      const count = await User.count();
      expect(count).toBe(mockDatabase.length + 1);
    });
  
    it('Creates a new user with hash and no password', async() => {
      const newUser = {
        username: 'test-user',
        password: 'test-password',
      };
      const mockHash = 'hashed-password';
  
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue(mockHash);
  
      const user = await usersService.create(newUser);
  
      expect(user.password).toBe(undefined);
      expect(user.hash).toBe(mockHash);
    });

    it('does not create a user when one with username already exists', async (done) => {
      const newUser = {
        username: mockDatabase[0].username,
        password: 'test-password',
      };

      jest.spyOn(User, 'findOne').mockReturnValue(true);

      try {
        await usersService.create(newUser);
      } catch (error) {
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('Username \'test-user-1\' is already taken.');
        done();
      }
    });
  });

  describe('DELETE', () => {

    beforeEach(() => {
      jest.clearAllMocks();
      mockData.forEach((userData) => {
        const user = new User(userData);
        mockDatabase.push(user);
        user.save();
      })
    })

    afterEach(async () => {
      await dbHandler.clearDatabase();
      mockDatabase = [];
    });
  
    // add function so it can be deleted via username instead of id
    it('should delete a user when given an id', async () => {
      await usersService.delete(mockDatabase[0]._id);

      const count = await User.count();

      expect(count).toBe(3);
    });
  });

  describe('LOGIN', () => {

    beforeEach(() => {
      jest.clearAllMocks();
      mockData.forEach((userData) => {
        const user = new User(userData);
        mockDatabase.push(user);
        user.save();
      })
    })

    afterEach(async () => {
      await dbHandler.clearDatabase();
      mockDatabase = [];
    });
  
    // add function so it can be deleted via username instead of id
    it('should return a login token when user is logged in', async () => {
      const loggingInUser = mockData[0];
      const mockToken = 'mock-token';

      jest.spyOn(User, 'findOne').mockResolvedValue({
        toObject: () => ({
          hash: 'fake-hash',
          ...loggingInUser
        })
      });

      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      jest.spyOn(jwt, 'sign').mockReturnValue(mockToken);

      const user = await usersService.login(loggingInUser);

      expect(user.token).toBe(mockToken);
      expect(user.hash).toBe(undefined);
      expect(user.username).toBe(loggingInUser.username);
    });

    it('should return 404 when user does not exist', async (done) => {
      const loggingInUser = mockData[0];

      jest.spyOn(User, 'findOne').mockResolvedValue(false);

      try {
        await usersService.login(loggingInUser);
      } catch (error) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe('Could not find user at login...');
        done();
      }
    });
  });

  describe('GET ALL', () => {

    beforeEach(() => {
      jest.clearAllMocks();
      mockData.forEach((userData) => {
        const user = new User(userData);
        mockDatabase.push(user);
        user.save();
      })
    })

    afterEach(async () => {
      await dbHandler.clearDatabase();
      mockDatabase = [];
    });
  
    // add function so it can be deleted via username instead of id
    it('should delete a user when given an id', async () => {
      await usersService.getAll();
      expect(true).toBe(true);
    });
  });
});