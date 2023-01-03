import { UiController } from "../UiController.js";

export class messagesController extends UiController {
    constructor(uiManager) {
        const domElements = {
            messagesList: {
                element: '.messages__list',
                events: ['click']
            }
        };
        super(uiManager, domElements);
        this.refreshMessages();
    }

    async refreshMessages() {
        this.uiRenderer.renderTemplate('message', await this.requestManager.getChats(), 'messagesList');
        console.log(await this.requestManager.getChats());
    }

    messagesListHandler(ev) {

    }
}