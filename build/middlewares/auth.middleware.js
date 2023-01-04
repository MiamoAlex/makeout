import jwt from "jsonwebtoken";
import appConfig from "../config/app.config.js";
/* Vérification du token */
export const checkTokenMiddleware = (req, res, next) => {
    var _a;
    // Récupération du token
    const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    // Présence d'un token
    if (!token) {
        return res.status(401).json({ message: "Error. Need a token" });
    }
    // Véracité du token
    jwt.verify(token, appConfig.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            res.status(401).json({ message: "Error. Bad token" });
        }
        else {
            req.headers.userId = decodedToken.id;
            return next();
        }
    });
};
export default {
    checkTokenMiddleware,
};
