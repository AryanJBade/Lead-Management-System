const db = require("../config/db");

const logActivity = async (action, leadId, userId = null) => {
    const sql = `INSERT INTO activity_logs(action, lead_id, user_id) VALUES($1, $2, $3)`;
    await db.query(sql, [action, leadId, userId]);
};

const findLeastLoadedAgent = async () => {
    const sql = `
        SELECT users.id
        FROM users
        LEFT JOIN leads ON users.id = leads.assigned_to
        WHERE users.role = 'agent'
        GROUP BY users.id
        ORDER BY COUNT(leads.id) ASC
        LIMIT 1
    `;
    const { rows } = await db.query(sql);
    return rows[0];
};

const createLead = async ({ name, email, phone, source, notes, assignedTo }) => {
    const sql = `
        INSERT INTO leads(name, email, phone, source, status, assigned_to, notes)
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;
    const { rows } = await db.query(sql, [name, email, phone, source, "New", assignedTo, notes]);
    return rows[0];
};

const getLeadById = async (id) => {
    const { rows } = await db.query("SELECT * FROM leads WHERE id=$1", [id]);
    return rows[0];
};

const deleteLead = async (id) => {
    await db.query("DELETE FROM leads WHERE id=$1", [id]);
};

const updateLead = async (id, { name, email, phone, source, status, notes }) => {
    const sql = `
        UPDATE leads
        SET name=$1, email=$2, phone=$3, source=$4, status=$5, notes=$6
        WHERE id=$7
        RETURNING *
    `;
    const { rows } = await db.query(sql, [name, email, phone, source, status, notes, id]);
    return rows[0];
};

const getLeads = async ({ search, status, source, sortBy, sortOrder, limit, offset }) => {
    let baseSql = "FROM leads";
    const values = [];
    const filters = [];

    if (search) {
        values.push(`%${search}%`);
        filters.push(`name ILIKE $${values.length}`);
    }

    if (status) {
        values.push(status);
        filters.push(`status=$${values.length}`);
    }

    if (source) {
        values.push(source);
        filters.push(`source=$${values.length}`);
    }

    if (filters.length) {
        baseSql += ` WHERE ${filters.join(" AND ")}`;
    }

    const countSql = `SELECT COUNT(*) AS total ${baseSql}`;
    const countResult = await db.query(countSql, values);
    const total = parseInt(countResult.rows[0].total, 10);

    const orderBy = ["name", "created_at", "status", "source"].includes(sortBy)
        ? sortBy
        : "created_at";
    const direction = sortOrder === "asc" ? "ASC" : "DESC";

    values.push(limit, offset);
    const listSql = `SELECT * ${baseSql} ORDER BY ${orderBy} ${direction} LIMIT $${values.length - 1} OFFSET $${values.length}`;
    const result = await db.query(listSql, values);

    return {
        leads: result.rows,
        total,
        page: Math.floor(offset / limit) + 1,
        limit
    };
};

const getDashboardStats = async () => {
    const stats = {};

    const leadsResult = await db.query("SELECT COUNT(*) AS totalleads FROM leads");
    stats.totalLeads = parseInt(leadsResult.rows[0].totalleads, 10);

    const agentsResult = await db.query("SELECT COUNT(*) AS totalagents FROM users WHERE role='agent'");
    stats.totalAgents = parseInt(agentsResult.rows[0].totalagents, 10);

    const managersResult = await db.query("SELECT COUNT(*) AS totalmanagers FROM users WHERE role='manager'");
    stats.totalManagers = parseInt(managersResult.rows[0].totalmanagers, 10);

    return stats;
};

module.exports = {
    logActivity,
    findLeastLoadedAgent,
    createLead,
    getLeadById,
    deleteLead,
    updateLead,
    getLeads,
    getDashboardStats
};
