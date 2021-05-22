const axios = require('axios');

module.exports = function (app, admin) {
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

  app.post("/api/auth/verifyProjectCredentials", async(req, res) => {
    console.log(`Verifying ${req.body.url}`)
    await axios.get(req.body.url, {
        auth: {
          username: req.body.username,
          password: req.body.password,
        },
      })
      .then(() => {
        res.send(true)
      })
      .catch(() => {
        res.send(false)
      });
  });
};
