const db = require("../config/db");
const bcrypt = require("bcryptjs");
const { generateToken, generateRefreshToken } = require("../utils/generateToken");

const refreshTokens = [];

exports.register = async (req, res) => {
    try {

        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const checkSql = "SELECT * FROM users WHERE email=?";

        db.query(checkSql, [email], async (checkErr, checkResult) => {
            if (checkErr) {
                return res.status(500).json(checkErr);
            }

            if (checkResult.length > 0) {
                return res.status(409).json({
                    message: "Email is already registered"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const insertSql =
                "INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)";

            db.query(
                insertSql,
                [name, email, hashedPassword, role || "agent"],
                (err, result) => {
                    if (err) {
                        return res.status(500).json(err);
                    }

                    res.status(201).json({
                        message: "User Registered Successfully"
                    });
                }
            );
        });

    } catch (error) {

        res.status(500).json(error);

    }
};

exports.refreshToken = (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ message: "Refresh token required" });
    }

    if (!refreshTokens.includes(token)) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }

    try {
        const decoded = require("jsonwebtoken").verify(
            token,
            process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET
        );

        const newToken = generateToken(decoded);
        res.json({ token: newToken });
    } catch (error) {
        return res.status(403).json({ message: "Unable to verify refresh token" });
    }
};

exports.logout = (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: "Refresh token required" });
    }

    const index = refreshTokens.indexOf(token);
    if (index !== -1) {
        refreshTokens.splice(index, 1);
    }

    res.json({ message: "Logged out successfully" });
};

exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const sql =
            "SELECT * FROM users WHERE email=?";

        db.query(sql, [email], async (err, result) => {

            if (err)
                return res.status(500).json(err);

            if (result.length === 0) {
                return res.status(404).json({
                    message: "User Not Found"
                });
            }

            const user = result[0];

            const isMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!isMatch) {
                return res.status(400).json({
                    message: "Invalid Password"
                });
            }

            const token =
                generateToken(user);

            const refreshToken = generateRefreshToken(user);
            refreshTokens.push(refreshToken);

            res.status(200).json({
                message: "Login Successful",
                token,
                refreshToken,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });

        });

    } catch (error) {

        res.status(500).json(error);

    }
};