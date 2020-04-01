const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const app = express();

const db = config.get("mongoURI");

app.use(express.json());

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });

app.use("/api/items", require("./routes/api/items"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started at port ${port}`));
