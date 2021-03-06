module.exports = function (app, db) {
  app
    .route("/api/user/:uid")
    .post(async function (req, res) {
      const docRef = db.collection("users").doc(req.params.uid);
      const doc = await docRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: "No such document" });
      } else {
        await docRef
          .update({
            // Set to the value given or the existing value by default
            admin: req.body.admin || doc.data().admin,
            teams: req.body.teams || doc.data().teams,
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
      const docRef = db.collection("users").doc(req.body.uid);
      const response = await docRef
        .set({
          admin: false,
          teams: [],
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
          return res.status(500).json(error);
        });

      // create metrics for user
      let metricRef = db
        .collection("metrics")
        .doc(req.body.uid)
        .collection("totalDependencies")
        .doc();
      await metricRef
        .set({
          timestamp: new Date().getTime(),
          value: 0,
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
          return res.status(500).json(error);
        });

      metricRef = db
        .collection("metrics")
        .doc(req.body.uid)
        .collection("greenDependencies")
        .doc();
      await metricRef
        .set({
          timestamp: new Date().getTime(),
          value: 0,
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
          return res.status(500).json(error);
        });

      metricRef = db
        .collection("metrics")
        .doc(req.body.uid)
        .collection("yellowDependencies")
        .doc();
      await metricRef
        .set({
          timestamp: new Date().getTime(),
          value: 0,
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
          return res.status(500).json(error);
        });

      metricRef = db
        .collection("metrics")
        .doc(req.body.uid)
        .collection("redDependencies")
        .doc();
      await metricRef
        .set({
          timestamp: new Date().getTime(),
          value: 0,
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
          return res.status(500).json(error);
        });

      metricRef = db.collection("metrics").doc(req.body.uid);
      await metricRef
        .set({
          totalProjects: 0,
          greenProjects: 0,
          yellowProjects: 0,
          redProjects: 0,
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
          return res.status(500).json(error);
        });

      return res.json(response);
    })

    .delete(async function (req, res) {
      const userRef = db.collection("users").doc(req.params.uid);
      const metricsRef = db.collection("metrics").doc(req.params.uid);
      if (req.params.uid != req.tokenId) {
        return res
          .status(403)
          .json({ error: "Users can only delete themselves!" });
      }
      await userRef
        .delete()
        .then(async () => {
          await metricsRef
            .delete()
            .then((response) => {
              return res.json(response);
            })
            .catch((error) => {
              console.log(JSON.stringify(error));
              return res.status(500).json(error);
            });
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
          return res.status(500).json(error);
        });
    });

  app.route("/api/getAllUserIds").get(async function (req, res) {
    console.log("Get All User IDs");
    const collectionRef = db.collection("users");
    await collectionRef
      .get()
      .then((snapshot) => {
        let data = { userIds: [] };
        snapshot.forEach((doc) => {
          data.userIds.push(doc.id);
        });
        return res.json(data);
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        return res.status(500).json(error);
      });
  });
};
