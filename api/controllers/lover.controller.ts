import { Request, Response } from "express";
import UserService from "../services/user.service";
import RelUserService from "../services/relUser.service";
import { RelUserStatus } from "../services/models/data.model";

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

    const lovers = await UserService.getLovers(req.headers.userId ,parseInt(req.query.nb.toString()));
    
    const result = lovers.map((lover: any) => ({
      id: lover.id,
      username: lover.username,
      birthdate: lover.birthdate,
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

    const rel = RelUserService.addRelUser(userId, loverId, RelUserStatus.Accepted);

    if(!rel) {
      return res.status(400).json({ error: "Error while trying to accept lovers" });
    }

    return res.status(200).json({ message: "Lover Accepted" });
  } catch (err: any) {
    return res.status(400).json({ error: "Error while trying to accept lovers" });
  }
};
