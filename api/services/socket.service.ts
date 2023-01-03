import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import appConfig from "../config/app.config";

/**
 * Message service class used to send messages to the client
 *
 */
class SocketService {

    private io: Server;
    private socketIdMap: Record<string, number | null> = {};


    constructor(server: Server) {
        this.socketIdMap = {};
        this.io = server;
        console.log("SocketService Initialized");

        // connection event
        this.io.on('connection', this.onConnection);

    }

    onConnection(socket: any) {
        this.socketIdMap[socket.id] = null;

        socket.on('disconnect', () => {
            delete this.socketIdMap[socket.id];
        });

        socket.on('token', (token: any) => {
            jwt.verify(token, appConfig.JWT_SECRET, (err: any, decoded: any) => {
                if (!err) this.socketIdMap[socket.id] = decoded.id;
            });
        });

        socket.on('sendMessage', (message: any) => { })
        socket.on('getMessages', (message: any) => { })

        socket.on('bug', (id: any) => {
            Object.entries(this.socketIdMap).filter((entry) => {
                entry[1] === id
            }).forEach((entry) => {
                this.io.to(entry[0]).emit('bug', id);
            })
        })
    }

    emit(id: number, event: string, params: any) {
        Object.entries(this.socketIdMap).filter((entry) => {
            entry[1] === id
        }).forEach((entry) => {
            this.io.to(entry[0]).emit(event, ...params);
        })
    }
}


export default SocketService;