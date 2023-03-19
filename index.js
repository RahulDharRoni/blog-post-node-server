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
    const db = client.db("posts");
    const productCollection = db.collection("post");
    console.log("database connected");

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.post("/product", async (req, res) => {
      const product = req.body;

      const result = await productCollection.insertOne(product);

      res.send(result);
    });

    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.patch("/product/:id", async (req, res) => {
      const postId = req.params.id;
      const postBody = req.body;
      const filter = { _id: ObjectId(postId) };
      const options = { upsert: true };
      const updateDoc = {
        $set: postBody,
      };
      console.log(updateDoc);
      const result = await productCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
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
