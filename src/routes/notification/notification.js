module.exports = function (app, db, admin) {
  app
    .route("/api/notification/:notificationId")
    .post(async function (req, res) {
      const docRef = db
        .collection("notifications")
        .doc(req.params.notificationId);
      const doc = await docRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: "No such document" });
      } else {
        await docRef
          .update({
            acknowledged: true,
          })
          .then((response) => {
            return res.json(response);
          })
          .catch((error) => {
            console.log(JSON.stringify(error));
            return res.status(500).json(error);
          });
      }
    })

    .get(async function (req, res) {})

    .put(async function (req, res) {
      if (
        req.body.projectId &&
        req.body.dependencyName &&
        req.body.nextVersion
      ) {
        const docRef = db
          .collection("notifications")
          .doc(
            `${req.body.projectId}.${req.body.dependencyName}.${req.body.nextVersion}`
          );
        const doc = await docRef.get();
        if (doc.exists) {
          // Stop if notification already exists
          return res.status(200).json({message: "document already exists"});
        }
        docRef
          .set({
            severity: req.body.severity,
            message: req.body.message,
            projectName: req.body.projectName,
            projectId: req.body.projectId,
            timestamp: new Date().getTime(),
            nextVersion: req.body.nextVersion,
            acknowledged: false,
          })
          .then((response) => {
            return res.json(response);
          })
          .catch((error) => {
            console.log(JSON.stringify(error));
            return res.status(500).json(error);
          });
      } else {
        return res
          .status(400)
          .json({ error: "Missing properties from request" });
      }
    })

    .delete(async function (req, res) {});

  app.route("/api/getNotificationsForUser").get(async function (req, res) {
    if (!req.tokenUid) {
      return res.status(401).json({ error: "please provide an access token" });
    }
    // Get user's teams
    const userRef = db.collection("users").doc(req.tokenUid);
    await userRef.get().then(async (doc) => {
      // Get all projects matching user's teams
      if (!doc.data().teams[0]) {
        return res.status(200).json({ notificationsData: [] });
      }
      let collectionRef = db
        .collection("projects")
        .where("teamId", "in", doc.data().teams);
      await collectionRef
        .get()
        .then(async (snapshot) => {
          let projectIds = [];
          snapshot.forEach((doc) => {
            projectIds.push(doc.id);
          });
          // Get all notifs matching projectIds list
          if (!projectIds[0]) {
            return res.status(200).json({ notificationsData: [] });
          }
          collectionRef = db
            .collection("notifications")
            .where("projectId", "in", projectIds);
          await collectionRef.get().then((snapshot) => {
            let data = { notificationsData: [] };
            snapshot.forEach((doc) => {
              // Add doc ID (notificationId) inside doc
              let docData = doc.data();
              if (doc.data().acknowledged) {
                return;
              }
              docData["notificationId"] = doc.id;
              data.notificationsData.push(docData);
            });
            return res.json(data);
          });
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
          return res.status(500).json(error);
        });
    });
  });
};
