import { UiController } from "../UiController.js";

export class matchController extends UiController {
    constructor(uiManager) {
        const domElements = {
            loversList: {
                element: '.match__lovers'
            },

            actions: {
                element: '.match__actions',
                events: ['click']
            }
        };
        super(uiManager, domElements);
        this.renderNewLovers();

    }

    async renderNewLovers() {
        this.lovers = await this.requestManager.getLovers();
        this.dataManager.canInterract = false;
        if (this.lovers.length > 0) {
            this.currentLover = this.lovers[this.lovers.length - 1];
            this.uiRenderer.renderTemplate('lover', this.lovers, 'loversList');
            setTimeout(() => {
                this.dataManager.canInterract = true;
            }, 300);
        } else {
            this.currentLover = null;
            this.uiRenderer.getElement('loversList').innerHTML = 'No lovers left 💔';
        }
    }

    /**
     * actionsHandler()
     * @param {Event} ev Evenement au clic sur les actions 
     */
    actionsHandler(ev) {
        if (ev.target.className == 'match__action') {
            this[`${ev.target.dataset.action}Action`](ev);
        }
    }

    rejectAction(ev) {
        if (this.currentLover) {
            document.querySelector(`[data-id="${this.currentLover.id}"]`).classList.add('match__lover-left');
            this.requestManager.rejectLover(this.currentLover.id);
            this.lovers.pop();

            if (this.lovers.length > 0) {
                this.currentLover = this.lovers[this.lovers.length - 1];
            } else {
                setTimeout(() => {
                    this.renderNewLovers();
                }, 300);
            }
        }
    }

    acceptAction(ev) {
        if (this.currentLover) {
            document.querySelector(`[data-id="${this.currentLover.id}"]`).classList.add('match__lover-right');
            this.requestManager.acceptLover(this.currentLover.id);
            this.lovers.pop();

            if (this.lovers.length > 0) {
                this.currentLover = this.lovers[this.lovers.length - 1];
            } else {
                setTimeout(() => {
                    this.renderNewLovers();
                }, 300);
            }
        }
    }
}