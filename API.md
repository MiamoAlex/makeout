# Requêtes et base de données

## Authentification 
-  Token stocké comme cookie
-  Reste tout le temps sauf si utilise le bouton de déconnexion

## Route : api/signup - POST
- Ce que je t'envoie :
{
    username: "MiamoAlex",
    password: "mystiblonx",
    birthdate: date.toJson()
}

- Ce que tu me retourne :
200
{
    token: "uuid"
}

403
{
    error: "Impossible de créer le compte"
}

## Route : api/login - POST
- Ce que je t'envoie :
{
    username: "MiamoAlex",
    password: "mystiblonx",
}
- Ce que tu me retourne :
- Pareil que sign up

## Route : api/editprofile - PUT
- Ce que je t'envoie
lover partiel{}

- Ce que tu me renvoie
lover entier en base{}

## Route : api/getlovers?nb=5 - GET
- Ce que tu me retourne 
[
    lover {}
]

## Route : api/rejectlover/:id - PUT
- Ce que tu me retourne : un potentiel match avec une personne précedemment acceptée

## Route : api/acceptlover/:id - PUT
- Ce que tu me retourne : un potentiel match avec une personne précedemment acceptée

## Route : api/getchats - GET
- Ce que tu me retourne : 
[lover{
    ...lastMessage: ""
}]

## Route : api/getusermessages/:id - GET
- Ce que tu me retourne 
[message{
    date, text, sender: TRUE c'est lui, FALSE c'est moi
}]