const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  // console.log(document.cookie);
  const token = req.get("token");
  if (!token) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token, "mk");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};
