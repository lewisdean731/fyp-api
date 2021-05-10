module.exports = function (app, db) {
  app
    .route("/api/project/:projectid")
    .post(async function (req, res) {
      const docRef = db.collection("projects").doc(req.params.projectid);
      await docRef
        .set({
          team: req.body.teamid,
        })
        .then((response) => {
          return res.json(response);
        })
        .catch((error) => {
          return res.status(500).json(error);
        });
    })

    .get(async function (req, res) {
      const docRef = db.collection("projects").doc(req.params.projectid);
      const doc = await docRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: "No such document" });
      } else {
        return res.json(doc.data());
      }
    })

    .put(async function (req, res) {
      const docRef = db.collection("projects").doc(req.params.projectid);
      await docRef
        .set({
          team: req.body.teamid,
        })
        .then((response) => {
          return res.json(response);
        })
        .catch((error) => {
          return res.status(500).json(error);
        });
    })

    .delete(async function (req, res) {
      const docRef = db.collection("projects").doc(req.params.projectid);
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
