import { Request, Response } from "express";
import UserService from "../services/user.service";
import RelUserService from "../services/relUser.service";
import { RelUserStatus, User } from "../services/models/data.model";
import SocketService from "../services/socket.service";
import fs from 'fs/promises';
/**
 * Controller to fetch lovers
 * @param req
 * @param res
 * @returns
 */
export const getLovers = async (req: Request, res: Response) => {
  try {

    if(!req?.query?.nb) {
      return res.status(400).json({ error: "Missing nb parameter" });
    }
    console.log(req.headers.userId);
    const lovers = await UserService.getLovers(req.headers.userId ,parseInt(req.query.nb.toString()));
    
    const result = lovers.map((lover: any) => ({
      id: lover.id,
      username: lover.username,
      birthdate: lover.birthdate,
      type : lover.type,
      language: lover.language,
      description : lover.description,
      image1: lover.image1,
      image2: lover.image2,
      image3: lover.image3,
      image4: lover.image4,
    }))

    // return the token
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ error: "Error while trying to lovers" });
  }
};

/**
 * Controller to reject lovers
 * @param req
 * @param res
 * @returns
 */
export const rejectLovers = async (req: Request, res: Response) => {
  try {

    const loverId = parseInt(req.params.id);
    const userId = parseInt(req.headers.userId?.toString() || "");

    if(!loverId) {
      return res.status(400).json({ error: "Missing loverId parameter" });
    }

    if(userId === loverId) {
      return res.status(400).json({ error: "You can't reject yourself" });
    }

    const rel = RelUserService.addRelUser(userId, loverId, RelUserStatus.Rejected);

    if(!rel) {
      return res.status(400).json({ error: "Error while trying to reject lovers" });
    }

    return res.status(200).json({ message: "Lover rejected" });
  } catch (err: any) {
    return res.status(400).json({ error: "Error while trying to reject lovers" });
  }
};


/**
 * Controller to acceptLovers lovers
 * @param req
 * @param res
 * @returns
 */
export const acceptLovers = async (req: Request, res: Response) => {
  try {

    const loverId = parseInt(req.params.id);
    const userId = parseInt(req.headers.userId?.toString() || "");

    if(!loverId) {
      return res.status(400).json({ error: "Missing loverId parameter" });
    }

    if(userId === loverId) {
      return res.status(400).json({ error: "You can't accept yourself" });
    }

    await RelUserService.addRelUser(userId, loverId, RelUserStatus.Accepted);
    const user = {...await UserService.getUserById(loverId)};
    const userCurrent = {...await UserService.getUserById(userId)};

    const matches = (await RelUserService.getMatchId(userId)).filter((match: any) => (match.id_user_1 === loverId || match.id_user_2 === loverId) && (match.id_user_1 === userId || match.id_user_2 === userId))

    if(matches.length >= 2) {
      SocketService.getInstance().emit(loverId, 'match', userCurrent);
      SocketService.getInstance().emit(userId, 'match', user);
    }

    if(!user) {
      return res.status(400).json({ error: "Error while trying to accept lovers" });
    }
    
    delete user.password;

    SocketService.getInstance().emit(loverId, 'match', user);
    return res.status(200).json({ message: "Lover Accepted" });
  } catch (err: any) {
    return res.status(400).json({ error: "Error while trying to accept lovers" });
  }
};

/**
 * Controller to edit lovers
 * @param req
 * @param res
 * @returns
 */
export const editLover = async (req: Request, res: Response) => {
  try {

    const userId = +(req.headers.userId?.toString() || "");

    const user = await UserService.getUserById(userId);

    if(!user) return;

    try {
      
      await Promise.all([req.body.image1, req.body.image2, req.body.image3, req.body.image4].map(async (image: string, index: number) => {
        if(image) return await fs.writeFile(`./data/${req.headers.userId}-${index + 1}.png`, image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), 'base64');
      }))

    } catch (error) {
      console.log(error)
      throw new Error('Error while saving the image');
    }

    const newData = {
      username: req.body.username || user.username,
      birthdate: req.body.birthdate || user.birthdate,
      type : req.body.type || user.type,
      language: req.body.language || user.language,
      description : req.body.description || user.description,
      image1 : req.body.image1 ? `/data/${req.headers.userId}-1.png` : user.image1,
      image2 : req.body.image2 ? `/data/${req.headers.userId}-2.png` : user.image2,
      image3 : req.body.image3 ? `/data/${req.headers.userId}-3.png` : user.image3,
      image4 : req.body.image4 ? `/data/${req.headers.userId}-4.png` : user.image4,
    }

    const lover = await UserService.updateUser(userId, <User>newData);

    return res.status(200).json({ lover });
  } catch (err: any) {
    console.log(err);
    return res.status(400).json({ error: "Error while trying to update a lover" });
  }
};