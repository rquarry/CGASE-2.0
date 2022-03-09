const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json"
  };

  try {
    switch (event.path) {
      case "DELETE /users/{id}":
        await dynamo
          .delete({
            TableName: "seUserTable",
            Key: {
              user_id: event.pathParameters.id
            }
          })
          .promise();
        body = `Deleted item ${event.pathParameters.user_id}`;
        break;
      case "DELETE /deck/logs/{id}":
        body = await dynamo
          .delete({
            TableName: "seLogTable",
            Key: {
              message_id: event.pathParameters.id
            }
          })
          .promise();
        break;
      default:
        throw new Error(`Unsupported path: "${event.path}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
};
