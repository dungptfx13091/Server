const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const User = require("../models/user");

exports.list = async function (req, res, next) {
  //output: return list all transactions
  const userLists = await User.find().lean();

  res.json(userLists);
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email, isAdmin: true });

    const validPassword = await bcrypt.compare(password, user.password);

    if (user && validPassword) {
      const token = jsonwebtoken.sign({ _id: user._id }, "mk");
      res.cookie("token", token, { httpOnly: true });

      res.setHeader("token", token).json({
        message: "Sucess!",
        login: true,
        token: token,
      });
    } else {
      res.json({
        message: "User Not Found!",
        login: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      login: false,
    });
  }
};

exports.logout = async (req, res, next) => {
  const token = req.body.token;
};

exports.auth = async function (req, res, next) {
  //output: authentication
  console.log(req.cookies);
  next();
};
