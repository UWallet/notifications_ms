var express = require('express');
var router = express.Router();

// Firebase
var firebase = require("firebase");
var admin = require("firebase-admin");
var referencia_db = "registros"

var serviceAccount = require("../database/notifications-db-283547e8e616.json");
var adminAccount = require("../database/notifications-db-firebase-adminsdk-mgzle-c98314b7df.json")

firebase.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://notifications-db.firebaseio.com"
});

admin.initializeApp({
  credential: admin.credential.cert(adminAccount),
  databaseURL: "https://notifications-db.firebaseio.com"
});


router
  .post('/', function(req, res, next) { // Post
    if(!req.body.id_user || !req.body.subject || !req.body.content || !req.body.notification_key ){
      res
        .status(400)
        .json({ message: 'Bad Request', code: 400, description: 'Peticion incorrecta' })
    }

    var subject = req.body.subject;
    var content = req.body.content;
    var id_user = req.body.id_user;
    var notificationKey = req.body.notification_key;

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
    // The topic name can be optionally prefixed with "/topics/".
    // See the "Defining the message payload" section below for details
    // on how to define a message payload.
    var payload = {
       notification: {
        title: subject,
        body: content
      },
        data: {
          subject: subject,
          content: content,
          id_user: id_user.toString(),
          read: read.toString(),
          delivered: delivered.toString()
      }

    };
    console.log(payload)
    console.log(notificationKey)
    admin.messaging().sendToDeviceGroup(notificationKey, payload)
      .then(function(response) {
        // See the MessagingDeviceGroupResponse reference documentation for
        // the contents of response.
        console.log("Successfully sent message:", response);
        res.writeContinue();
      })
      .catch(function(error) {
        console.log("Error sending message:", error);
        res.status(500);
      });

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
