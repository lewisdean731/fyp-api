module.exports = function (app, db, admin) {
  app
    .route("/api/project/:projectid")
    .post(async function (req, res) {
      const docRef = db.collection("projects").doc(req.params.projectid);
      const doc = await docRef.get();
      // Check document exists AND project is of allowed type
      if (!doc.exists) {
        return res.status(404).json({ error: "No such document" });
      }
      if (
        req.body.projectType &&
        !["npm"].includes(Object.keys(req.body.projectType)[0])
      ) {
        return res.status(400).json({ error: "Project type not allowed" });
      } else {
        docRef
          .update({
            // Set to the value given or the existing value by default
            projectName: req.body.projectName || doc.data().projectName,
            projectType: req.body.projectType || doc.data().projectType,
            projectDependencies: {
              directDependencies:
                req.body.directDependencies ||
                doc.data().projectDependencies.directDependencies,
            },
            yellowWarningPeriod:
              parseInt(req.body.yellowWarningPeriod) ||
              doc.data().yellowWarningPeriod,
            redWarningPeriod:
              parseInt(req.body.redWarningPeriod) ||
              doc.data().redWarningPeriod,
            lastScannedAt: req.body.lastScannedAt || doc.data().lastScannedAt || 0,
            scanErrors: req.body.scanErrors || doc.data().scanErrors || {},
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
      console.log(JSON.stringify(req.body));
      if (!["npm"].includes(Object.keys(req.body.projectType)[0])) {
        return res.status(400).json({ error: "Project type not allowed" });
      }
      const docRef = db.collection("projects").doc();
      await docRef
        .set({
          projectName: req.body.projectName,
          projectType: req.body.projectType,
          projectDependencies: req.body.projectDependencies,
          teamId: req.body.teamId,
          yellowWarningPeriod: parseInt(req.body.yellowWarningPeriod) || 8.64e8, // 10 days
          redWarningPeriod: parseInt(req.body.redWarningPeriod) || 1.296e9, // 15 days
          lastScannedAt: 0,
          scanErrors: {},
        })
        .catch((error) => {
          return res.status(500).json(error);
        });
      // Link new project to team
      const teamDocRef = db.collection("teams").doc(req.body.teamId);
      await teamDocRef
        .update({
          teamProjects: admin.firestore.FieldValue.arrayUnion(docRef.id),
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
      const doc = await docRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: "No such document" });
      }
      const teamDocRef = db.collection("teams").doc(doc.data().teamId);
      const teamDoc = await teamDocRef.get();

      // Check is user is admin of project's team first
      if (teamDoc.data().teamAdmins.includes(req.tokenUid)) {
        await docRef.delete().then((response) => {
          // Delete project ID from team
          const teamDocRef = db.collection("teams").doc(doc.data().teamId);
          teamDocRef
            .update({
              teamProjects: admin.firestore.FieldValue.arrayRemove(docRef.id),
            })
            .then(() => {
              return res.json(response);
            })
            .catch((error) => {
              return res.status(500).json(error);
            });
        });
      } else {
        console.log(
          `User ${res.uid} tried to delete project ${
            req.params.projectid
          } when the team admins are ${teamDoc.data().teamAdmins}`
        );
        return res
          .status(403)
          .json({ error: "Only team admins can delete projects" });
      }
    });

  app.route("/api/getAllProjectsForUser").get(async function (req, res) {
    // Get user's teams
    const userRef = db.collection("users").doc(req.query.uid);
    await userRef.get().then(async (doc) => {
      // Get all projects matching user's teams
      const collectionRef = db
        .collection("projects")
        .where("teamId", "in", doc.data().teams);
      await collectionRef
        .get()
        .then((snapshot) => {
          let data = { projectsData: [] };
          snapshot.forEach((doc) => {
            // Add doc ID (projectId) inside doc
            let docData = doc.data();
            docData["projectId"] = doc.id;
            data.projectsData.push(docData);
          });
          return res.json(data);
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).json(error);
        });
    });
  });

  app.route("/api/getAllProjectIds").get(async function (req, res) {
    console.log("Get All Project IDs");
    const collectionRef = db.collection("projects");
    await collectionRef
      .get()
      .then((snapshot) => {
        let data = { projectIds: [] };
        snapshot.forEach((doc) => {
          data.projectIds.push(doc.id);
        });
        return res.json(data);
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json(error);
      });
  });
};
