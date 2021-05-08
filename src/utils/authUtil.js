// Admin SDK

exports.verifyToken = (token) => {
  console.log(`Verifying token ${token.slice(0, 10)}...`);
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
