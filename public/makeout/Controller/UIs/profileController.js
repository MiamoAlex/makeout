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
            typeTitle: {
                element: '.profile__type-display'
            },
            languages: {
                element: '.profile__languages',
            },
        };
        super(uiManager, domElements);
        this.dataManager.canInterract = false;
        this.uiRenderer.renderTemplate('language', this.dataManager.languages, 'languages');
        // Selectionner si il existe le type actuel
        if (this.dataManager.currentProfile.type) {
            document.querySelector(`[data-type="${this.dataManager.currentProfile.type}"]`).click();
        }
        if (this.dataManager.currentProfile.language) {
            document.querySelector(`[data-language="${this.dataManager.currentProfile.language}"]`).click();
        }
        setTimeout(() => {
            this.dataManager.canInterract = true;
        }, 500);
    }

    /**
     * profileHandler() gère les évenements au clic sur le profil
     * @param {Event} ev Evenement au clic
     */
    profileFormHandler(ev) {
        const dataset = ev.target.dataset;
        if (dataset.language) {
            // Sauvegarde du langage
            if (this.currentLanguageNode) {
                this.currentLanguageNode.classList.remove('profile__selected');
            }
            this.currentLanguage = dataset.language;
            this.currentLanguageNode = ev.target;
            this.currentLanguageNode.classList.add('profile__selected');
        } else if (dataset.type) {
            // Sauvegarde du type
            this.dataManager.canInterract = false
            if (this.currentTypeNode) {
                this.currentTypeNode.classList.remove('profile__selected');
            }
            this.uiRenderer.getElement('typeTitle').textContent = dataset.type;
            this.currentType = dataset.type;
            this.currentTypeNode = ev.target;
            this.currentTypeNode.classList.add('profile__selected');
            setTimeout(() => {
                this.dataManager.canInterract = true
            }, 300);
        } else if (dataset.i18n == 'saveChanges') {
            // Sauvegarde du profil
            const obj = this.dataManager.formDataToObject(new FormData(this.uiRenderer.getElement('profileForm')));
            if (new Date(obj.birthdate).getFullYear() > 2005) {
                this.throwError('⚠️ User is too young');
                return
            }
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
                    if (reader.result == 'data:') {
                        obj[`image${i}`] = null;
                    } else {
                        obj[`image${i}`] = reader.result;
                    }
                    if (i === 4) {
                        setTimeout(async () => {
                            const newProfile = await this.requestManager.editProfile(obj);
                            if (newProfile.lover) {
                                this.dataManager.currentProfile = newProfile.lover;
                                this.uiManager.changeLayout(2, 'match');
                            }
                        }, 300);
                    }
                }
            }
        } else if (dataset.i18n == 'logout') {
            this.requestManager.logout();
        }
    }
}