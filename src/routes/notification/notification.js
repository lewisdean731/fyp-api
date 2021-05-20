module.exports = function (app, db, admin) {
  app
    .route("/api/notification/:notificationId")
    .post(async function (req, res) {
    
    })

    .get(async function (req, res) {

    })

    .put(async function (req, res) {
      if(req.body.projectId && req.body.dependencyName && req.body.nextVersion){
        const docRef = db.collection("notifications").doc(`${req.body.projectId}.${req.body.dependencyName}.${req.body.nextVersion}`);
        const doc = await docRef.get();
        if (!doc.exists) {
          return res.status(200) // Stop if notification already exists
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
            return res.status(500).json(error);
          });
      } else {
        return res.status(400).json({error: "Missing properties from request"});
      }
    })

    .delete(async function (req, res) {

    });

  app.route("/api/getNotificationsForUser").get(async function (req, res) {

  });
};
