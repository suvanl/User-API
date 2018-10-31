const APIUser = require("../models/APIUser");
const { InternalError, UnauthorizedError } = require("restify-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const auth = require("../auth");

module.exports = server => {
    // Register user
    server.post("/register", (req, res, next) => {
        const { email, password } = req.body;

        const apiUser = new APIUser({
            email,
            password
        });

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(apiUser.password, salt, async (err, hash) => {
                apiUser.password = hash;
                try {
                    const newAPIUser = await apiUser.save(); // eslint-disable-line no-unused-vars
                    res.send(201);
                    next();
                } catch (err) {
                    return next(new InternalError(err.message));
                }
            });
        });
    });

    // Authenticate user
    server.post("/auth", async (req, res, next) => {
        const { email, password } = req.body;
        try {
            const apiUser = await auth.authenticate(email, password);
            const token = jwt.sign(apiUser.toJSON(), config.JWT_SECRET, { expiresIn: "30m" });
            const { iat, exp } = jwt.decode(token);
            res.send({ iat, exp, token });
            next();
        } catch (err) {
            return next(new UnauthorizedError(err));
        }
    });
};
