module.exports = function (app, db) {
  app
    .route("/api/project/:projectid")
    .post(async function (req, res) {
      const docRef = db.collection("projects").doc(req.params.projectid);
      const doc = await docRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: "No such document" });
      } else {
        await docRef
          .update({
            // Set to the value given or the existing value by default
            projectName: req.body.projectName || doc.data().projectName,
            projectType: req.body.projectType || doc.data().projectType,
            projectDependencies: {
              directDependencies:
                req.body.directDependencies ||
                doc.data().projectDependencies.directDependencies,
            },
            teamId: req.body.teamId || doc.data().teamId,
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
      const docRef = db.collection("projects").doc(req.params.projectid);
      const doc = await docRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: "No such document" });
      } else {
        return res.json(doc.data());
      }
    })

    .put(async function (req, res) {
      console.log(JSON.stringify(req.body))
      const docRef = db.collection("projects").doc();
      await docRef
        .set({
          projectName: req.body.projectName,
          projectType: req.body.projectType,
          projectDependencies: req.body.projectDependencies,
          teamId: req.body.teamId
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

  app
    .route("/api/getAllProjectsForUser")
    .get(async function (req, res) {
      // Get user's teams
      const userRef = db.collection("users").doc(req.query.uid);
      await userRef.get()
        .then(async(doc) => {
          // Get all projects matching user's teams
           const collectionRef = db.collection("projects").where(
            "teamId", "in", doc.data().teams
          );
          await collectionRef.get()
          .then((snapshot) => {
            let data = { projectsData: [] }
            snapshot.forEach(doc => {
              // Add doc ID (projectId) inside doc
              let docData = doc.data();
              docData["projectId"] = doc.id
              data.projectsData.push(docData)
            })
            return res.json(data)
          })
          .catch((error) => {
            console.log(error)
            return res.status(500).json(error);
          })
        })
    })

  app
    .route("/api/getAllProjectIds")
    .get(async function (req, res) {
      console.log('Get All Project IDs')
      const collectionRef = db.collection("projects");
      await collectionRef.get()
      .then((snapshot) => {
        let data = { projectIds: [] }
        snapshot.forEach(doc => {
          data.projectIds.push(doc.id)
        })
        return res.json(data)
      })
      .catch((error) => {
        console.log(error)
        return res.status(500).json(error);
      })
    })
};
