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
      res.send("Create user")
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