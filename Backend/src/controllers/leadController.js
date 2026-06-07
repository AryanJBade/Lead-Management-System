const db = require("../config/db");
const { fetchCompanyInfo } = require("../services/enrichmentService");

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
exports.createLead = async (req, res) => {

    try {
        const {
            name,
            email,
            phone,
            source,
            notes
        } = req.body;

        const enrichment = await fetchCompanyInfo();
        const enrichedNotes = enrichment
            ? `${notes || ""}\nCompany: ${enrichment.companyName}\nIndustry: ${enrichment.industry}\nCatchphrase: ${enrichment.catchPhrase}`.trim()
            : notes;

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
                    enrichedNotes
                ],
                (err, result) => {
                    if (err) {
                        return res.status(500).json(err);
                    }

                    logActivity(
                        "Lead Created",
                        result.insertId,
                        req.user?.id || null
                    );
                    logActivity(
                        "Lead Assigned",
                        result.insertId,
                        req.user?.id || null
                    );

                    res.status(201).json({
                        message: "Lead Created & Assigned",
                        assignedTo: agentId
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json(error);
    }
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
        (req.query.search || "").trim();

    const status =
        req.query.status || "";

    const source =
        req.query.source || "";

    const sortBy =
        req.query.sortBy || "created_at";

    const sortOrder =
        req.query.sortOrder === "asc" ? "ASC" : "DESC";

    let baseSql = `SELECT leads.*, users.name AS assigned_agent FROM leads LEFT JOIN users ON leads.assigned_to = users.id`;
    const filters = [];
    const values = [];

    if (search) {
        filters.push(`leads.name LIKE ?`);
        values.push(`%${search}%`);
    }

    if (status) {
        filters.push(`leads.status=?`);
        values.push(status);
    }

    if (source) {
        filters.push(`leads.source=?`);
        values.push(source);
    }

    if (filters.length) {
        baseSql += ` WHERE ${filters.join(" AND ")}`;
    }

    const orderableFields = ["name", "created_at", "status", "source"];
    const orderField = orderableFields.includes(sortBy) ? sortBy : "created_at";

    const countSql = baseSql.replace(/^SELECT leads\.\*, users\.name AS assigned_agent/, "SELECT COUNT(*) AS total");

    db.query(countSql, values, (countErr, countResult) => {
        if (countErr) {
            return res.status(500).json(countErr);
        }

        const total = countResult[0].total;
        const sql = `${baseSql} ORDER BY leads.${orderField} ${sortOrder} LIMIT ? OFFSET ?`;
        const queryValues = [...values, limit, offset];

        db.query(sql, queryValues, (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.status(200).json({
                leads: result,
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit)
                }
            });
        });
    });
};

// Get Lead By ID
exports.getLeadById = (req, res) => {

    const sql =
        `SELECT leads.*, users.name AS assigned_agent FROM leads LEFT JOIN users ON leads.assigned_to = users.id WHERE leads.id=?`;

    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "Lead not found"
                });
            }

            res.status(200).json(result[0]);

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

    const getSql = "SELECT status FROM leads WHERE id=?";

    db.query(getSql, [req.params.id], (getErr, getResult) => {
        if (getErr) {
            return res.status(500).json(getErr);
        }

        if (getResult.length === 0) {
            return res.status(404).json({
                message: "Lead not found"
            });
        }

        const previousStatus = getResult[0].status;

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
                    req.params.id,
                    req.user?.id || null
                );

                if (status && status !== previousStatus) {
                    logActivity(
                        "Status Changed",
                        req.params.id,
                        req.user?.id || null
                    );
                }

                res.json({
                    message: "Lead Updated Successfully"
                });

            }
        );
    });
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