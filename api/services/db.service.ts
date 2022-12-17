import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Pool } from "mysql2/promise";

/**
 * an abstract class of the Database service class used as a base for all database services.
 * @class DbService
 * @classdesc Database service class
 *
 */
abstract class DbService<T extends RowDataPacket> {
  db: Pool;
  tableName: string;

  constructor(connection: Pool, tableName: string) {
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
  protected async query(sql: string): Promise<T[]> {
    const [result] = await this.db.query<T[]>(sql);
    return result;
  }

  /**
   * This function is made to get a row from the database by its id
   *
   * @param id a sql request to execute
   * @returns the row found by the id or undefined if not found
   */
  protected async getById(id: number): Promise<T | undefined> {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ${id}`;
    const [result] = await this.db.query<T[]>(sql);
    return result?.[0];
  }

  /**
   * This function is made to get a row from the database by its id
   *
   * @returns the list of all rows
   */
  protected async getAll(): Promise<T[]> {
    const sql = `SELECT * FROM ${this.tableName}`;
    const [result] = await this.db.query<T[]>(sql);
    return result;
  }

  /**
   * This function is used to add a row to the database
   *
   * @returns the inserted id or null
   */
  protected async addOne(object: Object): Promise<number | null> {
    const [result] = await this.db.query<ResultSetHeader>(
      `insert into ${this.tableName} (
        ${Object.keys(object).join(", ")}) 
      values (
        ${Object.values(object)
          .map((value) => `'${value}'`)
          .join(", ")});`
    );
    return result?.insertId || null;
  }
}

export default DbService;