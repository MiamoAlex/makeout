import connection from "../utils/db.utils";
import bcrypt from "bcrypt";
import DbService from "./db.service";
import { Table, RelUser, RelUserStatus } from "./models/data.model";
import { match } from "assert";

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

  async getMatchId(userId: number) {
    const userMatch = (await this.query(
      `SELECT * FROM ${Table.RelUser} WHERE id_user_1 = ${userId} AND choice = 1`
    )).map(match => match.id_user_2);

    const otherMatch = (await this.query(
      `SELECT * FROM ${Table.RelUser} WHERE id_user_2 = ${userId} AND choice = 1`
    )).map(match => match.id_user_1);

    const match = userMatch.filter((id) => otherMatch.includes(id));

    return match;
  }

}

export default new RelUserService();
