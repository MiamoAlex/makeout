import connection from "../utils/db.utils";
import DbService from "./db.service";
import { Table, Message } from "./models/data.model";

/**
 * Message service class use to interact with messages in the database
 *
 * @class MessageService
 * @extends {DbService}
 */
class MessageService extends DbService<Message> {
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
  async addMessage(
    id_user_1: number,
    id_user_2: number,
    content: string,
    date: string
  ) {
    return await this.addOne({
      id_user_1,
      id_user_2,
      content,
      date,
    });
  }

  async getMessages(id_user_1: number, id_user_2: number) {
    return await this.query(`
      SELECT * FROM message
      WHERE (id_user_1 = ${id_user_1} AND id_user_2 = ${id_user_2})
      OR (id_user_1 = ${id_user_2} AND id_user_2 = ${id_user_1})
    `);
  }

  async getLastMessage(id_user_1: number, id_user_2: number) {  
    return await this.query(`
      SELECT * FROM message
      WHERE (id_user_1 = ${id_user_1} AND id_user_2 = ${id_user_2})
      OR (id_user_1 = ${id_user_2} AND id_user_2 = ${id_user_1})
      ORDER BY date DESC
      LIMIT 1
    `);
    
  }
}

export default new MessageService();
