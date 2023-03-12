const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const jwt = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());

// app.use(
//   jwt({
//     secret: "mk",
//     getToken: (req) => req.cookies.token,
//   })
// );

const authhh = require("./controllers/auth");
const adminController = require("./controllers/admin");
const usersController = require("./controllers/users");
const hotelsController = require("./controllers/hotels");
const roomsController = require("./controllers/rooms");
const transactionsController = require("./controllers/transactions");

// Client App

app.post("/users/register", usersController.register);
app.post("/users/login", usersController.login);
app.get("/users/detail", usersController.detail);

app.get("/hotels/detail", hotelsController.detail);
app.get("/hotels/search", hotelsController.search);
app.get("/hotels/homePage", hotelsController.homePage);

app.get("/rooms/search", roomsController.search);

app.post("/transactions/add", transactionsController.add);
app.get("/transactions/user", transactionsController.userTrans);

//Admin Page
const auth = function (req, res, next) {
  const token = req.headers.authentication?.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ message: "Access Denied", authentication: false });
  try {
    const verified = jsonwebtoken.verify(token, "mk");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ messag: "Invalid Token", authentication: false });
  }
};

app.post("/admin/login", adminController.login);

app.get("/admin/auth", auth, (req, res) => {
  res.json({ authentication: true });
});

app.get("/admin/users/list", auth, adminController.list);

app.get("/admin/hotels/list", auth, hotelsController.list);
app.post("/admin/hotels/add", auth, hotelsController.add);
app.delete("/admin/hotels/delete", auth, hotelsController.delete);

app.get("/admin/rooms/list", auth, roomsController.list);
app.post("/admin/rooms/add", auth, roomsController.add);
app.delete("/admin/rooms/delete", auth, roomsController.delete);

app.get("/admin/transactions/lastest", auth, transactionsController.lastest);
app.get("/admin/transactions/list", auth, transactionsController.list);

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
