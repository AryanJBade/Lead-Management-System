const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/authRoutes");
const leadRoutes = require("./src/routes/leadRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const logRoutes = require("./src/routes/logRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/leads", leadRoutes);

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/logs", logRoutes);

app.get("/", (req, res) => {
    res.send("Lead Management API");
});

module.exports = app;