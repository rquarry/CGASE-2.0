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
      case "/users/{id}":
          body = await dynamo
          .get({
          TableName: "SE_Users",
          Key: {
             id: event.pathParameters.id
          }
          })
         .promise();
        break;
      case "/users":
        body = await dynamo.scan({ TableName: "SE_Users" }).promise();
        break;
      default:
        throw new Error(`Unsupported route: "${event.path}"`);
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

