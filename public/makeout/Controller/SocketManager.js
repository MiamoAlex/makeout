export class SocketManager {
    constructor() {

        this.socket = io("ws://localhost:3002");

        // send a message to the server
        this.socket.emit("hello from client", 5, "6", { 7: Uint8Array.from([8]) });

        // receive a message from the server
        this.socket.onAny((...args) => {
            console.log(args);
        });
    }

    sendAny(text) {
        this.socket.emit('feur', text);
    }
}