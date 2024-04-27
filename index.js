const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5001;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Travel Website Server Is Running");
});

app.listen(port, () => {
  console.log(`Travel Website Server Is Running on port: ${port}`);
});
