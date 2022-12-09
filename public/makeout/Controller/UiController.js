/**
 * UiController s'occupe de gérer les différentes intérractions de l'utilisateur sur les différents écrans,
 * et ainsi faire le lien entre les données et la vue.
 */
export class UiController {
    // Elements à stocker dans l'application ainsi que leurs évenements
    domElements = {
        mainCore: {
            element: '.main__core'
        }
    }

    constructor(uiRenderer, dataManager, requestManager) {
        this.uiRenderer = uiRenderer;
        this.dataManager = dataManager;
        this.requestManager = requestManager;
        
        this.uiRenderer.appendDomElements(this.domElements);
    }

    /**
     * changeLayout() change l'écran actuel de l'application
     * @param {String} newLayout 
     */
    changeLayout (newLayout) {

    }
}