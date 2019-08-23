const jwt = require('jsonwebtoken');
const key = process.env.KEY;

const Token = ({ id }) => jwt.sign(
    { id },
    key,
    { expiresIn: '2h' }
);

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, process.env.KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    status: 401,
                    data: {},
                    message: "Oops, there was an error verifying your credentials 1",
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({
            status: 401,
            data: {},
            message: "Oops, there was an error verifying your credentials",
        });
    }
}

module.exports = { Token, verifyToken };