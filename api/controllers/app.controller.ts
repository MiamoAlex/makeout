import { Request, Response } from "express";

/**
 * Controller for the user authentification
 * @param req
 * @param res
 * @returns
 */
export const loadApp = async (req: Request, res: Response) => {
  try {

    return res.sendFile('./index.html');
    
  } catch (err: any) {
    console.error(`Error loading the app`, err.message);
  }
};

