module.exports = function (app, db, admin) {
  app
    .route("/api/metric/:metricid")
    .post(async function (req, res) {})

    .get(async function (req, res) {})

    .put(async function (req, res) {})

    .delete(async function (req, res) {});

  app.route("/api/getMetricsForUser").get(async function (req, res) {});
};
