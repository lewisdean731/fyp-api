const express = require("express");
const app = express();
const port = 8080;

// Admin SDK
const admin = require("firebase-admin");

const serviceAccount = require("./resources/admin-sdk-service-account.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const auth = require("./utils/authUtil")(admin, db);

// parse application/json
app.use(express.json());

// protect all routes
app.use(async function (req, res, next) {
  if (typeof req.query.apiKey != "undefined") {
    if ((await auth.verifyApiKey(req.query.apiKey)) === false) {
      return res.status(403).json({ error: "Unauthorised" });
    }
  } else {
    if (!req.get("authorization")) {
      return res.status(403).json({ error: "No authorization given" });
    }
    auth.verifyToken(req.get("authorization"), function (uid) {
      if (uid === false) {
        return res.status(403).json({ error: "Unauthorised" });
      }
      req["tokenUid"] = uid;
    });
  }
  next();
});

require("./routes/auth/auth.js")(app, admin);
require("./routes/user/user.js")(app, db);
require("./routes/project/project.js")(app, db, admin);
require("./routes/team/team.js")(app, db, admin);
require("./routes/notification/notification.js")(app, db, admin);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
