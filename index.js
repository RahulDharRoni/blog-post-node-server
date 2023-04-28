require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://desyroni1:vdPL1M2EWA2OanNQ@cluster0.8wp7th9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("formPage");
    const productCollection = db.collection("formPageInfo");
    console.log("database connected");

    app.get("/getinfo", async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();
      res.send(product);
    });
    // start post
    app.post("/postinfo", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send({ ...result, data: product });
    });
    // delete api
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
    // put start
    app.put("/user/:id", async (req, res) => {
      const userId = req.params.id;
      const userBody = req.body;
      const filter = { _id: ObjectId(userId) };
      const options = { upsert: true };
      const updateDoc = {
        $set: userBody,
      };
      console.log(updateDoc);
      const result = await productCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send({ ...result, userBody });
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World! sdfafasdfads");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
