var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import connection from "../utils/db.utils.js";
import DbService from "./db.service.js";
import { Table } from "./models/data.model.js";
/**
 * Message service class use to interact with messages in the database
 *
 * @class MessageService
 * @extends {DbService}
 */
class MessageService extends DbService {
    constructor() {
        console.log("MessageService Initialized");
        super(connection, Table.Message);
    }
    /**
     * Add a message to the database
     *
     * @param id_user_1
     * @param id_user_2
     * @param content
     * @param date
     */
    addMessage(id_user_1, id_user_2, content, date) {
        content = content.replaceAll(/'/g, "\\'");
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query(`insert into message (id_user_1, id_user_2, content, date) values (${id_user_1}, ${id_user_2}, '${content}', '${date}')`);
        });
    }
    getMessages(id_user_1, id_user_2) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query(`
      SELECT * FROM message
      WHERE (id_user_1 = ${id_user_1} AND id_user_2 = ${id_user_2})
      OR (id_user_1 = ${id_user_2} AND id_user_2 = ${id_user_1})
      ORDER BY ID DESC
      LIMIT 100
    `);
        });
    }
    getLastMessage(id_user_1, id_user_2) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query(`
      SELECT * FROM message
      WHERE (id_user_1 = ${id_user_1} AND id_user_2 = ${id_user_2})
      OR (id_user_1 = ${id_user_2} AND id_user_2 = ${id_user_1})
      ORDER BY date DESC
      LIMIT 1
    `);
        });
    }
}
export default new MessageService();
