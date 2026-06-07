const db = require("../config/db");

const findUserByEmail = async (email) => {
    const { rows } = await db.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
    );
    return rows[0];
};

const createUser = async ({ name, email, password, role }) => {
    const { rows } = await db.query(
        "INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, $4) RETURNING id, name, email, role",
        [name, email, password, role]
    );
    return rows[0];
};

module.exports = {
    findUserByEmail,
    createUser
};
