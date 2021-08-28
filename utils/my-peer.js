import Emitter from 'events';

export default class MyPeer {
  constructor(Peer, puid) {
    this.stream = new Emitter();
    this.puid = puid || null;
    this.peer = new Peer();
    this.connections = [];
    this.initializePeer();
  }

  initializePeer() {
    this.peer.on('open', () => {
      this.id = this.peer.id;
      this.peer.on('connection', connection => {
        connection.on('data', this.receiveEvent.bind(this));
        this.connections[connection.peer] = connection;
      });
      if (this.puid) this.connectToPeer();
    });
  }

  connectToPeer() {
    const connection = this.peer.connect(this.puid);
    connection.on('data', this.receiveEvent.bind(this));
    this.connections[connection.peer] = connection;
  }

  sendEvent(type, payload, ids = [this.id]) {
    for (const connId in this.connections) {
      if (ids.includes(connId)) continue;
      const connection = this.connections[connId];
      connection.send({ids, type, payload});
    }
  }

  receiveEvent(data) {
    const {ids, type, payload} = data;
    this.sendEvent(type, payload, [...ids, this.id]);
    this.stream.emit(type, payload);
  }
}
