import { APIGatewayProxyHandler } from "aws-lambda"
import "source-map-support/register"
import * as util from "util"
import * as AWS from "aws-sdk"
import { ServiceConfigurationOptions } from "aws-sdk/lib/service"

import { put, deleteItem } from "./functions/ddb"

// https://seed.run/blog/how-to-fix-dynamodb-timeouts-in-serverless-application.html
let serviceConfigOptions: ServiceConfigurationOptions = {
  region: process.env.REGION,
  httpOptions: { timeout: 5000 },
  maxRetries: 3,
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

export const disconnect: APIGatewayProxyHandler = async (event, _context) => {
  // console.log("event", JSON.stringify(event))

  const deleteParams = {
    TableName: "WSConnections",
    Key: {
      ConnectionID: event.requestContext.connectionId,
    },
  }

  // save connection to database
  // if database error we'll continue the user can still connect to the websocket service
  const res = await deleteItem(dynamodb, deleteParams)
  console.log("delete res", res)
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

export const ping: APIGatewayProxyHandler = async (event, _context) => {
  const domain = event.requestContext.domainName
  const stage = event.requestContext.stage
  const connectionId = event.requestContext.connectionId
  const callbackUrlForAWS = util.format(util.format("https://%s/%s", domain, stage)) //construct the needed url
  // console.log(callbackUrlForAWS, connectionId, event)
  await sendMessageToClient(callbackUrlForAWS, connectionId, event)
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "pong",
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
