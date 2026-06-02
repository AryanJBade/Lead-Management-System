const db = require("../config/db");

// Activity Log Function
const logActivity = (action, leadId, userId = null) => {

    const sql = `
    INSERT INTO activity_logs
    (action, lead_id, user_id)
    VALUES(?,?,?)
    `;

    db.query(sql, [action, leadId, userId]);
};

// Create Lead
exports.createLead = (req, res) => {

    const {
        name,
        email,
        phone,
        source,
        notes
    } = req.body;

    const agentSql = `
    SELECT
        users.id,
        COUNT(leads.id) AS totalLeads
    FROM users
    LEFT JOIN leads
        ON users.id = leads.assigned_to
    WHERE users.role = 'agent'
    GROUP BY users.id
    ORDER BY totalLeads ASC
    LIMIT 1
    `;

    db.query(agentSql, (err, agentResult) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (agentResult.length === 0) {
            return res.status(400).json({
                message: "No Agent Available"
            });
        }

        const agentId = agentResult[0].id;

        const leadSql = `
        INSERT INTO leads
        (
            name,
            email,
            phone,
            source,
            status,
            assigned_to,
            notes
        )
        VALUES(?,?,?,?,?,?,?)
        `;

        db.query(
            leadSql,
            [
                name,
                email,
                phone,
                source,
                "New",
                agentId,
                notes
            ],
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                logActivity(
                    "Lead Created",
                    result.insertId
                );

                res.status(201).json({
                    message: "Lead Created & Assigned",
                    assignedTo: agentId
                });

            }
        );

    });

};

// Get All Leads + Search + Filter + Pagination
exports.getAllLeads = (req, res) => {

    const page =
        parseInt(req.query.page) || 1;

    const limit =
        parseInt(req.query.limit) || 5;

    const offset =
        (page - 1) * limit;

    const search =
        req.query.search || "";

    const status =
        req.query.status || "";

    let sql = `
    SELECT *
    FROM leads
    WHERE name LIKE ?
    `;

    let values = [`%${search}%`];

    if (status) {

        sql += ` AND status=?`;

        values.push(status);
    }

    sql += ` LIMIT ? OFFSET ?`;

    values.push(limit, offset);

    db.query(
        sql,
        values,
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.status(200).json(result);

        }
    );
};

// Get Lead By ID
exports.getLeadById = (req, res) => {

    const sql =
        "SELECT * FROM leads WHERE id=?";

    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.status(200).json(result);

        }
    );
};

// Update Lead
exports.updateLead = (req, res) => {

    const {
        name,
        email,
        phone,
        source,
        status,
        notes
    } = req.body;

    const sql = `
    UPDATE leads
    SET
    name=?,
    email=?,
    phone=?,
    source=?,
    status=?,
    notes=?
    WHERE id=?
    `;

    db.query(
        sql,
        [
            name,
            email,
            phone,
            source,
            status,
            notes,
            req.params.id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            logActivity(
                "Lead Updated",
                req.params.id
            );

            res.json({
                message: "Lead Updated Successfully"
            });

        }
    );
};

// Delete Lead
exports.deleteLead = (req, res) => {

    const sql =
        "DELETE FROM leads WHERE id=?";

    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            logActivity(
                "Lead Deleted",
                req.params.id
            );

            res.json({
                message: "Lead Deleted Successfully"
            });

        }
    );
};