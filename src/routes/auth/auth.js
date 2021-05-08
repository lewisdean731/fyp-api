module.exports = function (app) {
  app.get("/api/auth/verifyToken", (req, res) => {
    console.log(`Verifying token ${req.query.token.slice(0, 10)}...`);
    admin
      .auth()
      .verifyIdToken(req.query.token)
      .then((decodedToken) => {
        return res.json(decodedToken.uid);
      })
      .catch((error) => {
        return res.status(401).json(error);
      });
  });
};
