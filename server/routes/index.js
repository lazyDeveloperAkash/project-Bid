const expres = require("express");

const app = expres();

// user routes
app.use("/user", require("./userRoutes.js"));

//project routes
app.use("/project", require("./projectRoutes.js"));

//bid routes
app.use("/bid", require("./bidRoutes.js"));

module.exports = app;