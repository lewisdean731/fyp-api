// Admin SDK

module.exports = function verifyToken(token) {
  console.log(`Verifying token ${req.query.token.slice(0, 10)}...`);
  admin
    .auth()
    .verifyIdToken(req.query.token)
    .then((decodedToken) => {
      return decodedToken.uid;
    })
    .catch(() => {
      return false;
    });
};
