const express = require("express");

const router = express.Router();

const {
    getActivityLogs
} = require("../controllers/logController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin", "manager"),
    getActivityLogs
);

module.exports = router;
