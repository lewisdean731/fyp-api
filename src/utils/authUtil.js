// Admin SDK
const admin = require("firebase-admin");

const serviceAccount = require("../../resources/admin-sdk-service-account.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

function verifyToken (token) {
  console.log(`Verifying token ${req.query.token.slice(0,10)}...`)
    admin
      .auth()
      .verifyIdToken(req.query.token)
      .then((decodedToken) => {
        return decodedToken.uid
      })
      .catch(() => {
        return false
      });
}

export default verifyToken;