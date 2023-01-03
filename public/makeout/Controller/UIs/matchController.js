import { UiController } from "../UiController.js";

export class matchController extends UiController {
    constructor(uiManager) {
        const domElements = {
            loversList: {
                element: '.match__lovers'
            },

            actions: {
                element: '.match__actions'
            }
        };
        super(uiManager, domElements);
        this.renderNewLovers();
    }

    async renderNewLovers() {
        this.lovers = await this.requestManager.getLovers();
        if (this.lovers.length > 0) {
            this.uiRenderer.renderTemplate('lover', this.lovers, 'loversList');
        } else {
            this.uiRenderer.getElement('loversList').innerHTML = 'No lovers left 💔';
        }
    }
}