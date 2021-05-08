// Admin SDK
module.exports = function(admin) {
  var auth = {};
  auth.verifyToken = function(token) {
    console.log(`Verifying token ${token.slice(0, 10)}...`);
    admin
      .auth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        return decodedToken.uid;
      })
      .catch((error) => {
        console.log(error)
        return false;
      });
  };

  return auth;
}
