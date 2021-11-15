const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 9000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4yggv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        await client.connect();
        // console.log('database connected succesfully');
        const database = client.db("milestone-shop");
        const dronesCollection = database.collection("drones");
        const usersCollection = database.collection("users");
        const ordersCollection = database.collection("orders");
        const reviewsCollection = database.collection("reviews");
        //GET Product
        app.get("/drones", async (req, res) => {
            const cursor = dronesCollection.find({});
            const drones = await cursor.toArray();
            res.send(drones);
        });
        //GET Product id
        app.get("/drones/:id", async (req, res) => {
            const id = req.params.id;
            console.log("getting specific drones", id);
            const query = { _id: ObjectId(id) };
            const service = await dronesCollection.findOne(query);
            res.json(service);
        });
        //Post product
        app.post("/drones", async (req, res) => {
            console.log(req.body);
            const result = await dronesCollection.insertOne(req.body);
            console.log(result);
        });
        //GET USER
        app.get("/users", async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        });

        // GET USER EMAIL
        app.get("/users/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let admin = false;
            console.log("user", user?.role);
            //Admin SET
            if (user?.role === "Admin") {
                admin = true;
            }
            res.json({ isAdmin: admin });
        });

        // POST User
        app.post("/users", async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log("user", user);
            res.json(result);
        });
        //PUT USER
        app.put("/users", async (req, res) => {
            const user = req.body;
            console.log("put", user);
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            res.json(result);
        });

        // PUT API
        app.put("/users/:email", async (req, res) => {
            const email = req.params.email;
            const usersDetails = req.body;
            const query = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    role: "Admin",
                },
            };
            const result = await usersCollection.updateOne(query, updateDoc, options);
            res.send(result);
        });
        //GET Reviews
        app.get("/reviews", async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
        //GET Reviews id
        app.get("/reviews/:id", async (req, res) => {
            const id = req.params.id;
            console.log("getting specific reviews", id);
            const query = { _id: ObjectId(id) };
            const review = await reviewsCollection.findOne(query);
            res.json(review);
        });
        //POST Reviews
        app.post("/reviews", async (req, res) => {
            console.log(req.body);
            const result = await reviewsCollection.insertOne(req.body);
            console.log(result);
        });
        //GET Orders
        app.get("/orders", async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });
        //GET Order ID
        app.get("/orders/:id", async (req, res) => {
            const id = req.params.id;
            console.log("getting specific order", id);
            const query = { _id: ObjectId(id) };
            const order = await ordersCollection.findOne(query);
            res.json(order);
        });
        //POST Orders
        app.post("/orders", async (req, res) => {
            console.log(req.body);
            const result = await ordersCollection.insertOne(req.body);
            console.log(result);
        });

        // delet order
        app.delete("/orders/:id", async (req, res) => {
            console.log(req.params.id);
            const result = await ordersCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });

        // PUT API
        app.put("/drones/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };

            const result = await dronesCollection.updateOne(
                query,
                updateDoc,
                options
            );
            res.send(result);
        });

        app.put("/orders", async (req, res) => {
            const id = req.params.id;
            const options = { upsert: true };
            const query = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: "approved",
                },
            };
            const result = await ordersCollection.updateOne(
                query,
                updateDoc,
                options
            );
            res.send(result);
        });
    } finally {
        //  await client.close();
    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("TAT Milestone-shop Server is Active");
});

app.listen(port, () => {
    console.log("server running at port", port);
});
