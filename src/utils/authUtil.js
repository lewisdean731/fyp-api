// Admin SDK
module.exports = function (admin, db) {
  var auth = {};
  auth.verifyToken = function (token) {
    console.log(`Verifying token ${token.slice(0, 10)}...`);
    admin
      .auth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        return decodedToken.uid;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  };

  auth.verifyApiKey = async function (apiKey) {
    console.log(`Verifying API Key ${apiKey.slice(0, 10)}...`);
    const key = (apiKey.toString()).split(".")
    const docRef = db.collection("serviceAccounts").doc(key[0]);
      const doc = await docRef.get();
      if (doc.exists) {
        if(doc.data["apiKey"] === key[1])
        {
          return true
        }
      } else {
        return false
      }
  };

  return auth;
};