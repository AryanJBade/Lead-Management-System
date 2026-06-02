const express = require("express");

const router = express.Router();

const {
    createLead,
    getAllLeads,
    getLeadById,
    updateLead,
    deleteLead
} = require("../controllers/leadController");

const authMiddleware =
    require("../middleware/authMiddleware");

const roleMiddleware =
    require("../middleware/roleMiddleware");


// Create Lead
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin", "manager"),
    createLead
);


// Get All Leads
router.get(
    "/",
    authMiddleware,
    getAllLeads
);


// Get Lead By ID
router.get(
    "/:id",
    authMiddleware,
    getLeadById
);


// Update Lead
router.put(
    "/:id",
    authMiddleware,
    updateLead
);


// Delete Lead
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteLead
);

module.exports = router;