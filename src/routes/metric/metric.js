module.exports = function (app, db, admin) {
  app
    .route("/api/metric/:metricId")
    .post(async function (req, res) {})

    .get(async function (req, res) {
      let timeSeries = []
      db.collection("metrics").doc(req.params.metricId)
      .collection(req.query.metricName).get()
      .then((response) => {
        response.forEach((doc) => {
          timeSeries.push({timestamp: doc.id, ...doc.data()})
        })
        return res.status(200).json(timeSeries)
      })
    })

    .put(async function (req, res) {})

    .delete(async function (req, res) {});

  app.route("/api/getMetricsForUser").get(async function (req, res) {});
};
