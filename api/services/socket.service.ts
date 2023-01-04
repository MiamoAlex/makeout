import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import appConfig from "../config/app.config";
import MessageService from "./message.service";
import moment from "moment";

/**
 * Message service class used to send messages to the client
 *
 */
class SocketService {

    static io: Server;
    static socketIdMap: Record<string, number | null> = {};

    static instance: SocketService;

    static getInstance() {
        return SocketService.instance;
    }

    static setInstance(server: Server) {
        SocketService.instance = new SocketService(server);
    }

    constructor(server: Server) {
        SocketService.io = server;
        console.log("SocketService Initialized");

        // connection event
        SocketService.io.on('connection', this.onConnection);
    }

    onConnection(socket: any) {
        if (!SocketService.socketIdMap) SocketService.socketIdMap = {};

        SocketService.socketIdMap[socket.id] = null;
        socket.on('disconnect', () => {
            delete SocketService.socketIdMap[socket.id];
        });

        socket.on('token', (token: any) => {
            jwt.verify(token, appConfig.JWT_SECRET, (err: any, decoded: any) => {
                if (!err) SocketService.socketIdMap[socket.id] = decoded.id;
            });
        });

        socket.on('sendMessage', async (userId: any, message: any) => { 
            try {
                const id = SocketService.socketIdMap[socket.id];
            
                if (!id || !userId) throw new Error("Missing destination lovers id");
                const result = await MessageService.addMessage(id, userId, message, moment().format("YYYY-MM-DD HH:mm:ss"));
            
                if(!result) {
                  throw new Error("Error while trying to send message");
                }

                const mess = await MessageService.getMessages(userId, id);

                let resultMessages = mess.map((mes: any) => {
                    return {
                        id_user_1: mes.id_user_1,
                        id_user_2: mes.id_user_2,
                        id: mes.id,
                        content: mes.content,
                        date: mes.date,
                        sender: mes.id_user_1 == id,
                    };
                });
            
                socket.emit('getMessages', resultMessages);

                resultMessages = mess.map((mes: any) => {
                    return {
                        id_user_1: mes.id_user_1,
                        id_user_2: mes.id_user_2,
                        id: mes.id,
                        content: mes.content,
                        date: mes.date,
                        sender: mes.id_user_1 != id,
                    };
                });

                Object.entries(SocketService.socketIdMap).filter((entry) => {
                    return entry[1] == userId
                }).forEach((entry) => {
                    console.log(entry)
                    SocketService.io.to(entry[0]).emit('getMessages', resultMessages);
                })

              } catch (err: any) {
                console.error(err);
              }
        })
        socket.on('getMessages', async (userId: any) => {
            try {
                const id = SocketService.socketIdMap[socket.id];

                if (!id || !userId) throw new Error("Missing destination lovers id");

                const message = await MessageService.getMessages(userId, id);

                const result = message.map((message) => {
                    return {
                        id: message.id,
                        content: message.content,
                        date: message.date,
                        sender: message.id_user_1 == id,
                    };
                });

                socket.emit('getMessages', result);
            } catch (error) { 
                console.error(error);
            }
        })

        socket.on('bug', (id: any) => {
            Object.entries(SocketService.socketIdMap).filter((entry) => {
                entry[1] === id
            }).forEach((entry) => {
                SocketService.io.to(entry[0]).emit('bug', id);
            })
        })
    }

    emit(id: number, event: string, params: any) {
        Object.entries(SocketService.socketIdMap).filter((entry) => {
            return entry[1] === id
        }).forEach((entry) => {
            SocketService.io.to(entry[0]).emit(event, params);
        })
    }
}


export default SocketService;