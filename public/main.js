import * as Makeout from './makeout/index.js';

const App = {
    model: {
        dataManager: Makeout.DataManager
    },

    view: {
        uiRenderer: Makeout.UiRenderer
    },

    controller: {
        uiController: Makeout.UiController,
        requestManager: Makeout.RequestManager,

        init: function () {
            console.log("%cMakeout.dev", "color:#F455E4; font-size:2rem");
            console.log("%cDéveloppé par Alexandre Sounalet & Antoine Bauri", "color:#78F86D; font-size:.7rem");
            
            App.model.dataManager = new Makeout.DataManager();

            App.view.uiRenderer = new Makeout.UiRenderer();

            App.controller.requestManager = new Makeout.RequestManager();
            App.controller.uiController = new Makeout.UiManager(App.view.uiRenderer, App.model.dataManager, App.controller.requestManager);
        }
    }
}

window.addEventListener('load', App.controller.init);