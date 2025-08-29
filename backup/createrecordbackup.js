const { MongoClient } = require("mongodb");
const { randomUUID } = require("crypto");

// const uri = process.env.COSMOS_DB_CONNECTION_STRING;
const uri = "mongodb://mycosmosdbmongo123:IF24AbI4SQQsLqqQmN8zD8rEb8XpbITYCjY4Vb3LuITjaGIWgfhax1lZuBOze5HZDwb1en2MtS4qACDb74Lehw==@mycosmosdbmongo123.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@mycosmosdbmongo123@";

let client;

async function getClient() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client;
}

module.exports = async function (context, req) {
  context.log('Processing request to insert record');

  const client = await getClient();
  const db = client.db("legranddb"); // Replace with your DB name
  const collection = db.collection("UserForm"); // Replace with your collection name

  const data = req.body;

  if (!data) {
    context.res = { status: 400, body: "Please pass data in the request body" };
    return;
  }

  // Prepare the document to insert
  const document = {
    _id: randomUUID(), // generate unique ID for _id
    fullName: data.fullName || "",
    email: data.email || "",
    phoneNumber: data.phoneNumber || "",
    submissionDate: data.submissionDate || new Date().toISOString(),
    status: data.status || "Pending",
    comments: data.comments || ""
  };

  try {
    const result = await collection.insertOne(document);
    context.res = {
      status: 201,
      body: {
        message: "Record inserted successfully",
        insertedId: document._id
      }
    };
  } catch (error) {
    context.log.error("Error inserting document:", error);
    context.res = {
      status: 500,
      body: "Failed to insert record"
    };
  }
};
