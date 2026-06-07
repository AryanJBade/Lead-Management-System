const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};

module.exports = {
    generateToken,
    generateRefreshToken
};