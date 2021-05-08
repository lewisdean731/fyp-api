module.exports = function (app, db, auth) {
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
          return res.json(response);
        })
        .catch((error) => {
          return res.status(500).json(error);
        });
    })

    .get(async function (req, res) {
      const docRef = db.collection("users").doc(req.params.uid);
      const doc = await docRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: "No such document!" });
      } else {
        return res.json(doc.data());
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
          return res.json(response);
        })
        .catch((error) => {
          return res.status(500).json(error);
        });
    })

    .delete(async function (req, res) {
      const docRef = db.collection("users").doc(req.params.uid);
      if (req.get("authorization") != req.params.uid) {
        return res
          .status(403)
          .json({ error: "Users can only delete themselves!" });
      }
      await docRef
        .delete()
        .then((response) => {
          return res.json(response);
        })
        .catch((error) => {
          return res.status(500).json(error);
        });
    });
};
