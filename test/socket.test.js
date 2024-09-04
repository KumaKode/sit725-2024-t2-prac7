const expect = require("chai").expect;
const io = require("socket.io-client");
const server = require("../server");

describe("Socket.IO Server", () => {
  let clientSocket;

  before((done) => {
    // Start the server before running tests
    server.listen(4000, () => {
      done();
    });
  });

  beforeEach((done) => {
    // Create a client connection before each test
    clientSocket = io.connect("http://localhost:4000", {
      "reconnection delay": 0,
      "reopen delay": 0,
      "force new connection": true,
    });

    clientSocket.on("connect", () => {
      done();
    });
  });

  afterEach((done) => {
    // Disconnect the client after each test
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
    done();
  });

  after((done) => {
    // Close the server after all tests
    server.close();
    done();
  });

  it("should receive a message when sent by a client", (done) => {
    const testMessage = "Hello, World!";

    // Listen for the 'message' event
    clientSocket.on("message", (msg) => {
      expect(msg).to.equal(testMessage);
      done();
    });

    // Emit a 'message' event from the client
    clientSocket.emit("message", testMessage);
  });

  it("should broadcast messages to all clients", (done) => {
    const secondClient = io.connect("http://localhost:4000", {
      "reconnection delay": 0,
      "reopen delay": 0,
      "force new connection": true,
    });

    const testMessage = "Broadcast message";

    secondClient.on("connect", () => {
      secondClient.on("message", (msg) => {
        expect(msg).to.equal(testMessage);
        secondClient.disconnect();
        done();
      });

      clientSocket.emit("message", testMessage);
    });
  });
});
