/**
 * DataManager s'occupe de stocker les données importantes de l'application 
 */
export class DataManager {
    constructor() {

    }

    languages = [
        {
            name: 'JavaScript'
        }
    ];

    /**
     * formDataToObject() convertit un objet de type FormData, en objet prêt à être envoyé à l'api en json
     * @param {FormData} formData Données d'un formulaire
     */
    formDataToObject(formData) {
        var obj = {};
        for (const key of formData.keys()) {
            obj[key] = formData.get(key);
        }
        return obj;
    }
}