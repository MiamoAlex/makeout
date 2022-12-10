/**
 * 👁️ UiRenderer s'occupe du rendu de la vue de l'application en passant du templating par la traduction des données à afficher
 */
export class UiRenderer {
    constructor() {

    }

    // Elements visuels de l'application
    domElements = {};

    /**
     * appendDomElements() ajoute aux elements visuels actuels un groupe de nouveau éléments récupérables
     * @param {Object} domElements Objet contenant les différents classes des elements visuels à récuperer 
     */
    appendDomElements(domElements) {
        for (const key in domElements) {
            this.domElements[key] = document.querySelector(domElements[key].element);
        }
        console.log(this.domElements);
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
}