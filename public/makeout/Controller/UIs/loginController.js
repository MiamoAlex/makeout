import { UiController } from "../UiController.js";

export class loginController extends UiController {
    constructor(uiManager) {
        const domElements = {
            loginForm: {
                element: '.login__form',
            },

            loginSubmit: {
                element: '.login__submit',
                events: ['click']
            }
        };
        super(uiManager, domElements);
    }

    /**
     * loginSubmitHandler() gère les évenements au clic sur la section du formulaire de connexion
     * @param {Event} ev Evenement au clic sur le formulaire
    */
    async loginSubmitHandler(ev) {
        const obj = this.dataManager.formDataToObject(new FormData(this.uiRenderer.getElement('loginForm')));

        const response = await this.requestManager.login(obj);
        if (response.token) {
            this.dataManager.currentProfile = response.user;
            this.uiManager.socketManager.sendToken(response.token);
            this.uiManager.changeLayout(1, 'profile');
        } else {
            this.throwError('⚠ Password or Username is invalid');
        }
    }
}