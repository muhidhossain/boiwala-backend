const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
const uri = process.env.DB_PATH;

let client = new MongoClient(uri, { useNewUrlParser: true });

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const day = date.getDate();
const updateTime = day + "-" + month + "-" + year;

app.get('/allBooks', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("boiwala").collection("allBooks");
        collection.find().toArray((err, documents) => {
            if (err) {
                res.status(500).send({ message: err });
            }
            else {
                res.send(documents);
            }
        })
        client.close();
    });
});

app.get('/allBooks/:key', (req, res) => {
    const id = req.params.id;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("boiwala").collection("allBooks");
        collection.find({ id }).toArray((err, documents) => {
            if (err) {
                console.log(err)
                res.status(500).send({ message: err });
            }
            else {
                res.send(documents[0]);
            }
        })
        client.close();
    });
});

app.post('/addBooks', (req, res) => {
    const allBooks = req.body;
    allBooks.addedTime = updateTime;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("boiwala").collection("allBooks");
        collection.insertOne(allBooks, (err, result) => {
            if (err) {
                res.status(500).send({ message: err });
            }
            else {
                res.send(result.ops[0]);
            }
        })
        client.close();
    });
});

app.post('/placeOrder', (req, res) => {
    const orderDetails = req.body;
    orderDetails.orderTime = updateTime;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(() => {
        const collection = client.db("boiwala").collection("orders");
        collection.insertOne(orderDetails, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
            }
            else {
                res.send(result.ops[0]);
            }
        });
        client.close();
    });
});

app.get('/orders', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("boiwala").collection("orders");
        collection.find().toArray((err, documents) => {
            if (err) {
                res.status(500).send({ message: err });
            }
            else {
                res.send(documents);
            }
        })
        client.close();
    });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log('Listening 4000'));