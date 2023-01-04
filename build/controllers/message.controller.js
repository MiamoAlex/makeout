var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import MessageService from "../services/message.service";
import RelUserService from "../services/relUser.service";
import UserService from "../services/user.service";
import moment from "moment";
/**
 * Controller to send message
 * @param req
 * @param res
 * @returns
 */
export const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = parseInt(((_a = req.headers.userId) === null || _a === void 0 ? void 0 : _a.toString()) || "");
        const id = parseInt((_b = req.params.id) === null || _b === void 0 ? void 0 : _b.toString());
        if (!id) {
            return res.status(400).json({ error: "Missing destination lovers id" });
        }
        const result = yield MessageService.addMessage(userId, id, req.body.content, moment().format("YYYY-MM-DD HH:mm:ss"));
        if (!result) {
            return res.status(400).json({ error: "Error while trying to send message" });
        }
        // return the token
        return res.status(200).json({ message: "Message sent" });
    }
    catch (err) {
        return res.status(400).json({ error: "Error while trying to register a message", err });
    }
});
/**
 * Controller to get a users message
 * @param req
 * @param res
 * @returns
 */
export const getMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const userId = parseInt(((_c = req.headers.userId) === null || _c === void 0 ? void 0 : _c.toString()) || "");
        const id = parseInt((_d = req.params.id) === null || _d === void 0 ? void 0 : _d.toString());
        if (!id) {
            return res.status(400).json({ error: "Missing destination lovers id" });
        }
        const message = yield MessageService.getMessages(userId, id);
        const result = message.map((message) => {
            return {
                id: message.id,
                content: message.content,
                date: message.date,
                sender: message.id_user_1 === userId,
            };
        });
        // return the token
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(400).json({ error: "Error while trying to register a message", err });
    }
});
/**
 * Controller to get a users chats
 * @param req
 * @param res
 * @returns
 */
export const getChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const userId = parseInt(((_e = req.headers.userId) === null || _e === void 0 ? void 0 : _e.toString()) || "");
        const matchId = yield RelUserService.getMatchId(userId);
        const lovers = yield Promise.all(matchId.map(id => UserService.getUserById(id)));
        const lastMessage = yield Promise.all(matchId.map(id => MessageService.getLastMessage(userId, id)));
        const result = lovers.map((lover) => {
            var _a, _b;
            return ({
                id: lover === null || lover === void 0 ? void 0 : lover.id,
                username: lover === null || lover === void 0 ? void 0 : lover.username,
                image1: lover === null || lover === void 0 ? void 0 : lover.image1,
                birthdate: lover === null || lover === void 0 ? void 0 : lover.birthdate,
                lastMessage: (_b = (_a = lastMessage.find(([message]) => (message === null || message === void 0 ? void 0 : message.id_user_1) === (lover === null || lover === void 0 ? void 0 : lover.id) || (message === null || message === void 0 ? void 0 : message.id_user_2) === (lover === null || lover === void 0 ? void 0 : lover.id))) === null || _a === void 0 ? void 0 : _a.map((message) => message === null || message === void 0 ? void 0 : message.content)) === null || _b === void 0 ? void 0 : _b[0],
            });
        });
        // return the token
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(400).json({ error: "Error while trying to register a message", err });
    }
});
