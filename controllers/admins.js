const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email, isAdmin: true });
    console.log(user);

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
