require("dotenv").config({ path: "./.env", debug: true, encoding: "UTF-8" });

const express = require("express");

const app = express();

//connect databse
require("./config/database.js").connectDatabase();

//cors
const cors = require("cors");
app.use(
  cors({
    origin:
      process.env.NODE_ENV != "developement"
        ? process.env.FRONTEND_PRODUCTION_URL
        : process.env.FRONTEND_DEV_URL,
    credentials: true,
  })
);

//Logger (tiny Data/small data)
const logger = require("morgan");
app.use(logger("tiny"));

//BodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//routes
app.use("/api/v1", require("./routes/index.js"));

app.get("/", (req, res) => res.json("hello"));

//res handler
// const responseHandler = require("./utils/sendRes.js");
// app.use(responseHandler);

//Error Handling
const ErrorHandler = require("./utils/ErrorHandler.js");
const { generatedErrors } = require("./middlewares/error.js");
app.all(/.*/, (req, res, next) => {
  next(new ErrorHandler(`Requested Url Not Found ${req.url}`, 404));
});
app.use(generatedErrors);

//create server
app.listen(process.env.PORT, () => {
  console.log(`Server running on Port ${process.env.PORT}`);
});
