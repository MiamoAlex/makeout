var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import UserService from "../services/user.service.js";
import RelUserService from "../services/relUser.service.js";
import { RelUserStatus } from "../services/models/data.model.js";
import SocketService from "../services/socket.service.js";
import fs from 'fs/promises';
/**
 * Controller to fetch lovers
 * @param req
 * @param res
 * @returns
 */
export const getLovers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.nb)) {
            return res.status(400).json({ error: "Missing nb parameter" });
        }
        const lovers = yield UserService.getLovers(req.headers.userId, parseInt(req.query.nb.toString()));
        const result = lovers.map((lover) => ({
            id: lover.id,
            username: lover.username,
            birthdate: lover.birthdate,
            type: lover.type,
            language: lover.language,
            description: lover.description,
            image1: lover.image1,
            image2: lover.image2,
            image3: lover.image3,
            image4: lover.image4,
        }));
        // return the token
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(400).json({ error: "Error while trying to lovers" });
    }
});
/**
 * Controller to reject lovers
 * @param req
 * @param res
 * @returns
 */
export const rejectLovers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const loverId = parseInt(req.params.id);
        const userId = parseInt(((_b = req.headers.userId) === null || _b === void 0 ? void 0 : _b.toString()) || "");
        if (!loverId) {
            return res.status(400).json({ error: "Missing loverId parameter" });
        }
        if (userId === loverId) {
            return res.status(400).json({ error: "You can't reject yourself" });
        }
        const rel = RelUserService.addRelUser(userId, loverId, RelUserStatus.Rejected);
        if (!rel) {
            return res.status(400).json({ error: "Error while trying to reject lovers" });
        }
        return res.status(200).json({ message: "Lover rejected" });
    }
    catch (err) {
        return res.status(400).json({ error: "Error while trying to reject lovers" });
    }
});
/**
 * Controller to acceptLovers lovers
 * @param req
 * @param res
 * @returns
 */
export const acceptLovers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const loverId = parseInt(req.params.id);
        const userId = parseInt(((_c = req.headers.userId) === null || _c === void 0 ? void 0 : _c.toString()) || "");
        if (!loverId) {
            return res.status(400).json({ error: "Missing loverId parameter" });
        }
        if (userId === loverId) {
            return res.status(400).json({ error: "You can't accept yourself" });
        }
        yield RelUserService.addRelUser(userId, loverId, RelUserStatus.Accepted);
        const user = Object.assign({}, yield UserService.getUserById(loverId));
        const userCurrent = Object.assign({}, yield UserService.getUserById(userId));
        const isMatch = (yield RelUserService.getMatchId(userId)).includes(loverId);
        console.log(yield RelUserService.getMatchId(userId), loverId, userId, isMatch);
        if (isMatch) {
            SocketService.getInstance().emit(loverId, 'match', userCurrent);
            SocketService.getInstance().emit(userId, 'match', user);
        }
        if (!user) {
            return res.status(400).json({ error: "Error while trying to accept lovers" });
        }
        delete user.password;
        return res.status(200).json({ message: "Lover Accepted" });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ error: "Error while trying to accept lovers" });
    }
});
/**
 * Controller to edit lovers
 * @param req
 * @param res
 * @returns
 */
export const editLover = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const userId = +(((_d = req.headers.userId) === null || _d === void 0 ? void 0 : _d.toString()) || "");
        const user = yield UserService.getUserById(userId);
        if (!user)
            return;
        try {
            yield Promise.all([req.body.image1, req.body.image2, req.body.image3, req.body.image4].map((image, index) => __awaiter(void 0, void 0, void 0, function* () {
                if (image)
                    return yield fs.writeFile(`./data/${req.headers.userId}-${index + 1}.png`, image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), 'base64');
            })));
        }
        catch (error) {
            console.log(error);
            throw new Error('Error while saving the image');
        }
        const newData = {
            username: req.body.username || user.username,
            birthdate: req.body.birthdate || user.birthdate,
            type: req.body.type || user.type,
            language: req.body.language || user.language,
            description: req.body.description || user.description,
            image1: req.body.image1 ? `/data/${req.headers.userId}-1.png` : user.image1,
            image2: req.body.image2 ? `/data/${req.headers.userId}-2.png` : user.image2,
            image3: req.body.image3 ? `/data/${req.headers.userId}-3.png` : user.image3,
            image4: req.body.image4 ? `/data/${req.headers.userId}-4.png` : user.image4,
        };
        const lover = yield UserService.updateUser(userId, newData);
        return res.status(200).json({ lover });
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({ error: "Error while trying to update a lover" });
    }
});
