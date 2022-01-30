const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// User middleWare
app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "This is home page on this server! the server name is Work management application"
  );
});

// Connect with server___
const uri = process.env.MONGO_URL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("workManagementApplication");
    const worksCollection = database.collection("works");

    // Create a new work____________
    app.post("/create-work", async (req, res) => {
      const work = req.body;
      const result = await worksCollection.insertOne(work);
      res.json(result);
    });
    // Get all work____________
    app.get("/works", async (req, res) => {
      const cursor = worksCollection.find({});
      const works = await cursor.toArray();
      res.json(works);
    });
    // Delete a work___________
    app.delete("/works/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await addToCartCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(
    `Work Management Application server is running in port : ${port}`
  );
});

// MONGO_URL=mongodb+srv://<username>:<password>@cluster0.dpacy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
