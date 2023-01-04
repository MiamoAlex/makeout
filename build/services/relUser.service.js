var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import connection from "../utils/db.utils";
import DbService from "./db.service";
import { Table } from "./models/data.model";
/**
 * RelUser service class use to interact with the relation between users in the database
 *
 * @class RelUserService
 * @extends {DbService}
 */
class RelUserService extends DbService {
    constructor() {
        console.log("RelUserService Initialized");
        super(connection, Table.RelUser);
    }
    getLovers(nb) {
        return __awaiter(this, void 0, void 0, function* () {
            const lovers = yield this.query(`SELECT * FROM ${Table.User} ORDER BY RAND() LIMIT ${nb}`);
            return lovers;
        });
    }
    addRelUser(userId, loverId, choice) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.addOne({
                id_user_1: userId,
                id_user_2: loverId,
                choice: choice,
            });
        });
    }
    getMatchId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userMatch = (yield this.query(`SELECT * FROM ${Table.RelUser} WHERE id_user_1 = ${userId} AND choice = 1`)).map(match => match.id_user_2);
            const otherMatch = (yield this.query(`SELECT * FROM ${Table.RelUser} WHERE id_user_2 = ${userId} AND choice = 1`)).map(match => match.id_user_1);
            const match = userMatch.filter((id) => otherMatch.includes(id));
            return match;
        });
    }
}
export default new RelUserService();
