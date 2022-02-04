const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
const cors = require("cors");
// User middleWare
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send(
    "This is home page on this server! the server name is Work management application"
  );
});

// Connect with server___
const uri = process.env.MONGO_URL;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("workManagementApplication");
    const worksCollection = database.collection("works");
    const studentsCollection = database.collection("students");
    const completeCollection = database.collection("complete");

    // Here work related operation=====================
    // Create a new work____________
    app.post("/create-work", async (req, res) => {
      const work = req.body;
      const result = await worksCollection.insertOne(work);
      res.json(result);
    });
    // Load all work____________
    app.get("/works", async (req, res) => {
      const cursor = worksCollection.find({});
      const works = await cursor.toArray();
      res.json(works);
    });
    // Delete a work___________
    app.delete("/works/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await worksCollection.deleteOne(query);
      console.log(result);
      res.json(result);
    });
    // Load a work___________
    app.get("/works/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await worksCollection.findOne(query);
      res.json(result);
    });
    // Complete task for student_________________
    app.post("/complete", async (req, res) => {
      const task = req.body;
      const result = await completeCollection.insertOne(task);
      res.json(result);
    });
    app.get("/complete", async (req, res) => {
      const cursor = completeCollection.find({});
      const complete = await cursor.toArray();
      res.json(complete);
    });
    // Get complete order filtered by email
    app.get("/completeEmail/:mail", async (req, res) => {
      const email = req.params.mail;
      console.log(email);
      const query = { email: email };
      const cursor = completeCollection.find(query);
      const complete = await cursor.toArray();
      res.json(complete);
    });
    // Delete Here a single complete Work____________
    app.delete("/complete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await completeCollection.deleteOne(query);
      console.log(result);
      res.json(result);
    });
    // Here Student related operation=========================
    // Create a new work____________
    app.post("/create-student", async (req, res) => {
      const work = req.body;
      const result = await studentsCollection.insertOne(work);
      res.json(result);
    });
    // Load all work____________
    app.get("/students", async (req, res) => {
      const cursor = studentsCollection.find({});
      const works = await cursor.toArray();
      res.json(works);
    });
    // Create Admin____________
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await studentsCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    // Get Admin checking by email____________
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await studentsCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
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
