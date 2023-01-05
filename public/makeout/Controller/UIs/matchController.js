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
            },
            terminal: {
                element: '.match__terminal',
                events: ['mouseout', 'keyup']
            },
            terminalDisplay: {
                element: '.match__terminal-text'
            }
        };
        super(uiManager, domElements);
        this.renderNewLovers();
        this.uiRenderer.getElement('terminalDisplay').textContent = `${this.dataManager.currentProfile.username}@makeout-50123:`;
    }

    async renderNewLovers() {
        this.lovers = await this.requestManager.getLovers();
        clearTimeout(this.uiManager.timeout);
        this.dataManager.canInterract = false;
        if (this.lovers.length > 0) {
            this.currentLover = this.lovers[this.lovers.length - 1];
            this.uiRenderer.renderTemplate('lover', this.lovers, 'loversList');
            this.uiManager.timeout = setTimeout(() => {
                this.dataManager.canInterract = true;
            }, 600);
        } else {
            this.currentLover = null;
            this.uiRenderer.getElement('loversList').innerHTML = 'No lovers left 💔';
        }
    }

    terminalHandler(ev) {
        if (ev.type === 'mouseout') {
            this.uiRenderer.getElement('terminal').classList.remove('match__terminal-open')
        } else if (ev.key == 'Enter') {
            switch (ev.target.value) {
                case 'reject':
                    this.rejectAction();
                    break;

                case 'ping':
                    this.bugAction();
                    break;

                case 'accept':
                    this.acceptAction();
                    break;
            }
            ev.target.value = '';
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

    /**
     * Rejet d'un lover
     * @param {Event} ev 
     */
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

    /**
     * Reception d'un Ping d'un utilisaeur
     * @param {Event} ev 
     */
    bugAction(ev) {
        if (this.currentLover) {
            this.uiManager.socketManager.sendBug(this.currentLover.id);
        }
    }

    terminalAction(ev) {
        this.uiRenderer.getElement('terminal').classList.add('match__terminal-open');
    }

    /**
     * Acceptation d'un lover
     * @param {Event} ev 
     */
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