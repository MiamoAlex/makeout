/**
 * RequestManager s'occupe d'effectuer les différentes requêtes à l'api de l'application pour y 
 * retourner les données importantes
 */
export class RequestManager {

    /**
     * getPartial() récupere un partial html et le retourne
     * @param {String} partialName Nom du partial à récuperer
     */
    async getPartial(partialName) {
        const req = await fetch(`./views/${partialName}.html`);
        return await req.text();
    }
}