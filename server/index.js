const express = require("express");
const app = express();
const port = 3000;

const mongoose = require("mongoose");
const users = require("./routes/api/users");
const boards = require("./routes/api/boards");
// const db =
//   "mongodb+srv://kanbanadmin:nodogoro123@cluster0.yyqos.mongodb.net/kanbandb?retryWrites=true&w=majority";
let db = require('./config/keys').mongoURI;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use("/routes/api/users", users);
app.use("/routes/api/boards", boards);
app.listen(port, () => {
  console.log(`app is listening at http://localhost:${port}`);
});
