require("../../utils/authUtil");

module.exports = function (app, db) {
  app
    .route("/api/user/:uid")
    .post(async function (req, res) {
      const docRef = db.collection("users").doc(req.body.uid);
      await docRef
        .set({
          admin: req.body.admin,
          teams: req.body.teams,
        })
        .then((response) => {
          res.send(response);
        })
        .catch((error) => {
          res.status(500);
          res.send(error);
        });
    })

    .get(async function (req, res) {
      const docRef = db.collection("users").doc(req.params.uid);
      const doc = await docRef.get();
      if (!doc.exists) {
        res.status(404);
        res.send("No such document!");
      } else {
        res.send(doc.data());
      }
    })

    .put(async function (req, res) {
      const docRef = db.collection("users").doc(req.params.uid);
      await docRef
        .set({
          admin: req.body.admin,
          teams: req.body.teams,
        })
        .then((response) => {
          res.send(response);
        })
        .catch((error) => {
          res.status(500);
          res.send(error);
        });
    })

    .delete(async function (req, res) {
      const docRef = db.collection("users").doc(req.params.uid);
      await docRef
        .delete()
        .then((response) => {
          res.send(response);
        })
        .catch((error) => {
          res.status(500);
          res.send(error);
        });
    });
};
