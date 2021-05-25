module.exports = function () {
  let pubSubUtil = {};

  pubSubUtil.publishMessage = async function (attributes) {
    // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
    try {
      const topicName = "projects/bu-fyp-s5008913/topics/project-scan";
      const orderingKey = "api-new-project";
      // Imports the Google Cloud client library
      const { PubSub } = require("@google-cloud/pubsub");
      // Creates a client; cache this for further use
      const pubSubClient = new PubSub();
      const message = {
        data: Buffer.from("New Project ID Message"),
        attributes: attributes,
        orderingKey: orderingKey,
      };

      const messageId = await pubSubClient
        .topic(topicName, { enableMessageOrdering: true })
        .publishMessage(message);
      console.log(
        `Message ${messageId} published with attributes ${JSON.stringify(
          attributes
        )}`
      );
    } catch (error) {
      console.error(
        `Received error while publishing message with attributes ${JSON.stringify(
          attributes
        )}: ${error.message}`
      );
    }
  };

  return pubSubUtil;
};
