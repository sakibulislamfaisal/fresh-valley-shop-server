const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

//App used
const app = express();
app.use(cors());
app.use(bodyParser.json());

//set username and password protectively
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const uri = process.env.DB_DATABASE;

//Create a connection with MongoClient
let client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Route File for Home directory
app.get("/", (req, res) => {
  res.send(
    "<h1 style='color:green;text-align:center;margin-top:20px'>Welcome To The Fresh Valley Shop backend Side</h1>"
  );
});

//Add new Products into the database
app.post("/add-products", (req, res) => {
  const products = req.body;
  console.log(products);
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db("fresh-valley-shop").collection("products");
    collection.insertOne(products, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        console.log("inserted count", result.insertedCount);
        res.send(result.insertedCount > 0);
        console.log("Inserted products successfully..");
      }
    });
  });
});

//Get All Products Form Database
app.get("/products", (req, res) => {
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db("fresh-valley-shop").collection("products");
    collection.find().toArray((err, document) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(document);
        console.log("Products is get successfully from database");
      }
    });
  });
});

//Find single product Item by id (single product)
app.get("/singleProduct/:id", (req, res) => {
  const productId = Number(req.params.id);
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db("fresh-valley-shop").collection("products");
    collection.find({ id: productId }).toArray((err, document) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(document[0]);
        console.log("Single product is get successfully from database");
      }
    });
  });
});

//Get All Products Form Database
app.get("/search-product", (req, res) => {
  const search = req.query.search;
  console.log(search);
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db("fresh-valley-shop").collection("products");
    collection.find({ name: { $regex: search } }).toArray((err, document) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(document);
        console.log("Search Products is get successfully from database");
      }
    });
  });
});

// Post submit order
app.post("/submit-order", (req, res) => {
  const data = req.body;
  console.log(data);
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db("fresh-valley-shop").collection("orders");
    collection.insertOne(data, (rej, result) => {
      if (rej) {
        res.status(500).send("Failed to order request process");
      } else {
        console.log("inserted count", result.insertedCount);
        res.send(result.insertedCount > 0);
      }
    });
  });
});

//get all orders
app.get("/orders", (req, res) => {
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    const collection = client.db("fresh-valley-shop").collection("orders");
    collection.find({ email: req.query.email }).toArray((err, document) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(document);
        console.log("order is get successfully from database");
      }
    });
  });
});

//Delete IP: 27.147.201.125/32
app.all("*", (req, res) => {
  res.send(
    '<h1 style="color:red;text-align:center;margin-top:20px">Fresh Valley Shop Server Not Found</h1>'
  );
});

const port = process.env.PORT || 5200;

app.listen(port, (err) => console.log("Server Running on the port", port));
