const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const userValidation = require("../../validations/userValidation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenKey = require("../../config/keys").secretOrKey;
const passport = require("passport");
require("../../config/passport")(passport);

//Getting all users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json({ data: users });
});

//Creating new User
router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const name = req.body.name;
    const password = req.body.password;

    const newUser = {
      name,
      password,
    };
    const dbUser = await User.create(newUser);
    return res.json({ msg: "User was created successfully", data: dbUser });
  } catch (error) {
    console.log(error);
  }
});

//Updating the user
router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userID = req.user.id;
      // const userID=req.user.id

      const user = await User.findById(userID);
      if (!user) return res.status(404).send({ error: "User does not exist" });
      const salt = bcrypt.genSaltSync(10);
      if (req.body.password) {
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
        const updatedUser = await User.findByIdAndUpdate(
          { _id: userID },
          {
            name: req.body.name,
            password: hashedPassword,
          }
        );
      } else {
        const newUser = new User({
          name: req.body.name,
        });
        const updatedUser = await User.findByIdAndUpdate(
          { _id: userID },
          {
            name: req.body.name,
          }
        );
      }

      res.json({ msg: "User updated successfully" });
    } catch (error) {
      console.log(error);
    }
  }
);

//Deleting User
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const userID = req.user.id;
      const deletedUser = await User.findByIdAndRemove(userID);
      res.json({ msg: "User was deleted successfully", data: deletedUser });
    } catch (error) {
      console.log(error);
    }
  }
);

//Register
router.post("/register", async (req, res) => {
  const isValidated = userValidation.validate(req.body);
  //console.log(isValidated)
  
  if (isValidated.error) {
    let validationMsg;
    console.log("ERROR ", isValidated.error);
    console.log("details ",isValidated.error.details);
    if(isValidated.error.details[0].context.label==="name"){
      validationMsg="Username must be greater than 6 and start with a letter"
    }
    else{
     
      validationMsg="Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number"
    }
    return res
      .status(400)
      .send({
        msg: validationMsg,
        error: "validation error",
      });
  }
  const body = {
    name: req.body.name,
    password: req.body.password
  };

  const user = await User.findOne({ name: body.name });
  if (user) {
    return res
      .status(400)
      .json({ error: "Name already exists", msg: "Username already exists, try another one" });
  }
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(body.password, salt);
  const newUser = new User({
    name: body.name,
    password: hashedPassword,
  });
  const dbUser = await User.create(newUser);
  return res.json({ msg: "User was created successfully", data: dbUser });
});

//Login
router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });

    if (!user) return res.status(404).json({ msg: "This username does not exist!" });
    const match = bcrypt.compareSync(password, user.password);
    if (match) {
      const payload = {
        id: user.id,
        name: user.name,
      };
      const token = jwt.sign(payload, tokenKey, { expiresIn: "1h" });
      return res.json({ token: `Bearer ${token}`, data: payload });
    } else {
      return res
        .status(400)
        .send({ error: "Wrong password", msg: "Wrong password!" });
    }
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
