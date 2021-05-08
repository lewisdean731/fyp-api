const express = require("express");
const app = express();
const port = 8080;

// Admin SDK
const admin = require("firebase-admin");

const serviceAccount = require("./resources/admin-sdk-service-account.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

///////////////

app.get("/api/auth/verifyToken", (req, res) => {
  console.log(`Verifying token ${req.query.token.slice(0,10)}...`)
  admin
    .auth()
    .verifyIdToken(req.query.token)
    .then((decodedToken) => {
      res.send(decodedToken.uid);
    })
    .catch((error) => {
      res.status(401);
      res.send(error);
    });
});
