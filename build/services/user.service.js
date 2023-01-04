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
import bcrypt from "bcrypt";
import DbService from "./db.service.js";
import { Table } from "./models/data.model.js";
/**
 * User service class use to interact with the user table in the database
 *
 * @class UserService
 * @extends {DbService}
 */
class UserService extends DbService {
    constructor() {
        console.log("UserService Initialized");
        super(connection, Table.User);
    }
    /**
     *  This function is made to add a user to the database
     *
     * @param username
     * @param password
     * @param birthdate
     * @returns TODO
     */
    addUser(username, password, birthdate) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashPassword = yield bcrypt.hash(password, 10);
            return yield this.addOne({
                username,
                birthdate,
                password: hashPassword,
            });
        });
    }
    /**
     * This function is made to get a user from the database by its username
     *
     * @param id thi id of the user to get
     * @returns the user found by the id or undefined if not found
     */
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getById(id);
        });
    }
    /**
     *
     * @param username the username of the user to get
     * @returns the user found by the username or undefined if not found
     */
    getUserByUsernameAndPassword(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.query(`SELECT * FROM ${Table.User} WHERE username = "${username}"`);
            if (!users[0]) {
                return undefined;
            }
            const user = users[0];
            const isPasswordValid = yield bcrypt.compare(password, user.password || "");
            if (!isPasswordValid) {
                return undefined;
            }
            return user;
        });
    }
    getLovers(userId, nb) {
        const lovers = this.query(`SELECT * FROM ${Table.User} 
        WHERE id != ${userId} AND image1 IS NOT NULL AND id NOT IN (
          SELECT id_user_2 FROM ${Table.RelUser} 
          WHERE id_user_1 = ${userId}) 
        ORDER BY RAND() LIMIT ${nb}`);
        return lovers;
    }
    updateUser(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query(`
      UPDATE ${Table.User}
      SET ${Object.keys(user).map((key) => user[key] ? `${key} = "${user[key]}"` : false).filter(Boolean).join(", ")}
      WHERE id = ${id}
    `);
            const updatedUser = yield this.getById(id);
            // if (updatedUser) {
            //   Object.keys(updatedUser).forEach((key) => {
            //     if (!updatedUser[key]) updatedUser[key] = null;
            //   });
            // }
            return updatedUser;
        });
    }
}
export default new UserService();
