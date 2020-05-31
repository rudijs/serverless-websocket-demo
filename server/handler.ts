import { APIGatewayProxyHandler } from "aws-lambda"
import "source-map-support/register"
import * as util from "util"
import * as AWS from "aws-sdk"

AWS.config.region = process.env.REGION

export const connect: APIGatewayProxyHandler = async (event, _context) => {
  return {
    statusCode: 200,
    body: "OK",
  }
}

export const hello: APIGatewayProxyHandler = async (event, _context) => {
  const domain = event.requestContext.domainName
  const stage = event.requestContext.stage
  const connectionId = event.requestContext.connectionId
  const callbackUrlForAWS = util.format(util.format("https://%s/%s", domain, stage)) //construct the needed url
  // console.log(callbackUrlForAWS, connectionId, event)
  await sendMessageToClient(callbackUrlForAWS, connectionId, event)
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!",
      // input: event,
    }),
  }
}

const sendMessageToClient = (url, connectionId, payload) =>
  new Promise((resolve, reject) => {
    const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: url,
    })
    apigatewaymanagementapi.postToConnection(
      {
        ConnectionId: connectionId, // connectionId of the receiving ws-client
        Data: JSON.stringify(payload),
      },
      (err, data) => {
        if (err) {
          console.log("err is", err)
          reject(err)
        }
        resolve(data)
      }
    )
  })
