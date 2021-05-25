import { fetchEnvVar } from "./envUtil";

const topicName = fetchEnvVar("PUBSUB_TOPIC_NAME");
const orderingKey = "api-new-project";

// Imports the Google Cloud client library
const { PubSub } = require("@google-cloud/pubsub");

// Creates a client; cache this for further use
const pubSubClient = new PubSub();

export async function publishMessage(attributes) {
  const message = {
    data: Buffer.from("Project ID Message"),
    attributes: attributes,
    orderingKey: orderingKey,
  };

  // Publishes the message as a string, e.g. "Hello, world!" or JSON.stringify(someObject)
  try {
    const messageId = await pubSubClient
      .topic(topicName, { enableMessageOrdering: true })
      .publishMessage(message);
    console.log(`Message ${messageId} published for project ${id}`);
  } catch (error) {
    console.error(
      `Received error while publishing message for project ${id}: ${error.message}`
    );
  }
}

export default publishMessage;
