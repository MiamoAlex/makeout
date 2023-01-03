import * as Makeout from '../index.js';

/**
 * UiManager s'occupe de gérer les différentes intérractions de l'utilisateur sur les différents écrans,
 * et ainsi faire le lien entre les données et la vue.
 */
export class UiManager {
    // Elements à stocker dans l'application ainsi que leurs évenements
    domElements = {

        headDebug: {
            element: 'header',
            events: ['click']
        },

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

        // Initialisation
        if (document.cookie) {
            this.changeLayout(2, 'match');
        } else {
            this.changeLayout(0, 'home');
        }
    }

    /**
     * changeLayout() change l'écran actuel de l'application
     * @param {Number} newLayout numéro de l'écran à afficher 
     * @param {String} partialName nom du partial à récuperer pour formattage
     */
    async changeLayout(newLayout, partialName) {
        const corePartial = await this.requestManager.getPartial(partialName);
        const headerPartial = await this.requestManager.getPartial(`headers/header${partialName}`);
        this.uiRenderer.renderPartial(newLayout, corePartial, partialName);
        this.uiRenderer.getElement('header').children[1].innerHTML = headerPartial;
        this.currentController = new Makeout[`${partialName}Controller`](this);
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

    headDebugHandler(ev) {
        if (ev.target.className == 'miamo') {
            this.socketManager.sendAny(document.querySelector('.miamoValue').value);
        }
    }

}