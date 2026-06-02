const db = require("../config/db");

exports.getDashboardStats = (req, res) => {

    const stats = {};

    db.query(
        "SELECT COUNT(*) AS totalLeads FROM leads",
        (err, leadsResult) => {

            if (err)
                return res.status(500).json(err);

            stats.totalLeads =
                leadsResult[0].totalLeads;

            db.query(
                "SELECT COUNT(*) AS totalAgents FROM users WHERE role='agent'",
                (err, agentResult) => {

                    if (err)
                        return res.status(500).json(err);

                    stats.totalAgents =
                        agentResult[0].totalAgents;

                    db.query(
                        "SELECT COUNT(*) AS totalManagers FROM users WHERE role='manager'",
                        (err, managerResult) => {

                            if (err)
                                return res.status(500).json(err);

                            stats.totalManagers =
                                managerResult[0].totalManagers;

                            res.json(stats);

                        }
                    );

                }
            );

        }
    );
};