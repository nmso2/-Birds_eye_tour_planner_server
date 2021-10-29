const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sjr78.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('birdsEyeTour');
        const planCollection = database.collection('tourPlans');
        const purchaseCollection = database.collection('purchasePlan');

        // GET API (Get all products)
        app.get('/tourPlans', async (req, res) => {
            const cursor = planCollection.find({});
            const plans = await cursor.toArray();
            res.send(plans);
        })

        // GET API (Get single services)
        app.get('/tourPlans/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const plan = await planCollection.findOne(query);
            res.json(plan);
        })

        // POST API to get data by keys
        app.post('/tourPlans/byKeys', async (req, res) => {
            const keys = req.body;
            const query = { key: { $in: keys } };
            const result = await planCollection.find(query).toArray();
            res.json(result);
        });

        // POST API to add order
        app.post('/purchase', async (req, res) => {
            const order = req.body;
            const result = await purchaseCollection.insertOne(order);
            res.json(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})