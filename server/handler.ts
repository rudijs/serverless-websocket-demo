import { APIGatewayProxyHandler } from "aws-lambda"
import "source-map-support/register"
import * as util from "util"
import * as AWS from "aws-sdk"
import { ServiceConfigurationOptions } from "aws-sdk/lib/service"

import { put } from "./functions/ddb"

let serviceConfigOptions: ServiceConfigurationOptions = {
  region: process.env.REGION,
}

// AWS.config.region = process.env.REGION
const dynamodb = new AWS.DynamoDB.DocumentClient(serviceConfigOptions)

export const connect: APIGatewayProxyHandler = async (event, _context) => {
  // console.log("event", JSON.stringify(event))

  const putParams = {
    TableName: "WSConnections",
    Item: {
      ConnectionID: event.requestContext.connectionId,
    },
  }

  // save connection to database
  // if database error we'll continue the user can still connect to the websocket service
  const res = await put(dynamodb, putParams)
  if (res.errors) {
    console.log("DynamoDB Error:", JSON.stringify(res.errors))
  }

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
