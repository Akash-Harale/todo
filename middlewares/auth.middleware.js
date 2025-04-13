const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      const decoded = jwt.verify(token, "secret-key");
      req.body.userId = decoded.userId;
      next();
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  } else {
    res.status(400).send({ message: "Please login" });
  }
};

module.exports = { auth };
