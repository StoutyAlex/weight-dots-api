const dbHandler = require('../../testHelpers/dbHandler');
const usersService = require('../../../app/services/users.service');
const socket = require('../../../app/services/socket');

jest.mock('../../../app/services/socket');

describe('User Model ', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  })

  beforeAll(async () => await dbHandler.connect());

  afterEach(async () => await dbHandler.clearDatabase());

  afterAll(async () => await dbHandler.closeDatabase());

  it('can be created correctly', async () => {
    const userComplete = {
      username: 'username',
      password: 'password',
    };

    const socketSpy = jest.spyOn(socket, 'broadcastAll');

    const user = await usersService.create(userComplete)

    expect(socketSpy).toHaveBeenCalledWith('users', user);
  });

  it('can be deleted correctly', async () => {
    const userComplete = {
      username: 'username',
      password: 'password',
    };

    const socketSpy = jest.spyOn(socket, 'broadcastAll');

    const user = await usersService.create(userComplete);
    await usersService.delete(user._id);

    expect(socketSpy).toHaveBeenCalledTimes(2);
  });
});
