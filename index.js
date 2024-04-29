const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5001;

// middleware
const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};
app.use(cors(corsConfig));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ccm0dfs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const spotCollection = client.db("travelSpotDB").collection("spot");

    app.get("/spot", async (req, res) => {
      const cursor = spotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/spot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await spotCollection.findOne(query);
      res.send(result);
    });

    // app.get("/spot/:email", async (req, res) => {
    //   console.log(req.params.email);
    //   const result = await spotCollection
    //     .find({ user_email: req.params.email })
    //     .toArray();
    //   res.send(result);
    // });

    app.get("/spot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await spotCollection.findOne(query);
      res.send(result);
    });

    // app.get("/spot/:country", async (req, res) => {
    //   const country = req.params.country;
    //   const query = { country_Name: country };
    //   const result = await spotCollection.find(query).toArray();
    //   res.send(result);
    // });

    app.get("/spot/country/:countryName", async (req, res) => {
      try {
        const countryName = req.params.countryName;
        const results = await spotCollection
          .find({ country_Name: countryName })
          .toArray();
        res.json(results);
      } catch (error) {
        console.error("Error fetching data by country name:", error);
        res.status(500).send("Internal server error");
      }
    });

    app.post("/spot", async (req, res) => {
      const newSpot = req.body;
      console.log(newSpot);
      const result = await spotCollection.insertOne(newSpot);
      res.send(result);
    });

    app.put("/spot/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedSpot = req.body;
      const spot = {
        $set: {
          image: updatedSpot.image,
          tourists_spot_name: updatedSpot.tourists_spot_name,
          country_Name: updatedSpot.country_Name,
          location: updatedSpot.location,
          short_description: updatedSpot.short_description,
          average_cost: updatedSpot.average_cost,
          seasonality: updatedSpot.seasonality,
          travel_time: updatedSpot.travel_time,
          total_visitors_per_year: updatedSpot.total_visitors_per_year,
          user_email: updatedSpot.user_email,
          user_name: updatedSpot.user_name,
        },
      };
      const result = await spotCollection.updateOne(filter, spot, options);
      res.send(result);
    });

    app.delete("/spot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await spotCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Travel Website Server Is Running");
});

app.listen(port, () => {
  console.log(`Travel Website Server Is Running on port: ${port}`);
});
