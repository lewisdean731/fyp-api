import verifyToken from "../../utils/authUtil";

// Admin SDK
const admin = require("firebase-admin");

const serviceAccount = require("../../resources/admin-sdk-service-account.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = function(app){

  app.route("/api/user")
    .post(function (req, res) {
      const docRef = db.collection('users').doc(req.body.uid)

      await docRef.set({
        'admin': req.body.admin,
        'teams': req.body.teams
      }).then((response) => {
        res.send(response)
      }).catch((error) => {
        res.status(500)
        res.send(error)
      })
    })
    .get(function (req, res) {
      res.send("Read user")
    })
    .put(function (req, res) {
      res.send("Update user")
    })
    .delete(function (req, res) {
      res.send("Delete user")
    })

}