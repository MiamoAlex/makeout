import { UiController } from "../UiController.js";

export class profileController extends UiController {
    constructor(uiManager) {
        const domElements = {

            profile: {
                element: '.profile',
                events: ['click']
            },

            preferences: {
                element: '.profile__types',
            },


            languages: {
                element: '.profile__languages',
            },


        };
        super(uiManager, domElements);
        console.log(this.dataManager.currentProfile);
        this.uiRenderer.renderTemplate('language', this.dataManager.languages, 'languages');
        // Selectionner si il existe le type actuel
    }

    /**
     * profileHandler() gère les évenements au clic sur le profil
     * @param {Event} ev Evenement au clic
     */
    profileHandler(ev) {
        const dataset = ev.target.dataset;
        if (dataset.language) {

        } else if (dataset.type) {

        } else if (dataset.i18n == 'saveChanges') {
            // const obj = this.dataManager.formDataToObject(new FormData(this.uiRenderer.getElement('')));
            // console.log(obj);
        } else if (dataset.i18n == 'logout') {
            this.requestManager.logout();
        }
    }
}