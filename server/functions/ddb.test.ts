import * as AWSMock from "aws-sdk-mock"
import * as AWS from "aws-sdk"
// import { ServiceConfigurationOptions } from "aws-sdk/lib/service"

import { put, deleteItem } from "./ddb"

// let serviceConfigOptions: ServiceConfigurationOptions = {
//   region: "ap-southeast-1",
//   endpoint: "http://localhost:8000",
// }

// const dynamodb = new AWS.DynamoDB.DocumentClient(serviceConfigOptions)

// https://github.com/dwyl/aws-sdk-mock

describe("ddb", () => {
  it("#put should save", async () => {
    const params = {
      TableName: "WSConnections",
      Item: {
        ConnectionID: "NdM-hdWByQ0CHDA=",
      },
    }

    AWSMock.setSDKInstance(AWS)

    AWSMock.mock("DynamoDB.DocumentClient", "put", (_params: AWS.DynamoDB.DocumentClient.PutItemInput, callback: Function) => {
      // console.log(_params)
      // console.log("DynamoDB.DocumentClient", "put", "mock called")
      callback(null, {})
    })

    const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10", httpOptions: { timeout: 5000 }, maxRetries: 3 })

    const res = await put(dynamodb, params)

    expect(res.statusCode).toEqual(200)

    AWSMock.restore("DynamoDB.DocumentClient")
  })

  test("#put should handle errors", async () => {
    const params = {
      TableName: "BadTableName",
      Item: {
        ConnectionID: "NdM-hdWByQ0CHDA=",
      },
    }

    const err: AWS.AWSError = {
      message: "Cannot do operations on a non-existent table",
      code: "ResourceNotFoundException",
      time: new Date(Date.now()),
      requestId: "0df64a62-ca63-49c9-816e-68196ad1c7e6",
      statusCode: 400,
      retryable: false,
      retryDelay: 5.759940253472684,
      hostname: "asdf",
      region: "asdf",
      extendedRequestId: "asdf",
      cfId: "asdf",
      name: "asdf",
    }
    // console.log(err)

    AWSMock.setSDKInstance(AWS)

    AWSMock.mock("DynamoDB.DocumentClient", "put", (_params: AWS.DynamoDB.DocumentClient.PutItemInput, callback: Function) => {
      // console.log(_params)
      // console.log("DynamoDB.DocumentClient", "put", "mock called")
      callback(err)
    })

    const client = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" })
    const res = await put(client, params)

    expect(res.statusCode).toEqual(400)
    const error1 = res.errors[0]
    expect(error1.status).toEqual(400)
    expect(error1.title).toBe("ResourceNotFoundException")
    expect(error1.detail).toBe("Cannot do operations on a non-existent table")
  })

  it("#deleteItem should delete", async () => {
    const params = {
      TableName: "WSConnections",
      Key: {
        ConnectionID: "NdM-hdWByQ0CHDA=",
      },
    }

    AWSMock.setSDKInstance(AWS)

    AWSMock.mock("DynamoDB.DocumentClient", "delete", (_params: AWS.DynamoDB.DocumentClient.DeleteItemInput, callback: Function) => {
      // console.log(_params)
      // console.log("DynamoDB.DocumentClient", "put", "mock called")
      callback(null, {})
    })

    const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" })

    const res = await deleteItem(dynamodb, params)
    // console.log(101, res)

    expect(res.statusCode).toEqual(200)

    AWSMock.restore("DynamoDB.DocumentClient")
  })

  it("#deleteItem should handle errors", async () => {
    const params = {
      TableName: "WSConnections",
      Key: {
        BadKeyName: "NdM-hdWByQ0CHDA=",
      },
    }

    const err: AWS.AWSError = {
      message: "One of the required keys was not given a value",
      code: "ValidationException",
      time: new Date(Date.now()),
      requestId: "7b224c3a-dc6c-463f-9b81-d46baa08e835",
      statusCode: 400,
      retryable: false,
      retryDelay: 22.784455188070563,
      hostname: "asdf",
      region: "asdf",
      extendedRequestId: "asdf",
      cfId: "asdf",
      name: "asdf",
    }

    AWSMock.setSDKInstance(AWS)

    AWSMock.mock("DynamoDB.DocumentClient", "delete", (_params: AWS.DynamoDB.DocumentClient.DeleteItemInput, callback: Function) => {
      //   // console.log(_params)
      // console.log("DynamoDB.DocumentClient", "delete", "mock called")
      callback(err)
    })

    const dynamodb = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" })

    const res = await deleteItem(dynamodb, params)
    // console.log(res)

    expect(res.statusCode).toEqual(400)
    const error1 = res.errors[0]
    expect(error1.status).toEqual(400)
    expect(error1.title).toBe("ValidationException")
    expect(error1.detail).toBe("One of the required keys was not given a value")

    AWSMock.restore("DynamoDB.DocumentClient")
  })
})
