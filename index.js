const restify = require("restify");
const mongoose = require("mongoose");
const config = require("./config");
const rjwt = require("restify-jwt-community");

const server = restify.createServer();

server.use(restify.plugins.bodyParser());
server.use(rjwt({ secret: config.JWT_SECRET }).unless({ path: ["/auth"] }));
server.listen(config.PORT, () => mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true }));

const db = mongoose.connection;

db.on("error", err => console.error(err));
db.once("open", () => {
    require("./routes/users")(server);
    require("./routes/apiusers")(server);
    console.log(`Server started on port ${config.PORT}`);
});
