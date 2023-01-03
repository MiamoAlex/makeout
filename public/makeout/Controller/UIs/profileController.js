import { UiController } from "../UiController.js";

export class profileController extends UiController {
    constructor(uiManager) {
        const domElements = {
            profileForm: {
                element: '.profile__form',
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
        if (this.dataManager.currentProfile.type) {
            document.querySelector(`[data-type="${this.dataManager.currentProfile.type}"]`).click();
        }
        if (this.dataManager.currentProfile.language) {
            document.querySelector(`[data-language="${this.dataManager.currentProfile.language}"]`).click();
        }
    }

    /**
     * profileHandler() gère les évenements au clic sur le profil
     * @param {Event} ev Evenement au clic
     */
    profileFormHandler(ev) {
        const dataset = ev.target.dataset;
        if (dataset.language) {
            if (this.currentLanguageNode) {
                this.currentLanguageNode.classList.remove('profile__selected');
            }
            this.currentLanguage = dataset.language;
            this.currentLanguageNode = ev.target;
            this.currentLanguageNode.classList.add('profile__selected');
        } else if (dataset.type) {
            if (this.currentTypeNode) {
                this.currentTypeNode.classList.remove('profile__selected');
            }
            this.currentType = dataset.type;
            this.currentTypeNode = ev.target;
            this.currentTypeNode.classList.add('profile__selected');
        } else if (dataset.i18n == 'saveChanges') {
            const obj = this.dataManager.formDataToObject(new FormData(this.uiRenderer.getElement('profileForm')));
            // Mdp desactivé
            delete obj.password;
            delete obj.confirmpassword;
            // Actualisation language type
            obj.language = this.currentLanguage;
            obj.type = this.currentType;

            // Gestion des images
            for (let i = 1; i < 5; i++) {
                const reader = new FileReader();
                reader.readAsDataURL(obj[`image${i}`]);
                reader.onloadend = () => {
                    obj[`image${i}`] = reader.result;
                    if (i === 4) {
                        setTimeout(async () => {
                            this.dataManager.currentProfile = await this.requestManager.editProfile(obj);
                            this.uiManager.changeLayout(2, 'match');
                        }, 300);
                    }
                }
            }
        } else if (dataset.i18n == 'logout') {
            this.requestManager.logout();
        }
    }
}