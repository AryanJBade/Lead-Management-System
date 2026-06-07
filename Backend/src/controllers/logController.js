const db = require("../config/db");

exports.getActivityLogs = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const action = req.query.action || "";
    const leadId = req.query.leadId || "";
    const userId = req.query.userId || "";

    let baseSql = `
        FROM activity_logs
        LEFT JOIN users ON activity_logs.user_id = users.id
        LEFT JOIN leads ON activity_logs.lead_id = leads.id
    `;
    const filters = [];
    const values = [];

    if (action) {
        filters.push("activity_logs.action LIKE ?");
        values.push(`%${action}%`);
    }

    if (leadId) {
        filters.push("activity_logs.lead_id = ?");
        values.push(leadId);
    }

    if (userId) {
        filters.push("activity_logs.user_id = ?");
        values.push(userId);
    }

    if (filters.length) {
        baseSql += ` WHERE ${filters.join(" AND ")}`;
    }

    const countSql = `SELECT COUNT(*) AS total ${baseSql}`;

    db.query(countSql, values, (countErr, countResult) => {
        if (countErr) {
            return res.status(500).json(countErr);
        }

        const total = countResult[0].total;
        const sql = `
            SELECT activity_logs.*, users.name AS user_name, leads.name AS lead_name
            ${baseSql}
            ORDER BY activity_logs.created_at DESC
            LIMIT ? OFFSET ?
        `;
        const queryValues = [...values, limit, offset];

        db.query(sql, queryValues, (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                logs: result,
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
