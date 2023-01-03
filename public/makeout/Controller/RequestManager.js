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
        return await req.json();
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
        return await req.json();
    }

    /**
     * checkToken() vérifie le token actuellement stocké
     * @param {Number} currentToken 
     * @returns {Number} Code de statut
     */
    async checkToken(currentToken) {
        const req = await fetch('/api/checkIn', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: currentToken })
        });
        return await req.json();
    }

    /**
     * getChats() retourne les messages récents
     */
    async getChats() {
        const req = await fetch('/api/getchats');
        return await req.json();
    }

    /**
     * logout() déconnecte l'utilisateur actuel
     * et rafraichie la page
     */
    async logout() {
        const req = await fetch('/api/signout');
        setTimeout(() => {
            document.location.reload();
        }, 200);
    }

    /**
     * editProfile() gère la requête de modification de profil
     * @param {Object} edittedProfile 
     */
    async editProfile(edittedProfile) {
        const req = await fetch('/api/editProfile', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(edittedProfile)
        });
        return await req.json();
    }

    /**
     * getLovers() retourne les profils des personnes non rencontrées
     */
    async getLovers() {
        const req = await fetch('/api/getLovers?nb=5');
        return await req.json();
    }

    async rejectLover(id) {
        const req = await fetch(`/api/rejectlovers/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
    }

    async acceptLover(id) {
        const req = await fetch(`/api/acceptlovers/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
    }
}