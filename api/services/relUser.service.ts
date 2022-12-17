import connection from "../utils/db.utils";
import bcrypt from "bcrypt";
import DbService from "./db.service";
import { Table, RelUser, RelUserStatus } from "./models/data.model";

/**
 * RelUser service class use to interact with the relation between users in the database
 *
 * @class RelUserService
 * @extends {DbService}
 */
class RelUserService extends DbService<RelUser> {
  constructor() {
    console.log("RelUserService Initialized");
    super(connection, Table.RelUser);
  }

  async getLovers(nb: number) {
    const lovers = await this.query(
      `SELECT * FROM ${Table.User} ORDER BY RAND() LIMIT ${nb}`
    );

    return lovers;
  }

  async addRelUser(userId: number, loverId: number, choice: RelUserStatus) {
    this.addOne({
      id_user_1: userId,
      id_user_2: loverId,
      choice: choice,
    });
  }
}

export default new RelUserService();
