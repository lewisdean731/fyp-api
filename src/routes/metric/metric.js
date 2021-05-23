module.exports = function (app, db, admin) {
  app
    .route("/api/metric/:metricId")
    .post(async function (req, res) {
      const docRef = db.collection("metrics").doc(req.params.metricId);
      const doc = await docRef.get();
      if (!doc.exists) {
        return res.status(404).json({ error: "No such document" });
      }
      await docRef
        .update({
          // Set to the value given or the existing value by default
          totalProjects: req.body.totalProjects || doc.data().totalProjects,
          greenProjects: req.body.greenProjects || doc.data().greenProjects,
          yellowProjects: req.body.yellowProjects || doc.data().yellowProjects,
          redProjects: req.body.redProjects || doc.data().redProjects,
        })
        .then((response) => {
          return res.json(response);
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
          return res.status(500).json(error);
        });
    })

    .get(async function (req, res) {
      const timeSeriesMetrics = [
        "totalDependencies",
        "greenDependencies",
        "yellowDependencies",
        "redDependencies",
      ];
      // Differentiate for timeseries metrics
      if (timeSeriesMetrics.includes(req.query.metricName)) {
        let timeSeries = [];
        db.collection("metrics")
          .doc(req.params.metricId)
          .collection(req.query.metricName)
          .get()
          .then((response) => {
            response.forEach((doc) => {
              timeSeries.push({ timestamp: doc.id, ...doc.data() });
            });
            return res.status(200).json(timeSeries);
          })
          .catch((error) => {
            console.log(error);
            return res.status(404).json({ error: "No such collection!" });
          });
      } else {
        const docRef = db.collection("metrics").doc(req.params.metricId);
        const doc = await docRef.get();
        if (!doc.exists) {
          return res.status(404).json({ error: "No such document!" });
        } else {
          return res.json(doc.data());
        }
      }
    })

    .put(async function (req, res) {
      db.collection("metrics")
        .doc(req.params.metricId)
        .collection(req.body.metricName)
        .doc(req.body.timestamp.toString())
        .set({
          value: req.body.value,
        })
        .then((response) => {
          return res.status(200).json(response);
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
          return res.status(500).json(error);
        });
    })

    .delete(async function (req, res) {});

  app.route("/api/getMetricsForUser").get(async function (req, res) {});
};
