var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * an abstract class of the Database service class used as a base for all database services.
 * @class DbService
 * @classdesc Database service class
 *
 */
class DbService {
    constructor(connection, tableName) {
        this.db = connection;
        this.tableName = tableName;
    }
    /**
     * This function isn't made to be widely used,
     * but it allows the user to run a raw sql request
     *
     * @param sql a sql request to execute
     * @returns the result of the query
     */
    query(sql) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.db.query(sql);
            return result;
        });
    }
    /**
     * This function is made to get a row from the database by its id
     *
     * @param id a sql request to execute
     * @returns the row found by the id or undefined if not found
     */
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM ${this.tableName} WHERE id = ${id}`;
            const [result] = yield this.db.query(sql);
            return result === null || result === void 0 ? void 0 : result[0];
        });
    }
    /**
     * This function is made to get a row from the database by its id
     *
     * @returns the list of all rows
     */
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM ${this.tableName}`;
            const [result] = yield this.db.query(sql);
            return result;
        });
    }
    /**
     * This function is used to add a row to the database
     *
     * @returns the inserted id or null
     */
    addOne(object) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.db.query(`insert into ${this.tableName} (
        ${Object.keys(object).join(", ")}) 
      values (
        ${Object.values(object)
                .map((value) => `'${value}'`)
                .join(", ")});`);
            return (result === null || result === void 0 ? void 0 : result.insertId) || null;
        });
    }
}
export default DbService;
