import { RowDataPacket } from "mysql2";

// #region DataBase Table

/**
 * an enum of the database tables
 */
export enum Table {
  User = "user",
  RelUser = "r_user",
  Message = "message",
}

// #endregion DataBase Table

interface BasicDataModel extends RowDataPacket {
  id: number;
}

/**
 * the user model
 */
export interface User extends BasicDataModel {
  username: string;
  password: string;
  birthdate: string;
}

/**
 * the user relation model
 */
export interface RelUser extends BasicDataModel {
  id_user_1: number,
  id_user_2: number,
  choice: boolean,
}

/**
 * the message model
 */
export interface Message extends BasicDataModel {
  id_user_1: number,
  id_user_2: number,
  date: string,
  content: string,
}


export enum RelUserStatus {
  Rejected = 0,
  Accepted = 1,
}