var express = require('express');
var router = express.Router();

// Firebase
var firebase = require("firebase");
var admin = require("firebase-admin");
var referencia_db = "registros"

var serviceAccount = require("../database/notifications-db-283547e8e616.json");

firebase.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://notifications-db.firebaseio.com"
});

router
  .post('/', function(req, res, next) { // Post
    if(!req.body.id_user || !req.body.subject || !req.body.content ){
      res
        .status(400)
        .json({ message: 'Bad Request', code: 400, description: 'Peticion incorrecta' })
    }

    var subject = req.body.subject;
    var content = req.body.content;
    var id_user = req.body.id_user;

    var read = false;
    var delivered = false;

    var db = firebase.database();
    var element1 = db.ref(referencia_db).push()
    element1.set({
      subject: subject,
      content: content,
      id_user: id_user,
      read: read,
      delivered: delivered
    })

    res
      .status(201)
      .json({ description: 'Created', code:201})
  })

  .put('/:id_notification', function(req, res, next) {
    if( !req.params.id && !req.body ){
      res
        .status(400)
        .json({ message: 'Bad Request', code: 400, description: 'Parametros vacios' })
    }

    if( !req.body.subject || !req.body.content || !req.body.read || !req.body.delivered || !req.body.id_user ){
      res
        .status(400)
        .json({ message: 'Bad Request', code: 400, description: 'Peticion incorrecta' })
    }

    var db = firebase.database();
    url_edicion = referencia_db+"/"+req.params.id_notification;
    var element1 = db.ref(url_edicion)

    var subject = req.body.subject;
    var content = req.body.content;
    var read = req.body.read;
    var delivered = req.body.delivered;
    var id_user = req.body.id_user;

    element1.set({
      subject: subject,
      content: content,
      read: read,
      delivered: delivered,
      id_user: id_user
    })

    res
      .status(204)
      .json({ description: 'No Content', code:204})
  })

module.exports = router;
