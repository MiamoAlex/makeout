import * as Makeout from '../index.js';

/**
 * UiManager s'occupe de gérer les différentes intérractions de l'utilisateur sur les différents écrans,
 * et ainsi faire le lien entre les données et la vue.
 */
export class UiManager {
    // Elements à stocker dans l'application ainsi que leurs évenements
    domElements = {
        header: {
            element: '.main__head',
            events: ['click']
        },

        main: {
            element: '.main'
        },

        mainCore: {
            element: '.main__core',
            events: ['click']
        }
    }

    currentController = Makeout.UiController

    constructor(uiRenderer, dataManager, requestManager, socketManager) {
        this.uiRenderer = uiRenderer;
        this.dataManager = dataManager;
        this.requestManager = requestManager;
        this.socketManager = socketManager;
        this.socketManager.uiManager = this; 

        this.uiRenderer.appendDomElements(this.domElements);

        // Binding des évenements
        for (const key in this.domElements) {
            const element = this.domElements[key];
            if (element.events) {
                element.events.forEach(event => {
                    if (this[`${key}Handler`]) {
                        this.uiRenderer.getElement(key).addEventListener(event, (ev) => this[`${key}Handler`](ev));
                    }
                });
            }
        }

        // Fonction callback à éxécuter quand une mutation est observée
        const callback = (mutationsList) => {
            for (var mutation of mutationsList) {
                if (this.dataManager.canInterract === true && (mutation.type === "attributes" || mutation.type === "childList") && mutation.attributeName !== 'style') {
                    // L'utilisateur à modifié l'interface manuellement
                    document.location.reload();
                }
            }
        };

        // Créé une instance de l'observateur lié à la fonction de callback
        this.observer = new MutationObserver(callback);
        this.observer.observe(this.uiRenderer.getElement('main'), { attributes: true, childList: true, subtree: true, attributeFilter: ['data-id', 'data-action', 'data-language'] });

        addEventListener('keydown', (ev) => {
            switch (ev.key) {
                case '5':
                    this.socketManager.sendMessage('bonjour !', '12')
                    break;
                case '6':
                    this.socketManager.sendMessage('coucou !', '13')
                    break;
            }
        })

        this.checkLogin();
    }

    /**
     * changeLayout() change l'écran actuel de l'application
     * @param {Number} newLayout numéro de l'écran à afficher 
     * @param {String} partialName nom du partial à récuperer pour formattage
     */
    async changeLayout(newLayout, partialName) {
        this.currentLayout = partialName;
        this.dataManager.canInterract = false;
        let data;
        const corePartial = await this.requestManager.getPartial(partialName);
        const headerPartial = await this.requestManager.getPartial(`headers/header${partialName}`);
        switch (partialName) {
            case 'profile':
                data = this.dataManager.currentProfile;
                break;
            case 'chat':
                data = this.dataManager.selectedLover;
                break;
        }
        this.uiRenderer.renderPartial(newLayout, corePartial, partialName, data);
        this.uiRenderer.getElement('header').children[1].innerHTML = headerPartial;
        this.currentController = new Makeout[`${partialName}Controller`](this);
        setTimeout(() => {
            this.dataManager.canInterract = true;
        }, 1500);
    }

    /**
     * headerHandler() gère les évenements et interractions sur l'en tête de l'application
     * @param {Event} ev Evenement au clic sur l'en tête de l'application
     */
    headerHandler(ev) {
        const dataset = ev.target.dataset;
        if (dataset.layout) {
            this.changeLayout(dataset.layout, dataset.partial);
        }
    }

    /**
     * mainCoreHandler() gère les évenements et interractions sur le coeur de l'application
     * @param {Event} ev Evenement au clic sur le coeur de l'application 
     */
    mainCoreHandler(ev) {
        const dataset = ev.target.dataset;
        if (dataset.layout) {
            this.changeLayout(dataset.layout, dataset.partial);
        }
    }

    /**
     * checkLogin() vérifie que le token actuellement stocké
     * dans le navigateur est toujours valide
     */
    async checkLogin() {
        const token = document.cookie.split('token=')[1];
        if (token) {
            const profile = await this.requestManager.checkToken(token);
            if (profile.user) {
                this.socketManager.sendToken(token);
                this.dataManager.currentProfile = profile.user;
                this.changeLayout(2, 'match');
            } else {
                this.changeLayout(0, 'home');
            }
        } else {
            this.changeLayout(0, 'home');
        }
    }
}