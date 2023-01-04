var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import appConfig from "../config/app.config.js";
import MessageService from "./message.service.js";
import moment from "moment";
/**
 * Message service class used to send messages to the client
 *
 */
class SocketService {
    constructor(server) {
        SocketService.io = server;
        console.log("SocketService Initialized");
        // connection event
        SocketService.io.on('connection', this.onConnection);
    }
    static getInstance() {
        return SocketService.instance;
    }
    static setInstance(server) {
        SocketService.instance = new SocketService(server);
    }
    onConnection(socket) {
        if (!SocketService.socketIdMap)
            SocketService.socketIdMap = {};
        SocketService.socketIdMap[socket.id] = null;
        socket.on('disconnect', () => {
            delete SocketService.socketIdMap[socket.id];
        });
        socket.on('token', (token) => {
            jwt.verify(token, appConfig.JWT_SECRET, (err, decoded) => {
                if (!err)
                    SocketService.socketIdMap[socket.id] = decoded.id;
            });
        });
        socket.on('sendMessage', (userId, message) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = SocketService.socketIdMap[socket.id];
                if (!id || !userId)
                    throw new Error("Missing destination lovers id");
                const result = yield MessageService.addMessage(id, userId, message, moment().format("YYYY-MM-DD HH:mm:ss"));
                if (!result) {
                    throw new Error("Error while trying to send message");
                }
                const mess = yield MessageService.getMessages(userId, id);
                let resultMessages = mess.map((mes) => {
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
                resultMessages = mess.map((mes) => {
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
                    return entry[1] == userId;
                }).forEach((entry) => {
                    console.log(entry);
                    SocketService.io.to(entry[0]).emit('getMessages', resultMessages);
                });
            }
            catch (err) {
                console.error(err);
            }
        }));
        socket.on('getMessages', (userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = SocketService.socketIdMap[socket.id];
                if (!id || !userId)
                    throw new Error("Missing destination lovers id");
                const message = yield MessageService.getMessages(userId, id);
                const result = message.map((message) => {
                    return {
                        id: message.id,
                        content: message.content,
                        date: message.date,
                        sender: message.id_user_1 == id,
                    };
                });
                socket.emit('getMessages', result);
            }
            catch (error) {
                console.error(error);
            }
        }));
        socket.on('bug', (id) => {
            Object.entries(SocketService.socketIdMap).filter((entry) => {
                entry[1] === id;
            }).forEach((entry) => {
                SocketService.io.to(entry[0]).emit('bug', id);
            });
        });
    }
    emit(id, event, params) {
        Object.entries(SocketService.socketIdMap).filter((entry) => {
            return entry[1] === id;
        }).forEach((entry) => {
            SocketService.io.to(entry[0]).emit(event, params);
        });
    }
}
SocketService.socketIdMap = {};
export default SocketService;
