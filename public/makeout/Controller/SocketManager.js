export class SocketManager {
    constructor() {

        const socket = io("ws://localhost:3002");

        // send a message to the server
        socket.emit("hello from client", 5, "6", { 7: Uint8Array.from([8]) });

        // receive a message from the server
        socket.onAny((...args) => {
            console.log(args);
        });
    }

    sendAny(text) {
        socket.emit('feur', text);
    }
}