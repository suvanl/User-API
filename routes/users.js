const User = require("../models/User");
const { InvalidContentError, InternalError, ResourceNotFoundError } = require("restify-errors");

module.exports = server => {
    // Get users
    server.get("/users", async (req, res, next) => {
        try {
            const users = await User.find({});
            res.send(users);
            next();
        } catch (err) {
            return next(new InvalidContentError(err));
        }
    });

    // Get single user
    server.get("/users/:id", async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id);
            res.send(user);
            next();
        } catch (err) {
            return next(new ResourceNotFoundError(`No user found with ID ${req.params.id}`));
        }
    });

    // Add users
    server.post("/users", async (req, res, next) => {
        if (!req.is("application/json")) return next(new InvalidContentError("Only accepts 'application/json'"));

        const { username, discriminator, balance } = req.body;
        const user = new User({
            username,
            discriminator,
            balance
        });

        try {
            const newUser = await user.save(); // eslint-disable-line no-unused-vars
            res.send(201);
            next();
        } catch (err) {
            return next(new InternalError(err.message));
        }
    });

    // Update user
    server.put("/users/:id", async (req, res, next) => {
        if (!req.is("application/json")) return next(new InvalidContentError("Only accepts 'application/json'"));

        try {
            const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body); // eslint-disable-line no-unused-vars
            res.send(200);
            next();
        } catch (err) {
            return next(new ResourceNotFoundError(`No user found with ID ${req.params.id}`));
        }
    });

    // Delete user
    server.del("/users/:id", async (req, res, next) => {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.id }); // eslint-disable-line no-unused-vars
            res.send(204);
            next();
        } catch (err) {
            return next(new ResourceNotFoundError(`No user found with ID ${req.params.id}`));
        }
    });
};
