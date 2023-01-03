/**
 * 👁️ UiRenderer s'occupe du rendu de la vue de l'application en passant du templating par la traduction des données à afficher
 */
export class UiRenderer {
    // Elements visuels de l'application
    domElements = {};

    templates = {};

    constructor() {
        const templates = document.querySelector('#templates');
        for (let i = 0; i < templates.children.length; i++) {
            const template = templates.children[i];
            this.templates[template.className.split('template__')[1]] = template;
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
     * @param {Object} obj Objet à formatter
     */
    renderPartial(layoutId, partialContent, partialName, obj) {
        // Formattage clef valeurs
        if (obj) {
            const toFormat = Array.from(partialContent.matchAll(/{{(.*?)}}/gi));
            for (let i = 0; i < toFormat.length; i++) {
                const tag = toFormat[i][0];
                const key = toFormat[i][1];
                if (obj[key]) {
                    partialContent = partialContent.replaceAll(tag, obj[key]);
                } else {
                    partialContent = partialContent.replaceAll(tag, '');
                }
            }
        }

        this.getElement('mainCore').style.transform = `translateX(${-layoutId * 100}%)`;
        const section = this.getElement('mainCore').children[layoutId];
        section.className = `main__section ${partialName}`;
        section.innerHTML = partialContent;
    }

    /**
     * renderTemplate() formatte une template à partir d'un tableau d'objet et l'envoie dans le dom destination
     * @param {Node} template 
     * @param {Array<Object>} arrayObj 
     * @param {String} destination 
     */
    renderTemplate(template, arrayObj, destination) {

        const toFormat = Array.from(this.templates[template].innerHTML.matchAll(/{{(.*?)}}/gi));
        let formattedTemplates = '';
        for (let i = 0; i < arrayObj.length; i++) {
            const obj = arrayObj[i];
            formattedTemplates += this.templates[template].innerHTML;
            for (let j = 0; j < toFormat.length; j++) {
                const tag = toFormat[j][0];
                const key = toFormat[j][1];
                if (obj[key]) {
                    if (key == 'birthdate') {
                        const ageDifMs = Date.now() - new Date(obj[key]).getTime();
                        const ageDate = new Date(ageDifMs);
                        formattedTemplates = formattedTemplates.replaceAll(tag, Math.abs(ageDate.getUTCFullYear() - 1970))
                    } else {
                        formattedTemplates = formattedTemplates.replaceAll(tag, obj[key]);
                    }
                } else {
                    formattedTemplates = formattedTemplates.replaceAll(tag, '');
                }
            }
        }
        // Retour des données
        if (destination) {
            this.getElement(destination).insertAdjacentHTML('beforeend', formattedTemplates);
        } else {
            return formattedTemplates;
        }
    }
}