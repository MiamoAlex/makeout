import userBD from "../services/user.service";
import jwt from "jsonwebtoken";
import appConfig from "../config/app.config";
import { Request, Response } from "express";

/**
 * Controller for the user authentification
 * @param req
 * @param res
 * @returns
 */
export const login = async (req: Request, res: Response) => {
  try {
    // if all value are present
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({
        message: "Error. Please enter the correct username and password",
      });
    }

    // Get the user
    const user = await userBD.getUserByUsernameAndPassword(
      req.body.username,
      req.body.password
    );

    // if user is not found
    if (!user) {
      return res
        .status(400)
        .json({ message: "Error. Wrong login or password" });
    }

    // generate a token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      appConfig.JWT_SECRET,
      { expiresIn: "3 hours" }
    );

    const returnUser: any = {...user}
    delete returnUser.password
    delete returnUser.id

    // return the token
    return res.cookie('token', token,  {
      expires : new Date(Date.now() + 3 * 60 * 60 * 1000),
    }).json({ token: token, user: returnUser });
  } catch (err: any) {
    console.error(`Error while reading the user`, err.message);
    return res.status(400).json({ error: "Error while reading the user" });
  }
};

/**
 * Controller for the user registration
 * @param req
 * @param res
 * @returns
 */
export const signup = async (req: Request, res: Response) => {
  try {
    if (!req.body.username || !req.body.birthdate || !req.body.password) {
      return res.status(400).json({
        message: "Error. Please provide a username, a password and a birthdate",
      });
    }

    // add the user to the database
    const result = await userBD.addUser(
      req.body.username,
      req.body.password,
      req.body.birthdate,
    );

    // get the added user
    const user = await userBD.getUserById(result);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Error while adding the user to the database" });
    }

    // generate a token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      appConfig.JWT_SECRET,
      { expiresIn: "3 hours" }
    );

    delete user.password

    // return the token
    return res.cookie('token', token).json({ token: token, user: user });
  } catch (err: any) {
    console.error(`Error while adding the user`, err.message);
    return res.status(400).json({ error: "Error while trying to add the user to the database" });
  }
};

/**
 * Controller for the user signout
 * @param req
 * @param res
 * @returns
 */
export const signout = async (req: Request, res: Response) => {
  try {
    return res.clearCookie('token').sendStatus(200);
  } catch (err: any) {
    console.error(`Error while clearing the auth cookie the user`, err.message);
    return res.status(400).json({ error: "Error while clearing the auth cookie the user" });
  }
};

/**
 * Controller to validate a user token
 * @param req
 * @param res
 * @returns
 */
export const checkIn = async (req: Request, res: Response) => {
  try {
    jwt.verify(
      req.body.token,
      appConfig.JWT_SECRET,
      async (err: any, decodedToken: any) => {
        if (err) {
          res.status(401).json({ message: "Invalid token" });
        } else {
          const user = await userBD.getUserById(decodedToken.id);

          const returnUser: any = {...user}
          delete returnUser.password

          res.json({ user: returnUser,  message: "Token is valid" });
        }
      }
    );
  } catch (err: any) {
    console.error(`Error while trying to verify the auth token`, err.message);
    return res.status(400).json({ error: "Error while trying to verify the auth token" });
  }
};