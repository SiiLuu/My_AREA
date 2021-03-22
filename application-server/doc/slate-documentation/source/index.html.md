---
title: API Reference

language_tabs:
  - javascript

toc_footers:
  - <a href='https://github.com/slatedocs/slate'>Documentation Powered by Slate</a>

search: true

code_clipboard: true
---

# Introduction

INTRO

# OAUTH

## OAUTH login / register

```javascript
fetch("http://localhost:8080/api/user/oauth", {
  method: "POST",
  headers: {
    Accept: "application/json",
    jwt: "jwt", // Optionnel
    // Si c'est dans la page de login ne pas envoyer de jwt vue que vous en avez pas
    // Si c'est dans la page de service il faut l'envoyer pour que le serveur comprenne que c'est pas une tentative de connexion mais d'abonnement à un service
  },
  body: JSON.stringify({
    oauth: "google",
    id: "541gdf586s478zesd4q1f4sdfg",
    refresh_token: "ds451fg8475g41d5f4sg4",
  }),
});
```

> If all goes well the above command returns JSON structured like this:

```json
return code : 200
{
  "token": "TOKEN"
}
```

> If a problem occur, the above command returns JSON structured like this:

```json
return code : 420
return code : 421
{
}
```

This endpoint allows you to subscribe or login to a oauth.

### Error

| Return code | Description                       |
| ----------- | --------------------------------- |
| 200         | OK                                |
| 420         | You need to validate your account |
| 421         | Args error                        |

## OAUTH list

```javascript
fetch("http://localhost:8080/api/service/list_oauth", {
  method: "GET",
  headers: {
    Accept: "application/json",
    jwt: "jwt",
  },
});
```

> If all goes well the above command returns JSON structured like this:

```json
return code : 200
{
  "[facebook, google]"
}
```

> If a problem occur, the above command returns JSON structured like this:

```json
return code : 419
{
}
```

This endpoint allows you to subscribe or login to a oauth.

### Error

| Return code | Description     |
| ----------- | --------------- |
| 200         | OK              |
| 419         | Token incorrect |

# Users

## Create an user

```javascript
fetch("http://localhost:8080/api/user/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "test@mail.com",
    password: "667",
  }),
});
```

> If all goes well the above command returns JSON structured like this:

```json
return code : 200
{
}
```

> If a problem occur, the above command returns JSON structured like this:

```json
return code : 415
return code : 416
{
}
```

This endpoint add an user in the database.

### Error

| Return code | Description                 |
| ----------- | --------------------------- |
| 200         | OK                          |
| 415         | Email or password incorrect |
| 416         | Email already exist         |

## Login / Get token

```javascript
fetch("http://localhost:8080/api/user/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "test@mail.com",
    password: "667",
  }),
});
```

> If all goes well the above command returns JSON structured like this:

```json
return code : 200
{
  "token": "TOKEN"
}
```

> If a problem occur, the above command returns JSON structured like this:

```json
return code : 417
return code : 418
return code : 419
{
}
```

This endpoint return the authentification token.

### Error

| Return code | Description                       |
| ----------- | --------------------------------- |
| 200         | OK                                |
| 417         | You need to use OAuth             |
| 418         | Credentials incorrect             |
| 419         | You need to validate your account |

## User area

# Services

PS: To communicate with this endpoint you need to send the token (jwt)

## Get list of services

```javascript
fetch("http://localhost:8080/api/service/subscribe_list", {
  method: "GET",
  headers: {
    Accept: "application/json",
    jwt: "jwt",
  },
});
```

> If all goes well the above command returns JSON structured like this:

```json
return code : 200
{
  "services": "[facebook, google]"
}
```

> If a problem occur, the above command returns JSON structured like this:

```json
return code : 420
{
}
```

This endpoint return the list of your subscribed services.

### Error

| Return code | Description     |
| ----------- | --------------- |
| 200         | OK              |
| 420         | Token incorrect |

## Subscribe to a service

```javascript
fetch("http://localhost:8080/api/service/subscribe_service", {
  method: "POST",
  headers: {
    Accept: "application/json",
    jwt: "jwt",
  },
  body: JSON.stringify({
    service: "facebook",
  }),
});
```

> If all goes well the above command returns JSON structured like this:

```json
return code : 200
{
}
```

> If a problem occur, the above command returns JSON structured like this:

```json
return code : 420
return code : 421
return code : 422
{
}
```

This endpoint allows you to subscribe to a service.

### Error

| Return code | Description                        |
| ----------- | ---------------------------------- |
| 200         | OK                                 |
| 420         | Token incorrect                    |
| 421         | Already subscribed to this service |
| 422         | Args error                         |

## Unsubscribe to a service

```javascript
fetch("http://localhost:8080/api/service/unsubscribe_service", {
  method: "DELETE",
  headers: {
    Accept: "application/json",
    jwt: "jwt",
  },
  body: JSON.stringify({
    service: "serviceFacebook",
  }),
});
```

> If all goes well the above command returns JSON structured like this:

```json
return code : 200
{
}
```

> If a problem occur, the above command returns JSON structured like this:

```json
return code : 420
return code : 421
return code : 422
{
}
```

This endpoint allows you to unsubscribe to a service.

### Error

| Return code | Description                            |
| ----------- | -------------------------------------- |
| 200         | OK                                     |
| 420         | Token incorrect                        |
| 421         | You are not subscribed to this service |
| 422         | Args error                             |

# Composant

PS: To communicate with this endpoint you need to send the token (jwt)

## Get list of composant

```javascript
fetch("http://localhost:8080/api/composant/composant_list", {
  method: "GET",
  headers: {
    Accept: "application/json",
    jwt: "jwt",
  },
});
```

> If all goes well the above command returns JSON structured like this:

```json
return code : 200
{
    "composant": [
        {
            "name": "WIDGETNAME",
            "timer": 5,
            "fctId": "11"
        },
        {
            "name": "WIDGETNAME2",
            "timer": 5,
            "fctId": "12"
        },
  ]
}
```

> If a problem occur, the above command returns JSON structured like this:

```json
return code : 420
{
}
```

This endpoint return the list of your subscribed composant.

### Error

| Return code | Description     |
| ----------- | --------------- |
| 200         | OK              |
| 420         | Token incorrect |

## Subscribe to a composant

```javascript
fetch("http://localhost:8080/api/composant/subscribe_composant", {
  method: "POST",
  headers: {
    Accept: "application/json",
    jwt: "jwt",
  },
  body: JSON.stringify({
    name: "WIDGETNAME",
    timer: 5,
    fctId: "1",
  }),
});
```

> If all goes well the above command returns JSON structured like this:

```json
return code : 200
{
}
```

> If a problem occur, the above command returns JSON structured like this:

```json
return code : 420
return code : 421
return code : 422
return code : 423
{
}
```

This endpoint allows you to subscribe to a composant.

### Error

| Return code | Description                           |
| ----------- | ------------------------------------- |
| 200         | OK                                    |
| 420         | Token incorrect                       |
| 421         | Already subscribed to this composant  |
| 422         | Args error                            |
| 423         | You are not subscribed to the service |

## Unsubscribe to a composant

```javascript
fetch("http://localhost:8080/api/composant/unsubscribe_composant", {
  method: "DELETE",
  headers: {
    Accept: "application/json",
    jwt: "jwt",
  },
  body: JSON.stringify({
    fctId: "1",
  }),
});
```

> If all goes well the above command returns JSON structured like this:

```json
return code : 200
{
}
```

> If a problem occur, the above command returns JSON structured like this:

```json
return code : 420
return code : 421
return code : 422
{
}
```

This endpoint allows you to unsubscribe to a composant.

### Error

| Return code | Description                              |
| ----------- | ---------------------------------------- |
| 200         | OK                                       |
| 420         | Token incorrect                          |
| 421         | You are not subscribed to this composant |
| 422         | Args error                               |

## Get the current user infos

```javascript
fetch("http://localhost:8080/api/user/infos", {
  method: "GET",
  headers: {
    Accept: "application/json",
    jwt: "jwt",
  },
});
```

> If all goes well the above command returns JSON structured like this:

```json
return code : 200
{
  "username": "exemple"
}
```

> If a problem occur, the above command returns JSON structured like this:

```json
return code : 420
{
}
```

This endpoint gives you the user infos.

### Error

| Return code | Description     |
| ----------- | --------------- |
| 200         | OK              |
| 420         | Token incorrect |

# Id Trigger by services

## facebook

### 21

Action: Track activity for a facebook group

Requires 1 arguments : Facebook Group

Reation: Send an email notification to the user if there is new activity

```javascript
fetch("http://localhost:8080/api/composant/subscribe_composant", {
  method: "POST",
  headers: {
    Accept: "application/json",
    jwt: "jwt",
  },
  body: JSON.stringify({
    name: "WIDGETNAME",
    service: "facebook",
    fctId: "21",
    timer: 500,
  }),
});
```

To obtain the error codes go to : Subscribe to a composant

## google

### 31

Action: Track the last email

Reaction: Reply to the email indicating that we are on holiday

```javascript
fetch("http://localhost:8080/api/composant/subscribe_composant", {
  method: "POST",
  headers: {
    Accept: "application/json",
    jwt: "jwt",
  },
  body: JSON.stringify({
    name: "WIDGETNAME",
    service: "google",
    fctId: "31",
    timer: 500,
  }),
});
```

To obtain the error codes go to : Subscribe to a composant

### 32

Action: Track the last email

requires an argument, if the last email comes from this email address then the reaction will be triggered.

Reaction: Put the mail in the trash

```javascript
fetch("http://localhost:8080/api/composant/subscribe_composant", {
  method: "POST",
  headers: {
    Accept: "application/json",
    jwt: "jwt",
  },
  body: JSON.stringify({
    name: "WIDGETNAME",
    service: "google",
    fctId: "32",
    timer: 500,
    args: ["test@nasa.mars"],
  }),
});
```

To obtain the error codes go to : Subscribe to a composant

## github

### 41

Action: Track if user creates a repository

Reaction: Star the new repository

```javascript
fetch("http://localhost:8080/api/composant/subscribe_composant", {
  method: "POST",
  headers: {
    Accept: "application/json",
    jwt: "jwt",
  },
  body: JSON.stringify({
    name: "WIDGETNAME",
    service: "github",
    fctId: "41",
    timer: 500,
  }),
});
```

To obtain the error codes go to : Subscribe to a composant

### 42

Action: Track push activity for a repository

Requires 1 arguments : Repository

Reaction: notifies the user if there is a new push

```javascript
fetch("http://localhost:8080/api/composant/subscribe_composant", {
  method: "POST",
  headers: {
    Accept: "application/json",
    jwt: "jwt",
  },
  body: JSON.stringify({
    name: "WIDGETNAME",
    service: "github",
    fctId: "42",
    timer: 500,
  }),
});
```

To obtain the error codes go to : Subscribe to a composant

## spotify

### 51

Action: Tracker user follow a playlist

Reaction: Add to your library all the sounds of your top artists in the playlist.

```javascript
fetch("http://localhost:8080/api/composant/subscribe_composant", {
  method: "POST",
  headers: {
    Accept: "application/json",
    jwt: "jwt",
  },
  body: JSON.stringify({
    name: "WIDGETNAME",
    service: "spotify",
    fctId: "51",
    timer: 360,
  }),
});
```

To obtain the error codes go to : Subscribe to a composant

### 52

Action: Tracker user create a playlist

Requires 1 arguments : Damso Vald Arouf

Reaction: Add the top tracks of a specified artist to the playlist

```javascript
fetch("http://localhost:8080/api/composant/subscribe_composant", {
  method: "POST",
  headers: {
    Accept: "application/json",
    jwt: "jwt",
  },
  body: JSON.stringify({
    name: "WIDGETNAME",
    service: "spotify",
    fctId: "52",
    timer: 360,
    args: ["Damso"],
  }),
});
```

To obtain the error codes go to : Subscribe to a composant

## aviationstack

### 61

Action: Follow the activity of an airport

Requires 1 arguments : PARIS TOULOUSE MARSEILLE NEW-YORK

Reaction: If a new data arrives send an email

```javascript
fetch("http://localhost:8080/api/composant/subscribe_composant", {
  method: "POST",
  headers: {
    Accept: "application/json",
    jwt: "jwt",
  },
  body: JSON.stringify({
    name: "WIDGETNAME",
    service: "aviationstack",
    fctId: "61",
    timer: 360,
    args: ["PARIS"],
  }),
});
```

To obtain the error codes go to : Subscribe to a composant

### 62

Action: Follow the activity of a flight

Requires 1 arguments : this argument shoud be Flight number (with or without spaces, IATA , any case formats are acceptable, e.g. KL1395,)

Reaction: If a new data arrives send an email

```javascript
fetch("http://localhost:8080/api/composant/subscribe_composant", {
  method: "POST",
  headers: {
    Accept: "application/json",
    jwt: "jwt",
  },
  body: JSON.stringify({
    name: "WIDGETNAME",
    service: "aviationstack",
    fctId: "62",
    timer: 360,
    args: ["KL1395"],
  }),
});
```

To obtain the error codes go to : Subscribe to a composant

## football

### 71

Action: Live scores

Reaction: Send a notification as soon as there is a goal

```javascript
fetch("http://localhost:8080/api/composant/subscribe_composant", {
  method: "POST",
  headers: {
    Accept: "application/json",
    jwt: "jwt",
  },
  body: JSON.stringify({
    name: "WIDGETNAME",
    service: "football",
    fctId: "71",
    timer: 360,
  }),
});
```

To obtain the error codes go to : Subscribe to a composant

### 72

Action: Live scores of a particular league

Requires 1 arguments : if you want ligue 1 send 46 for other league please refer to the table below

| League         | Code |
| -------------- | ---- |
| Ligue 1        | 46   |
| Premier League | 25   |
| Bundesligua    | 114  |
| Liga           | 74   |
| Serie A        | 73   |

Reaction: Sends an email if a match changes status in a particular division

```javascript
fetch("http://localhost:8080/api/composant/subscribe_composant", {
  method: "POST",
  headers: {
    Accept: "application/json",
    jwt: "jwt",
  },
  body: JSON.stringify({
    name: "WIDGETNAME",
    service: "football",
    fctId: "72",
    timer: 360,
    args: ["46"],
  }),
});
```

To obtain the error codes go to : Subscribe to a composant

## openweather

### 81

Action: Track temperature of a city

Requires 2 arguments as the appId and the city

Reaction: Send a notification if the temperature drops under 10°c

```javascript
fetch("http://localhost:8080/api/composant/subscribe_composant", {
  method: "POST",
  headers : {
    'Accept': 'application/json',
    'jwt': 'jwt'
  },
  body: JSON.stringify({
    name: "WIDGETNAME",
    service: "openweather",
    fctId: "81",
    timer: 500
    args: ["appID", "Toulouse"]
  }),
})
```

To obtain the error codes go to : Subscribe to a composant
