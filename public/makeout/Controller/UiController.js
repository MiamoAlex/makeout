export class UiController {
    domElements = {}

    constructor(uiManager, domElements) {
        this.uiManager = uiManager;
        this.uiRenderer = uiManager.uiRenderer;
        this.dataManager = uiManager.dataManager;
        this.requestManager = uiManager.requestManager;

        this.domElements = domElements;

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
    }

    /**
     * 
     * @param {String} errorCode Code d'erreur (clef du dictionnaire) 
     */
    throwError(errorCode) {
        if (!this.currentError) {
            clearTimeout(this.uiManager.timeout);
            this.uiRenderer.renderTemplate('notification', [{ errorCode }], 'main');
            this.dataManager.canInterract = false;
            this.currentError = true;
            setTimeout(() => {
                document.querySelector('.notification').remove();
                this.currentError = false;
                this.uiManager.timeout = setTimeout(() => {
                    this.dataManager.canInterract = true;
                }, 300);
            }, 4500);
        }
    }
}