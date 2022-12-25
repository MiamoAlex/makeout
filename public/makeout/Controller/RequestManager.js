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

    /**
     * signup gère la création d'un nouveau compte
     * @param {Object} account 
     * @returns {Number} Code statut
     */
    async signup(account) {
        const req = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(account)
        });
        return req.status;
    }

    /**
     * login() gère la connexion à un compte existant 
     * @param {Object} account 
     * @returns {Number} Code statut
     */
    async login(account) {
        const req = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(account)
        });
        return req.status;
    }
}