import connection from "../utils/db.utils";
import bcrypt from "bcrypt";
import DbService from "./db.service";
import { Table, User } from "./models/data.model";

/**
 * User service class use to interact with the user table in the database
 *
 * @class UserService
 * @extends {DbService}
 */
class UserService extends DbService<User> {
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
  async addUser(
    username: string,
    password: string,
    birthdate: string
  ): Promise<number | null> {
    const hashPassword: string = await bcrypt.hash(password, 10);
    return await this.addOne({
      username,
      birthdate,
      password: hashPassword,
    });
  }

  /**
   * This function is made to get a user from the database by its username
   *
   * @param id thi id of the user to get
   * @returns the user found by the id or undefined if not found
   */
  async getUserById(id: any): Promise<User | undefined> {
    return await this.getById(id);
  }

  /**
   *
   * @param username the username of the user to get
   * @returns the user found by the username or undefined if not found
   */
  async getUserByUsernameAndPassword(
    username: string,
    password: string
  ): Promise<User | undefined> {
    const users = await this.query(
      `SELECT * FROM ${Table.User} WHERE username = "${username}"`
    );

    if (!users[0]) {
      return undefined;
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return undefined;
    }

    return user;
  }

  getLovers(userId: any, nb: number): Promise<User[]> {
    const lovers = this.query(
      `SELECT * FROM ${Table.User} 
        WHERE id != ${userId} AND id NOT IN (
          SELECT id_user_2 FROM ${Table.RelUser} 
          WHERE id_user_1 = ${userId}) 
        ORDER BY RAND() LIMIT ${nb}`
    );

    return lovers;
  }

  async updateUser(id: number, user: Partial<User>) {
    await this.query(`
      UPDATE ${Table.User}
      SET ${Object.keys(user).map((key) => user[key] ? `${key} = "${user[key]}"` : false).filter(Boolean).join(", ")}
      WHERE id = ${id}
    `);
    
    return this.getById(id);
  }

}

export default new UserService();
