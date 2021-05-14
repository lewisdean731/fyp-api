module.exports = function (app, db, admin) {
  app
    .route("/api/team/:teamid")
    .post(async function (req, res) {
      const docRef = db.collection("teams").doc(req.params.teamid);
      const doc = await docRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: "No such document" });
      } else {
        await docRef
          .update({
            // Set to the value given or the existing value by default
            teamName: req.body.teamName || doc.data().teamName,
            teamMembers: req.body.teamMembers || doc.data().teamMembers,
            teamAdmins: req.body.teamAdmins || doc.data().teamAdmins,
            teamProjects: req.body.teamProjects || doc.data().teamProjects,
          })
          .then((response) => {
            return res.json(response);
          })
          .catch((error) => {
            return res.status(500).json(error);
          });
      }
    })

    .get(async function (req, res) {
      const docRef = db.collection("teams").doc(req.params.teamid);
      const doc = await docRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: "No such document" });
      } else {
        return res.json(doc.data());
      }
    })

    .put(async function (req, res) {
      const docRef = db.collection("teams").doc();
      await docRef
        .set({
          teamName: req.body.teamName,
          teamMembers: req.body.teamMembers,
          teamAdmins: req.body.teamAdmins,
          teamProjects: [],
        })
        .catch((error) => {
          return res.status(500).json(error);
        });

      //Link new team to creating user
      const userDocRef = db.collection("users").doc(req.body.teamAdmins[0]);
      await userDocRef
        .update({
          teams: admin.firestore.FieldValue.arrayUnion(docRef.id),
        })
        .then((response) => {
          return res.json(response);
        })
        .catch((error) => {
          return res.status(500).json(error);
        });
    })

    .delete(async function (req, res) {
      const docRef = db.collection("teams").doc(req.params.teamid);
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
