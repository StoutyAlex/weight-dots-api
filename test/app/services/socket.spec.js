const io = require('socket.io');

const sockets = require('../../../app/services/socket');

jest.mock('socket.io', () => jest.fn().mockReturnValue({
  on: jest.fn(),
  close: jest.fn(),
  adapter: jest.fn(),
  emit: jest.fn(),
  to: jest.fn().mockReturnThis(),
}));

const room = 'room';
const mockData = {
  foo: 'bar',
};

let mockSocket;

describe('Sockets', () => {
  describe('setup', () => {
    it('should setup socket with correct parameters', () => {
      mockSocket = io();
      sockets.setup('server');
      expect(mockSocket.adapter).toHaveBeenCalled();
    });
  });

  describe('broadcast', () => {
    beforeEach(() => {
      mockSocket = io();
      sockets.setup('server');
    });

    afterEach(() => {
      mockSocket.on.mockReset();
      mockSocket.close.mockReset();
      mockSocket.adapter.mockReset();
      mockSocket.emit.mockReset();
      mockSocket.to.mockReset();
    });

    it('should emit data to clients', () => {
      sockets.broadcast(room, mockData);
      expect(mockSocket.to).toHaveBeenCalledWith(room);
      expect(mockSocket.emit).toHaveBeenCalledWith(room, mockData);
    });

    it('should not emit data when no room provided', () => {
      sockets.broadcast(null, mockData);
      expect(mockSocket.emit).not.toHaveBeenCalled();
    });

    it('should not emit data when no data provided', () => {
      sockets.broadcast(room, null);
      expect(mockSocket.emit).not.toHaveBeenCalled();
    });

    it('should close socket', () => {
      const callback = jest.fn();
      
      sockets.close(callback);

      expect(mockSocket.close).toHaveBeenCalledWith(callback);
    });
  });
});