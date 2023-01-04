import { Request, Response } from "express";
import MessageService from "../services/message.service";
import RelUserService from "../services/relUser.service";
import UserService from "../services/user.service";
import moment from "moment";

/**
 * Controller to send message
 * @param req
 * @param res
 * @returns
 */
export const sendMessage = async (req: Request, res: Response) => {
  try {

    const userId = parseInt(req.headers.userId?.toString() || "");

    const id = parseInt(req.params.id?.toString());

    if(!id) {
      return res.status(400).json({ error: "Missing destination lovers id" });
    }

    const result = await MessageService.addMessage(userId, id, req.body.content, moment().format("YYYY-MM-DD HH:mm:ss"));

    if(!result) {
      return res.status(400).json({ error: "Error while trying to send message" });
    }

    // return the token
    return res.status(200).json({ message: "Message sent" });
  } catch (err: any) {
    return res.status(400).json({ error: "Error while trying to register a message", err });
  }
};

/**
 * Controller to get a users message
 * @param req
 * @param res
 * @returns
 */
export const getMessage = async (req: Request, res: Response) => {
  try {

    const userId = parseInt(req.headers.userId?.toString() || "");

    const id = parseInt(req.params.id?.toString());

    if(!id) {
      return res.status(400).json({ error: "Missing destination lovers id" });
    }

    const message = await MessageService.getMessages(userId, id);

    const result = message.map((message) => {
      return {
        id: message.id,
        content: message.content,
        date: message.date,
        sender: message.id_user_1 === userId,
      };
    });

    // return the token
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ error: "Error while trying to register a message", err });
  }
};



/**
 * Controller to get a users chats
 * @param req
 * @param res
 * @returns
 */
export const getChats = async (req: Request, res: Response) => {
  try {

    const userId = parseInt(req.headers.userId?.toString() || "");

    const matchId = await RelUserService.getMatchId(userId);
    const lovers = await Promise.all(matchId.map(id => UserService.getUserById(id)));
    const lastMessage = await Promise.all(matchId.map(id => MessageService.getLastMessage(userId, id)));

    const result = lovers.map((lover) => ({
      id: lover?.id,
      username: lover?.username,
      image1: lover?.image1,
      birthdate: lover?.birthdate,
      lastMessage: lastMessage.find(([message]) => message?.id_user_1 === lover?.id || message?.id_user_2 === lover?.id)?.map((message) => message?.content)?.[0],
    }))

    // return the token
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ error: "Error while trying to register a message", err });
  }
};