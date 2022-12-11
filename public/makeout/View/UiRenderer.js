/**
 * 👁️ UiRenderer s'occupe du rendu de la vue de l'application en passant du templating par la traduction des données à afficher
 */
export class UiRenderer {
    // Elements visuels de l'application
    domElements = {};

    templates = ['message'];
    templatesElements = {};

    constructor() {
        for (let i = 0; i < this.templates.length; i++) {
            this.templatesElements[this.templates[i]] = document.querySelector(`.template__${this.templates[i]}`);
        }
    }

    /**
     * appendDomElements() ajoute aux elements visuels actuels un groupe de nouveau éléments récupérables
     * @param {Object} domElements Objet contenant les différents classes des elements visuels à récuperer 
     */
    appendDomElements(domElements) {
        for (const key in domElements) {
            this.domElements[key] = document.querySelector(domElements[key].element);
        }
    }

    /**
     * getElement() retourne un noeud du DOM à partir de l'id renseigné
     * @param {String} id Identifiant de l'objet 
     * @returns {Node} Noeud demandé
     */
    getElement(id) {
        return this.domElements[id];
    }

    /**
     * renderPartial() déplace la vue sur un nouvel écran formatté
     * @param {Number} layoutId Id de l'écran à remplir
     * @param {String} partialContent Contenu du partial selectionné
     * @param {String} partialName Nom du partial sélectionné
     */
    renderPartial(layoutId, partialContent, partialName) {
        this.getElement('mainCore').style.transform = `translateX(${-layoutId * 100}%)`;
        const section = this.getElement('mainCore').children[layoutId];
        section.className = `main__section ${partialName}`;
        section.innerHTML = partialContent;
    }

    /**
     * renderTemplate() formatte une template à partir d'un tableau d'objet et l'envoie dans le dom destination
     * @param {Node} template 
     * @param {Array<Object>} arrayObj 
     * @param {Node} destination 
     */
    renderTemplate(template, arrayObj, destination) {
        const toFormat = Array.from(template.innerHTML.matchAll(/{{(.*?)}}/gi));
        let formattedTemplates = '';
        for (let i = 0; i < arrayObj.length; i++) {
            const obj = arrayObj[i];
            formattedTemplates += template.innerHTML;
            for (let j = 0; j < toFormat.length; j++) {
                const tag = toFormat[j][0];
                const key = toFormat[j][1];
                if (obj[key]) {
                    formattedTemplates = formattedTemplates.replaceAll(tag, obj[key]);
                } else {
                    formattedTemplates = formattedTemplates.replaceAll(tag, '');
                }
            }
        }
        // destination.innerHTML = formattedTemplates;
    }
}