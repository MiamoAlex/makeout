var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import userBD from "../services/user.service.js";
import jwt from "jsonwebtoken";
import appConfig from "../config/app.config.js";
/**
 * Controller for the user authentification
 * @param req
 * @param res
 * @returns
 */
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // if all value are present
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({
                message: "Error. Please enter the correct username and password",
            });
        }
        // Get the user
        const user = yield userBD.getUserByUsernameAndPassword(req.body.username, req.body.password);
        // if user is not found
        if (!user) {
            return res
                .status(400)
                .json({ message: "Error. Wrong login or password" });
        }
        // generate a token
        const token = jwt.sign({
            id: user.id,
            username: user.username,
        }, appConfig.JWT_SECRET, { expiresIn: "3 hours" });
        const returnUser = Object.assign({}, user);
        delete returnUser.password;
        delete returnUser.id;
        // return the token
        return res.cookie('token', token).json({ token: token, user: returnUser });
    }
    catch (err) {
        console.error(`Error while reading the user`, err.message);
        return res.status(400).json({ error: "Error while reading the user" });
    }
});
/**
 * Controller for the user registration
 * @param req
 * @param res
 * @returns
 */
export const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.username || !req.body.birthdate || !req.body.password) {
            return res.status(400).json({
                message: "Error. Please provide a username, a password and a birthdate",
            });
        }
        // add the user to the database
        const result = yield userBD.addUser(req.body.username, req.body.password, req.body.birthdate);
        // get the added user
        const user = yield userBD.getUserById(result);
        if (!user) {
            return res
                .status(400)
                .json({ message: "Error while adding the user to the database" });
        }
        // generate a token
        const token = jwt.sign({
            id: user.id,
            username: user.username,
        }, appConfig.JWT_SECRET, { expiresIn: "3 hours" });
        delete user.password;
        // return the token
        return res.cookie('token', token).json({ token: token, user: user });
    }
    catch (err) {
        console.error(`Error while adding the user`, err.message);
        return res.status(400).json({ error: "Error while trying to add the user to the database" });
    }
});
/**
 * Controller for the user signout
 * @param req
 * @param res
 * @returns
 */
export const signout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.clearCookie('token').sendStatus(200);
    }
    catch (err) {
        console.error(`Error while clearing the auth cookie the user`, err.message);
        return res.status(400).json({ error: "Error while clearing the auth cookie the user" });
    }
});
/**
 * Controller to validate a user token
 * @param req
 * @param res
 * @returns
 */
export const checkIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        jwt.verify(req.body.token, appConfig.JWT_SECRET, (err, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.status(401).json({ message: "Invalid token" });
            }
            else {
                const user = yield userBD.getUserById(decodedToken.id);
                const returnUser = Object.assign({}, user);
                delete returnUser.password;
                res.json({ user: returnUser, message: "Token is valid" });
            }
        }));
    }
    catch (err) {
        console.error(`Error while trying to verify the auth token`, err.message);
        return res.status(400).json({ error: "Error while trying to verify the auth token" });
    }
});
