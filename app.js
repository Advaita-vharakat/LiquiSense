// load environment variables first
require('dotenv').config();

const express = require("express");
const path = require("path");

const esp32Routes = require("./routes/esp32");
const monitoringRoutes = require("./routes/monitoring");
const connectToDB = require("./config/db");

// connect after dotenv is loaded
connectToDB();

const app = express();



app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));

app.use(express.static("public"));
app.use(express.json());

app.use("/", require("./routes/pages"));
app.use("/api/esp32", esp32Routes);
app.use("/api/monitoring", monitoringRoutes);

app.listen(5000,()=>{
	console.log("Server running http://localhost:5000");
});
