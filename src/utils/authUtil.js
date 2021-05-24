// Admin SDK
module.exports = function (admin, db) {
  var auth = {};
  auth.verifyToken = async function (token) {
    console.log(`Verifying token ${token.slice(0, 10)}...`);
    return await admin
      .auth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        return decodedToken.uid;
      })
      .catch((error) => {
        console.log(error.message);
        throw false;
      });
  };

  auth.verifyApiKey = async function (apiKey) {
    console.log(`Verifying API Key ${apiKey.slice(0, 10)}...`);
    const key = apiKey.toString().split(".");
    const docRef = db.collection("serviceAccounts").doc(key[0]);
    const doc = await docRef.get();
    if (doc.exists) {
      if (doc.data["apiKey"] === key[1]) {
        return true;
      }
    } else {
      console.log("API Key not found or incorrect");
      return false;
    }
  };

  auth.userCanAccessProject = async function (uid, projectId) {
    const docRef = db.collection("users").doc(uid);
    let teams = [];
    await docRef
      .get()
      .then((doc) => {
        teams = doc.data().teams;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
    const collectionRef = db.collection("teams");
    return await collectionRef
      .get()
      .then((snapshot) => {
        let projectIds = [];
        snapshot.forEach((doc) => {
          projectIds.push(...doc.data().teamProjects);
        });
        if (projectIds.includes(projectId)) {
          return true;
        }
        return false;
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        return false;
      });
  };

  auth.userCanAccessTeam = async function (uid, teamId) {
    const docRef = db.collection("teams").doc(teamId);
    return await docRef
      .get()
      .then((doc) => {
        if (doc.data().teamMembers.includes(uid)) {
          return true;
        }
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  };

  return auth;
};
