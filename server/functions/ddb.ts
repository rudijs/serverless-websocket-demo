type result = {
  statusCode: number
  errors?: { status: string; title: string; detail: string }[]
}

export const put = async (dynamodb: AWS.DynamoDB.DocumentClient, params: AWS.DynamoDB.DocumentClient.PutItemInput): Promise<result> => {
  // console.log(process.env.NODE_ENV)
  // console.log(params)

  let result: result = { statusCode: 200 }

  // const res = await dynamodb.listTables().promise()
  // console.log(res)

  try {
    await dynamodb.put(params).promise()
  } catch (e) {
    result.statusCode = e.statusCode
    result.errors = [{ status: e.statusCode, title: e.code, detail: e.message }]
  }

  return result
}

export const deleteItem = async (dynamodb: AWS.DynamoDB.DocumentClient, params: AWS.DynamoDB.DocumentClient.DeleteItemInput): Promise<result> => {
  let result: result = { statusCode: 200 }

  // const res = await dynamodb.listTables().promise()
  // console.log(res)

  try {
    await dynamodb.delete(params).promise()
  } catch (e) {
    result.statusCode = e.statusCode
    result.errors = [{ status: e.statusCode, title: e.code, detail: e.message }]
  }

  return result
}
