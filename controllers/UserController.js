const userService = require("../services/UserService");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");

exports.userInfo = async (req, res, next) => {
  try {
    const users = await userService.getUserById(req._userId);
    if (users) {
      const { _id, username, email } = users;
      return res.json({
        data: { _id, username, email },
        status: 200,
        message: "success",
      });
    } else
      return res.status(401).json({ status: 400, message: "Auth not found!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.validate = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
      let message = "";
      if (!email || email === "") message = "Email ";
      if (!password || password === "") message += "Password ";
      message += "is Required.";
      res.send({ status: 400, message });
    } else {
      next();
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.signIn = async (req, res) => {
  try {
    const users = await userService.getUserByEmail(req.body.email);
    if (users) {
      bcrypt.compare(
        req.body.password,
        users.password,
        function (error, result) {
          if (result) {
            const token = jwt.sign(
              { id: users._id.toString() },
              process.env.JWT_SECRET_KEY,
              {
                expiresIn: "24h",
              }
            );
            return res.json({
              data: { token },
              status: 200,
              message: "success",
            });
          } else {
            return res.json({ status: 400, message: "Invailid password!" });
          }
        }
      );
    } else {
      return res.json({ status: 400, message: "Invailid Email!" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.signUp = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || username === "") {
      return res.json({ status: 400, message: "Username is Required.!" });
    }
    const users = await userService.getUserByEmail(req.body.email);
    if (users)
      return res.json({ status: 400, message: "Email Already Exist." });
    bcrypt.genSalt(10, async function (er, salt) {
      bcrypt.hash(req.body.password, salt, null, async function (er, hash) {
        if (er) console.log(er);
        req.body.password = hash;
        const user = await userService.createUser(req.body);
        if (user._id) {
          const token = jwt.sign(
            { id: user._id.toString() },
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: "24h",
            }
          );
          return res.json({ data: { token }, status: 200, message: "success" });
        } else return res.json({ status: 400, message: "Something went please try again after sometime." });
      });
    });
  } catch (err) {
    console.log("error :", err.message);

    res.status(500).json({ message: err.message });
  }
};
