export class SocketManager {

    socket = undefined;

    socketEvents = ['getMessages', 'match', 'bug']

    constructor(uiManager) {
        this.uiManager = uiManager;
        this.socket = io("ws://localhost:3002");

        this.socketEvents.forEach(event => {
            this.socket.on(event, (data) => {
                this[`${event}Handler`](data);
            })
        });
    }

    /**
     * sendToken() initialise le token du socket côté back en lui envoyant
     * @param currentToken Token de l'api
     */
    sendToken(currentToken) {
        this.socket.emit('token', currentToken);
    }

    sendBug(userId) {}

    sendMessage(message, id) {
        this.socket.emit('sendMessage', id, message);
    }

    getMessages(id) {
        this.socket.emit('getMessages', id);
    }

    getMessagesHandler(messages) {
        if (this.uiManager.currentLayout == 'chats') {
            this.uiManager.uiRenderer.getElement('chatList').innerHTML = '';
            this.uiManager.uiRenderer.renderTemplate('chat', messages.reverse(), 'chatList');
        } else {
            this.uiManager.currentController.throwError('New chat received 😉');
        }
    }

    /**
     * matchHandler() joue l'animation de match
     * @param {Object} match 
     */
    async matchHandler(match) {
        const corePartial = await this.uiManager.requestManager.getPartial('matchanim');
        this.uiManager.uiRenderer.renderPartial(4, corePartial, 'matchanim', match);
        setTimeout(() => {
            this.uiManager.changeLayout(2, 'match');
        }, 3000);
    }

}