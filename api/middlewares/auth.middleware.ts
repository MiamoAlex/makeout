import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import appConfig from "../config/app.config";
import { Request, Response } from "express";

/* Vérification du token */
export const checkTokenMiddleware = (req: Request, res: Response, next: any) => {
  // Récupération du token
  const token = req.cookies?.token 

  // Présence d'un token
  if (!token) {
    return res.status(401).json({ message: "Error. Need a token" });
  }

  // Véracité du token
  jwt.verify(token, appConfig.JWT_SECRET, (err: any, decodedToken: any) => {
    if (err) {
      res.status(401).json({ message: "Error. Bad token" });
    } else {
      req.headers.userId = decodedToken.id;

      return next();
    }
  });
};

export default {
  checkTokenMiddleware,
};