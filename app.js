const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const Room = require("./models/room");
const Transaction = require("./models/transaction");

const adminsController = require("./controllers/admins");

const usersController = require("./controllers/users");
const hotelsController = require("./controllers/hotels");
const roomsController = require("./controllers/rooms");
const transactionsController = require("./controllers/transactions");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/admins/login", adminsController.login);

app.post("/users/register", usersController.register);
app.post("/users/login", usersController.login);
app.get("/users/detail", usersController.detail);

app.get("/hotels/list", hotelsController.list);
app.post("/hotels/add", hotelsController.add);
app.delete("/hotels/delete", hotelsController.delete);
app.get("/hotels/detail", hotelsController.detail);
app.get("/hotels/search", hotelsController.search);
app.get("/hotels/homePage", hotelsController.homePage);

app.get("/rooms/list", roomsController.list);
app.post("/rooms/add", roomsController.add);
app.delete("/rooms/delete", roomsController.delete);
app.get("/rooms/search", roomsController.search);

app.get("/transactions/list", transactionsController.list);
app.get("/transactions/lastest", transactionsController.lastest);
app.post("/transactions/add", transactionsController.add);
app.get("/transactions/user", transactionsController.userTrans);

mongoose
  .connect(
    "mongodb+srv://dungptfx13091:eNrQbIF1jMq8td8m@cluster0.5obi4ll.mongodb.net/mydatabase?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(5000, () => {
  console.log("Server Started");
});
