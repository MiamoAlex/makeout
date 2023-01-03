import { UiController } from "../UiController.js";

export class signController extends UiController {
    constructor(uiManager) {
        const domElements = {
            signForm: {
                element: '.sign__section'
            },

            signSubmit: {
                element: '.sign__submit',
                events: ['click']
            }
        };
        super(uiManager, domElements);
    }

    /**
     * signSubmitHandler() gère les évenements au clic sur la section du formulaire d'inscription
     * @param {Event} ev Evenement au clic sur le formulaire
     */
    async signSubmitHandler(ev) {
        const obj = this.dataManager.formDataToObject(new FormData(this.uiRenderer.getElement('signForm')));

        // Si les mots de passe sont bien identiques
        if (obj.password.length < 4) {
            this.throwError('⚠ Password is too short');
        } else if (obj.password !== obj.confirmpassword) {
            this.throwError('⚠ Passwords are not identical');
        } else if (!obj.birthdate) {
            this.throwError('⚠ Birthdate is required');
        } else if (!obj.username) {
            this.throwError('⚠ Username is required');
        } else {
            delete obj.confirmpassword;
            const response = await this.requestManager.signup(obj);
            if (response.token) {
                this.dataManager.currentProfile = response.user;
                this.uiManager.socketManager.sendToken(response.token);
                setTimeout(() => {
                    this.uiManager.changeLayout(1, 'profile');
                }, 300);
            } else {
                this.throwError('⚠ An error occured');
            }
        }
    }
}