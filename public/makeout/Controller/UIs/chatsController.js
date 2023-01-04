import { UiController } from "../UiController.js";

export class chatsController extends UiController {
    constructor(uiManager) {
        const domElements = {
            chatList: {
                element: '.chat__list',
            },
            chatMessage: {
                element: '.chat__input',
                events: ['keydown']
            }
        };
        super(uiManager, domElements);
        this.uiManager.socketManager.getMessages(this.dataManager.selectedLover);
    }


    chatMessageHandler(ev) {
        if (ev.key == 'Enter') {
            this.uiManager.socketManager.sendMessage(ev.target.value, this.dataManager.selectedLover);
            ev.target.value = '';
        }
    }

}