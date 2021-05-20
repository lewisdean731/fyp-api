module.exports = function (app, db, admin) {
  app
    .route("/api/notification/:notificationId")
    .post(async function (req, res) {
    
    })

    .get(async function (req, res) {

    })

    .put(async function (req, res) {
      const docRef = db.collection("notifications").doc();
      docRef
        .set({
          severity: req.body.severity,
          message: req.body.message,
          projectName: req.body.projectName,
          projectId: req.body.projectId,
          timestamp: new Date().getTime(),
          acknowledged: false,
        })
        .then((response) => {
          return res.json(response);
        })
        .catch((error) => {
          return res.status(500).json(error);
        });
    })

    .delete(async function (req, res) {

    });

  app.route("/api/getNotificationsForUser").get(async function (req, res) {

  });
};
