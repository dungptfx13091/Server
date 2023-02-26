const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.register = async (req, res, next) => {
  const { userName, password, fullName, phoneNumber, email, isAdmin } =
    req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
      res.json({
        oldUser: true,
      });
    } else {
      res.json({
        userName: userName,
        password: password,
        fullName: fullName,
        phoneNumber: phoneNumber,
        email: email,
        isAdmin: isAdmin,
        oldUser: false,
      });
      User.create({
        userName,
        password: encryptedPassword,
        fullName,
        phoneNumber,
        email,
        isAdmin,
      });
    }
  } catch (err) {
    res.send({ status: "err" });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    const validPassword = await bcrypt.compare(password, user.password);

    if (user && validPassword) {
      res.json({
        email: user.email,
        password: user.password,
        login: true,
      });
    } else {
      res.json({
        login: false,
      });
    }
  } catch (err) {
    res.json({
      login: false,
    });
  }
};

exports.detail = async function (req, res, next) {
  try {
    const user = await User.findOne({ email: req.query.email });
    if (user) res.send(user);
    else res.send("Not Found!");
  } catch (err) {
    res.send({ status: "err" });
  }
};
