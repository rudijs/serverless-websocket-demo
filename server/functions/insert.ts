type result = {
  statusCode: number
  errors?: { status: string; title: string; detail: string }[]
}

export const insert = async (dynamodb: AWS.DynamoDB.DocumentClient, params: AWS.DynamoDB.DocumentClient.PutItemInput): Promise<result> => {
  // export const insert = async (dynamodb: any, params: AWS.DynamoDB.DocumentClient.PutItemInput): Promise<result> => {
  console.log(process.env.NODE_ENV)

  let result: result = { statusCode: 200 }

  // const res = await dynamodb.listTables().promise()
  // console.log(res)

  try {
    const res = await dynamodb.put(params).promise()
    console.log(res)
  } catch (e) {
    // console.log(e)
    result.statusCode = e.statusCode
    result.errors = [{ status: e.statusCode, title: e.code, detail: e.message }]
  }

  return result
}

// export const put = async (params: AWS.DynamoDB.DocumentClient.PutItemInput): Promise<result> => {
//   let result: result = { statusCode: 200 }

//   // const res = await dynamodb.listTables().promise()
//   // console.log(res)

//   try {
//     await dynamodb.put(params).promise()
//   } catch (e) {
//     result.statusCode = e.statusCode
//     // console.log(e)
//     result.errors = [{ status: e.statusCode, title: e.code, detail: e.message }]
//   }

//   return result
// }
