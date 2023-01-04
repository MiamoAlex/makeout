var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Controller for the user authentification
 * @param req
 * @param res
 * @returns
 */
export const loadApp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.sendFile('./index.html');
    }
    catch (err) {
        console.error(`Error loading the app`, err.message);
    }
});
